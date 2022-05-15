import  { useEffect, useState, useContext, useRef } from "react";
import moment from "moment";
import { GlobalState } from "context/store";
import CardBody from "App/components/Card/CardBody.js";
import { Stack } from "@mui/material";
import { DefaultBtn } from "App/components/MUIComponents";
import CardFooter from "App/components/Card/CardFooter.js";
import TextField from "@mui/material/TextField";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import TeamsDataService from "services/api_services/teams.service";
import ConverterClass from "App/Functions/converterClass";
import ExportCSV from "App/Functions/exportXLSX";
import { TeamsDropDownOptions } from "App/components/CustomComponents";
import HoursDataService from "services/api_services/hours.service";

export default function ExportReports() {
  const render = useRef(0);
  useEffect(() => {
    render.current = render.current + 1;
  }, []);

  const [Store, setStore] = useContext(GlobalState);
  

  const [TeamsFilter, setTeamsFilter] = useState(Store.UserDetails.Department.id);
  const [state, setState] = useState(moment());

  async function ExportReport() {


    const start = moment(state).startOf("month");
    const end = moment(state).endOf("month");
    const startDate = ConverterClass.ToDBDates(start);
    const endDate = ConverterClass.ToDBDates(end);
    const param = {
      start: moment(startDate).format("YYYY-MM-DD"),
      end: moment(endDate).format("YYYY-MM-DD"),
    };
    let ProjectReports = await HoursDataService.ExportReport(
      param
    );

    let TeamLedgers = ProjectReports.data.Ledgers.filter(function (e) {
      return e.Account === TeamsFilter;
    });
    let Ledgers = ProjectReports.data.Ledgers.filter(function (e) {
      return e.Account !== TeamsFilter;
    });

    //? Change excel headers and positioning of columns to the format for the German team want's
    let Filtered = [];
    for (const h of ProjectReports.data.Hour){
      TeamLedgers.forEach(l=>{
        if(h.Transaction_ID === l.Transaction_ID){

          let personLedger = {}
          Ledgers.forEach(le=>{
            if(le.Transaction_ID === h.Transaction_ID){
              personLedger = le
            }
          })
          Filtered.push({
            Hour: h,
            Ledgers: [personLedger, l]
          })
        }
      })
    }

    let ExportArray = []
    Filtered.forEach((e) => {
      let exports = {}
      exports.Name = e.Hour.User
      exports.Caller = e.Hour.Initials
      exports.Datum = e.Hour.Date
      exports.Team = e.Hour.Team
      exports.Stunden = e.Ledgers[0].Hours
      exports.Projekt =  e.Hour.Project
      exports.Task = e.Hour.Contacts
      exports.Bemerkung = e.Hour.Description
      exports.Kontakte = e.Hour.Contacts
      exports.Meetings = e.Hour.Meetings
      exports.Supplement = e.Ledgers[0].Type
      exports.Transaction_ID = e.Hour.Transaction_ID

      if (exports.Bemerkung === null) {
        exports.Bemerkung = "";
      }
      if (exports.Bemerkung === null) {
        exports.Bemerkung = "";
      }
      if (exports.Meetings === null) {
        exports.Meetings = 0;
      }
      if (exports.Kontakte === null) {
        exports.Kontakte = 0;
      }
      exports.Datum = moment(exports.Datum).format("DD-MMM-YYYY");

      if (exports.Stunden === "") {
        exports.Stunden = 0;
      } else {
        exports.Stunden = parseFloat(exports.Stunden);
      }
      if (exports.Projekt === "EWE-Licht-K3") {
        exports.Projekt = "EWE-Licht";
      }
      if (exports.Projekt === "EWE-Green Solutions-K3") {
        exports.Projekt = "EWE-Green Solutions";
      }
      if (exports.Meetings === "") {
        exports.Meetings = 0;
      } else {
        exports.Meetings = parseInt(exports.Meetings);
      }
      if (exports.Kontakte === "") {
        exports.Kontakte = 0;
      } else {
        exports.Kontakte = parseInt(exports.Kontakte);
      }
      ExportArray.push(exports);
    });

    const nameAndSubject = `Project-Hours-${moment(startDate).format(
      "DD-MM-YYY"
    )}-${moment(endDate).format("DD-MM-YYY")}`;
    if (ExportArray.length === 0) {
      setStore({
        Notification: {
          color: "success",
          icon: "check",
          title: "Failed",
          content: "No data to export",
          dateTime: moment(),
        },
      });
      return;
    } else {
      //! Make Username here when getting Graph Data
      ExportCSV(nameAndSubject, "Report", "MakeToUsername", ExportArray);
    }
  }
  function PropsFunc(data) {
    setTeamsFilter(data.target.value);
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
          onClickFunction={ExportReport}
          BtnType={"submit"}
          text={"Export project hours"}
        ></DefaultBtn>
        <div style={{ margin: "1rem" }}></div>
      </CardFooter>
    </>
  );
}
