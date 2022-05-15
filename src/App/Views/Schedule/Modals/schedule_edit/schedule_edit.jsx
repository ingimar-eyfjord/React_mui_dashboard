import { useState, useEffect, useCallback, useContext } from "react";
import ConverterClass from "App/Functions/converterClass";
import moment from "moment";
import { GlobalState } from "context/store";
import ScheduleDataService from "services/api_services/schedule.service";
import { CheckBox, DefaultBtn, PrimaryBtn } from "App/components/MUIComponents";
import "simplebar/dist/simplebar.min.css";
import TextField from "@mui/material/TextField";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import { Grid } from "@mui/material";
import { WarningNotification } from "App/components/MUIComponents";
import { ControlledRadioButtonsGroup } from "App/components/CustomComponents";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import Stack from "@mui/material/Stack";
import TeamsDataService from "services/api_services/teams.service";
import CloseIcon from "@mui/icons-material/Close";
import { useDebouncedCallback } from "App/Functions/debounce";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";
import Cards from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import styles from "App/components/classes";
import MDBox from "App/components/MDBox";
import { makeStyles } from "@material-ui/styles";
import { Divider } from "@mui/material";
import CardFooter from "App/components/Card/CardFooter";
import Timers from "./components/timers";
import Modal from "@mui/material/Modal";
import ChooseTableModal from "App/components/Modals/chooseTable";
const useStyles = makeStyles(styles);

export default function ScheduleEdit(props) {
  const [location, setLocation] = useState("Home Office");
  // eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  const [team, setTeam] = useState(Store.UserDetails.Department.id);
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(
    props.WorkData.Original.Start
  );
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [times, setTimes] = useState({
    FormTimeEnd: props.WorkData.Original.End,
    FormTimeStart: props.WorkData.Original.Start,
  });

  const [state, setState] = useState({
    IsWorking: undefined,
    message: undefined,
    scheduled: undefined,
    officeSelected: false,
  });

  const [tables, setTables] = useState(false);
  const debounce = useDebouncedCallback((callback, value) => {
    callback(value);
  }, 300);

  const changeTable = useCallback(async () => {
    handleOpen();
  }, []);

  const initiate = useCallback(
    async (data) => {
      if (data.length > 0) {
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
          let truthy = false;
          for (const e of array) {
            if (e.User_UUID !== Store.UserDetails.UserUUID) {
              truthy = true;
            }
            else if(e.User_UUID === Store.UserDetails.UserUUID){
              setStore({
                Notification: {
                  color: "success",
                  icon: "notifications",
                  title: "Notice!",
                  content: `Table ${Store.table} is already booked by you, you will keep it for this edit`,
                  dateTime: moment(),
                },
              });
            }
          }
          if (truthy) {
            setStore({
              Notification: {
                color: "error",
                icon: "warning",
                title: "Failed",
                content: `Table ${Store.table} is already booked at this time, please select another table`,
                dateTime: moment(),
              },
            });
            setTables(true);
            return true;
          }
        }
      } else {
        setTables(false);
      }
    },
    [setTables, setStore, Store.table,Store.UserDetails.UserUUID]
  );

  function PropsFunc(data) {
    setTeam((team) => ({
      ...team,
      Team: data.target.value,
    }));
  }
  const getBookedTables = useCallback(
    async (date) => {
      const selectedDate = date;
      const newParam = {
        start: moment(selectedDate).startOf("day").format(),
        end: moment(selectedDate).endOf("day").format(),
        uuid: Store.UserDetails.UserUUID,
      };
      const Booked = await ScheduleDataService.GetBooked(
        newParam
      );
      newParam.email = Store.UserDetails.UserEmail;
      const TestWorking = await ScheduleDataService.pingTrueFalse(
        newParam
      );
      let isWorkingState = TestWorking.data;
      if (
        moment(props.WorkData.Original.Start).isSame(
          moment(selectedDate),
          "day"
        )
      ) {
        isWorkingState = false;
      }
      if (location === "Office") {
        if (debounce(initiate, Booked.data)) {
          return;
        } else {
          setTables(false);
          return;
        }
      }
      setState((state) => ({
        ...state,
        scheduled: Booked.data,
        IsWorking: isWorkingState,
      }));
      return;
    },
    [initiate, setState, Store, debounce, props, location]
  );

  useEffect(() => {
    if (location === "Office") {
      debounce(getBookedTables, selectedDate);
    }
    // eslint-disable-next-line
  }, [location, Store.table, selectedDate]);

  useEffect(() => {
    setState((state) => ({
      ...state,
      selectedDate: new Date(props.WorkData.Original.Start),
    }));
  }, [props]);

  const changeInput = useCallback(
    async (e) => {
      e.preventDefault();
      e.persist(e);
      const elements = await ConverterClass.formToJSON(e.target.elements);
      const id = props.WorkData.ID;
      delete elements.id;
      if (team === undefined) {
        setStore({
          Notification: {
            color: "error",
            icon: "warning",
            title: "Failed",
            content: "Please select the team first",
            dateTime: moment(),
          },
        });
        return;
      }

      elements.Team = team;
      elements.Date_start_time = ConverterClass.makeMomentDateWithTime(
        selectedDate,
        elements.start
      );
      elements.Date_end_time = ConverterClass.makeMomentDateWithTime(
        selectedDate,
        elements.end
      );

      delete elements.start;
      delete elements.end;
      Object.entries(elements).forEach((entry) => {
        // eslint-disable-next-line
        const [key, value] = entry;
        if (key.includes("ChoiceGroup")) {
          delete elements[key];
        }
      });
      elements.Location = location;
      if (elements.Location === "Office") {
        if (Store.table === undefined) {
          setStore({
            Notification: {
              color: "error",
              icon: "warning",
              title: "Failed",
              content: "Please select the table first",
              dateTime: moment(),
            },
          });
          return;
        }
      }
      elements.Table_number = parseInt(Store.table);
      delete elements.Table;

      const duration = moment.duration(
        moment(elements.Date_end_time).diff(moment(elements.Date_start_time))
      );
      elements.Hours = duration.asHours().toFixed(2);
      if (elements.Break === "true") {
        elements.Hours = parseFloat(elements.Hours - 0.5).toFixed(2);
      }
      elements.Break === "true" ? (elements.Break = 1) : (elements.Break = 0);
      if (elements.Location !== "Office") {
        elements.Table_number = null;
      }
      ScheduleDataService.update(id, elements)
        .then((response) => {
          if (response.request.statusText === "OK") {
            props.getSchedule();
            props.handleClose();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    [Store, setStore, location, props, selectedDate, team]
  );

  function deleteEntry(id) {
    ScheduleDataService.delete(id)
      .then((response) => {
        if (response.request.statusText === "OK") {
          setStore({
            Notification: {
              color: "success",
              icon: "check",
              title: "Success",
              content: "Successfully deleted the schedule",
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
  }
  useEffect(() => {
    if (props.WorkData.ID) {
      setTimes((state) => ({
        ...state,
        FormTimeEnd: props.WorkData.End,
        FormTimeStart: props.WorkData.Start,
      }));
    }
  }, [props.WorkData.End, props.WorkData.Start, props.WorkData.ID]);

  const officeClicked = useCallback((truthy, value) => {
    if (truthy) {
      handleOpen();
    }
    if (value !== undefined) {
      setLocation(value);
    }
  }, []);
  const Start = props.WorkData.Original.start;
  //? Edit the schedule modal
  return (
    <>
      <form
        style={{
          height: "100%",
          display: "flex",
          pointerEvents: "none",
        }}
        key={props.WorkData.ID}
        onSubmit={changeInput}
        id={props.WorkData.ID}
      >
        <Cards
          className="Settings"
          style={{ margin: "auto", width: "60%", pointerEvents: "all" }}
        >
          <CardHeader>
            <h4 className={classes.cardTitle}>
              Now changing |{" "}
              {moment(props.WorkData.Original.Start).format("DD-MMMM-YYYY")}
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
          <MDBox mt={2} mb={3} sx={{ padding: "2rem" }}>
            <Grid container spacing={3}>
              <Grid item justifyContent={"center"} xs={12} md={12} xl={4}>
                <TeamsDropDownOptions
                  TeamsDataService={TeamsDataService}
                  PropsFunc={PropsFunc}
                  label={"Select your team first"}
                  placeHolder={"Team"}
                  required={true}
                />
                <input type="hidden" value={selectedDate} name="Date" />
              </Grid>
              <Grid
                item
                xs={12}
                md={12}
                xl={4}
                justifyContent={"center"}
                sx={{ display: "flex" }}
              >
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <StaticDatePicker
                  sx={{ ml: 5 }}
                  orientation="portrait"
                  displayStaticWrapperAs="desktop"
                  openTo="day"
                  value={selectedDate}
                  minDate={new Date()}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Divider orientation="vertical" sx={{ mx: 0 }} />
              </Grid>

              <Grid item spacing={2} xs={12} md={12} xl={4}>
                <Stack direction="column" spacing={3} position="static">
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
                  <Stack direction="row" spacing={3} position="static">
                    <p className="ManualLabel">I will take a 30 minute break</p>
                    <CheckBox
                      label="I will take 30 minutes break"
                      name="Break"
                    ></CheckBox>
                  </Stack>

                  {state.officeSelected === true ? (
                    <WarningNotification
                      warningMessage={
                        "Please note!! This feature is not yet aware of tables already booked, nor can it book a table for you at this time. If you had a table booked on the day you are currently editing, then you will keep the table for the updated entry, so please make sure you are not overwriting another persons table booking."
                      }
                    />
                  ) : null}
                  <input type="hidden" value={Start} name="day" />
                  {state.message}
                </Stack>

                <Timers times={times} setTimes={setTimes}></Timers>
              </Grid>
            </Grid>
          </MDBox>
          <CardFooter>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={12} md={6} xl={6}>
                <div
                  onClick={(e) => {
                    deleteEntry(props.WorkData.ID);
                  }}
                >
                  <PrimaryBtn BtnType={"button"} text={"Delete this entry"} />
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={6}>
                {state.IsWorking ? (
                  <h3 className="InfoWarning">
                    You are already working on this day
                  </h3>
                ) : (
                  <>
                    <Stack spacing={3}>
                      {tables && (
                        <div onClick={changeTable}>
                          <DefaultBtn
                            disabled={false}
                            BtnType={"button"}
                            text={"Click to change table"}
                          />
                        </div>
                      )}
                    </Stack>

                    {!tables && (
                      <DefaultBtn
                        BtnType={"submit"}
                        disabled={tables ? true : false}
                        text={"Confirm Edit"}
                      />
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </CardFooter>
        </Cards>
      </form>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ChooseTableModal
          times={times}
          handleModal={handleClose}
          selectedDate={selectedDate}
        ></ChooseTableModal>
      </Modal>
    </>
  );
}
