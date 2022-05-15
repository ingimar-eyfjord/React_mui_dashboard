import ImportSchedule from "./import_schedule";
import Card from "App/components/Card/Card.js";
import CardBody from "App/components/Card/CardBody.js";
export default function Import(props) {
  return (
    <Card>
      <CardBody style={{ height: "fit-content" }}>
        <ImportSchedule></ImportSchedule>
      </CardBody>
    </Card>
  );
}
