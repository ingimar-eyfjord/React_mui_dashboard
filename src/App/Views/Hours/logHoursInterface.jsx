// Licensed under the MIT License.
import { useState, useEffect, useCallback, useContext } from "react";
import moment from "moment";
import _ from "lodash";
import { GlobalState } from "context/store";
import Stack from "@mui/material/Stack";
import GridItem from "App/components/Grid/GridItem.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import { usePosition } from "App/components/usePosition";
import { Card } from "@mui/material";
import Functions from "App/Functions/functions";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Number } from "App/components/MUIComponents";
import { TextFieldAuto } from "App/components/MUIComponents";
import { DefaultBtn } from "App/components/MUIComponents";
import HoursDataService from "services/api_services/hours.service";
import ConverterClass from "App/Functions/converterClass";
import CardBody from "App/components/Card/CardBody.js";
import { Divider } from "@mui/material";

//! find out why this module is rendered twice, it will cause an error since the DropDownOptions is undefined
export default function LogHoursInterface() {
  // VARIABLES
  const { latitude, longitude } = usePosition();
  // eslint-disable-next-line
  const [Office, SetOffice] = useState(false);
  const [Store, setStore] = useContext(GlobalState);

  useEffect(() => {
    const area = Functions.distanceInKmBetweenEarthCoordinates(
      latitude,
      longitude
    ).toFixed(1);
    if (area < 2) {
      SetOffice(true);
    }
  }, [latitude, longitude]);

  const [DropDownInputs, setDropDownInputs] = useState({
    Team: Store.UserDetails.Department.id,
    Project: "",
    Task: "",
    Type: "Normal",
  });
  const [selectedDate, setSelectedDateState] = useState(moment().format());
  const [projects, setProjects] = useState([]);
  const [Role, setRole] = useState();
  // END STATES

  //HOOKS

  

  const [disabledBtn, setDisabledBtn] = useState(false);

  const getTasksOptions = useCallback(async () => {
    const Team = DropDownInputs.Team;
    if (!Team) return;
    let Tasks = [];

    for (const e of Store.Options.Task) {
      if(!e.Belongs_to){
        e.Belongs_to = []
      } 
      if (e.Belongs_to.includes(Team)) {
        Tasks.push(e.Task);
      }
    }
    let Projects = [];
    for (const e of Store.Options.Project) {
      if(!e.Belongs_to){
        e.Belongs_to = []
      } 
      if (e.Belongs_to.includes(DropDownInputs.Team)) {
        Projects.push(e);
      }
    }

    setProjects(Projects);
    let setPr = "";
    if (Projects.length > 0) {
      setPr = Projects[0].Project;
    }
    setDropDownInputs((DropDownInputs) => ({
      ...DropDownInputs,
      Project: setPr,
      // Project: projects[0],
    }));

    for (const y of Store.EmplyUsers) {
      if (y.uuid === Store.UserDetails.UserUUID) {
        setRole(y.jobTitle);
        if (y.jobTitle === "Konsultant") {
          setDropDownInputs((DropDownInputs) => ({
            ...DropDownInputs,
            Task: "Calling",
          }));
        } else {
          setDropDownInputs((DropDownInputs) => ({
            ...DropDownInputs,
            Task: Tasks[0],
          }));
        }
      }
    }
    // esilint disable next line
  }, [Store, DropDownInputs]);

  useEffect(() => {
    getTasksOptions();
    // eslint-disable-next-line
  }, [DropDownInputs.Team]);

  // END CALLBACKS

  // FUNCTIONS

  //? This function will return the values that are not numbers from the response data from Tasks, Projects and Types tables from the SQL query

  function submitHours(e) {
    e.preventDefault();
    e.persist(e);
    let elements = ConverterClass.formToJSON(
      e.target.elements
    );
    elements.Date = moment(elements.Date).format();
    const Date = moment(elements.Date).format();
    const Week_number = moment(Date).isoWeek();
    elements.Meetings = parseInt(elements.Meetings);
    elements.Contacts = parseInt(elements.Contacts);
    elements.Hours = parseFloat(elements.Hours);
    elements.Week_number = Week_number;
    elements.Date = Date;
    elements.User = Store.UserDetails.UserName;
    elements.Email = Store.UserDetails.UserEmail;
    elements.Account_Debit = DropDownInputs.Team;
    elements.Account_Credit = Store.UserDetails.UserUUID;
    elements = _.merge(elements, DropDownInputs);

    if (elements.Hours === null || elements.Hours === undefined) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Please input your hours",
          dateTime: moment(),
        },
      });
      return;
    }

    if (elements.Project === null || elements.Project === undefined) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Please input your project",
          dateTime: moment(),
        },
      });
      return;
    }
    if (elements.Task === null || elements.Task === undefined) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Please input your task",
          dateTime: moment(),
        },
      });
      return;
    }
    //New feature where it alerts when the description is more than 225 characters (done by adriano)
    if (elements.Description === undefined) {
      elements.Description = "";
    }
    if (elements.Description.length >= 220) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Comment can't be more than 225 characters",
          dateTime: moment(),
        },
      });
      return;
    }
    setDisabledBtn(true);

    HoursDataService.create(elements)
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
          setDisabledBtn(false);

          let Team = DropDownInputs.Team;
          let Project = DropDownInputs.Project;
          let Task = DropDownInputs.Task;
          setDropDownInputs((state) => ({
            ...state,
            Team: Team,
            Project: Project,
            Task: Task,
          }));
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
        setDisabledBtn(false);
      });
  }

  function PropsFunc(data, placeholder) {
    setDropDownInputs((DropDownInputs) => ({
      ...DropDownInputs,
      [data.target.name]: data.target.value,
    }));
  }
  // END FUNCTIONS
  // RENDER
  const leng = Store.Options.Task.filter((e) => {
    if(!e.Belongs_to){
      e.Belongs_to = []
    } 
    return e.Belongs_to.includes(DropDownInputs.Team);
  });
  return (

      <Card>
        <form onSubmit={submitHours} style={{ height: "fit-content" }}>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={12} md={2} style={{ marginBottom: "3rem" }}>
                <Stack
                  mt={4}
                  direction='column'
                  justifyContent='center'
                  alignItems='center'
                >
                  <TeamsDropDownOptions PropsFunc={PropsFunc} name={"Team"} />
                  <input
                    type='hidden'
                    required
                    name={"Date"}
                    value={selectedDate}
                  />
                </Stack>
              </GridItem>
              <GridItem
                justifyContent='center'
                alignItems='center'
                xs={12}
                sm={12}
                md={6}
                sx={{ display: "flex" }}
              >
                <Divider orientation='vertical' sx={{ margin: "auto" }} />
                <StaticDatePicker
                  sx={{ margin: "auto" }}
                  displayStaticWrapperAs='desktop'
                  openTo='day'
                  value={selectedDate}
                  maxDate={new Date(Store.Options.CurrentPeriod.Date_end)}
                  // minDate={new Date(Store.Options.CurrentPeriod.Date_start)}
                  onChange={(newValue) => {
                    setSelectedDateState(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <input
                  type='hidden'
                  required
                  name={"Date"}
                  value={selectedDate}
                />
                <Divider orientation='vertical' sx={{ margin: "auto" }} />
              </GridItem>

              <GridItem xs={12} sm={12} md={4}>
                <Grid container alignItems='center' justifyContent='center'>
                  <GridItem
                    sx={{ marginTop: "2rem", display: "flex" }}
                    xs={12}
                    sm={12}
                    md={6}
                  >
                    <Stack direction='column' spacing={4}>
                      <Box>
                        <FormControl fullWidth>
                          <InputLabel id='demo-simple-select-labelf'>
                            Select project
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-labelf'
                            id='demo-simple-select'
                            value={DropDownInputs.Project}
                            label='Project'
                            name={"Project"}
                            onChange={PropsFunc}
                          >
                            {projects.map((e, index) => {
                              return (
                                <MenuItem key={index} value={e.Project}>
                                  {e.Project}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl fullWidth>
                          <InputLabel id='demo-simple-select-labels'>
                            Select Task
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-labels'
                            id='demo-simple-select'
                            value={DropDownInputs.Task}
                            label='Task'
                            name={"Task"}
                            onChange={PropsFunc}
                          >
                            {!leng.some(
                              (key) =>
                                key.Task === "Calling" && Role === "Konsultant"
                            ) ? (
                              <MenuItem value={"Calling"}>Calling</MenuItem>
                            ) : null}

                            {leng.length <= 0 && Role === "Konsultant" ? (
                              <MenuItem value={"Calling"}>Calling</MenuItem>
                            ) : null}

                            {Store.Options.Task.map((e) => {
                                if(!e.Belongs_to){
                                  e.Belongs_to = []
                                } 
                              if (e.Belongs_to.includes(DropDownInputs.Team)) {
                                return (
                                  <MenuItem key={e.Task} value={e.Task}>
                                    {e.Task}
                                  </MenuItem>
                                );
                              } else {
                                return null;
                              }
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                      <Box>
                        <FormControl fullWidth>
                          <InputLabel id='demo-simple-select-labelg'>
                            Supplement/Type
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-labelg'
                            id='demo-simple-select'
                            value={DropDownInputs.Type}
                            label='Type'
                            name={"Type"}
                            onChange={PropsFunc}
                          >
                            {Store.Options.Type.map((e, index) => {
                              return (
                                <MenuItem key={index + e} value={e.Type}>
                                  {e.Type}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                    </Stack>
                  </GridItem>

                  <GridItem sx={{ marginTop: "2rem" }} xs={12} sm={12} md={6}>
                    <Stack
                      direction='column'
                      justifyContent='center'
                      alignItems='center'
                      spacing={4}
                    >
                      <Number
                        IconID={"Clock"}
                        InputName={"Hours"}
                        label={"Hours"}
                        required={true}
                        step={0.25}
                        maximum={16}
                        minimum={0}
                        clear={disabledBtn}
                      ></Number>

                      {DropDownInputs.Task === "Calling" && (
                        <>
                          <Number
                            IconID={"Phone"}
                            InputName={"Contacts"}
                            label={"Contacts"}
                            required={false}
                            step={1}
                            maximum={250}
                            minimum={0}
                            clear={disabledBtn}
                          ></Number>
                          <Number
                            IconID={"PeopleAdd"}
                            InputName={"Meetings"}
                            label={"Meetings"}
                            placeHolder={"Meetings"}
                            required={false}
                            step={1}
                            maximum={250}
                            minimum={0}
                            clear={disabledBtn}
                          ></Number>
                        </>
                      )}
                    </Stack>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <TextFieldAuto
                      InputName={"Description"}
                      label={"Comment"}
                      required={false}
                      placeHolder={"Optionally add a comment to the input"}
                      clear={disabledBtn}
                    ></TextFieldAuto>

                    <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
                      <DefaultBtn
                        text={"Log hours"}
                        disabled={disabledBtn}
                        BtnType={"submit"}
                      ></DefaultBtn>
                    </div>
                  </GridItem>
                </Grid>
              </GridItem>
            </GridContainer>
          </CardBody>
        </form>
      </Card>
  );
}
