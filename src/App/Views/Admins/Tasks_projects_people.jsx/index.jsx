import { useState, useEffect, useCallback, useContext } from "react";
import TransferList from "App/components/TransferList_people";
import { GlobalState } from "context/store";
import Card from "App/components/Card/Card.js";
import CardBody from "App/components/Card/CardBody.js";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import ProjectDataService from "services/api_services/projects.service";
import { useDebouncedCallback } from "App/Functions/debounce";
import {
  DefaultBtn,
  Notification,
} from "App/components/MUIComponents";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import { DropDown } from "App/components/MUIComponents";
import { Stack } from "@mui/material";
import moment from "moment";
import DashboardLayout from "App/components/DashboardLayout";
import DashboardNavbar from "App/components/DashboardNavbar";
export default function TasksProjectsUsers() {
  const [errorNotification, setErrorNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [right, setRight] = useState([]);
  const [left, setLeft] = useState([]);
  const [projects, setProjects] = useState(["Loading"]);
  const [selectedProject, setSelectedProject] = useState("");
  const [Store, setStore] = useContext(GlobalState);
  const [Department, SetDepartment] = useState(
    Store.UserDetails.Department.id
  );

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
    let project;
    try {
      project = await ProjectDataService.getAll();
      debounce(setSuccessMessage, true);
    } catch (error) {
      debounce(setErrorNotification, true);
    }
    let data = []
    for (const e of project) {
      if (e.Project === selectedProject) {
        for (const r of right) {
          if (!e.Assigned_to.includes(r.userUUID)) {
            e.Assigned_to.push(r.userUUID);
          }
        }
        for (const r of left) {
            if (e.Assigned_to.includes(r.userUUID)) {
              e.Assigned_to = e.Assigned_to.filter((e) => e !== r.userUUID);
              }
        }
        data.push(e);
      }
    }
    for (const e of data) {
      try {
        await ProjectDataService.update(
          e.Project,
          e,
        );
        debounce(setSuccessMessage, true);
      } catch (error) {
        debounce(setErrorNotification, true);
      }
    }
    try {
      const Projects = await ProjectDataService.getAll(
      );
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
  }, [left, Store, right, setStore, debounce, selectedProject]);

  useEffect(() => {
    let projectList = [];
    for (const e of Store.Options.Project) {
      if(!e.Belongs_to){
        e.Belongs_to = []
      } 
      if (e.Belongs_to.includes(Department)) {
        projectList.push(e);
      }
    }
    setProjects(projectList);
    // esilint disable next line
  }, [Department,Store.Options.Project]);

  const handleChangeDrop = (event) => {
    setSelectedProject(event.target.value);
  };
  return (
    <DashboardLayout>
    <DashboardNavbar />
    <Card style={{ marginTop: 0 }}>
      <CardBody>
        <Stack style={{ marginTop: "2rem" }} direction='row' spacing={6}>
          <TeamsDropDownOptions
            PropsFunc={PropsFunc}
            placeHolder={"Team"}
          ></TeamsDropDownOptions>

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>
                Select project
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={selectedProject}
                label='Age'
                onChange={handleChangeDrop}
              >
                {projects.map((e) => {
                  return <MenuItem value={e.Project}>{e.Project}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>

          <Stack direction='column' spacing={6}>
            <div>
              <TransferList
                left={left}
                setLeft={setLeft}
                right={right}
                setRight={setRight}
                Department={Department}
                selectedProject={selectedProject}
              ></TransferList>
            </div>
            <DefaultBtn
              onClickFunction={Confirm}
              BtnType={"button"}
              text={"Confirm"}
            />
          </Stack>
        </Stack>
        {successMessage && <Notification message={successMess}></Notification>}
        {errorNotification && (
          <Notification message={errormessage}></Notification>
        )}
      </CardBody>
    </Card>
    </DashboardLayout>

  );
}
