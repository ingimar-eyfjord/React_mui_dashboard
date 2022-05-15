import {
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import useWindowSize from "App/Functions/useWindowSize";
import Button from "@mui/material/Button";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { HoursModalContext } from "../modalContext";
import ReactDOM from "react-dom";
import moment from "moment";
import { GlobalState } from "context/store";
import "simplebar/dist/simplebar.min.css";

function HoursOnCalander(props) {
  let { modalContent, handleHoursModal, modal } = useContext(HoursModalContext);
  const [Store] = useContext(GlobalState);
  const [state, setState] = useState();
  const [month, setMonth] = useState(moment());
  const size = useWindowSize();
  const getSchedule = useCallback(async () => {
    //? get all weeks with the dates that are in the month passed
    const Calendar = props.ConverterClass.getCalendarDates(month);
    //? prepare array of objects of dates (as many objects there are weeks)
    const FirstDay = Calendar[0].days[0].startOf("Day").format();
    const LastDay = Calendar[Calendar.length - 1].days[Calendar.length - 1]
      .endOf("Day")
      .format();

    const param = {
      start: FirstDay,
      end: LastDay,
      UserUUID: Store.UserDetails.UserUUID,
    };
    const Schedule = await props.ScheduleDataService.GetByDayAndUser(
      param
    );
    let RowChildren = [];
    let WeekNumber = [];
    // eslint-disable-next-line
    let WeeKrows = 0;
    Calendar.map((e) => {
      WeeKrows++;
      const WeekNumbTD = (
        <td className='CalendarBox WeekNumber'>
          {moment(e.days[0]).isoWeek()}
        </td>
      );
      WeekNumber.push(WeekNumbTD);
      const week = e.days.map((t, index) => {
        //? double map since Calendar = [{object={day1, ...},{object={day1, ...}}]
        let WorkData = {
          isWorking: false,
          SameMonth: false,
          isSameDay: false,
        };
        Schedule.data.forEach((e) => {
          if (moment(e.Date_start_time).isSame(t, "day")) {
            WorkData.isWorking = true;
            WorkData.Start = moment(e.Date_start_time).format("HH:mm");
            WorkData.End = moment(e.Date_end_time).format("HH:mm");
            WorkData.Hours = e.Hours;
            WorkData.Location = e.Location;
            WorkData.ID = e.id;
            WorkData.Original = {
              Start: e.Date_start_time,
              End: e.Date_end_time,
            };
            WorkData.Table_number = e.Table_number;
          }
        });
        if (moment(t).isSame(moment(), "day")) {
          WorkData.isSameDay = true;
        }
        //? Get the second week and check if the first day of that
        if (Calendar[2].days[0].isSame(t, "month")) {
          WorkData.SameMonth = true;
        }
        return (
          <td
            onClick={() =>
              WorkData.isWorking !== false
                ? handleHoursModal({
                    WorkData,
                    getSchedule,
                    modal: "ScheduleEdit",
                  })
                : handleHoursModal({
                    date: moment(t).format("MM-DD-YYYY"),
                    getSchedule,
                    modal: "ScheduleAdd",
                  })
            }
            key={index}
            week={moment(t).isoWeek()}
            isbeforetoday={`${moment(new Date()).isAfter(t)}`}
            issamemonth={`${WorkData.SameMonth}`}
            issameday={`${WorkData.isSameDay}`}
            className={
              WorkData.isWorking !== false
                ? `Working CalendarBox`
                : "CalendarBox notWorking"
            }
            targettoclick={moment(t).format()}
          >
            {WeeKrows === 1 ? (
              <h3 className={"CalendarDate dd"}> {moment(t).format("dd")}</h3>
            ) : null}
            <h3 className='CalendarDate'> {moment(t).format("DD")}</h3>
            {WorkData.isWorking !== false ? (
              <div className='DateInfoSchedule'>
                <p>
                  {WorkData.Location}{" "}
                  {WorkData.Location === "Office" ? "tbl" : null}{" "}
                  {WorkData.Table_number ?? ""}
                </p>
                <p>
                  {WorkData.Start} - {WorkData.End}
                </p>
                <p>{WorkData.Hours} Hours</p>
              </div>
            ) : (
              ""
            )}
          </td>
        );
      });
      //? Push each week as object to weekWithCalBoxes array

      return RowChildren.push(week);
      //? end result week = [{<div>day1</div>, <di....},{<div>day1</div>, <di....},{<div>day1</div>, <di....}]
    });
    //? now make containers for the weeks, as many containers as weeks
    //? Make rows

    let rows = RowChildren.map((e, index) => {
      return (
        <tr
          key={`weekNumber ${e[0].props.week}`}
          className={`weekNumber weekRow ${e[0].props.week}`}
        >
          {size.width >= 800 ? WeekNumber[index] : null}
          {e}
        </tr>
      );
    });
    setState(rows);
  }, [month, props, size, Store, handleHoursModal]);

  useEffect(() => {
    getSchedule();
  }, [month, props, getSchedule]);

  function OnclickCallback(e) {
    if (e === "Forwards") {
      let PlusMonth = moment(month).add(1, "M");
      setMonth(PlusMonth);
    } else if (e === "Back") {
      let MinusMonth = moment(month).subtract(1, "M");
      setMonth(MinusMonth);
    } else if (e === "Today") {
      let ThisMonth = moment();
      setMonth(ThisMonth);
    }
  }
  if (modal) {
    return ReactDOM.createPortal(
    <div className='CustomCalandarContainer'>
      <div className='nextDaysSelection selectionCalendar'>
        <Button onClick={() => OnclickCallback("Today")} variant='outlined'>
          Today
        </Button>
        <Button
          onClick={() => OnclickCallback("Back")}
          variant='text'
          startIcon={<ArrowBackIosNew />}
        ></Button>
        <Button
          onClick={() => OnclickCallback("Forwards")}
          variant='text'
          endIcon={<ArrowForwardIosIcon />}
        ></Button>
        <h2 className='CalendarMonthTitle'>
          {moment(month).format("MMMM YYYY")}
        </h2>
      </div>

      <table className='CalendarMonth customCalendar'>
        <tbody>{state}</tbody>
      </table>
    </div>,
      document.querySelector("#modal-root_2")
    );
  } else return null;
};

export default HoursOnCalander;
