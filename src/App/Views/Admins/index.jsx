import ExportReport from "./Reports/Reports.jsx";
import EditHours from "./Hours";
import EditSchedule from "./Schedule/index2.0";
import SalaryPeriodSet from "./Salary_period_set/index.jsx";
import SalaryPeriod from "./Salary_period/index.jsx";
import SalaryOverview from "./Salary_Overview/index.jsx";
import Import from "./Import";
import { useParams } from "react-router-dom";
import LogHoursInterface from "./Log_hours/index";
import Card from "App/components/Card/Card.js";
import CardBody from "App/components/Card/CardBody.js";
import Announcements from "./Announcements";
import TasksProjects from "App/Views/Admins/Tasks-Projects2.0";
import TasksProjectsUsers from "./Tasks_projects_people.jsx/index.jsx";
import forOfor from "assets/img/notifications/404.png";
import forOone from "assets/img/notifications/401.png";
import MDBox from "App/components/MDBox/index.js";
import AdminPanel from "./Admin_panel/index.jsx";
import DashboardLayout from "App/components/DashboardLayout";
import DashboardNavbar from "App/components/DashboardNavbar";
import TokenService from "services/api_services/token.service";

export default function Admins() {
  const NoMatch = () => {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <MDBox
          component='img'
          src={forOfor}
          alt='Brand'
          width='2rem'
          sx={{ width: "100%", height: "auto" }}
        />
      </div>
    );
  };
  const NotAuthorized = () => {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <MDBox
          component='img'
          src={forOone}
          alt='Brand'
          width='2rem'
          sx={{ width: "100%", height: "auto" }}
        />
      </div>
    );
  };
  let { subPath, secondPath } = useParams();
  let roles = TokenService.getRoles()
  if (!roles.includes('admin')) {
    return <NotAuthorized></NotAuthorized>;
  } else if (subPath === undefined) {
    return (
      <DashboardLayout>
      <DashboardNavbar />
        <AdminPanel></AdminPanel>
        </DashboardLayout>

    );
  } else if (subPath === "schedules") {
    return (
      <DashboardLayout>
      <DashboardNavbar />
        {secondPath === "edit" && <EditSchedule></EditSchedule>}
        {secondPath === "import" && <Import></Import>}
        </DashboardLayout>

    );
  } else if (subPath === "hours") {
    return (
      <DashboardLayout>
      <DashboardNavbar />
        {secondPath === "edit" && (
          <>
            <EditHours></EditHours>
          </>
        )}
        {secondPath === "log" && <LogHoursInterface></LogHoursInterface>}
        </DashboardLayout>

    );
  } else if (subPath === "salary") {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        {secondPath === "periods" && (
          <Card style={{ marginTop: 0 }}>
            <CardBody
              style={{
                height: "fit-content",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <SalaryPeriodSet></SalaryPeriodSet>
              <SalaryPeriod></SalaryPeriod>
            </CardBody>
          </Card>
        )}
        {secondPath === "overview" && (
          <Card style={{ marginTop: 0 }}>
            <CardBody
              style={{
                height: "fit-content",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <SalaryOverview></SalaryOverview>
            </CardBody>
          </Card>
        )}
      </DashboardLayout>
    );
  } else if (subPath === "export") {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        {secondPath === "reports" && <ExportReport></ExportReport>}
      </DashboardLayout>
    );
  } else if (subPath === "assignments") {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        {secondPath === "departments" && <TasksProjects></TasksProjects>}
        {secondPath === "users" && <TasksProjectsUsers></TasksProjectsUsers>}
      </DashboardLayout>
    );
  } else if (secondPath === undefined) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        {subPath === "announcements" && <Announcements></Announcements>}
      </DashboardLayout>
    );
  } else {
    return <NoMatch></NoMatch>;
  }
}
