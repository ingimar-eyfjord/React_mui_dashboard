import { useState, useContext, useEffect, useCallback } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { GlobalState } from "context/store";
import ScheduleDataService from "services/api_services/schedule.service";
import moment from "moment";
import NewTables from "App/components/newTables";
import ConverterClass from "App/Functions/converterClass";
import { TablesWithBookings } from "App/components/CustomComponents";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Card from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import CardBody from "App/components/Card/CardBody.js";
import CardActions from "@mui/material/CardActions";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(styles);

function ChooseTableModal({ selectedDate, times, handleModal }) {
  // eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  const [booked, setBooked] = useState(undefined);
  const classes = useStyles();

  const FindDate = useCallback(async () => {
    const param = {
      start: ConverterClass.makeMomentDateWithTime(selectedDate, times.start),
      end: ConverterClass.makeMomentDateWithTime(selectedDate, times.end),
    };
    //? Find the dates from the schedule
    let people = await ScheduleDataService.ExportReport(param);
    let NewArray = [];
    if (people?.length > 0) {
      for (const e of people) {
        if (e.Table_number !== null) {
          const ob = {
            BookedFrom: e.Date_start_time,
            BookedTo: e.Date_end_time,
            Table: `tb${e.Table_number}`,
            User: e.User,
            date: moment(e.Date_end_time).format(),
            email: e.Email,
            Table_number: e.Table_number,
            Email: e.Email,
          };
          NewArray.push(ob);
        }
      }
    }
    setBooked(NewArray);
  }, [selectedDate, times]);

  useEffect(() => {
    FindDate();
  }, [times.start, FindDate]);

  function getTableFromChild(parameter) {
    setStore({ table: parameter });
  }

  return (
    <Card
      style={{
        margin: "auto",
        width: "80%",
        pointerEvents: "all",
        marginTop: "2rem",
      }}
    >
      <CardHeader>
        <h4 className={classes.cardTitle}>
          Tables boookings for {moment(selectedDate).format("DD-MM-YYYY")}
        </h4>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <IconButton
            onClick={() => handleModal()}
            color='primary'
            aria-label='upload picture'
            component='span'
          >
            <CloseIcon size='medium' sx={{ color: "white" }} />
          </IconButton>
        </CardActions>
      </CardHeader>
      <CardBody className='overFlowHidden' style={{ height: "80vh" }}>
        <SimpleBar autoHide={false} style={{ height: "100%" }}>
          <Stack direction='row' p={2} spacing={5}>
            <div
              style={{
                width: "50%",
              }}
            >
              <TablesWithBookings
                ConverterClass={ConverterClass}
                scheduled={booked}
                buttonText={"CloseModal"}
              ></TablesWithBookings>
            </div>
            <div style={{ width: "50%" }}>
              <NewTables
                NotifyParent={getTableFromChild}
                booked={booked}
              ></NewTables>
            </div>
          </Stack>
        </SimpleBar>
      </CardBody>
    </Card>
  );
}

export default ChooseTableModal;
