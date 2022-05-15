import { useState, useCallback, useContext } from "react";
import DaysAdded from "./components/daysAdded";
import moment from "moment";
import _ from "lodash";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import { ControlledRadioButtonsGroup } from "App/components/CustomComponents";
import { ModalContext } from "App/components/Modals/modalContext";
import TeamsDataService from "services/api_services/teams.service";
import { GlobalState } from "context/store";

export default function AddToSchedule(props) {
  let { handleModal } = useContext(ModalContext);
  const [Store] = useContext(GlobalState);

  //? const [chosenDays, setChosenDays] = useState([]);
  //? const [selectedDate, setSelectedDate] = useState(undefined);

  const [dateState, setDateState] = useState({
    chosenDays: [],
    selectedDate: moment().format(),
    start: "09:00",
    end: "17:30",
  });

  const [team, setTeam] = useState(Store.UserDetails.Department.id);
  const [location, setLocation] = useState("Home Office");

  function confirmSelection(e) {
    e.preventDefault();
    e.persist(e);
    const elements = props.ConverterClass.formToJSON(e.target.elements);
    if (elements.Date === "") {
      alert("Please select the date");
      return;
    } else if (elements.Time_Start === "") {
      alert("Please select the start time");
      return;
    } else if (elements.Time_End === "") {
      alert("Please select the end time");
      return;
    }
    if (team === undefined) {
      alert("Please select the team first");
      return;
    }
    const dayObject = {
      Date: elements.Date,
      TimeStart: elements.Time_Start,
      TimeEnd: elements.Time_End,
      id: elements.Date + elements.Time_Start + elements.Time_End,
      team: team,
    };

    // if selection already exists then don't concatenate it with existing array
    const find = _.find(dateState.chosenDays, ["id", dayObject.id]);
    // if undefined then it does not exist
    if (find === undefined) {
      setDateState((dateState) => ({
        ...dateState,
        chosenDays: dateState.chosenDays.concat(dayObject),
      }));
    }
  }

  function POSTDay(e) {
    TakeAwayDay(e);
  }

  function ResetForm(e) {
    e.preventDefault();
    e.persist(e);
    TakeAwayDay(e);
  }

  function TakeAwayDay(e) {
    const days = [...dateState.chosenDays];
    const daysLeft = days.filter(function (obj) {
      return obj.id !== e.target.id;
    });
    setDateState((dateState) => ({ ...dateState, chosenDays: daysLeft }));
  }

  function calendarChooseDate(date) {
    setDateState((dateState) => ({ ...dateState, selectedDate: date }));
  }

  function PropsFunc(data) {
    setTeam((team) => ({
      ...team,
      Team: data.target.value,
    }));
  }

  const officeClicked = useCallback(
    (truthy, value) => {
      const booked = {
        start: dateState.start,
        end: dateState.end,
        date: dateState.selectedDate,
      };
      if (truthy) {
        handleModal({ booked, modal: "ChooseTableModal" });
      }
      if (value !== undefined) {
        setLocation(value);
      }
    },
    [handleModal, dateState]
  );

  return (
    <>
      <Card
        sx={{
          height: "fit-content",
          width: "fit-content",
          zIndex: "500",
          overflow: "unset",
        }}
      >
        <form onSubmit={confirmSelection}>
          <CardContent>
            <props.CalendarComponent
              setDateState={setDateState}
              selectedDate={dateState.selectedDate}
              calendarChooseDate={calendarChooseDate}
              dateState={dateState}
              DayPicker={true}
              weekNumber={true}
              monthPicker={false}
              minDate={new Date()}
              maxDate={false}
            ></props.CalendarComponent>
            <TeamsDropDownOptions
              TeamsDataService={TeamsDataService}
              PropsFunc={PropsFunc}
              label={"Select your team first"}
              placeHolder={"Team"}
              required={true}
            />
            <ControlledRadioButtonsGroup officeClicked={officeClicked} />

            <Stack
              direction='row'
              justifyContent='center'
              alignItems='center'
              spacing={3}
            >
              <TextField
                name='Time_Start'
                id='Time_Start'
                label='Time start'
                type='time'
                defaultValue='09:00'
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{ width: 150 }}
                onChange={(e) => {
                  setDateState((dateState) => ({
                    ...dateState,
                    start: e.target.value,
                  }));
                }}
              />{" "}
              <TextField
                name='Time_End'
                id='Time_End'
                label='Time end'
                type='time'
                defaultValue='17:30'
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                onChange={(e) => {
                  setDateState((dateState) => ({
                    ...dateState,
                    end: e.target.value,
                  }));
                }}
                sx={{ width: 150 }}
              />
            </Stack>
            <Stack style={{ marginTop: "1rem" }} spacing={3}>
              <props.DefaultBtn BtnType={"submit"} text={"Confirm Selection"} />
            </Stack>
            <input type='hidden' value={dateState.selectedDate} name='Date' />
          </CardContent>
        </form>
      </Card>
      <DaysAdded
        team={team}
        location={location}
        TeamsDataService={props.TeamsDataService}
        TeamsDropDownOptions={props.TeamsDropDownOptions}
        ConverterClass={props.ConverterClass}
        WarningNotification={props.WarningNotification}
        ErrorNotification={props.ErrorNotification}
        DefaultBtn={props.DefaultBtn}
        PrimaryBtn={props.PrimaryBtn}
        SuccessNotification={props.SuccessNotification}
        RadioGroup={props.RadioGroup}
        // userInfo={props.userInfo}
        POSTDay={POSTDay}
        ResetForm={ResetForm}
        chosenDays={dateState.chosenDays}
      ></DaysAdded>
    </>
  );
}
