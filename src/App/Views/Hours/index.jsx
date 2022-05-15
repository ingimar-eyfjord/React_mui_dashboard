import LogHoursInterface from "./logHoursInterface";
import SeeLoggedHours from "./seeHours";
import Bank from "./Bank";
import { useParams } from "react-router-dom";
import DashboardLayout from "App/components/DashboardLayout";
import DashboardNavbar from "App/components/DashboardNavbar";
export default function Hours() {
  let { subPath } = useParams();
  return (
    <>
      {subPath === "log" && (
        <DashboardLayout>
          <DashboardNavbar />
          <LogHoursInterface />
        </DashboardLayout>
      )}
      {subPath === undefined && (
        <DashboardLayout>
          <DashboardNavbar />
          <SeeLoggedHours />
        </DashboardLayout>
      )}
      {subPath === "salary" && (
        <DashboardLayout>
          <DashboardNavbar />
          <Bank />
        </DashboardLayout>
      )}
    </>
  );
}
