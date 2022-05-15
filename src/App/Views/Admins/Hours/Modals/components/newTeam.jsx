import { useState } from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import { TeamsDropDownOptions } from "App/components/CustomComponents";

const NewTeam = (props) => {
  const [Team, SetTeam] = useState();

  function PropsFunc(data, placeholder) {
    SetTeam(data.target.value);
    props.change({Account: data.target.value})
  }
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={3}
    >
      <FormControl>
        <TeamsDropDownOptions passedSelected={props.selection.TeamID} PropsFunc={PropsFunc} name={"Team"} />
        <input type="hidden" required name={"Team"} value={Team} />
      </FormControl>
    </Stack>
  );
};

export default NewTeam;
