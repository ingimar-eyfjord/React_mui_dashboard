import { useState, useEffect, useCallback, useContext } from "react";
import moment from "moment";
import { GlobalState } from "context/store";
import useWindowSize from "App/Functions/useWindowSize";
import Button from "@mui/material/Button";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Modal from "@mui/material/Modal";
import ScheduleAdd from "../Modals/schedule_add";
import ScheduleEdit from "../Modals/schedule_edit/schedule_edit";
import { makeStyles } from "@material-ui/styles";
import styles from "App/components/classes";
import CardBody from "App/components/Card/CardBody.js";
import GridItem from "App/components/Grid/GridItem.js";
import Card from "App/components/Card/Card.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import ConverterClass from "App/Functions/converterClass";
import ScheduleDataService from "services/api_services/schedule.service";
const useStyles = makeStyles(styles);
export default function YourSchedule() {
  const classes = useStyles();

  const [Store] = useContext(GlobalState);
  const [state, setState] = useState();
  const [month, setMonth] = useState(moment());
  const size = useWindowSize();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [WorkData, SetWorkData] = useState();

  const handleOpen = useCallback(
    async (data) => {
      SetWorkData(data);
      setOpen(true);
    },
    [SetWorkData]
  );
  const handleOpen2 = useCallback(
    async (data) => {
      SetWorkData(data);
      setOpen2(true);
    },
    [SetWorkData]
  );

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  const getSchedule = useCallback(async () => {
    //? get all weeks with the dates that are in the month passed
    const Calendar = ConverterClass.getCalendarDates(month);
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
    const Schedule = await ScheduleDataService.GetByDayAndUser(
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
            style={{ minHeight: "3rem !important" }}
            onClick={() =>
              WorkData.isWorking !== false
                ? handleOpen2(WorkData)
                : handleOpen({ date: moment(t).format("MM-DD-YYYY") })
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
              <h3 className={classes.calendarWeekNames}>
                {" "}
                {moment(t).format("dd")}
              </h3>
            ) : null}
            <h3 className={classes.calendarDates}> {moment(t).format("DD")}</h3>
            {WorkData.isWorking !== false ? (
              <div className='DateInfoSchedule'>
                <p className={classes.calendarText}>
                  {WorkData.Location}{" "}
                  {WorkData.Location === "Office" ? "tbl" : null}{" "}
                  {WorkData.Table_number ?? ""}
                </p>
                <p className={classes.calendarText}>
                  {WorkData.Start} - {WorkData.End}
                </p>
                <p className={classes.calendarText}>{WorkData.Hours} Hours</p>
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
          style={{ height: `calc(100% / ${WeekNumber})` }}
          key={`weekNumber ${e[0].props.week}`}
          className={`weekNumber weekRow ${e[0].props.week}`}
        >
          {size.width >= 800 ? WeekNumber[index] : null}
          {e}
        </tr>
      );
    });
    setState(rows);
  }, [month, size, Store, handleOpen, handleOpen2, classes]);

  useEffect(() => {
    getSchedule();
    // eslint-disable-next-line
  }, [month]);

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

  return (

      <GridContainer id='CalanderContianer'>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <div className='nextDaysSelection selectionCalendar'>
                <Button
                  onClick={() => OnclickCallback("Today")}
                  variant='outlined'
                >
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

              <table
                style={{ height: "100%" }}
                className='CalendarMonth customCalendar'
              >
                <tbody style={{ height: "100%" }}>{state}</tbody>
              </table>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <ScheduleAdd
                  handleClose={handleClose}
                  getSchedule={getSchedule}
                  WorkData={WorkData}
                ></ScheduleAdd>
              </Modal>
              <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
              >
                <ScheduleEdit
                  handleClose={handleClose2}
                  getSchedule={getSchedule}
                  WorkData={WorkData}
                ></ScheduleEdit>
              </Modal>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
  );
}
