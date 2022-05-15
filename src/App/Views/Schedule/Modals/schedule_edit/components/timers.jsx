import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

function Timers({ setTimes, times }) {
  return (
    <Stack direction="column" mt={3} spacing={3} position="static">
      <TextField
        name="start"
        id="Time_Start"
        label="Time start"
        value={times.FormTimeStart}
        onChange={(e) => {
          setTimes((state) => ({
            ...state,
            FormTimeStart: e.target.value,
          }));
        }}
        type="time"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
        sx={{ width: 150 }}
      />
      <TextField
        name="end"
        onChange={(e) => {
          setTimes((state) => ({
            ...state,
            FormTimeEnd: e.target.value,
          }));
        }}
        id="Time_End"
        label="Time end"
        type="time"
        value={times.FormTimeEnd}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
        sx={{ width: 150 }}
      />
    </Stack>
  );
}

export default Timers;
