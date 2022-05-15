import { useState, useEffect, useCallback, useContext } from "react";
import ConverterClass from "App/Functions/converterClass";
import moment from "moment";
import { GlobalState } from "context/store";
import ScheduleDataService from "services/api_services/schedule.service";
import { CheckBox, DefaultBtn } from "App/components/MUIComponents";
import "simplebar/dist/simplebar.min.css";
import TextField from "@mui/material/TextField";
import { ModalContext } from "App/components/Modals/modalContext";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import TeamsDataService from "services/api_services/teams.service";
import Stack from "@mui/material/Stack";
import { ControlledRadioButtonsGroup } from "App/components/CustomComponents";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Notification } from "App/components/MUIComponents";
import { useDebouncedCallback } from "App/Functions/debounce";
import GridContainer from "App/components/Grid/GridContainer.js";
import GridItem from "App/components/Grid/GridItem.js";
import { Divider } from "@mui/material";
import Card from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import CardBody from "App/components/Card/CardBody.js";
import CardActions from "@mui/material/CardActions";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";
const useStyles = makeStyles(styles);

export default function ScheduleAdd(props) {
  const classes = useStyles();
  const date = props.WorkData.date;
  const [Store, setStore] = useContext(GlobalState);

  const [disabledBtn] = useState(false);

  const debounce = useDebouncedCallback((callback, value) => {
    callback(value);
  }, 300);

  let { handleModal } = useContext(ModalContext);
  const [dateState, setDateState] = useState({
    chosenDays: [],
    selectedDate: date,
    start: "09:00",
    end: "17:30",
  });
  const [tables, setTables] = useState({
    TableIsBooked: false,
    tableMessage: [],
  });
  const [team, setTeam] = useState(Store.UserDetails.Department.id);
  const [location, setLocation] = useState("Home Office");
  const confirmSelection = useCallback(
    async (e) => {
      e.preventDefault();
      e.persist(e);
      const elements = ConverterClass.formToJSON(e.target.elements);
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

      elements.Team = team;
      elements.Location = location;
      if (elements.Location === undefined) {
        alert("Please select the team first");
        return;
      }
      if (elements.Location === "Office") {
        if (Store.table === undefined) {
          alert("Please select the table first");
          return;
        }
      }
      elements.Date_start_time = ConverterClass.makeMomentDateWithTime(
        elements.Date,
        elements.Time_Start
      );
      elements.Date_end_time = ConverterClass.makeMomentDateWithTime(
        elements.Date,
        elements.Time_End
      );
      const duration = moment.duration(
        moment(elements.Date_end_time).diff(moment(elements.Date_start_time))
      );
      elements.User = Store.UserDetails.UserName;
      elements.Email = Store.UserDetails.UserEmail;
      elements.Hours = parseFloat(duration.asHours()).toFixed(2);
      elements.Table_number = parseInt(Store.table);
      if (elements.Location !== "Office") {
        elements.Table_number = null;
      }
      elements.User_UUID = Store.UserDetails.UserUUID;
      if (elements.Break === "true") {
        elements.Hours = parseFloat(elements.Hours - 0.5).toFixed(2);
      }
      elements.Break === "true" ? (elements.Break = 1) : (elements.Break = 0);
      ScheduleDataService.create(elements)
        .then((response) => {
          if (response.request.statusText === "OK") {
            setStore({
              Notification: {
                color: "success",
                icon: "check",
                title: "Success",
                content: response.data.message,
                dateTime: moment(),
              },
            });
            props.getSchedule();
            props.handleClose();
          }
        })
        .catch((e) => {
          setStore({
            Notification: {
              color: "error",
              icon: "warning",
              title: "Failed",
              content: e.response.data.message,
              dateTime: moment(),
            },
          });
        });
    },
    [location, team, Store, setStore, props]
  );

  const initiate = useCallback(async () => {
    if (location !== "Office") {
      setTables((state) => ({
        ...state,
        TableIsBooked: false,
        tableMessage: [],
      }));
      return;
    }
    const param = {
      start: moment(dateState.selectedDate).startOf("day").format(),
      end: moment(dateState.selectedDate).endOf("day").format(),
    };

    const data = await ScheduleDataService.ExportReport(
      param
    );

    //here
    if (data.length !== 0) {
      let array = [];
      for (const e of data) {
        if (e.Table_number !== 0) {
          if (e.Table_number !== null) {
            if (parseInt(e.Table_number, 10)) {
              if (e.Table_number === parseInt(Store.table)) {
                array.push(e);
              }
            }
          }
        }
      }
      if (array.length > 0) {
        function changeTable() {
          const booked = {
            start: dateState.start,
            end: dateState.end,
            date: date,
          };
          handleModal({ booked, modal: "ChooseTableModal" });
        }
        const mapped = array.map((e, index) => (
          <>
            <Notification
              className="TableWarningMessage"
              key={index + "tableSelectionsMessage"}
              message={`Table ${Store.table} is already booked at this time, please select another table`}
            />
            <div onClick={changeTable}>
              <DefaultBtn
                disabled={false}
                BtnType={"button"}
                text={"Click to change table"}
              />
            </div>
          </>
        ));
        setTables((state) => ({
          ...state,
          TableIsBooked: true,
          tableMessage: mapped,
        }));
      } else {
        setTables((state) => ({
          ...state,
          TableIsBooked: false,
          tableMessage: [],
        }));
      }
    } else {
      alert("Failed to load schedule please report this issue");
    }
  }, [date, dateState, Store, setTables, handleModal, location]);

  useEffect(() => {
    debounce(initiate);
    // eslint-disable-next-line
  }, [dateState, location, Store.table, debounce]);

  useEffect(() => {
    if (props && date) {
      setDateState((dateState) => ({
        ...dateState,
        selectedDate: date,
      }));
    }
  }, [props, date]);

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
        date: date,
      };
      if (truthy) {
        handleModal({ booked, modal: "ChooseTableModal" });
      }
      if (value !== undefined) {
        setLocation(value);
      }
    },
    [dateState, date, handleModal]
  );

  function ResetForm() {
    // modalContent.getSchedule();
    // handleScheduleModal();
  }

  return (
    <form
      style={{
        height: "100%",
        display: "flex",
        pointerEvents: "none",
      }}
      onReset={ResetForm}
      onSubmit={confirmSelection}
    >
      <Card style={{ margin: "auto", width: "60%", pointerEvents: "all" }}>
        <CardHeader>
          <h4 className={classes.cardTitle}>
            Now adding to | {moment(date).format("DD-MMMM-YYYY")}
          </h4>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <IconButton
              onClick={() => props.handleClose()}
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <CloseIcon size="medium" sx={{ color: "white" }} />
            </IconButton>
          </CardActions>
        </CardHeader>

        <CardBody style={{ padding: "2rem" }}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={3}
              >
                <TeamsDropDownOptions
                  TeamsDataService={TeamsDataService}
                  PropsFunc={PropsFunc}
                  label={"Select your team first"}
                  placeHolder={"Team"}
                  required={true}
                />
              </Stack>
            </GridItem>

            <GridItem
              xs={12}
              sm={12}
              md={4}
              justifyContent={"center"}
              sx={{ display: "flex" }}
            >
              <Divider orientation="vertical"  sx={{ margin: "auto" }} />

              <Stack
                direction="column"
                justifyContent="left"
                alignItems="left"
                spacing={3}
                sx={{ ml: 5 }}
              >
                <ControlledRadioButtonsGroup
                  currentState={location}
                  officeClicked={officeClicked}
                />
                {Store.table && location === "Office" ? (
                  <p className="ManualLabel">
                    Current table selection {Store.table}
                  </p>
                ) : (
                  ""
                )}
                <div
                  className="flexRow"
                  style={{
                    width: "100%",
                    justifyContent: "left",
                    alignItems: "left",
                  }}
                >
                  <p className="ManualLabel">I'll take a 30 minute break</p>
                  <CheckBox></CheckBox>
                </div>
              </Stack>
              <Divider orientation="vertical"  sx={{ margin: "auto" }}/>
            </GridItem>

            <GridItem xs={12} sm={12} md={4} spacing={2}>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={3}
              >
                {tables.tableMessage}

                <Stack style={{ marginTop: "1rem" }} spacing={3}>
                  <TextField
                    name="Time_Start"
                    id="Time_Start"
                    label="Time start"
                    type="time"
                    defaultValue="09:00"
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
                    name="Time_End"
                    id="Time_End"
                    label="Time end"
                    type="time"
                    defaultValue="17:30"
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
                  <DefaultBtn
                    BtnType={"submit"}
                    disabled={
                      disabledBtn
                        ? true
                        : false || tables.TableIsBooked
                        ? true
                        : false
                    }
                    text={"Confirm Selection"}
                  />
                </Stack>
                <input type="hidden" value={date} name="Date" />
              </Stack>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </form>
  );
}
