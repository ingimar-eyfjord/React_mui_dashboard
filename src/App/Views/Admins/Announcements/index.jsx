import { useState, useContext } from "react";
import Card from "App/components/Card/Card.js";
import CardBody from "App/components/Card/CardBody.js";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
// import TextFormatting from "App/components/TextFormatting";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";
import { DefaultBtn } from "App/components/MUIComponents";
import { GlobalState } from "context/store";
import { TeamsChannelPicker } from "@microsoft/mgt-react";
import { Button } from "@mui/material";

import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import TokenService from "services/api_services/token.service";

import AlertTitle from '@mui/material/AlertTitle';
const steps = [
  "Select either public announcement or to members of a specific Teams channel",
  "Write the message",
];

//? Todo
//? * Create teams, groups inside graph, or use Teams channels??,
//? * Add on server side routing for different groups.
//? * Don't show read messages

export default function Announcements(props) {
  const [Store] = useContext(GlobalState);
  const [Steps, setSteps] = useState(0);
  const [value, setValue] = useState();
  const [group, setGroup] = useState();
  const [title, setTitle] = useState();
  const [groupSelection, setGroupSelection] = useState(false);
  // eslint-disable-next-line
  const [radio, setRadio] = useState();

  const handleChange = (event) => {
    const value = event.target.value;
    setRadio(value);

    if (value === "Group") {
      setGroupSelection(!groupSelection);
    }
    if (value === "Public") {
      setSteps(1);
      setGroup("Public");
      setGroupSelection(false);
    }
  };

  function submit() {
    Store.websocket.send(
      JSON.stringify({
        Intent: "Public announcement",
        Group: group,
        Message: value,
        Title: title,
        Sender: Store.UserDetails.UserEmail,
        SenderId: Store.UserDetails.UserUUID,
        UserID: TokenService.getUserID(),
        Bearer: TokenService.getLocalBearerToken(),
        APIToken: TokenService.getLocalAccessToken(),
      })
    );
    setSteps(0);
    setGroup();
    setGroupSelection(false);
  }
  function selectedGroup(e) {
    if (e.detail.length === 0) {
      setGroup();
      return;
    }
    const teamID = e.detail[0].team.id;
    const team = e.detail[0].team.displayName;
    const channelID = e.detail[0].channel.id;
    const channel = e.detail[0].channel.displayName;
    const selectedGroup = {
      teamID: teamID,
      team: team,
      channelID: channelID,
      channel: channel,
    };
    setGroup(selectedGroup);
  }

  return (
    <Card  style={{ marginTop: 0, paddingBottom: "3rem"  }}>
      <CardBody style={{ height: "fit-content" }}>
        <Alert severity='info'>
          Make announcements to all users of Dialogue Time <br />
          <br />
          <ul>
            <li>
              All logged in users will receive an instant notification once an
              announcement has been made.
            </li>
            <li>
              If a user logs on and has an unread announcement, the announcement
              will pop up.
            </li>
            <li>
              Users can see their unread announcement in the announcement
              sidebar on the right.
            </li>
            <li>
              You can limit who sees announcement by selecting groups and
              subsequently selecting a Teams channel.
            </li>
            <li>Notifications are not visible inside Teams.</li>
          </ul>
        </Alert>

        <Stack style={{ padding: "5rem 5rem 0 5rem" }}>
          {Steps === 0 && (
            <FormGroup>
              <Typography variant='h4' gutterBottom component='div'>
                Select type of announcement
              </Typography>
              <RadioGroup
                aria-label='gender'
                defaultValue='female'
                name='radio-buttons-group'
                onChange={handleChange}
              >
                <FormControlLabel
                  value='Public'
                  control={<Radio />}
                  label='Public'
                />
                <FormControlLabel
                  value='Group'
                  control={<Radio />}
                  label='Group'
                />
              </RadioGroup>
              <Alert style={{marginTop:"2rem"}} severity='success'>
        <AlertTitle>New feature, line break</AlertTitle>
            <p>{`This feature expects double periods example. "Make new line.. And then", becomes "Make new line. `}<br/>{` And then": line one period will be replaced with a new line break`}</p>
        </Alert>
              {groupSelection && (
                <div style={{ width: "25%", marginTop: "3rem" }}>
                  <TeamsChannelPicker
                    selectionChanged={(e) => {
                      selectedGroup(e);
                    }}
                  ></TeamsChannelPicker>
                  <Button
                    style={{ marginTop: "3rem" }}
                    type={"button"}
                    endIcon={<SkipNextIcon />}
                    onClick={(e) => {
                      if (group !== undefined) {
                        setSteps(Steps + 1);
                      } else {
                        alert("Please select a group first");
                        return;
                      }
                    }}
                  >
                    Confirm teams group selection
                  </Button>
                </div>
              )}
            </FormGroup>
          )}

          {Steps === 1 && (
            <>
              <Typography variant='h4' gutterBottom component='div'>
                Write the announcement
              </Typography>
              <TextField
                label='Title'
                variant='standard'
                onInput={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <TextField
                id='standard-multiline-static'
                label='Write your announcement'
                multiline
                variant='standard'
                onInput={(e) => {
                  setValue(e.target.value);
                }}
              />

              <Typography variant='subtitle2' gutterBottom component='div'>
                Formatting options are not available at this moment.
              </Typography>
              {/* <TextFormatting></TextFormatting> */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "2rem auto auto auto",
                }}
              >
                <h4 style={{ marginBottom: "2rem" }}>
                  Announcement is for all users of{" "}
                  <strong>
                    {group === "Public"
                      ? "Dialogue Time"
                      : group.team + " / " + group.channel}
                  </strong>
                </h4>
                <DefaultBtn
                  BtnType={"button"}
                  onClickFunction={submit}
                  text={"Post announcement"}
                ></DefaultBtn>
              </div>
            </>
          )}
        </Stack>
        <Box sx={{ width: "100%", marginTop: "5rem" }}>
          <Stepper activeStep={Steps} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {Steps > 0 && (
          <Button
            type={"button"}
            startIcon={<SkipPreviousIcon />}
            onClick={(e) => {
              setSteps(Steps - 1);
            }}
          >
            Previous
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
