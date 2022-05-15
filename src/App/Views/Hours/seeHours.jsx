import { useState, useEffect, useCallback, useContext, Fragment } from "react";
import moment from "moment";
import { GlobalState } from "context/store";
import { DataGrid } from "@mui/x-data-grid";
import HoursDataService from "services/api_services/hours.service";
import ExportCSV from "App/Functions/exportXLSX";
import useWindowSize from "App/Functions/useWindowSize";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MobileDateRangePicker from "@mui/lab/MobileDateRangePicker";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Stack } from "@mui/material";
import Cards from "App/components/Card/Card.js";
import CardBody from "App/components/Card/CardBody.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import GridItem from "App/components/Grid/GridItem.js";
import MDButton from "App/components/MDButton";
import TokenService from "services/api_services/token.service";
const useStyles = makeStyles(styles);

export default function SeeLoggedHours() {
  const [elements, setElements] = useState({});
  const classes = useStyles();
  // let { handleHoursModal } = useContext(HoursModalContext);
  // eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);

  const [hours, setHours] = useState(0);
  const [state, setState] = useState({
    Start: moment(),
    End: moment(),
  });

  const [HoursData, setHoursData] = useState({
    HoursData: undefined,
  });

  const changeFunction = useCallback(
    (e) => {
      setState((state) => ({
        ...state,
        Start: moment(e[0]).format(),
        End: moment(e[1]).format(),
      }));
    },
    [setState]
  );

  const getHours = useCallback(async () => {
    const user = TokenService.getUser();

    const param = {
      start: moment(state.Start).startOf("day").format("YYYY-MM-DD"),
      end: moment(state.End).endOf("day").format("YYYY-MM-DD"),
      uuid: user.id,
    };
    let getHours = await HoursDataService.ExportHoursForPerson(param);
    let amount = 0;
    getHours.data.forEach((e) => {
      e.Ledgers.forEach((l) => {
        amount = parseFloat(amount) + parseFloat(l.Hours);
      });
    });
    getHours.data.forEach((e) => {
      e.Ledgers.forEach((l) => {
        l.Hours = parseFloat(l.Hours);
      });
    });
    setHoursData({
      HoursData: getHours.data,
    });
    setHours(amount);
  }, [setHours, state]);

  useEffect(() => {
    getHours();
  }, [state, getHours]);

  const exportHours = useCallback(() => {
    const user = TokenService.getUser();

    if (HoursData.HoursData.length <= 0) {
      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "nothing to export",
          dateTime: moment(),
        },
      });
      return;
    }
    const Title = "Export Hours";
    const Subject = "Logged hours";

    const Username = user.name;
    let JsonData = [];
    for (const t of HoursData.HoursData) {
      t.Ledgers.forEach((e) => {
        let row = {
          Transaction_ID: t.Hour.Transaction_ID,
          Date: t.Hour.Date,
          Hours: parseFloat(e.Hours),
          Status: e.Status,
          Type: e.Type,
          Project: t.Hour.Project,
          Task: t.Hour.Task,
          Contacts: t.Hour.Contacts ? parseInt(t.Hour.Contacts) : 0,
          Meetings: t.Hour.Meetings ? parseInt(t.Hour.Meetings) : 0,
          Description: t.Hour.Description,
          Location: t.Hour.Location,
        };
        JsonData.push(row);
      });
    }
    ExportCSV(Title, Subject, Username, JsonData);
  }, [HoursData, setStore]);

  useEffect(() => {
    if (HoursData.HoursData === undefined || HoursData?.HoursData.length < 0) {
      return;
    }
    let columns = [{ field: "Transaction_ID", headerName: "Transaction id" }];
    if (HoursData.HoursData.length > 0) {
      let copy = [...HoursData.HoursData];
      copy.forEach((e) => {
        delete e.Hour.Team;
        delete e.Hour.User_UUID;
        delete e.Hour.createdAt;
        delete e.Hour.updatedAt;
        delete e.Hour.id;
        e.Ledgers.forEach((t) => {
          delete t.id;
          delete t.Account;
          delete t.createdAt;
          delete t.updatedAt;
          delete t.deletedAt;

          delete t.Debit;
          delete t.Credit;
          delete t.Transaction_ID;
          delete t.Salary_period;
        });
      });
      let keys = Object.keys(copy[0].Ledgers[0]);
      keys.push(Object.keys(copy[0].Hour));
      keys.sort();
      for (const d of keys.flat(1)) {
        let ob = { field: d, headerName: d, width: "150", sortable: true };
        if (d === "Date") {
          ob.customBodyRender = (value) => moment(value).format("DD-MM-YYYY");
        }
        if (d === "Hours") {
          ob.width = 130;
        }
        columns.push(ob);
      }
    }
    let rows = [];
    for (const e of HoursData.HoursData) {
      let row = {
        Transaction_ID: e.Transaction_ID,
        Hours: e.Ledgers[0].Hours,
        Contacts: e.Hour.Contacts ? parseInt(e.Hour.Contacts) : 0,
        Meetings: e.Hour.Meetings ? parseInt(e.Hour.Meetings) : 0,
        Date: e.Hour.Date,
        Task: e.Hour.Task,
        Description: e.Hour.Description,
        Project: e.Hour.Project,
        Type: e.Ledgers[0].Type,
        Status: e.Ledgers[0].Status,
      };
      rows.push(row);
    }

    setElements({
      rows: rows,
      columns: columns,
    });
  }, [HoursData]);

  const size = useWindowSize();
  const [value] = useState([null, null]);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Cards style={{ marginTop: 0 }}>
          <CardBody>
            <CardBody style={{ height: "fit-content" }}>
              <div style={{ height: "90vh" }}>
                <Stack direction='column' mb={2}>
                  <h3 className={classes.cardCategory}>
                    {moment(state.Start).format("DD-MM-YYYY")} -{" "}
                    {moment(state.End).format("DD-MM-YYYY")}
                  </h3>
                  <Stack direction='row' spacing={2}>
                    <h3 className={classes.cardTitle}>Hours Logged</h3>
                    <h3 className={classes.cardTitle}>{hours}</h3>
                  </Stack>
                </Stack>

                <Stack direction='row' spacing={5} mb={2}>
                  <MobileDateRangePicker
                    startText='Start'
                    value={value}
                    onChange={(newValue) => {
                      changeFunction(newValue);
                    }}
                    renderInput={(startProps, endProps) => (
                      <Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField {...endProps} />
                      </Fragment>
                    )}
                  />
                  <MDButton
                    color='success'
                    style={{ marginTop: "auto" }}
                    onClick={() => exportHours()}
                    variant='contained'
                    endIcon={<FileDownloadIcon />}
                  >
                    Export to excel
                  </MDButton>
                </Stack>

                {size.width >= 700 ? (
                  <>
                    {elements.rows && elements.rows.length > 0 ? (
                      <div style={{ height: "80%", width: "100%" }}>
                        <DataGrid
                          rows={elements.rows}
                          columns={elements.columns}
                          pageSize={20}
                          rowsPerPageOptions={[5]}
                          checkboxSelection
                          getRowId={(row) => row.Transaction_ID}
                        />
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <h3 className={classes.cardTitle}>
                      Export to view hours on mobile
                    </h3>
                  </div>
                )}
              </div>
            </CardBody>
          </CardBody>
        </Cards>
      </GridItem>
    </GridContainer>
  );
}
