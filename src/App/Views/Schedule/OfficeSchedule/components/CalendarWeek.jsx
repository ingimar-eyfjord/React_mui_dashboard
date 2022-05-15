import { useState } from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import PickersDay from "@mui/lab/PickersDay";
import endOfWeek from "date-fns/endOfWeek";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";
import startOfWeek from "date-fns/startOfWeek";
import { styled } from "@mui/material/styles";
import moment from "moment";
export default function BasicDatePicker({ CalendarPicked }) {
  const [value, setValue] = useState(null);

  const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
      prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
  })(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
    ...(dayIsBetween && {
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
    ...(isFirstDay && {
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
    }),
    ...(isLastDay && {
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    }),
  }));

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!value) {
      return <PickersDay {...pickersDayProps} />;
    }

    const start = startOfWeek(value);
    const end = endOfWeek(value);

    const dayIsBetween = isWithinInterval(date, { start, end });
    const isFirstDay = isSameDay(date, start);
    const isLastDay = isSameDay(date, end);
    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };
  function picked(newValue) {
    if (newValue !== "Invalid Date") {
      const startOfWeek = moment(newValue).startOf("week").format();
      const endOfWeek = moment(newValue).endOf("week").format();
      var days = [];
      let day = startOfWeek;
      while (day <= endOfWeek) {
        days.push(day);
        day = moment(day).add(1, "d");
      }
      CalendarPicked(days);
      setValue(newValue);
    }
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        style={{ overflow: "hidden", color: "white" }}
        label="Choose week"
        value={value}
        onChange={(newValue) => {
          picked(newValue);
        }}
        renderInput={(params) => (
          <TextField
            style={{
              borderRadius: "0.2rem",
              backgroundColor: "white",
              color: "white",
            }}
            {...params}
          />
        )}
        // renderInput={(params) => <CalendarTodayIcon style={{borderRadius:"0.2rem" ,backgroundColor: "white", color:"white"}} {...params} />}
        inputFormat="'Week of' MMM d"
        renderDay={renderWeekPickerDay}
      />
    </LocalizationProvider>
  );
}
