import { useContext, useState } from "react";
import { GlobalState } from "context/store";
import { PrimaryBtn } from "App/components/MUIComponents";
import moment from "moment";
import salaryService from "services/api_services/salary.service";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import CardHeader from "App/components/Card/CardHeader.js";

export default function SalaryPeriodSet() {
// eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  const [value, setValue] = useState([null, null]);
  const [monthSelection, setMonthSelection] = useState(moment());
  async function ConfirmSalaryPeriod(e) {
    e.preventDefault();
    e.persist(e);
    if (monthSelection === undefined) {
      alert("Please reselect month first");
      return;
    }
    if (value[0] === undefined) {
      alert("Please reselect start of salary period");
      return;
    }
    if (value[1] === undefined) {
      alert("Please reselect end of salary period");
      return;
    }
    const month = moment(monthSelection).add(1, "month").format("MMMM-YYYY");
    const start = moment(value[0]).startOf("day").format("YYYY-MM-DD HH:m");
    const end = moment(value[1]).endOf("day").format("YYYY-MM-DD HH:m");

    const param = {
      Date_start: start,
      Date_end: end,
      Month_name: month,
    };
    try {
      await salaryService.create_period(param);
    } catch (error) {
     setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Something went wrong, please contact IT for support",
          dateTime: moment(),
        },
      });
      return;
    }setStore({
      Notification: {
        color: "success",
        icon: "check",
        title: "Success",
        content: "You have successfully logged the period",
        dateTime: moment(),
      },
    });
  }
  return (
    <form
      style={{ width: "45%" }}
      onSubmit={ConfirmSalaryPeriod}
      className="flexColumn alignCenter"
    >

      <CardHeader style={{ marginBottom: "1rem", width: "100%" }}>
        <h3>Set Salary period</h3>
      </CardHeader>

      <div className="calendar flexColumn alignCenter">
        <StaticDateRangePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          clearable={true}
          onMonthChange={(newValue) => {
            setMonthSelection(newValue);
          }}
        />
        <div>
          <h3>
            Now selecting days for salary period{" "}
            <strong>
              {moment(monthSelection).add(1, "month").format("MMMM-YYYY")}
            </strong>
          </h3>
          <h4 className="manualLabel">
            Start: {moment(value[0]).format("DD-MM-YY")}
          </h4>
          <h4 style={{ marginBottom: "1rem" }} className="manualLabel">
            End: {moment(value[1]).format("DD-MM-YY")}
          </h4>
        </div>
        <PrimaryBtn BtnType={"submit"} text={"Confirm Salary period"} />
      </div>
    </form>
  );
}
