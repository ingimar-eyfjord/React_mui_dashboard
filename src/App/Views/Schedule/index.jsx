//? This is the file that opens when the Tab "Schedule" is clicked.
//? It has Three sub pages that can be navigated from here.
import { useState } from "react";
import OfficeSchedule from "./OfficeSchedule";
import AddToSchedule from "./AddToSchedule";
import YourSchedule from "./YourSchedule";
import GraphInfoService from "services/graph_services/graph.service.js";
import ConverterClass from "App/Functions/converterClass";
import ScheduleDataService from "services/api_services/schedule.service";
import {
  DefaultBtn,
  PrimaryBtn,
  CalendarComponent,
} from "App/components/MUIComponents";
import TeamsDataService from "services/api_services/teams.service";
import LocationsDataService from "services/api_services/locations.service";
import {
  LocationDropDownOptions,
  TeamsDropDownOptions,
} from "App/components/CustomComponents";
import CardBody from "App/components/Card/CardBody.js";
import GridItem from "App/components/Grid/GridItem.js";
import Card from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import "./schedule.css";
import { useParams } from "react-router-dom";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";
import DashboardLayout from "App/components/DashboardLayout";
import DashboardNavbar from "App/components/DashboardNavbar";
import { Stack } from "@mui/material";
const useStyles = makeStyles(styles);

export default function Schedule(props) {
  const classes = useStyles();
  // ? This is the pages, here you define the amount of pages and a navigator component from Fluent UI will make tabs to navigate to them
  let { subPath } = useParams();

  const [loggedHours, setLoggedHours] = useState(0);

  return (
    <>
      {subPath === "log" && (
        <DashboardLayout>
          <DashboardNavbar />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }}>

          <AddToSchedule
            ConverterClass={ConverterClass}
            DefaultBtn={DefaultBtn}
            PrimaryBtn={PrimaryBtn}
            CalendarComponent={CalendarComponent}
            Bearer={props.Bearer}
            ScheduleDataService={ScheduleDataService}
            TeamsDataService={TeamsDataService}
            TeamsDropDownOptions={TeamsDropDownOptions}
            />
            </Stack>
        </DashboardLayout>
      )}
      {subPath === undefined && (
        <DashboardLayout>
          <DashboardNavbar />
          <YourSchedule
          />
        </DashboardLayout>
      )}
      {subPath === "D1" && (
        <DashboardLayout>
          <DashboardNavbar />
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card style={{ marginTop: 0 }}>
                <CardHeader>
                  <div style={{ justifySelf: "start" }}>
                    <p className={classes.cardCategory}>Logged hours</p>
                    <p className={classes.cardTitle}>{loggedHours?.Hours}</p>
                  </div>
                </CardHeader>

                <CardBody>
                  <OfficeSchedule
                    setLoggedHours={setLoggedHours}
                    ConverterClass={ConverterClass}
                    GraphInfoService={GraphInfoService}
                    TeamsDropDownOptions={TeamsDropDownOptions}
                    TeamsDataService={TeamsDataService}
                    LocationsDataService={LocationsDataService}
                    LocationDropDownOptions={LocationDropDownOptions}
                    Bearer={props.Bearer}
                    ScheduleDataService={ScheduleDataService}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </DashboardLayout>
      )}
    </>
  );
}
