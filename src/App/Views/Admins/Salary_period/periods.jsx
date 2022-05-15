import { useContext, useState } from "react";
import moment from "moment";
import {
  CalendarComponent,
  PrimaryBtn,
  DefaultBtn,
} from "App/components/MUIComponents";
import salaryService from "services/api_services/salary.service";
import ConverterClass from "App/Functions/converterClass";
import { GlobalState } from "context/store";

export default function Period(props) {
  // eslint-disable-next-line 
  const [Store, setStore] = useContext(GlobalState);
  const [UIExpand, SetUIExpand] = useState(false);

  const [state, setState] = useState({
    Month: undefined,
    Start: undefined,
    End: undefined,
  });

  function calendarChooseDate(date) {
    setState((state) => ({
      ...state,
      Month: date,
    }));
  }
  function expandUI() {
    if (UIExpand === false) {
      SetUIExpand(true);
    } else {
      SetUIExpand(false);
    }
  }
  const UIExpandStyle = {
    display: UIExpand ? "block" : "none",
  };
  async function EditSalaryPeriod(e) {
    e.preventDefault();
    e.persist(e);
    if (state.Month === undefined) {
      alert("Please reselect month first");
      return;
    }
    if (state.Start === undefined) {
      alert("Please reselect start of salary period");
      return;
    }
    if (state.End === undefined) {
      alert("Please reselect end of salary period");
      return;
    }
    const id = props.Data.id;
    const elements = ConverterClass.formToJSON(e.target.elements);
    elements.Date = moment(elements.Date).format("MMMM-YYYY");
    elements.Start = moment(elements.Start).format("YYYY-MM-DD");
    elements.End = moment(elements.End).format("YYYY-MM-DD");
    const Date_start = elements.Start;
    const Date_end = elements.End;
    const Month_name = elements.Date;
    const param = {
      Date_start: Date_start,
      Date_end: Date_end,
      Month_name: Month_name,
    };
    const update = await salaryService.update_period(
      id,
      param
    );
    if (update.status === 200) {
      setStore({
        Notification: {
          color: "success",
          icon: "check",
          title: "Success",
          content: "You have successfully edited the salary",
          dateTime: moment(),
        },
      });
      return;
    } else {
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
    }
  }
  async function deleteInput() {
    const id = props.Data.id;
    const RemInput = await salaryService.delete_period(
      id
    );
    if (RemInput.status === 200) {
      props.removeUIBecDelete(id);
    } else {
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
    }
  }
  return (
    <div className="customCard flexColumn alignCenter">
      <p>{moment(props.Data.Month_name).format("MMMM-YYYY")}</p>
      <h5 style={{ margin: "0 5px" }}>
        {moment(props.Data.Date_start).format("DD-MM-YYYY")} -{" "}
        {moment(props.Data.Date_end).format("DD-MM-YYYY")}
      </h5>
      <div style={{ marginTop: "1rem" }}></div>
      <form
        style={UIExpandStyle}
        onSubmit={EditSalaryPeriod}
        className="flexColumn alignCenter"
      >
        <h3>Edit salary period</h3>
        <div
          style={{ margin: "1rem 0" }}
          className="calendar flexColumn alignCenter"
        >
          <CalendarComponent
            calendarChooseDate={calendarChooseDate}
            DayPicker={false}
            weekNumber={false}
            monthPicker={true}
          />
          {/* <DatePickerMinMax
            changeFunction={startOrEndChange}
            nameForLabel={"Start"}
            label={"Select start date"}
            required={true}
            minDate={new Date("2000-01-01")}
            maxDate={new Date("2999-01-01")}
            value={Date.now()}
          ></DatePickerMinMax>{" "}
          <DatePickerMinMax
            changeFunction={startOrEndChange}
            nameForLabel={"End"}
            label={"Select end date"}
            required={true}
            minDate={new Date("2000-01-01")}
            maxDate={new Date("2999-01-01")}
            value={Date.now()}
          ></DatePickerMinMax> */}
          <div>
            <p className="manualLabel">Selection:</p>
            <p className="manualLabel">
              Month: {moment(state.Month).format("MMMM-YYYY")}
            </p>
            <p className="manualLabel">
              Start: {moment(state.Start).format("DD-MM-YY")}
            </p>
            <p style={{ marginBottom: "1rem" }} className="manualLabel">
              End: {moment(state.End).format("DD-MM-YY")}
            </p>
          </div>
          <DefaultBtn BtnType={"submit"} text={"Confirm edit"} />
          <button
            style={{ marginTop: "1rem" }}
            onClick={(e) => {
              deleteInput(e);
            }}
            className="delete-btn"
            type="button"
          >
            Delete this period
          </button>
        </div>
      </form>
      <PrimaryBtn
        onClickFunction={expandUI}
        BtnType={"button"}
        text={UIExpand ? "Cancel" : "Edit"}
      />
    </div>
  );
}
