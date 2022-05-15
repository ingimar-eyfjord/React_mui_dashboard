import  { useEffect, useState } from "react";
import ExportSalary from "./exportSalary";
import ExportReports from "./exportReports";
import ExportSchedule from "./exportSchedule";
import Cards from "App/components/Card/Card.js";
// @mui material components
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";
export default function ExportReport() {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  return (
    <Cards style={{ marginTop: 0 }}>
      <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
        <AppBar position='static'>
          <Tabs
            orientation={tabsOrientation}
            value={tabValue}
            onChange={handleSetTabValue}
          >
            <Tab
              label='Project Report'
              icon={
                <AssignmentIcon fontSize='small' sx={{ mt: -0.25 }}>
                  home
                </AssignmentIcon>
              }
            />
            <Tab
              label='Salary Report'
              icon={
                <AccountBalanceIcon fontSize='small' sx={{ mt: -0.25 }}>
                  email
                </AccountBalanceIcon>
              }
            />
            <Tab
              label='Schedule Report'
              icon={
                <EventNoteIcon fontSize='small' sx={{ mt: -0.25 }}>
                  settings
                </EventNoteIcon>
              }
            />
          </Tabs>
        </AppBar>
      </Grid>
      {tabValue === 0 && (
        <ExportReports
        ></ExportReports>
      )}
      {tabValue === 1 && (
        <ExportSalary
        ></ExportSalary>
      )}
      {tabValue === 2 && (
        <ExportSchedule
        ></ExportSchedule>
      )}
    </Cards>
  );
}
