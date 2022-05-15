//? This is the file that opens when the Tab "Dashboard" is clicked.
//? It has no subpages, but I am trying to use the function GoToPath to traverse to the corresponding tabs
//? when clicking on the components in the dashboard.
import { useContext, useState, useEffect, useCallback } from "react";
import { GlobalState } from "context/store";
import moment from "moment";
import ConverterClass from "App/Functions/converterClass";
import HoursDataService from "services/api_services/hours.service";
import ScheduleDataService from "services/api_services/schedule.service";
import { PersonalTodo, AgendaComp } from "App/components/MGTComponents";
import Emails from "App/components/Emails";
import { CalendarComponent, DefaultBtn } from "App/components/MUIComponents";
import {
  HoursLogged,
  ProjectHours,
  ScheduledHours,
  TasksHours,
  TableBooking,
  TreeNation,
} from "App/components/CustomComponents";
import SimpleBar from "simplebar-react";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import { makeStyles } from "@material-ui/styles";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ForumIcon from "@mui/icons-material/Forum";
// core components+
import GridItem from "App/components/Grid/GridItem.js";
import CardBody from "App/components/Card/CardBody.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import Card from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import CardIcon from "App/components/Card/CardIcon.js";
import CardFooter from "App/components/Card/CardFooter.js";
import salaryService from "services/api_services/salary.service";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import styles from "App/components/classes";
import DashboardLayout from "App/components/DashboardLayout";
import DashboardNavbar from "App/components/DashboardNavbar";
const useStyles = makeStyles(styles);
export default function Dashboard() {
  const [Store, setStore] = useContext(GlobalState);
  
  const [Stats, SetStats] = useState({
    TreeNation: 0,
    AvgContacts: 0,
    sumHours: 0,
  });
  const [dates, setDates] = useState({
    start: undefined,
    end: undefined,
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const getDates = useCallback(async () => {
    const thisPeriod = await salaryService.get_current_period(
    );
    setDates({
      start: thisPeriod.data[0]?.Date_start,
      end: thisPeriod.data[0]?.Date_end,
    });
    const meetingsSold = await HoursDataService.Treenation(
      Store.UserDetails.UserUUID,
    );
    const param_aux = {
      period_id: thisPeriod.data[0]?.id,
      user_uuid: Store.UserDetails.UserUUID,
    };
    const sumHoursMonth = await HoursDataService.getHoursInSalaryPeriod(
      param_aux,
    );
    const avgContacts = await HoursDataService.AvgContacts(
      Store.UserDetails.UserUUID
    );
    const Hours =
      sumHoursMonth.data.length > 0 ? sumHoursMonth.data[0].Hours : 0;
    const Meetings =
      meetingsSold.data.length > 0 ? meetingsSold.data[0].totalMeeting : 0;
    const Contacts = avgContacts.data.length > 0 ? avgContacts.data[0].avg : 0;

    SetStats((Stats) => ({
      ...Stats,
      TreeNation: Meetings === null ? 0 : parseFloat(Meetings).toFixed(2),
      AvgContacts: Contacts === null ? 0 : parseFloat(Contacts).toFixed(2),
      sumHours: Hours === null ? 0 : parseFloat(Hours).toFixed(2),
    }));
    setStore({
      SalaryOverviewOptions: {
        type: "Normal",
        period: thisPeriod.data[0],
      },
    });
  }, [Store, setStore]);

  const classes = useStyles();

  useEffect(() => {
    getDates();
    // eslint-disable-next-line
  }, []);

  const monthString = `${moment()
    .startOf("month")
    .startOf("day")
    .format("DD-MM-YYYY")} - ${moment()
    .endOf("month")
    .endOf("day")
    .format("DD-MM-YYYY")}`;

  return (
    <DashboardLayout>
      <DashboardNavbar />
        {Store.UserDetails.UserEmail === undefined ? (
          ""
        ) : (
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem xs={12} sm={6} md={3}>
                  <Card>
                    <CardHeader color='warning' stats icon>
                      <CardIcon color='warning'>
                        <AccountBalanceIcon
                          style={{ color: "white" }}
                        ></AccountBalanceIcon>
                      </CardIcon>
                      <p className={classes.cardCategory}> Logged hours</p>
                      <HoursLogged
                     
                      ></HoursLogged>
                    </CardHeader>
                    <CardFooter stats>
                      <div>
                        {moment(dates.end).format("MMMM")} salary period
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={3}>
                  <Card>
                    <CardHeader color='info' stats icon>
                      <CardIcon color='info'>
                        <WatchLaterIcon style={{ color: "white" }} />
                      </CardIcon>
                      <p className={classes.cardCategory}>Scheduled hours</p>
                      <ScheduledHours
                        cardClass={classes.cardCategory}
                        cardTitleClass={classes.cardTitle}
                        ScheduleDataService={ScheduleDataService}
                        Mail={Store.UserDetails.UserEmail}
                      ></ScheduledHours>
                    </CardHeader>
                    <CardFooter stats>
                      <div>{moment().format("MMMM")} schedule</div>
                    </CardFooter>
                  </Card>
                </GridItem>

                <GridItem xs={12} sm={6} md={3}>
                  <Card>
                    <CardHeader color='success' stats icon>
                      <CardIcon color='success'>
                        <ForumIcon style={{ color: "white" }}></ForumIcon>
                      </CardIcon>
                      <p className={classes.cardCategory}>Average contacts</p>
                      <h3 className={classes.cardTitle}>
                        {Stats.AvgContacts} /hr
                      </h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div>{moment().format("MMMM")} contacts</div>
                    </CardFooter>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={3}>
                  <Card>
                    <CardHeader color='info' stats icon>
                      <CardIcon color='info'>
                        <MarkChatReadIcon style={{ color: "white" }} />
                      </CardIcon>
                      <p className={classes.cardCategory}>Meetings</p>
                      <h3 className={classes.cardTitle}>{Stats.TreeNation}</h3>
                    </CardHeader>
                    <CardFooter stats>
                      <div>{moment().format("MMMM")} meetings</div>
                    </CardFooter>
                  </Card>
                </GridItem>
              </GridContainer>
            </GridItem>

            <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <Card chart style={{ marginTop: "1rem" }}>
                    <CardHeader color='warning'>
                      <TasksHours
                        Mail={Store.UserDetails.UserEmail}
                        HoursDataService={HoursDataService}
                      ></TasksHours>
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>
                        Hours logged by tasks
                      </h4>
                      <p className={classes.cardCategory}>
                        {Stats.sumHours} This salary period
                      </p>
                    </CardBody>
                    <CardFooter chart>
                      <div className={classes.stats}>
                        <DateRangeIcon style={{ color: "info" }} />
                        {moment(dates.start).format("DD-MM-YYYY")} -{" "}
                        {moment(dates.end).format("DD-MM-YYYY")}
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>

                <GridItem xs={12} sm={12} md={4}>
                  <Card chart style={{ marginTop: "1rem" }}>
                    <CardHeader color='info'>
                      <ProjectHours
                        Mail={Store.UserDetails.UserEmail}
                        HoursDataService={HoursDataService}
                      ></ProjectHours>
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>
                        Hours logged by projects
                      </h4>
                      <p className={classes.cardCategory}>
                        {Stats.sumHours} This salary period
                      </p>
                    </CardBody>
                    <CardFooter chart>
                      <div className={classes.stats}>
                        <DateRangeIcon style={{ color: "info" }} />
                        {moment(dates.start).format("DD-MM-YYYY")} -{" "}
                        {moment(dates.end).format("DD-MM-YYYY")}
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>

                <GridItem xs={12} sm={12} md={4}>
                  <Card chart style={{ marginTop: "1rem" }}>
                    <CardHeader color='success'>
                      <TreeNation></TreeNation>
                    </CardHeader>
                    <CardBody>
                      <h4 className={classes.cardTitle}>
                        Your Tree nation contribution
                      </h4>
                      <p className={classes.cardCategory}>
                        <span className={classes.successText}>
                          {/* <KeyboardArrowUpOutlinedIcon className={classes.upArrowCardCategory} /> */}
                          {Stats.TreeNation}
                        </span>{" "}
                        trees planted this month.
                      </p>
                    </CardBody>
                    <CardFooter chart>
                      <div className={classes.stats}>
                        <DateRangeIcon style={{ color: "info" }} />
                        {monthString}
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>

                <GridItem xs={12} sm={12} md={8}>
                  <Card style={{ marginTop: 0 }}>
                    <CardHeader title>
                      <h4 className={classes.cardTitle}>Booked tables today</h4>
                      <DefaultBtn
                        text={"See office floor plan"}
                        BtnType={"button"}
                        onClickFunction={handleOpen}
                      ></DefaultBtn>
                    </CardHeader>

                    <CardBody
                      className='overFlowHidden'
                      style={{ height: "40vh" }}
                    >
                      <TableBooking
                        open={open}
                        setOpen={setOpen}
                        handleClose={handleClose}
                        handleOpen={handleOpen}
                        CalendarComponent={CalendarComponent}
                        ScheduleDataService={ScheduleDataService}
                        ConverterClass={ConverterClass}
                      ></TableBooking>
                    </CardBody>
                  </Card>
                  <Card style={{ marginTop: 0 }}>
                    <CardHeader title>
                      <h4 className={classes.cardTitle}>
                        Your unread mail (focused)
                      </h4>
                    </CardHeader>

                    <CardBody
                      className='overFlowHidden'
                      style={{ height: "100%" }}
                    >
                      <Emails Mail={Store.UserDetails.UserEmail}></Emails>
                    </CardBody>
                  </Card>
                  <Card className='grid-item' style={{ marginTop: 0 }}>
                    <CardHeader title>
                      <h4 className={classes.cardTitle}>Video</h4>
                    </CardHeader>
                    <CardBody>
                      <iframe
                        style={{
                          margin: 0,
                          padding: 0,
                        }}
                        width='100%'
                        height='250px'
                        src='https://www.youtube.com/embed/U9tAjYXu-uI'
                        title='YouTube video player'
                        frameBorder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen
                      ></iframe>
                    </CardBody>
                    <CardFooter chart>
                      <h4 className={classes.cardTitle}>
                        Dialogue Time tutorial
                      </h4>
                      <p className={classes.stats}>
                        How to use the new Dialogue Time system.
                      </p>
                    </CardFooter>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Card style={{ marginTop: 0 }}>
                    <CardHeader title>
                      <h4 className={classes.cardTitle}>Your agenda</h4>
                    </CardHeader>
                    <CardBody>
                      <AgendaComp></AgendaComp>
                    </CardBody>
                    <CardFooter stats></CardFooter>
                    <CardHeader title>
                      <h4 className={classes.cardTitle}>Personal Tasks</h4>
                    </CardHeader>
                    <CardBody>
                      <SimpleBar style={{ maxHeight: "90vh" }} autoHide={false}>
                        <PersonalTodo></PersonalTodo>
                      </SimpleBar>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem xs={12} sm={12} md={8}></GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        )}
    </DashboardLayout>
  );
}
