import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import Button from "@mui/material/Button";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@material-ui/core/Checkbox";
import MDSnackbar from "App/components/MDSnackbar";
import moment from "moment";

export function TextFieldAuto({ InputName, clear }) {
  const [value, setValue] = React.useState("");
  useEffect(() => {
    if (clear === true) {
      setValue("");
    } else {
      return;
    }
  }, [clear]);
  //end useEffect
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <input type={"hidden"} name={InputName} value={value}></input>
      <TextField
        style={{ width: "100%", marginTop: "2rem" }}
        id='outlined-multiline-flexible'
        label='Optionally insert a comment'
        multiline
        rows={5}
        maxRows={10}
        value={value}
        onChange={handleChange}
      />
    </>
  );
}

export function Number({
  label,
  required,
  maximum,
  InputName,
  step,
  clear,
  PassedStyle,
}) {
  //Here , useEffect clears input values when "clear props" changes
  const [inputValue, setInputValue] = useState("0");
  useEffect(() => {
    if (clear === true) {
      setInputValue(0);
    } else {
      return;
    }
  }, [clear]);
  //end useEffect
  const style = { minWidth: "10rem" };

  return (
    <TextField
      sx={PassedStyle ? PassedStyle : style}
      name={InputName}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      label={label}
      InputProps={{ inputProps: { min: "0", max: maximum, step: step } }}
      type='number'
      value={inputValue}
      required={required}
      min={0}
      max={maximum}
    />
  );
}

export function PrimaryBtn({ text, onClickFunction, BtnType, disabled }) {
  return (
    <Button
      onClick={onClickFunction}
      style={{ width: "100%" }}
      type={BtnType ? BtnType : "Button"}
      disabled={disabled}
      variant='outlined'
    >
      {text}
    </Button>
  );
}

export function DropDown({
  label,
  required,
  placeHolder,
  options,
  PropsFunc,
  clear,
}) {
  useEffect(() => {
    if (clear === true) {
    }
  }, [clear]);

  function Selected(event) {
    PropsFunc(event.target.value, placeHolder);
  }

  return (
    <FormControl fullWidth>
      <InputLabel id='demo-simple-select-label'>{label}</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        label={label}
        onChange={Selected}
      >
        {label === "Supplement" ? (
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
        ) : (
          <> </>
        )}
        {options.map((e, index) => {
          return (
            <MenuItem key={`${index}`} value={e.text}>
              {e.text}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export function DefaultBtn({ text, onClickFunction, BtnType, disabled }) {
  return (
    <Button
      variant='contained'
      disabled={disabled}
      type={BtnType ? BtnType : "Button"}
      onClick={onClickFunction}
      disableElevation
      style={{ width: "100%" }}
    >
      {text}
    </Button>
  );
}
export function WarningNotification(props) {
  return (
    <Alert severity='warning'>
      <AlertTitle>Warning</AlertTitle>
      {props.warningMessage}
    </Alert>
  );
}

export function Notification(props) {
  const [errorSB, setErrorSB] = useState(true);
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color={props.message.color}
      icon={props.message.icon}
      title={props.message.title}
      content={props.message.content}
      dateTime={moment(props.message.time).fromNow()}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return <>{renderErrorSB}</>;
}

export function RangeDatePicker({ changeFunction }) {
  const [value, setValue] = React.useState([null, null]);
  useEffect(() => {
    changeFunction(value);
  }, [value, changeFunction]);

  return (
    <Paper>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDateRangePicker
          displayStaticWrapperAs='desktop'
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
    </Paper>
  );
}

export function CalendarComponent(props) {
  const [selectedDate, setSelectedDate] = useState(props.selectedDatePassDown);
  function onSelectDate(date) {
    props.calendarChooseDate(date);
    setSelectedDate(date);
  }
  let min = false;
  if (props.minDate !== undefined) {
    min = props.minDate;
  }
  return (
    <div className='calendarComponentContainer' style={{ width: "100%" }}>
      <StaticDatePicker
        orientation='portrait'
        displayStaticWrapperAs='desktop'
        openTo='day'
        value={selectedDate}
        minDate={min}
        shouldDisableDate={false}
        onChange={(newValue) => {
          onSelectDate(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
}

export function CheckBox() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Checkbox
        onChange={handleChange}
        checked={checked}
        color='primary'
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <input type='hidden' name='Break' value={checked} />
    </>
  );
}
