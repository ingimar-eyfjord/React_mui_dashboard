import  { useState, useEffect, useCallback, useContext } from "react";
import moment from "moment";
import { GlobalState } from "context/store";
// import { ModalContext } from "App/components/Modals/modalContext";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { CheckBox } from "App/components/MUIComponents";
import ScheduleDataService from "services/api_services/schedule.service";
import { ModalContext } from "App/components/Modals/modalContext";
import MDAlert from "App/components/MDAlert";
import MDTypography from "App/components/MDTypography";

export default function CardElementController(props) {
  let { handleModal } = useContext(ModalContext);

  const alertContent = (name, text) => (
    <MDTypography variant="body2" color="white">
      {name}
      <MDTypography
        component="p"
        variant="body2"
        fontWeight="medium"
        color="white"
      >
        {text.Date_start_time &&
          moment(text.Date_start_time).format("HH:mm a") +
            ` - ` +
            moment(text.Date_end_time).format("HH:mm a")}
      </MDTypography>
    </MDTypography>
  );

  // let { handleModal } = React.useContext(ModalContext);
  const [state, setState] = useState({
    IsWorking: undefined,
    message: [],
    tableMessage: [],
    scheduled: undefined,
    FormTimeEnd: props.E.TimeEnd,
    FormTimeStart: props.E.TimeStart,
    officeSelected: false,
    Team: props.team,
    Date: props.E.Date,
    Booked_tables: [],
    Location: props.location,
    TableIsBooked: undefined,
  });
  const [Store] = useContext(GlobalState);

  useEffect(() => {
    setState((state) => ({
      ...state,
      FormTimeEnd: props.E.TimeEnd,
      FormTimeStart: props.E.TimeStart,
    }));
  }, [props.E.TimeEnd, props.E.TimeStart]);

  const setIsWorking = useCallback(
    (MessageDataConflict, MessageDataWarning) => {
      let message = [];
      if (MessageDataConflict.length !== 0) {
        const mapped = MessageDataConflict.map((e, index) => (
          <MDAlert key={index} color="error">
            {alertContent("Conflict you have a shift scheduled at", e)}
          </MDAlert>
        ));
        message.push(mapped);
        setState((state) => ({ ...state, IsWorking: true }));
      } else if (MessageDataWarning.length > 0) {
        const mapped = MessageDataWarning.map((e, index) => (
          <MDAlert key={index} color="warning" dismissible>
            {alertContent("Warning you have a shift scheduled at", e)}
          </MDAlert>
        ));
        setState((state) => ({
          ...state,
          IsWorking: false,
        }));
        message.push(mapped);
      }
      setState((state) => ({
        ...state,
        message: message,
      }));
    },
    []
  );

  const checkIfWorking = useCallback(
    (scheduled) => {
      let MessageDataConflict = [];
      let MessageDataWarning = [];
      scheduled.forEach((t) => {
        //? Compares the schedule information in the date
        //? get moment start and end objects the passed down element (from the add day form)
        const FormStartAndEnd = {
          start: moment(
            props.ConverterClass.makeMomentDateWithTime(
              props.E.Date,
              props.E.TimeStart
            )
          ),
          end: moment(
            props.ConverterClass.makeMomentDateWithTime(
              props.E.Date,
              props.E.TimeEnd
            )
          ),
        };
        //? get the scheduled information (from the database)
        const ScheduledStartAndEnd = {
          start: moment(t.Date_start_time),
          end: moment(t.Date_end_time),
        };
        //? Moment JS check if between dates (if inputted shift is shorter and is in between the dates.)
        if (
          FormStartAndEnd.start.isBetween(
            ScheduledStartAndEnd.start,
            ScheduledStartAndEnd.end
          ) ||
          FormStartAndEnd.end.isBetween(
            ScheduledStartAndEnd.start,
            ScheduledStartAndEnd.end
          )
        ) {
          MessageDataConflict.push(t);
          //? Moment check if inputted start is before start on schedule and inputted end input is after end on schedule (is longer and reaches over whole shift)
        } else if (
          FormStartAndEnd.start.isBefore(ScheduledStartAndEnd.start) &&
          FormStartAndEnd.end.isAfter(ScheduledStartAndEnd.end)
        ) {
          MessageDataConflict.push(t);
        } else if (
          moment(FormStartAndEnd.end).isSame(ScheduledStartAndEnd.end) ||
          moment(FormStartAndEnd.end).isSame(ScheduledStartAndEnd.end)
        ) {
          MessageDataConflict.push(t);
        } else {
          MessageDataWarning.push(t);
        }
      });

      setIsWorking(MessageDataConflict, MessageDataWarning);
    },
    [props, setIsWorking]
  );

  const TableMessages = useCallback(() => {
    let array = [];
    for (const e of state.scheduled) {
      if (e.Table_number !== 0) {
        if (e.Table_number !== null) {
          if (parseInt(e.Table_number, 10)) {
            if (e.Table_number === Store.table) {
              array.push(e);
            }
          }
        }
      }
    }

    if (array.length > 0) {
      function changeTable() {
        const booked = {
          end: state.TimeEnd,
          start: state.TimeStart,
          date: state.Date,
        };
        handleModal({ booked, modal: "ChooseTableModal" });
      }

      const mapped = array.map((e, index) => (
        <>
          <MDAlert key={index + "tableSelectionsMessage"} color="error">
            {alertContent(
              `Table ${Store.table} is already booked at this time, please select another table`,
              e
            )}
          </MDAlert>

          <div onClick={changeTable}>
            <props.DefaultBtn
              disabled={false}
              BtnType={"button"}
              text={"Click to change table"}
            />
          </div>
        </>
      ));
      setState((state) => ({
        ...state,
        TableIsBooked: true,
        tableMessage: mapped,
      }));
    } else {
      setState((state) => ({
        ...state,
        tableMessage: [],
        TableIsBooked: false,
      }));
    }
  }, [
    state.scheduled,
    state.Date,
    state.TimeStart,
    state.TimeEnd,
    Store.table,
    handleModal,
  ]);

  useEffect(() => {
    if (state.scheduled === undefined) {
      return;
    }
    if (Store.table === undefined) {
      return;
    }
    TableMessages();
  }, [state.scheduled, Store.table, TableMessages]);

  const initiate = useCallback(async () => {
    const param = {
      start: moment(props.E.Date).startOf("day").format(),
      end: moment(props.E.Date).endOf("day").format(),
    };
    //! Need to make this into not user but get everyone in the schedule these days,
    //! Because we need it to check the booked tables
    try {
      const data = await ScheduleDataService.ExportReport(
        param
      );
      if (data.length > 0) {
        setState((state) => ({ ...state, scheduled: data.data }));
        const mySchedule = data.filter((e) => {
          return e.Email === Store.UserDetails.UserEmail;
        });
        checkIfWorking(mySchedule);
      } else {
        setState((state) => ({
          ...state,
          IsWorking: false,
          tableMessage: [],
          message: [],
          TableIsBooked: false,
        }));
      }
    } catch (error) {
      alert("Failed to load schedule please report this issue");
    }
  }, [
    checkIfWorking,
    props.E.Date,
    Store.UserDetails.UserEmail,
  ]);

  useEffect(() => {
    initiate();
  }, [initiate]);

  return (
    <SimpleBar
      className={
        state.officeSelected === true
          ? " DayAddingToSchedule DaySubmitForm"
          : "DayAddingToSchedule DaySubmitForm"
      }
      autoHide={false}
    >
      <form
        key={props.E.id}
        onReset={props.ResetForm}
        onSubmit={props.SubmitDay}
        id={props.E.id}
      >
        <h3>{moment(props.E.Date).format("DD-MMMM-YYYY")}</h3>
        <input type="hidden" value={props.E.Date} name="day" />
        <Stack
          style={{ marginTop: "1rem" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <TextField
            name="start"
            id="Time_Start"
            label="Time start"
            value={state.FormTimeStart}
            onChange={(e) => {
              setState((state) => ({
                ...state,
                FormTimeStart: e.target.value,
              }));
            }}
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            //officeclicked
            sx={{ width: 150 }}
          />
          <TextField
            name="end"
            onChange={(e) => {
              setState((state) => ({
                ...state,
                FormTimeEnd: e.target.value,
              }));
            }}
            id="Time_End"
            label="Time end"
            type="time"
            value={state.FormTimeEnd}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 150 }}
          />
        </Stack>
        <input type="hidden" name="Team" value={state.Team} />
        <Stack
          style={{ marginTop: "1rem" }}
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <div
            className="flexRow"
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p className="ManualLabel">I'll take a 30 minute break</p>
            <CheckBox></CheckBox>
          </div>

          {<p className="ManualLabel">{state.Location}</p>}
          {Store.table && state.Location === "Office" ? (
            <p className="ManualLabel">
              Current table selection {Store.table}
            </p>
          ) : (
            ""
          )}
          {state.tableMessage}
          <props.DefaultBtn
            disabled={state.IsWorking || state.TableIsBooked}
            BtnType={"submit"}
            text={"Add this day"}
          />
          <props.PrimaryBtn
            disabled={false}
            BtnType={"reset"}
            text={"Cancel"}
          />
          {state.message}
        </Stack>
      </form>
    </SimpleBar>
  );
}
