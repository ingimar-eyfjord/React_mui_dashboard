import { useEffect, useCallback, useContext } from "react";
import { GlobalState } from "context/store";
import GridItem from "App/components/Grid/GridItem.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import CardBody from "App/components/Card/CardBody.js";
import Card from "App/components/Card/Card.js";
import CardFooter from "App/components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/styles";
import styles from "App/components/classes";
import salaryService from "services/api_services/salary.service";
import TopCards from "./components/topCards";
import CreateTransaction from "./components/createTransaction";
import Elements from "./components/elements";
import SalaryAppBar from "./components/AppBar";

const useStyles = makeStyles(styles);
export default function Bank() {
  const [Store, setStore] = useContext(GlobalState);

  const getDates = useCallback(async () => {
    let thisMonth = await salaryService.get_current_period(
    );
    setStore({
      SalaryOverviewOptions: {
        type: "Normal",
        period: thisMonth.data[0],
      },
    });
  }, [setStore]);


  useEffect(() => {
    
    getDates();
    // eslint-disable-next-line 
  }, []);
  const classes = useStyles();
  //? This function will return the values that are not numbers from the response data from Tasks, Projects and Supplements tables from the SQL query
  return (
<>
      {Store?.SalaryOverviewOptions?.period === undefined ||
      Store?.SalaryOverviewOptions?.type === undefined ? (
        ""
      ) : (
        <GridContainer sx={{ paddingBottom: "3rem" }}>
          <TopCards></TopCards>
          <GridItem xs={12} sm={12} md={12}>
            <GridItem xs={12} sm={12} md={12}>
              <Card chart>
                <SalaryAppBar></SalaryAppBar>
                <CardBody>
                  <CardFooter stats>
                    <h3 className={classes.cardTitleForViews}>
                      Create transaction
                    </h3>
                  </CardFooter>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <CreateTransaction></CreateTransaction>
                      <Elements></Elements>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridItem>
        </GridContainer>
      )}

      </>
  );
}
