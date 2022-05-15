import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { GlobalState } from "context/store";
import moment from "moment";
import CardBody from "App/components/Card/CardBody.js";
import { DefaultBtn } from "App/components/MUIComponents";
import CardFooter from "App/components/Card/CardFooter.js";
import TextField from "@mui/material/TextField";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import { Stack } from "@mui/material";
import TeamsDataService from "services/api_services/teams.service";
import ConverterClass from "App/Functions/converterClass";
import ExportCSV from "App/Functions/exportXLSX";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import ScheduleDataService from "services/api_services/schedule.service";

export default function ExportSchedule() {
  const render = useRef(0);
  const [Store, setStore] = useContext(GlobalState);

  useEffect(() => {
    render.current = render.current + 1;
  }, []);
  const [TeamsFilter, setTeam] = useState(Store.UserDetails.Department.id);
  const [state, setState] = useState(moment());

  const ExportScheduled = useCallback(
    async () => {
      const param = {
        start: moment(state).format("YYYY-MM-DD"),
        team: TeamsFilter,
      };
      let ScheduleReport = await ScheduleDataService.ExportScheduleMonthlyByTeam(
        param
      );
      let azureUsers = ScheduleReport.data[2]

      ScheduleReport = ScheduleReport.data[0];
      const lengTH = Object.keys(ScheduleReport).length;
      let ScheduleReportArray = [];
      for (let i = 0; i < lengTH; i++) {
        ScheduleReportArray.push(ScheduleReport[i]);
      }

      for (let i = 0; i < azureUsers.length; i++) {
        ScheduleReportArray.push(azureUsers[i]);
      }

      //! need to find all users in graph data currently working to see if anyone has not scheduled anything
      //! in the current timeline// must return username: 0 "Hours"
      //   users = users.filter(function (e) {
      //     return e.Team == team
      //   });
      // ScheduleReport.forEach(e => {
      //     const ob = {
      //       User: User,
      //       initials: e.user_uid,
      //       hours: 0,
      //     }
      //     newJs = [...ScheduleReport, ob]
      //   })
      //! upper foreach function must concat all graph users into the ScheduleReport to make total graph user list + scheduled
  
      //? Construct a new object to calculate total for each user where if user exists then go through the data and sum up the hours
      let ExcelData = [];
      ScheduleReportArray.forEach(function (a) {

        if(a.User_UUID){
          a.id = a.User_UUID
          delete a.User_UUID
        }
        if(a.Email){
          a.mail =  a.Email
          delete a.Email
        }
        if(!a.mail){
          return
        }
        if(a.mail.substr(0, a.mail.indexOf("@")).toUpperCase().length > 3){
          return
        }
        if(!a.displayName){
          a.displayName = undefined
        }
        if(!a.Hours){
          a.Hours = 0
        }
        if (!this[a.id]) {
          this[a.id] = {
            Name: a.displayName,
            Caller: a.mail.substr(0, a.mail.indexOf("@")).toUpperCase(),
            Hours: 0,
            id: a.id
          };
          ExcelData.push(this[a.id]);
        }
          this[a.id].Hours = +parseFloat(this[a.id].Hours) + +parseFloat(a.Hours);
      }, Object.create(null));

      ExcelData.forEach((e, index)=>{
        azureUsers.forEach(t=>{
          if(e.id === t.id){
            e.Name = t.displayName
          }
        })
      })
      ExcelData.forEach(e=>{
        if(e.Name === undefined){
          e.Name = "Former User"
        }
        delete e.id
      })
  
      const nameAndSubject = `Scheduled-Hours-${ConverterClass.toReadableDates(
        moment(state)
      )}`;
      if (ExcelData.length === 0) {
        setStore({
          Notification: {
            color: "error",
            icon: "warning",
            title: "Failed",
            content: "No data to export",
            dateTime: moment(),
          },
        });
        return;
      } else {
        //! Make Username here when getting Graph Data
        ExportCSV(nameAndSubject, "Salary report", "MakeToUsername", ExcelData);
      }

    },
    [TeamsFilter, setStore, state],
  )
  
 

  function PropsFunc(data) {
    setTeam(data.target.value);
    return;
  }
  return (
    <>
      <CardBody>
        <Stack
          direction='row'
          spacing={10}
          justifyContent='center'
          alignItems='center'
        >
          <TeamsDropDownOptions
            PropsFunc={PropsFunc}
            label={"Select the team"}
            nameForLabel={"TeamFilter"}
            TeamsDataService={TeamsDataService}
          ></TeamsDropDownOptions>
          <StaticDatePicker
            displayStaticWrapperAs='desktop'
            openTo='month'
            value={state}
            views={["year", "month"]}
            onChange={(newValue) => {
              setState(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Stack>
      </CardBody>
      <CardFooter>
        <div style={{ margin: "1rem" }}></div>
        <DefaultBtn
          onClickFunction={ExportScheduled}
          BtnType={"button"}
          text={"Export schedule report"}
        ></DefaultBtn>
        <div style={{ margin: "1rem" }}></div>
      </CardFooter>
    </>
  );
}
