import { useContext, useState, useCallback } from "react";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
import { GlobalState } from "context/store";
import DateTimePicker from "@mui/lab/DateTimePicker";
import moment from "moment";
import Checkbox from "@material-ui/core/Checkbox";

const EditMetadata = (props) => {
  const [Store] = useContext(GlobalState);

  const [DropDownOptions] = useState({
    Team: Store.Options.Departments,
    Project: Store.Options.Project,
    Task: Store.Options.Task,
    Type: Store.Options.Type,
    Status: ["Unpaid", "Pending", "Paid"],
    Locations: Store.Options.Locations,
  });

  const handleDatepickerChanges = useCallback(
    (value) => {
      props.change(value);
      var hours = moment
        .duration(
          moment(props.selection.Date_end_time, "YYYY/MM/DD HH:mm").diff(
            moment(props.selection.Date_start_time, "YYYY/MM/DD HH:mm")
          )
        )
        .asHours();
      props.change({Hours: hours.toFixed(2)});
    },
    [props]
  );

  return (
    <>
      <Stack direction='column' justifyContent='center' spacing={2}>
        <Stack direction='row' justifyContent='center' spacing={2}>
          <Stack direction='column' spacing={3}>
            <DateTimePicker
              label='Start time'
              value={props.selection.Date_start_time}
              onChange={(e) => {
                handleDatepickerChanges({ Date_start_time: e });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DateTimePicker
              label='End time'
              value={props.selection.Date_end_time}
              onChange={(e) => {
                handleDatepickerChanges({ Date_end_time: e });
              }}
              renderInput={(params) => <TextField {...params} />}
            />

            <FormControl>
              <InputLabel id='demo-simple-select-labelf'>
                Change Location
              </InputLabel>
              <Select
                labelId='demo-simple-select-labels'
                id='demo-simple-select'
                label='Location'
                name={"Location"}
                defaultValue={props.selection.Location}
                onChange={(e) => {
                  props.change({ Location: e.target.value });
                }}
              >
                {DropDownOptions.Locations.map((e) => {
                  return <MenuItem value={e.Location}>{e.Location}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction='column' spacing={3}>
          <div
            className="flexRow"
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Checkbox defaultChecked={props.selection.Break}
            ></Checkbox>
            <p className="ManualLabel">Break?</p>
          </div>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default EditMetadata;
