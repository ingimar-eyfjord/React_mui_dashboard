import { useContext, useState, useCallback } from "react";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { TextField } from "@mui/material";
import { GlobalState } from "context/store";
import DatePicker from "@mui/lab/DatePicker";
import MDTypography from "App/components/MDTypography";
import MDAlert from "App/components/MDAlert";

const alertContent = (name, text) => (
  <MDTypography variant='body2' color='white'>
    {name}
    <MDTypography
      component='p'
      variant='body2'
      fontWeight='medium'
      color='white'
    >
      {text}
    </MDTypography>
  </MDTypography>
);
const EditMetadata = (props) => {
  const [Store] = useContext(GlobalState);

  const [DropDownOptions] = useState({
    Team: Store.Options.Departments,
    Project: Store.Options.Project,
    Task: Store.Options.Task,
    Type: Store.Options.Type,
    Status: ["Unpaid", "Pending", "Paid"],
  });
  const [Contacts, setContacts] = useState();
  const [Meetings, setMeetings] = useState();
  const [inputValue, setInputValue] = useState();

  const handleOnchange = useCallback(
    (value) => {
      setInputValue(value);
      props.change({ Hours: parseFloat(value) });
    },
    [props]
  );
  const handleOnchangeMeetings = useCallback(
    (value) => {
      setMeetings(value);
      props.change({ Meetings: parseInt(value) });
    },
    [props]
  );
  const handleOnchangeContacts = useCallback(
    (value) => {
      setContacts(value);
      props.change({ Contacts: parseInt(value) });
    },
    [props]
  );

  return (
    <Stack direction='row' justifyContent='center' spacing={10}>
      <Stack direction='column' spacing={2}>
       

          <Stack direction='row' justifyContent='center' spacing={10}>

            <Stack direction='row' justifyContent='center' spacing={2}>
           
              <Stack direction='column' spacing={3}>
              <DatePicker
          label='Change date'
          value={props.selection.Date}
          onChange={(e) => {
            props.change({ Date: e });
          }}
          renderInput={(params) => <TextField {...params} />}
        />
                <FormControl>
                  <InputLabel id='demo-simple-select-labelf'>
                    Select Project
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-labels'
                    id='demo-simple-select'
                    label='Project'
                    name={"Project"}
                    defaultValue={props.selection.Project}
                    onChange={(e) => {
                      props.change({ Project: e.target.value });
                    }}
                  >
                    {DropDownOptions.Project.map((e) => {
                      return <MenuItem value={e.Project}>{e.Project}</MenuItem>;
                    })}
                  </Select>
                </FormControl>

                <FormControl>
                  <InputLabel id='demo-simple-select-labelf'>
                    Select Task
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-labels'
                    id='demo-simple-select'
                    label='Task'
                    name={"Task"}
                    defaultValue={props.selection.Task}
                    onChange={(e) => {
                      props.change({ Task: e.target.value });
                    }}
                  >
                    {DropDownOptions.Task.map((e) => {
                      return <MenuItem value={e.Task}>{e.Task}</MenuItem>;
                    })}
                  </Select>
                </FormControl>

                <FormControl>
                  <InputLabel id='demo-simple-select-labelf'>
                    Select Supplement/Type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-labels'
                    id='demo-simple-select'
                    label='Type'
                    name={"Type"}
                    defaultValue={props.selection.Type}
                    onChange={(e) => {
                      props.change({ Type: e.target.value });
                    }}
                  >
                    {DropDownOptions.Type.map((e) => {
                      return <MenuItem value={e.Type}>{e.Type}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction='column' spacing={3}>
                <TextField
                  style={{ minWidth: "10rem" }}
                  name={"Contacts"}
                  onChange={(e) => {
                    handleOnchangeContacts(e.target.value);
                  }}
                  label={"Contacts"}
                  InputProps={{ inputProps: { min: 0, max: 250, step: 1 } }}
                  type='number'
                  value={Contacts}
                  required={false}
                  step={1}
                  maximum={250}
                  minimum={0}
                  defaultValue={props.selection.Contacts}
                />

                <TextField
                  style={{ minWidth: "10rem" }}
                  name={"Meetings"}
                  onChange={(e) => {
                    handleOnchangeMeetings(e.target.value);
                  }}
                  label={"Meetings"}
                  InputProps={{ inputProps: { min: 0, max: 250, step: 1 } }}
                  type='number'
                  value={Meetings}
                  required={false}
                  step={1}
                  maximum={250}
                  minimum={0}
                  defaultValue={props.selection.Meetings}
                />
              </Stack>
            </Stack>
            <Stack direction='column' mt={"auto"} spacing={3}>
              <TextField
                style={{ minWidth: "10rem" }}
                name={"Hours"}
                onChange={(e) => {
                  handleOnchange(e.target.value);
                }}
                label={"Hours"}
                InputProps={{ inputProps: { min: -16, max: 16, step: 0.25 } }}
                type='number'
                value={inputValue}
                required={false}
                min={-16}
                max={16}
                defaultValue={props.selection.Hours}
              />
            </Stack>
          </Stack>

        <MDAlert color='info'>
          {alertContent(
            "Important info about editing hours",
            "To edit hours, either widhdraw the difference from original hours logged, or add extra hours if needed, the number put in here will create a new transaction"
          )}
        </MDAlert>
      </Stack>
    </Stack>
  );
};

export default EditMetadata;
