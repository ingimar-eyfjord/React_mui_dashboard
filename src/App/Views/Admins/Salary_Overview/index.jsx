import { useState, useEffect, useCallback, useContext } from "react";
import { GlobalState } from "context/store";

import Grid from "@mui/material/Grid";
import GridContainer from "App/components/Grid/GridContainer.js";

import { makeStyles } from "@material-ui/styles";
import { DataGrid } from "@mui/x-data-grid";

import styles from "App/components/classes";

import salaryService from "services/api_services/salary.service";
import bankService from "services/api_services/bank.service.js";

const useStyles = makeStyles(styles);
let render = 0;

export default function SalaryOverview(props) {
  const [Store] = useContext(GlobalState);
  const UserUUID = Store.UserDetails.UserUUID;

  // MESSAGES

  const [successMessage, setSuccessMessage] = useState(false);
  const [errorNotification, setErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // END MESSAGES

  const [disabledBtn, setDisabledBtn] = useState(false);

  const [currentPeriod, setCurrentPeriod] = useState();
  const [elements, setElements] = useState({});

  const [TransactionData, setTransactionData] = useState({
    TransactionData: undefined,
  });

  useEffect(() => {
    getCurrentPeriod();
  }, []);

  const getTransactions = useCallback(async () => {
    /*


        setTransactionData({
            TransactionData: transactions.data,
        })

        
        */
  }, []);

  useEffect(() => {
    //getTransactions();
  }, []);

  useEffect(() => {
    let columns = [{ field: "id", headerName: "ID", width: 70 }];

    const copy = [
      { User: "Waldo", Hours: 10, Status: "Unpaid" },
      { User: "Waldo", Hours: -10, Status: "Unpaid" },
      { User: "Raymond", Hours: 5, Status: "Unpaid" },
      { User: "Raymond", Hours: -5, Status: "Unpaid" },
      { User: "Ben", Hours: 1, Status: "Unpaid" },
      { User: "Ben", Hours: -1, Status: "Unpaid" },
    ];
    const keys = Object.keys(copy[0]);
    for (const d of keys) {
      let ob = { field: d, headerName: d, width: "150", sortable: true };

      columns.push(ob);
    }

    let num = 0;
    let rows = [];
    for (const e of copy) {
      const row = {
        id: num,

        User: e.User,
        Hours: e.Hours,

        Status: e.Status,
      };
      rows.push(row);
      num++;
    }

    setElements({
      rows: rows,
      columns: columns,
    });

    /*
        if (TransactionData.TransactionData === undefined || TransactionData?.TransactionData.length < 0) {
            return;
        }

        let columns = [{ field: "id", headerName: "ID", width: 70 }];

        if (TransactionData.TransactionData.length > 0) {
            const copy = [...TransactionData.TransactionData];
            delete copy[0].id;
            const keys = Object.keys(copy[0]);
            for (const d of keys) {
                let ob = { field: d, headerName: d, width: "150", sortable: true };
                if (d === "Date") {
                    ob.customBodyRender = (value) =>
                        moment(new Date(value)).format("DD-MM-YYYY");
                }
                columns.push(ob);
            }
        }
        let num = 0;
        let rows = [];
        for (const e of TransactionData.TransactionData) {
            const row = {
                id: num,
                User_UUID: e.User_UUID,
                User: e.User,
                Hours: e.Hours,
                Debit: e.Debit,
                Credit: e.Credit,
                Salary_period: e.Salary_period,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                Type: e.Type,
                Status: e.Status,
                Transaction_ID: e.Transaction_ID
            };
            rows.push(row);
            num++;
        }
        */
  }, []);

  //This callback also gives the neccesary salary period dates to send to the bank endpoint

  const getCurrentPeriod = useCallback(async () => {
    let thisMonth = await salaryService.get_current_period(
    );


    setCurrentPeriod((thisMonth = thisMonth.data[0]));
  }, [currentPeriod]);

  const classes = useStyles();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(false);
      setErrorMessage("");
      setErrorNotification(false);
      setDisabledBtn(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  function approveSalaries(e) {
    setDisabledBtn(true);
    e.preventDefault();
    e.persist(e);
    let elements = props.ConverterClass.formToJSON(e.target.elements);
    elements.User_UUID = UserUUID;
    elements.User = props?.userInfo?.Me?.displayName;
    elements.Hours = parseFloat(elements.Hours);
    //elements = _.merge(elements, DropDownInputs);

    if (
      elements.Hours === null ||
      elements.Hours === undefined ||
      elements.Hours === 0 ||
      elements.Hours === "0"
    ) {
      setDisabledBtn(false);
      alert("Please input hours");
      return;
    }

    if (
      elements.debit_month_name === null ||
      elements.debit_month_name === undefined
    ) {
      setDisabledBtn(false);
      alert("Please input Debit month");
      return;
    }

    if (
      elements.credit_month_name === null ||
      elements.credit_month_name === undefined
    ) {
      setDisabledBtn(false);
      alert("Please input Credit month");
      return;
    }
  }

  return (
    <>
      <GridContainer style={{ width: "100%" }}>
        <Grid>
          <h3 style={{ textAlign: "center" }}>
            Salary Period: {currentPeriod?.Month_name}
          </h3>
        </Grid>

        <Grid container spacing={2}>
          <div style={{ height: "60vh", width: "100%" }}>
            {elements.rows ? (
              <DataGrid
                rows={elements.rows}
                columns={elements.columns}
                pageSize={16}
                rowsPerPageOptions={[16]}
                checkboxSelection={true}
              />
            ) : null}
          </div>
        </Grid>
      </GridContainer>
    </>
  );
}

/*
  
*/
