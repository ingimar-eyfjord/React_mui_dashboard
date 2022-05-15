import { useContext } from "react";
import moment from "moment";
import GridItem from "App/components/Grid/GridItem.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Card from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import CardIcon from "App/components/Card/CardIcon.js";
import CardFooter from "App/components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/styles";
import { GlobalState } from "context/store";
import styles from "App/components/classes";
import {
  HoursLogged,
  DefferedHours,
  CreditHours,
  NetHours,
} from "App/components/CustomComponents";
const useStyles = makeStyles(styles);

export default function TopCards() {
  const [Store] = useContext(GlobalState);

  let period = Store.SalaryOverviewOptions.period

  const classes = useStyles();
  return (
    <GridItem xs={12} sm={12} md={12}>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color='warning' stats icon>
              <CardIcon color='warning'>
                <AccountBalanceOutlinedIcon
                  style={{ color: "white" }}
                ></AccountBalanceOutlinedIcon>
              </CardIcon>
              <p className={classes.cardCategory}>
                Logged hours {moment(period?.Date_end).format("MMMM")}
              </p>
              <HoursLogged ></HoursLogged>
            </CardHeader>
            <CardFooter stats>Hours logged for this period</CardFooter>
          </Card>
        </GridItem>
        {/* Hours in debit in current Salary period */}
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color='info' stats icon>
              <CardIcon color='info'>
                <ReceiptIcon style={{ color: "white" }} />
              </CardIcon>
              <p className={classes.cardCategory}>
                Credit hours {moment(period?.Date_end).format("MMMM")}
              </p>
              <CreditHours
              ></CreditHours>
            </CardHeader>
            <CardFooter stats>
              <div>Hours moved from this period</div>
            </CardFooter>
          </Card>
        </GridItem>
        {/* Hours in credit in current Salary period */}
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color='danger' stats icon>
              <CardIcon color='danger'>
                <ReceiptIcon style={{ color: "white" }} />
              </CardIcon>
              <p className={classes.cardCategory}>
                Debit hours {moment(period?.Date_end).format("MMMM")}
              </p>
              <DefferedHours
              ></DefferedHours>
            </CardHeader>
            <CardFooter stats>
              <div>Hours moved to this period</div>
            </CardFooter>
          </Card>
        </GridItem>
        {/* Net Hours in current Salary period */}
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color='success' stats icon>
              <CardIcon color='success'>
                <AccountBalanceOutlinedIcon
                  style={{ color: "white" }}
                ></AccountBalanceOutlinedIcon>
              </CardIcon>
              <p className={classes.cardCategory}>
                Net hours {moment(period?.Date_end).format("MMMM")} period
              </p>
              <NetHours
              
              ></NetHours>
            </CardHeader>
            <CardFooter stats>
              <div>Hours to be paid this period</div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </GridItem>
  );
}
