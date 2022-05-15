import Card from "@mui/material/Card";
import CardBody from "App/components/Card/CardBody.js";
import UserLogs from "./logs";
import SimpleBar from "simplebar-react";
import Projects from "./Projects";
import { Stack } from "@mui/material";
export default function AdminPanel(props) {
  return (
    <Stack  direction={{ xs: 'column', sm: 'row' }}  spacing={2}>
      <Card style={{ height: "85vh", minWidth: "20vw" }}>
        <CardBody style={{ height: "100%" }}>
          <SimpleBar autoHide={false} style={{ height: "100%" }}>
            <UserLogs></UserLogs>
          </SimpleBar>
        </CardBody>
      </Card>
      <Projects></Projects>
    </Stack>
  );
}
