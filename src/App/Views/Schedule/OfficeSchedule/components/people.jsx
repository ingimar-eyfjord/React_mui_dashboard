import {
  Person,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";
import { Stack } from "@mui/material";
import moment from "moment";
const useStyles = makeStyles(styles);

export default function People(props) {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.person}>
      <Person
        personQuery={props.info.Email}
        showPresence={true}
        view={PersonViewType.twolines}
        personCardInteraction={PersonCardInteraction.hover}
      />
      </div>
      <Stack
        style={{ marginTop: "5px", marginLeft: "10px" }}
        direction="row"
        spacing={2}
      >
        <p className={classes.cardCategory}>
          {/* {ConverterClass.currentMomentTimezone(
            props.info.Date_start_time
          ).format("HH:MM")} */}
          {moment.utc(props.info.Date_start_time).format("HH:mm")} -{" "}
          {/* {ConverterClass.currentMomentTimezone(
            props.info.Date_end_time
          ).format("HH:MM")} */}
          {moment.utc(props.info.Date_end_time).format("HH:mm")}
        </p>
        <p>|</p>
        <p className={classes.cardCategory}>{props.info.Location}</p>
      </Stack>
    </div>
  );
}
