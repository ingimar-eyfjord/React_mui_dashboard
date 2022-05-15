// Licensed under the MIT License.
import { useState, useEffect, useCallback, useContext } from "react";
import moment from "moment";
import _ from "lodash";
import { GlobalState } from "context/store";
import TaskDataService from "services/api_services/tasks.service";
import SupplementDataService from "services/api_services/supplement.service";
import ProjectDataService from "services/api_services/projects.service";
import { Number } from "App/components/MUIComponents";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import { DropDown } from "App/components/MUIComponents";
import { LocationDropDownOptions } from "App/components/CustomComponents";
import { TextFieldAuto } from "App/components/MUIComponents";
import HoursDataService from "services/api_services/hours.service";
import ConverterClass from "App/Functions/converterClass";
import { PrimaryBtn, DefaultBtn } from "App/components/MUIComponents";
import TeamsDataService from "services/api_services/teams.service";
import LocationsDataService from "services/api_services/locations.service";
import { PeoplePickerComp } from "App/components/MGTComponents";
import { Stack } from "@mui/material";
import Card from "App/components/Card/Card.js";
import CardBody from "App/components/Card/CardBody.js";
import StaticDatePicker from "@mui/lab/StaticDatePicker";


//! find out why this module is rendered twice, it will cause an error since the DropDownOptions is undefined
export default function LogHoursInterface() {
// eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  const [selectedPerson, setPerson] = useState(undefined);

  const [disabledBtn, setDisabledBtn] = useState(false);

  const [DropDownInputs, setDropDownInputs] = useState({
    Team: undefined,
  });
  const OptionsTemplate = {
    Tasks: ["option1", "option2"],
    Projects: ["option1", "option2"],
    Supplements: ["option1", "option2"],
  };
  const [Options, SetOptions] = useState(OptionsTemplate);

  const getTasksOptions = useCallback(
    async (Team) => {
      if (!Team) return;
      let Tasks = await TaskDataService.GetAllInTeam(
        Team
      );
      Tasks = GetMappedOptions(Tasks);

      let Supplements = await SupplementDataService.GetEverything(
      );
      Supplements = GetMappedOptions(Supplements);

      let Projects = await ProjectDataService.GetAllInTeam(
        Team
      );
      Projects = GetMappedOptions(Projects);
      SetOptions({ Tasks, Supplements, Projects });
    },
    []
  );

  useEffect(() => {
    getTasksOptions(DropDownInputs.Team);
  }, [DropDownInputs.Team, getTasksOptions]);

  //? This function will return the values that are not numbers from the response data from Tasks, Projects and Supplements tables from the SQL query
  function GetMappedOptions(Data) {
    let MapThis = [];
    Data.forEach((e) => {
      const Values = Object.values(e);
      Values.forEach((t) => {
        if (isNaN(t)) {
          MapThis.push(t);
        }
      });
    });
    return MapThis.map((e, index) => {
      return { key: `${index}`, text: `${e}` };
    });
  }
  function submitHours(e) {
    e.preventDefault();
    e.persist(e);
    if (selectedPerson === undefined) {
      alert("select person first");
      return;
    }
    let elements = ConverterClass.formToJSON(e.target.elements);
    const Date = moment(elements.Date).format();
    const Week_number = moment(elements.Date).week();
    elements.Meetings = parseInt(elements.Meetings);
    elements.Contacts = parseInt(elements.Contacts);
    elements.Hours = parseFloat(elements.Hours);
    elements.Week_number = Week_number;
    elements.Date = Date;
    elements.User = selectedPerson.displayName;
    elements.Email = selectedPerson.userPrincipalName;
    elements.User_UUID = selectedPerson.id;
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
    if (elements.Location === null || elements.Location === undefined) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Please input your location",
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

  const [selectedDate, setSelectedDateState] = useState("");

  function calendarChooseDate(date) {
    setSelectedDateState(date);
  }
  function PropsFunc(data, placeholder) {
    setDropDownInputs((DropDownInputs) => ({
      ...DropDownInputs,
      [placeholder]: data,
    }));
    // getTasksOptions(props, placeholder);
  }
  function selected(value) {
    if (value.detail.length > 0) {
      const person = value.detail[0];
      setPerson(person);
    } else {
      setPerson(undefined);
    }
  }
  return (
    <form style={{ width: "fit-content" }} onSubmit={submitHours}>
      <Card style={{ marginTop: 0 }}>
        <CardBody style={{ height: "fit-content" }}>
          <Stack direction="row" spacing={6}>
            <Stack spacing={2}>
              <p className="ManualLabel">Select person</p>
              <PeoplePickerComp
                passedDown={selected}
                mode={"single"}
              ></PeoplePickerComp>
              <input
                type="hidden"
                required
                name={"Date"}
                value={selectedDate}
              />
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                value={selectedDate}
                onChange={(newValue) => {
                  calendarChooseDate(newValue);
                }}
              />
            </Stack>
            <Stack spacing={2} style={{ width: "30vw" }}>
              <Number
                IconID={"Clock"}
                InputName={"Hours"}
                label={"Hours"}
                required={true}
                step={0.25}
                maximum={2000}
                minimum={0}
              ></Number>
              <Number
                IconID={"Phone"}
                InputName={"Contacts"}
                label={"Contacts"}
                required={true}
                step={1}
                maximum={2000}
                minimum={0}
              ></Number>
              <Number
                IconID={"PeopleAdd"}
                InputName={"Meetings"}
                label={"Meetings"}
                required={true}
                step={1}
                maximum={2000}
                minimum={0}
              ></Number>
              <TeamsDropDownOptions
                TeamsDataService={TeamsDataService}
                PropsFunc={PropsFunc}
                label={"Select your team first"}
                placeHolder={"Team"}
                required={true}
              />
              <DropDown
                InputName={"Task"}
                placeHolder={"Task"}
                label={"Task"}
                PropsFunc={PropsFunc}
                required={true}
                options={Options.Tasks}
              ></DropDown>
              <DropDown
                InputName={"Project"}
                placeHolder={"Project"}
                label={"Project"}
                PropsFunc={PropsFunc}
                required={true}
                options={Options.Projects}
              ></DropDown>
              <LocationDropDownOptions
                required={true}
                label={"Location"}
                PropsFunc={PropsFunc}
                placeHolder={"Location"}
                LocationsDataService={LocationsDataService}
              ></LocationDropDownOptions>
              <DropDown
                InputName={"Supplement"}
                placeHolder={"Supplement"}
                label={"Supplement"}
                PropsFunc={PropsFunc}
                required={false}
                options={Options.Supplements}
              ></DropDown>
              <TextFieldAuto
                InputName={"Description"}
                label={"Comment"}
                required={false}
                placeHolder={"Optionally add a comment to the input"}
              ></TextFieldAuto>
              <PrimaryBtn
                text={"Log hours"}
                disabled={disabledBtn}
                BtnType={"submit"}
              ></PrimaryBtn>
              <DefaultBtn text={"Cancel"}></DefaultBtn>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </form>
  );
}
