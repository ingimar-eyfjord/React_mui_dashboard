import { useState, useEffect, useCallback, useContext } from "react";
import TransferList from "App/components/TransferList";
import { GlobalState } from "context/store";
import Card from "App/components/Card/Card.js";
import CardBody from "App/components/Card/CardBody.js";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TaskDataService from "services/api_services/tasks.service";
import ProjectDataService from "services/api_services/projects.service";
import { useDebouncedCallback } from "App/Functions/debounce";
import { DefaultBtn, Notification } from "App/components/MUIComponents";
import { Divider, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";

import moment from "moment";
import GridItem from "App/components/Grid/GridItem";
import GridContainer from "App/components/Grid/GridContainer";

export default function TasksProjects() {
  const [errorNotification, setErrorNotification] = useState(false);

  const [successMessage, setSuccessMessage] = useState(false);
  const [newTaskProject, setnewTaskProject] = useState("");
  const [valid, setValid] = useState(true);


  const successMess = {
    color: "success",
    icon: "check",
    title: "Success",
    content: "Update successfull",
    dateTime: moment(),
  };
  const errormessage = {
    color: "error",
    icon: "warning",
    title: "Failed",
    content: "Something went wrong, please contact IT for support",
    dateTime: moment(),
  };

  const [alignment, setAlignment] = useState("Task");
  const [right, setRight] = useState([]);
  const [left, setLeft] = useState([]);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const [Store, setStore] = useContext(GlobalState);
  const [Department, SetDepartment] = useState(
    Store.UserDetails.Department.id
  );

  const PropsFunc = useCallback(
    async (data, placeholder) => {
      SetDepartment(data.target.value);
    },
    [SetDepartment]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (successMessage === true) {
        setSuccessMessage(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorNotification(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [errorNotification]);

  const debounce = useDebouncedCallback((callback, value) => {
    callback(value);
  }, 300);

  const Confirm = useCallback(async () => {
    if (alignment === "Task") {
      let task;
      try {
        task = await TaskDataService.getAll();
        debounce(setSuccessMessage, true);
      } catch (error) {
        debounce(setErrorNotification, true);
      }
      let data = [];

      for (const e of task) {
        if (right.includes(e.Task)) {
          if(!e.Belongs_to){
            e.Belongs_to = []
          } 
          if (!e.Belongs_to.includes(Department)) {
            e.Belongs_to.push(Department);
          }
          data.push(e);
        }
        if (left.includes(e.Task)) {
          if(!e.Belongs_to){
            e.Belongs_to = []
          } 
          if (e.Belongs_to.includes(Department)) {
            e.Belongs_to = e.Belongs_to.filter((e) => e !== Department);
            data.push(e);
          }
        }
      }

      for (const e of data) {
        try {
          await TaskDataService.update(e.Task, e);
          debounce(setSuccessMessage, true);
        } catch (error) {
          debounce(setErrorNotification, true);
        }
      }
      try {
        const tasks = await TaskDataService.getAll();
        setStore({
          Options: {
            Departments: Store.Options.Departments,
            Project: Store.Options.Project,
            Task: tasks,
            Type: Store.Options.Type,
            CurrentPeriod: Store.Options.CurrentPeriod,
            Locations: Store.Options.Locations,
          },
        });
        debounce(setSuccessMessage, true);
      } catch (error) {
        debounce(setErrorNotification, true);
      }
    }
    if (alignment === "Project") {
      let project;
      try {
        project = await ProjectDataService.getAll();
        debounce(setSuccessMessage, true);
      } catch (error) {
        debounce(setErrorNotification, true);
      }
      let data = [];
      for (const e of project) {
        if (right.includes(e.Project)) {
          if(!e.Belongs_to){
            e.Belongs_to = []
          } 
          if (!e.Belongs_to.includes(Department)) {
            e.Belongs_to.push(Department);
          }
          data.push(e);
        }
        if (left.includes(e.Project)) {
          if(!e.Belongs_to){
            e.Belongs_to = []
          } 
          if (e.Belongs_to.includes(Department)) {
            e.Belongs_to = e.Belongs_to.filter((e) => e !== Department);
            data.push(e);
          }
        }
      }
      for (const e of data) {
        try {
          await ProjectDataService.update(e.Project, e);
          debounce(setSuccessMessage, true);
        } catch (error) {
          debounce(setErrorNotification, true);
        }
      }
      try {
        const Projects = await ProjectDataService.getAll();
        setStore({
          Options: {
            Departments: Store.Options.Departments,
            Project: Projects,
            Task: Store.Options.Task,
            Type: Store.Options.Type,
            CurrentPeriod: Store.Options.CurrentPeriod,
            Locations: Store.Options.Locations,
          },
        });
        debounce(setSuccessMessage, true);
      } catch (error) {
        debounce(setErrorNotification, true);
      }
    }
  }, [left, alignment, Store, Department, right, setStore, debounce]);


  const AddNew = useCallback(
    async () => {
      if(!valid){
        return
      }
      if (alignment === "Project") {
        try {
          const projects = {
            Project: newTaskProject,
          };
          await ProjectDataService.create(projects);
          const Projects = await ProjectDataService.getAll();
          setStore({
            Options: {
              Departments: Store.Options.Departments,
              Project: Projects,
              Task: Store.Options.Task,
              Type: Store.Options.Type,
              CurrentPeriod: Store.Options.CurrentPeriod,
              Locations: Store.Options.Locations,
            },
          });
          debounce(setSuccessMessage, true);
        } catch (error) {
          debounce(setErrorNotification, true);
        }
      }else{
        try {
          const task = {
            Task: newTaskProject,
          };
          await TaskDataService.create(task);
          const tasks = await TaskDataService.getAll();
          setStore({
            Options: {
              Departments: Store.Options.Departments,
              Project: Store.Options.Project,
              Task: tasks,
              Type: Store.Options.Type,
              CurrentPeriod: Store.Options.CurrentPeriod,
              Locations: Store.Options.Locations,
            },
          });
          debounce(setSuccessMessage, true);
        } catch (error) {
          console.log(error)
          debounce(setErrorNotification, true);
        }
      }
    },
    [alignment, newTaskProject, valid, setStore, Store, debounce],
  )

  const handleValidation = (e) => {
    const reg = new RegExp(/^(\w+ ?)[A-Z- _:]+$/i);
    setValid(reg.test(e.target.value));
    setnewTaskProject(e.target.value);
  };


  return (
    <Card style={{ marginTop: 0, padding: "5rem" }}>
      <CardBody>
        <GridContainer>
          <GridItem
            alignItems='center'
            xs={12}
            sm={12}
            md={6}
            sx={{ display: "flex" }}
          >
            <Stack style={{ marginTop: "2rem", width:"100%"}} direction='column' alignItems="flex-end" spacing={2}>
            <Stack style={{ margin: "auto", width:"50%"}} direction='column'  spacing={2}>

              <p>Switch between projects and tasks</p>
              <ToggleButtonGroup
                color='primary'
                value={alignment}
                exclusive
                onChange={handleChange}
              >
                <ToggleButton value='Task'>Tasks</ToggleButton>
                <ToggleButton value='Project'>Projects</ToggleButton>
              </ToggleButtonGroup>
               <Divider orientation='horizontal' sx={{ margin: "auto" }} />
              <p>{`Add new ${alignment}`}</p>
              
              {!valid && <p style={{color:"red"}}>{`Should be at least two letters, no numbers and the special characters allowed are : - _ `}</p>}

              <TextField
                id='outlined-basic'
                label={`Add new ${alignment}`}
                variant='outlined'
                value={newTaskProject}
                error={!valid}
                onChange={e=> {handleValidation(e)}}
              />

              <DefaultBtn
                onClickFunction={AddNew}
                BtnType={"button"}
                text={`Confirm new ${alignment}`}
                disabled={!valid}
                />
            </Stack>

            </Stack>
             <Divider orientation='vertical' sx={{ margin: "auto" }} />
          </GridItem>

          <GridItem
          
            xs={12}
            sm={12}
            md={6}
            sx={{ display: "flex" }}
          >
            <Stack style={{ margin: "auto" }} direction='row' spacing={6}>
              <TeamsDropDownOptions
                PropsFunc={PropsFunc}
                placeHolder={"Team"}
              ></TeamsDropDownOptions>
              <Stack direction='column' spacing={6}>
                <div>
                  <TransferList
                    left={left}
                    setLeft={setLeft}
                    right={right}
                    setRight={setRight}
                    Department={Department}
                    TasksOrProjects={alignment}
                  ></TransferList>
                </div>
                <DefaultBtn
                  onClickFunction={Confirm}
                  BtnType={"button"}
                  text={"Confirm"}
                />
              </Stack>
            </Stack>
          </GridItem>
        </GridContainer>

        {successMessage && <Notification message={successMess}></Notification>}
        {errorNotification && (
          <Notification message={errormessage}></Notification>
        )}
      </CardBody>
    </Card>
  );
}
