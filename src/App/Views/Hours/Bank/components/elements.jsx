import { DataGrid } from "@mui/x-data-grid";
import bankService from "services/api_services/bank.service.js";
import { useState, useEffect, useCallback, useContext } from "react";
import CardFooter from "App/components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/styles";
import styles from "App/components/classes";
import { GlobalState } from "context/store";
const useStyles = makeStyles(styles);

export default function Elements(){

  const [Store] = useContext(GlobalState);
  const [elements, setElements] = useState({});

  let type = Store.SalaryOverviewOptions.type
  let period = Store.SalaryOverviewOptions.period
  
  const classes = useStyles();

    const getTransactions = useCallback(async () => {

        const param = {
          user_uuid: Store.UserDetails.UserUUID,
          id: period.id,
          filter: type
        };
        const transactions = await bankService.getLedgerByUser(
          param
        );
        const TransactionData = transactions.data;
        if (TransactionData === undefined || TransactionData.length < 0) {
          return;
        }
        let columns = [{ field: "id", headerName: "id", hide:true, width: 100 }];
        if (TransactionData.length > 0) {
          const copy = [...TransactionData];
          delete copy[0].id;
          const keys = Object.keys(copy[0]);
          columns.push({
            field: "Hours",
            headerName: "Hours",
            width: "250",
            sortable: true,
          });
          columns.push({
            field: "Details",
            headerName: "Details",
            width: "250",
            sortable: true,
          });
          columns.unshift({
            field: "Transaction_ID",
            headerName: "Transaction_ID",
            width: "250",
            sortable: true,
          });
          const not = [
            "Account",
            "Salary_period",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "Debit",
            "Credit",
            "Hours",
          ];
          
          for (const d of keys) {
            let ob = { field: d, headerName: d, width: "250", sortable: true };
            if (!not.includes(d)) {
              columns.push(ob);
            }
          }
        }
        let num = 0;
        let rows = [];
        for (const e of TransactionData) {
          const row = {
            Transaction_ID: e.Transaction_ID,
            Status: e.Status,
            Hours: e.Hours,
            Details: e.Credit ? "Invoiced" : "Deffered/Ammended",
            Type: e.Type,
            id: num,
          };
          rows.push(row);
          num++;
        }
        setElements({
          rows: rows,
          columns: columns,
        });
      }, [Store, period, type]);

      useEffect(() => {
        if (period?.id !== undefined) {
          getTransactions();
        }
        // eslint-disable-next-line
      }, [period, type]);


return(
    <>
    <CardFooter stats>
    <h3 className={classes.cardTitleForViews}>Transactions</h3>
  </CardFooter>
  
  <div
    style={{
      marginTop: "1rem",
      height: "80vh",
      width: "100%",
    }}
  >
    {elements.rows ? (
      <DataGrid
        rows={elements.rows}
        columns={elements.columns}
        pageSize={16}
        rowsPerPageOptions={[16]}
      />
    ) : null}
  </div>
  </>
)
}
