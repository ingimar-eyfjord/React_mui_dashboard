import React, { useState, useContext,  useCallback } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Person,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";
import { Stack } from "@mui/material";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Paper from "@mui/material/Paper";
import { GlobalState } from "context/store";
import { makeStyles } from "@material-ui/styles";
import styles from "App/components/classes";
import moment from "moment";
import TokenService from "services/api_services/token.service";
//? Todo
//? * Hook up to mongo database,
//? * On close message add patch operation to document, inside read array add ID's of the people who have read it
//? * Don't show read messages
const useStyles = makeStyles(styles);

export function Notification(props) {
  const classes = useStyles();
  const [show, handleShow] = useState(true);
  const group =
    props.Group === "Public"
      ? "Dialogue Time"
      : props.Group.team + " > " + props.Group.channel;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [Store] = useContext(GlobalState);
  const mongoId = props.mongoId;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowItem = useCallback(
    (show) => {

      handleShow(!show);
      if (!show) {
        props.setAmountShown((state) => --state);
      }
    },
    [handleShow, props]
  );

  function MarkAsRead() {
    const markAsRead = {
      mongoId: mongoId,
      Intent: "Mark as read",
      UserID: TokenService.getUserID(),
      Bearer: TokenService.getLocalBearerToken(),
      APIToken: TokenService.getLocalAccessToken(),
      Group: {
        channel: props.Group.channel,
        channelID: props.Group.channelID,
        team: props.Group.team,
        teamID: props.Group.teamID,
      },
    };
    Store.websocket.send(JSON.stringify(markAsRead));
    props.removeMessage(mongoId);
  }
 
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function NewlineText(props) {
    const newText = props
      .split("\n")
      .map((str) => <p className={classes.cardCategory}>{str}</p>);

    return newText;
  }

  const body = NewlineText(props.message.replace("..", "\n"));

  return (
    <>
      {show && (
        <Paper
          className="MessagePopUp"
          style={{ maxWidth: "50vw", width: "fit-content" }}
          elevation={6}
        >
          <Card
            sx={{ minWidth: 275, maxWidth: "100%", width: "fit-content" }}
            key={props.propskey}
          >
            <CardHeader
              avatar={
                <Stack spacing={2}>
                  <Person
                    personCardInteraction={PersonCardInteraction.hover}
                    showPresence={true}
                    line2Property="mail"
                    view={PersonViewType.twolines}
                    personQuery={props.sender}
                  ></Person>
                  <h4 className={classes.cardCategory}>
                    Announcing for members of <strong>{group}</strong>
                  </h4>
                </Stack>
              }
              action={
                <>
                  <IconButton aria-label="settings">
                    <InfoOutlinedIcon
                      aria-describedby={id}
                      variant="contained"
                      onClick={handleClick}
                    ></InfoOutlinedIcon>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Typography sx={{ p: 2 }}>
                        This message is only available in Dialogue Time.
                      </Typography>
                      <Typography sx={{ p: 2 }}>
                        You are seeing this message because you are a member of{" "}
                        <strong>{group}</strong>.
                      </Typography>
                    </Popover>
                  </IconButton>
                  <IconButton aria-label="settings">
                    <CloseIcon
                      onClick={(e) => {
                        handleShowItem(!show);
                      }}
                    ></CloseIcon>
                  </IconButton>
                </>
              }
            />
            <CardContent>
              <h5 className={classes.cardTitle}>{props.title}</h5>

              {body}
            </CardContent>
            <CardActions>
              <Button
                onClick={(e) => {
                  MarkAsRead();
                }}
                size="small"
              >
                Mark as read
              </Button>
             <p style={{marginLeft: "auto"}} className={classes.cardCategory}>
               {moment(props.date).format("DD-MM-YYYY - HH:m")}
               </p> 
            </CardActions>
          </Card>
        </Paper>
      )}
    </>
  );
}
