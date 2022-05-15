import { useCallback, useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import Button from "@mui/material/Button";
import CardHeader from "App/components/Card/CardHeader.js";
import moment from "moment";
import { GlobalState } from "context/store";
import { makeStyles } from "@material-ui/styles";
import styles from "App/components/classes";
import SalaryDataService from "services/api_services/salary.service";
import salaryService from "services/api_services/salary.service";

const useStyles = makeStyles(styles);

export default function SalaryAppBar() {
  const classes = useStyles();
  const [Store, setStore] = useContext(GlobalState);

  const updateTimeline = useCallback(
    async (passed) => {
      if (passed === "Next") {
        const day = moment(Store.SalaryOverviewOptions.period.Date_end)
          .add(1, "day")
          .endOf("day")
          .format();
        const next = await SalaryDataService.get_period_using_date(
          day
        );
        if (next.data.length <= 0) {
          setStore({
            Notification: {
              color: "error",
              icon: "warning",
              title: "Failed",
              content: `A salary period containing the day ${moment(day).format(
                "DD-MM-YYYY"
              )} does not exist, please contact an Administrator to fix this issue`,
              dateTime: moment(),
            },
          });
          return;
        }
        setStore({
          SalaryOverviewOptions: {
            type: Store.SalaryOverviewOptions.type,
            period: next.data[0],
          },
        });
      } else if (passed === "Prev") {
        const day = moment(Store.SalaryOverviewOptions.period.Date_start)
          .subtract(1, "day")
          .startOf("day")
          .format();
        const prev = await SalaryDataService.get_period_using_date(
          day
        );
        if (prev.data.length <= 0) {
          setStore({
            Notification: {
              color: "error",
              icon: "warning",
              title: "Failed",
              content: `A salary period containing the day ${moment(day).format(
                "DD-MM-YYYY"
              )} does not exist, please contact an Administrator to fix this issue`,
              dateTime: moment(),
            },
          });
          return;
        }
        setStore({
          SalaryOverviewOptions: {
            type: Store.SalaryOverviewOptions.type,
            period: prev.data[0],
          },
        });
      } else if (passed === "Current") {
        let thisMonth = await salaryService.get_current_period(
        );
        if (thisMonth.data.length <= 0) {
          setStore({
            Notification: {
              color: "error",
              icon: "warning",
              title: "Failed",
              content: `This salary period does not exist, please contact an Administrator to fix this issue`,
              dateTime: moment(),
            },
          });
          return;
        }
        setStore({
          SalaryOverviewOptions: {
            type: Store.SalaryOverviewOptions.type,
            period: thisMonth.data[0],
          },
        });
      }
    },
    [Store, setStore]
  );

  return (
    <CardHeader color='info'>
      <AppBar
        position='static'
        style={{
          backgroundColor: "info",
          boxShadow: "unset",
        }}
      >
        <Container style={{ backgroundColor: "transparent" }} maxWidth='xl'>
          <Toolbar disableGutters>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h6
                className={classes.cardCategoryWhite}
                style={{
                  marginRight: "auto",
                  textTransform: "capitalize",
                }}
              >
                Salary period
              </h6>
              <h6
                style={{
                  marginRight: "auto",
                  textTransform: "capitalize",
                  color: "white",
                }}
                className={classes.stats}
              >
                {moment(
                  Store?.SalaryOverviewOptions?.period?.Date_start
                ).format("DD/MM/YYYY")}{" "}
                -{" "}
                {moment(
                  Store?.SalaryOverviewOptions?.period?.Date_end
                ).format("DD/MM/YYYY")}
              </h6>
            </Box>
            <Button
              aria-label='Prev'
              onClick={(e) => {
                updateTimeline("Prev");
              }}
            >
              <NavigateBeforeIcon style={{ color: "white" }} />
              <p
                className={classes.cardCategoryWhite}
                style={{
                  textTransform: "capitalize",
                }}
              >
                Previous salary period
              </p>
            </Button>
            <Button
              style={{
                paddingLeft: "0.5rem",
                textTransform: "capitalize",
              }}
              aria-label='Prev'
              onClick={(e) => {
                updateTimeline("Current");
              }}
            >
              <p
                className={classes.cardCategoryWhite}
                style={{
                  textTransform: "capitalize",
                }}
              >
                Current salary period
              </p>
            </Button>
            <Button
              style={{ paddingLeft: "0.5rem" }}
              aria-label='Next'
              onClick={(e) => {
                updateTimeline("Next");
              }}
            >
              <p
                className={classes.cardCategoryWhite}
                style={{
                  textTransform: "capitalize",
                }}
              >
                Next salary period
              </p>
              <NavigateNextIcon style={{ color: "white" }} />
            </Button>

            <Box sx={{ marginRight: 2 }}>
              <FormControl fullWidth>
                <Select
                  labelId='demo-simple-select-labelg'
                  id='demo-simple-select'
                  value={Store.SalaryOverviewOptions.type}
                  label='Type'
                  name={"Type"}
                  onChange={(e) => {
                    setStore({
                      SalaryOverviewOptions: {
                        type: e.target.value,
                        period: Store.SalaryOverviewOptions.period,
                      },
                    });
                  }}
                >
                  {Store.Options.Type.map((e) => {
                    return <MenuItem value={e.Type}>{e.Type}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </CardHeader>
  );
}
