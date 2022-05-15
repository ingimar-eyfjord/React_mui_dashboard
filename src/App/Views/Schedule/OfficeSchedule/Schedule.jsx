import  { useEffect, useState, useCallback } from "react";
import CommandBtn from "./components/commandBtn";
import CalendarGrid from "./components/CalendarGrid";
import moment from "moment";
import useWindowSize from "App/Functions/useWindowSize";
import LinearProgress from "@mui/material/LinearProgress";
import Card from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import CardBody from "App/components/Card/CardBody";

function nextWeek(date) {
  const day = moment(date).add(1, "week");
  return day;
}
function previousWeek(date) {
  const day = moment(date).subtract(1, "week");
  return day;
}
const getDaysArray = function (start, end) {
  for (
    var arr = [], dt = new Date(start);
    dt <= end;
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
};

moment.locale("en", { week: { dow: 1, doy: 4 } });
const thisMonday = moment().startOf("week");
const thisFriday = moment().startOf("week").add(4, "days");
const thisSunday = moment().endOf("week");
const workWeek = getDaysArray(thisMonday, thisFriday);

export default function Schedule(props) {

  const [StateHours, SetHours] = useState();
  const WindowSize = useWindowSize();
  const windowWidth = WindowSize.width;
  const [SelectedDays, setSelectedDays] = useState({
    Monday: Date,
    Friday: Date,
    Sunday: Date,
    WeekDays: [],
    IsFullWeek: undefined,
    Hours: undefined,
  });

  useEffect(() => {
    setSelectedDays((SelectedDays) => ({
      ...SelectedDays,
      Monday: thisMonday,
      Friday: thisFriday,
      Sunday: thisSunday,
      WeekDays: workWeek,
    }));
  }, []);

  const callParent = useCallback(
    (days) => {
      props.setState(
        (state) => ({
          ...state,
          RunTime: 0,
        }),
        props.gotDays(days)
      );
    },
    [props]
  );

  useEffect(() => {
    if (SelectedDays.WeekDays.length !== 0) {
      callParent(SelectedDays.WeekDays);
    }
    // eslint-disable-next-line
  }, [SelectedDays.WeekDays]);

  function updateWeekArray(passed) {
    //? passed is either true or false. will make IsFullWeek t||f and update weekdays
    setSelectedDays((SelectedDays) => ({
      ...SelectedDays,
      IsFullWeek: passed,
      WeekDays: passed
        ? getDaysArray(SelectedDays.Monday, SelectedDays.Sunday)
        : getDaysArray(SelectedDays.Monday, SelectedDays.Friday),
    }));
  }

  function updateTimeLine(currentTimeline) {
    if (currentTimeline === "Next") {
      setSelectedDays((SelectedDays) => ({
        ...SelectedDays,
        Monday: nextWeek(SelectedDays.Monday),
        Friday: nextWeek(SelectedDays.Friday),
        Sunday: nextWeek(SelectedDays.Sunday),
        WeekDays: SelectedDays.IsFullWeek
          ? getDaysArray(
              nextWeek(SelectedDays.Monday),
              nextWeek(SelectedDays.Sunday)
            )
          : getDaysArray(
              nextWeek(SelectedDays.Monday),
              nextWeek(SelectedDays.Friday)
            ),
      }));
    } else if (currentTimeline === "Prev") {
      setSelectedDays((SelectedDays) => ({
        ...SelectedDays,
        Monday: previousWeek(SelectedDays.Monday),
        Friday: previousWeek(SelectedDays.Friday),
        Sunday: previousWeek(SelectedDays.Sunday),
        WeekDays: SelectedDays.IsFullWeek
          ? getDaysArray(
              previousWeek(SelectedDays.Monday),
              previousWeek(SelectedDays.Sunday)
            )
          : getDaysArray(
              previousWeek(SelectedDays.Monday),
              previousWeek(SelectedDays.Friday)
            ),
      }));
    } else if (currentTimeline === "Today") {
      setSelectedDays((SelectedDays) => ({
        ...SelectedDays,
        Monday: thisMonday,
        Friday: thisFriday,
        Sunday: thisSunday,
        WeekDays: SelectedDays.IsFullWeek
          ? getDaysArray(thisMonday, thisSunday)
          : getDaysArray(thisMonday, thisFriday),
      }));
    }
  }

  const Hours = useCallback(
    async (date) => {
      const param2 = {
        start: moment(date)
          .startOf("month")
          .startOf("day")
          .format("YYYY-MM-DD hh:mm:ss"),
        team: props.filterBy.Team,
      };
      let monthly = undefined;
      if (param2.start === "Invalid date") {
        return;
      }
      if (props.filterBy.People.length === 0) {
        if (param2.team === undefined) {
          monthly = await props.ScheduleDataService.GetMonthlyHours(
            param2
          );
          if (monthly.data) {
            props.setLoggedHours(monthly.data[0][0]);
            SetHours(monthly.data[0][0]);
          }
        } else {
          monthly = await props.ScheduleDataService.GetHoursForTheMonth(
            param2
          );

          if (monthly.data) {
            props.setLoggedHours(monthly.data[0][0]);
            SetHours(monthly.data[0][0]);
          }
        }
      }
//!? fix this
      // if (props.filterBy.People.length !== 0) {
      //   const param3 = {
      //     set: props.filterBy.People,
      //     start: moment(date)
      //       .startOf("month")
      //       .startOf("day")
      //       .format("YYYY-MM-DD hh:mm:ss"),
      //   };
      //   monthly = await props.ScheduleDataService.GetMonthlyHoursByUserArray(
      //     param3,
      //   );
      //   props.setLoggedHours(await monthly.data[0]);
      //   SetHours(await monthly.data[0]);
      // }
    },
    // eslint-disable-next-line
    [
      SelectedDays,
      props.setLoggedHours,
      SetHours,
      props.ScheduleDataService,
      props.filterBy,
    ]
  );
  useEffect(() => {
    Hours(SelectedDays.Monday);
    // eslint-disable-next-line
  }, [SelectedDays, props.filterBy]);

  function CalendarPicked(dateRangeArray) {
    const PickedMonday = moment(dateRangeArray[0]).startOf("week");
    const PickedSunday = moment(dateRangeArray[0]).endOf("week");
    const PickedFriday = moment(dateRangeArray[0])
      .startOf("week")
      .add(4, "days");

    setSelectedDays((SelectedDays) => ({
      ...SelectedDays,
      Monday: PickedMonday,
      Friday: PickedFriday,
      Sunday: PickedSunday,
      WeekDays: SelectedDays.IsFullWeek
        ? getDaysArray(PickedMonday, PickedSunday)
        : getDaysArray(PickedMonday, PickedFriday),
    }));
  }
  return (
      <Card chart >
        <CardHeader color='info'>
          <CommandBtn
            selectedMonday={SelectedDays.Monday}
            CalendarPicked={CalendarPicked}
            StateHours={StateHours?.Hours}
            SelectedDays={SelectedDays}
            updateWeekArray={updateWeekArray}
            updateTimeLine={updateTimeLine}
          ></CommandBtn>
        </CardHeader>
        <CardBody style={{paddingTop:0}}>
            {props.People === undefined ? (
              <LinearProgress></LinearProgress>
            ) : (
              <CalendarGrid
                ConverterClass={props.ConverterClass}
                GraphInfoService={props.GraphInfoService}
                Bearer={props.Bearer}
                People={props.People}
                filterBy={props.filterBy}
                ScheduleDataService={props.ScheduleDataService}
                days={SelectedDays.WeekDays}
                windowWidth={windowWidth}
              ></CalendarGrid>
            )}
        </CardBody>
      </Card>
  );
}
