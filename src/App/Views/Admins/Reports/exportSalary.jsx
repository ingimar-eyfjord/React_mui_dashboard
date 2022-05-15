import { useEffect, useState, useContext, useRef, useCallback } from "react";
import { GlobalState } from "context/store";
import moment from "moment";
import { RangeDatePicker } from "App/components/MUIComponents";
import CardBody from "App/components/Card/CardBody.js";
import { DefaultBtn } from "App/components/MUIComponents";
import { PrimaryBtn } from "App/components/MUIComponents";
import CardFooter from "App/components/Card/CardFooter.js";
import SalaryService from "services/api_services/salary.service";
import ExportCSVMultiple from "App/Functions/exportXLSXMultiple";
import { Stack } from "@mui/material";

export default function ExportSalary() {
  const render = useRef(0);
  useEffect(() => {
    render.current = render.current + 1;
  }, []);
  // eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  const [dates, setDates] = useState({
    start: null,
    end: null,
  });

  async function ExportHours(e, pass) {
    let startDate;
    let endDate;
    if (e !== undefined) {
      e.preventDefault();
      e.persist(e);
      startDate = moment(dates.start).startOf("day").format();
      endDate = moment(dates.end).endOf("day").format();
    } else {
      startDate = moment(pass.start).startOf("day").format();
      endDate = moment(pass.end).endOf("day").format();
    }
    const param = {
      id: pass.id,
    };
    const HoursReport = await SalaryService.export_salary(param);
    const nameAndSubject = `Salary-Report-${moment(startDate).format(
      "DD-MM-YYYY"
    )}-${moment(endDate).format("DD-MM-YYYY")}`;
    for (const e of HoursReport.data.Hour) {
      delete e.Email;
      delete e["Account id credit"];
      delete e["Account id debit"];
      delete e["Hours credit"];
      delete e["Hours debit"];
      e.Hours = e.UserHours;
      delete e.UserHours;
    }

    const names = Object.keys(HoursReport.data);
    const sheetsData = Object.values(HoursReport.data);

    if (HoursReport.data.length === 0) {
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
      ExportCSVMultiple(nameAndSubject, names, "MakeToUsername", sheetsData);
    }
  }
  async function ExportPeriod() {
    const period = await SalaryService.get_current_period();
    const data = period.data[0];
    ExportHours(undefined, data);
  }
  const changeFunction = useCallback((data) => {
    setDates({
      start: data[0],
      end: data[1],
    });
  }, []);
  return (
    <>
      <CardBody>
        <Stack
          direction='row'
          spacing={10}
          justifyContent='center'
          alignItems='center'
        >
          <RangeDatePicker changeFunction={changeFunction}></RangeDatePicker>
        </Stack>
      </CardBody>
      <CardFooter>
        <div style={{ margin: "1rem" }}></div>
        <DefaultBtn
          onClickFunction={ExportHours}
          BtnType={"submit"}
          text={"Export salary report"}
        ></DefaultBtn>
        <div style={{ margin: "1rem" }}></div>

        <PrimaryBtn
          onClickFunction={ExportPeriod}
          text={"Export current period"}
        ></PrimaryBtn>
        <div style={{ margin: "1rem" }}></div>
      </CardFooter>
    </>
  );
}
