import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";
import CalendarWeek from "./CalendarWeek";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Button from "@mui/material/Button";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const useStyles = makeStyles(styles);
const CommandBtn = (props) => {
  const classes = useStyles();

  return (
    <AppBar
      position='static'
      style={{
        backgroundColor: "transparent",
        boxShadow: "unset"
      }}
    >
      <Container style={{backgroundColor: "transparent"}} maxWidth='xl'>
        <Toolbar disableGutters>
          <CalendarWeek
            selectedMonday={props.SelectedDays.Monday}
            CalendarPicked={props.CalendarPicked}
          ></CalendarWeek>
          <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
            <Button
              style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
              aria-label='Prev'
              onClick={(e) => {
                props.updateTimeLine("Today");
              }}
            >
              <CalendarTodayIcon style={{ color: "white" }} />
              <p
                style={{
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                }}
                className={classes.cardCategoryWhite}
              >
                This week
              </p>
            </Button>

            <Button
              style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
              aria-label='Prev'
              onClick={(e) => {
                props.updateWeekArray(true);
              }}
            >
              <DateRangeIcon style={{ color: "white" }} />
              <p
                style={{
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                }}
                className={classes.cardCategoryWhite}
              >
                Full week
              </p>
            </Button>

            <Button
              style={{
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
              }}
              aria-label='Prev'
              onClick={(e) => {
                props.updateWeekArray(false);
              }}
            >
              <DateRangeIcon style={{ color: "white" }} />
              <p
                style={{
                  paddingLeft: "0.5rem",
                  paddingRight: "0.5rem",
                }}
                className={classes.cardCategoryWhite}
              >
                Work week
              </p>
            </Button>
          </Box>
          <Button
            style={{ paddingLeft: "0.5rem", paddingRight: "3rem" }}
            aria-label='Prev'
            onClick={(e) => {
              props.updateTimeLine("Prev");
            }}
          >
            <NavigateBeforeIcon style={{ color: "white" }} />
            <p
              className={classes.cardCategoryWhite}
              style={{
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
              }}
            >
              Previous Week
            </p>
          </Button>

          <Button
            style={{ paddingLeft: "0.5rem"}}
            aria-label='Next'
            onClick={(e) => {
              props.updateTimeLine("Next");
            }}
          >
            <p
              className={classes.cardCategoryWhite}
              style={{
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
              }}
            >
              Next Week
            </p>
            <NavigateNextIcon style={{ color: "white" }} />
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default CommandBtn;
