import { useState, useEffect, useCallback, useContext, useRef } from "react";
import moment from "moment";
import { GlobalState } from "context/store";
import { PeoplePickerComp } from "App/components/MGTComponents";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import {
  Person,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";
import HoursDataService from "services/api_services/hours.service";
import Card from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import CardBody from "App/components/Card/CardBody.js";
import styles from "App/components/classes";
import DatePicker from "@mui/lab/DatePicker";
import { makeStyles } from "@material-ui/styles";
import MDAlert from "App/components/MDAlert";
import MDTypography from "App/components/MDTypography";
import HoursEdit from "./Modals/components/hours_edit.jsx";
import Modal from "@mui/material/Modal";
import CardActions from "@mui/material/CardActions";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "App/components/MDButton";
import PropTypes from "prop-types";

import CardFooter from "App/components/Card/CardFooter";



function CustomFooterStatusComponent(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  let rows =
    props.selectionModel.length > 0
      ? props.selectionModel
      : props.FilteredElements
      ? props.FilteredElements.rows
      : props.elements.rows;

  let hours = 0;
  for (const r of rows) {
    hours = hours + parseFloat(r.Hours);
  }
  return (
    <CardFooter>
      <h4 className={classes.cardTitle}>
        {" "}
        Hours selected and or shown : {hours}
      </h4>
    </CardFooter>
  );
}

CustomFooterStatusComponent.propTypes = {
  status: PropTypes.oneOf(["connected", "disconnected"]).isRequired,
};

export { CustomFooterStatusComponent };

export default function EditHours() {

  const render = useRef(0);

  useEffect(() => {
    render.current = render.current + 1;
  }, []);

  const [Date, setSelectedDate] = useState();
  const [elements, setElements] = useState({
    Data:{
      Hour: []
    }
  });
  const [FilteredElements, setFilteredElements] = useState(undefined);
  // eslint-disable-next-line
  const [hidden, setHidden] = useState(undefined);
  // eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  // eslint-disable-next-line
  const [selectedPerson, setPerson] = useState(undefined);
  const [selectionModel, setSelectionModel] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (selectionModel.length === 0) {
      alert("No row selected");
      return;
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const getHoursReport = useCallback(
    async (param) => {
      const HoursReport = await HoursDataService.ExportReport(
        param
      );
      setElements((elements) => ({
        ...elements,
        Data: HoursReport.data,
        Hidden: HoursReport.data.length === 0 ? true : false,
      }));
      return;
    },
    [setElements]
  );

  useEffect(() => {
    const data = {
      start: moment.utc(Date).startOf("day").format(),
      end: moment.utc(Date).endOf("day").format(),
    };
    getHoursReport(data);
  }, [Date, getHoursReport]);

  const deepFind = useCallback((arr, search) => {
    for (var obj of Object.values(arr)) {
      if (search(obj)) {
        return obj;
      }
      if (obj.SubDepartments) {
        var deepResult = deepFind(obj.SubDepartments, search);
        if (deepResult) {
          return deepResult;
        }
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (elements.Data?.Hour === undefined) {
      return
    }
    if (elements.Data?.Hour.length === 0) {
      return;
    } else {
      const headersArray = [
        "User",
        "Hours",
        "Status",
        "Type",
        "Project",
        "Task",
        "Contacts",
        "Meetings",
        "Team",
      ];
      let columns = [
        {
          field: "Transaction_ID",
          headerName: "Transaction id",
          minWidth: 50,
          flex: 0.3,
        },
      ];
      headersArray.map((e) => {
        let ob = {
          field: e,
          headerName: e,
          sortable: true,
          editable: true,
          flex: 0.5,
          minWidth: 50,
        };
        if (e === "User") {
          ob.flex = 1;
          ob.renderCell = (params) => (
            <Person
              view={PersonViewType.twolines}
              showPresence={true}
              line1Property='givenName'
              personCardInteraction={PersonCardInteraction.hover}
              userId={params.formattedValue}
            ></Person>
          );
        }
        return columns.push(ob);
      });
      let rows = [];
      //? Change excel headers and positioning of columns to the format for the German team want's
      for (const h of elements.Data.Hour){
        let user = elements.Data.AzureUsers.filter(function (e){
          return e.id === h['Account id credit'] || e.id === h['Account id credit']
        })
        // Filter ledgers to only the current hour metadata
        let Ledgers = elements.Data.Ledgers.filter(function (e) {
          return e.Transaction_ID === h.Transaction_ID;
        });
        // Get ledger from the user id of the Azure data
        let UserLedger = Ledgers.filter(function (e) {
          return e.Account === user[0].id
        })
        // Get ledger that's not the user
        let TeamLedger = Ledgers.filter(function (e) {
          return e.Account !== user[0].id
        })
        TeamLedger =  TeamLedger[0]
        UserLedger = UserLedger[0]
        user = user[0]
        const row = {
          Transaction_ID: h.Transaction_ID,
          Project: h.Project,
          Task: h.Task,
          Contacts: h.Contacts,
          Meetings: h.Meetings,
          Team: h.Team,
          User: user.id,
          Hours: UserLedger.Hours,
          Status: UserLedger.Status,
          Type: UserLedger.Type,
          TeamID: TeamLedger.Account,
        };
        rows.push(row);
      }
      setElements({
        rows: rows,
        columns: columns,
      });
    }
  }, [
    elements.Data?.Hour,
    hidden,
    getHoursReport,
  ]);
  const [openDialogue, setOpenDialogue] = useState(false);
  const handleCloseDialogue = () => {
    setOpenDialogue(false);
  };
  const confirmDeletion = useCallback(() => {
    if (selectionModel.length > 0) {
      setOpenDialogue(true);
    }
  }, [selectionModel]);


  const alertContent = (name, text) => (
    <MDTypography variant='body2' color='white'>
      {name}
      <MDTypography
        component='p'
        variant='body2'
        fontWeight='medium'
        color='white'
      >
        {text.Date_start_time &&
          moment(text.Date_start_time).format("HH:mm a") +
            ` - ` +
            moment(text.Date_end_time).format("HH:mm a")}
      </MDTypography>
    </MDTypography>
  );
  const selected = useCallback(
    (value) => {
      if (value.detail[0]?.id) {
        const person = value.detail[0].id;
        let rows = [...elements.rows];
        let columns = [...elements.columns];
        rows = rows.filter((e) => {
          return person === e.User;
        });
        setFilteredElements({
          rows: rows,
          columns: columns,
        });
      } else {
        setFilteredElements(false);
      }
    },
    [elements]
  );
  const handleConfirmDeletion = useCallback(async () => {
    if (selectionModel.length > 0) {
      setOpenDialogue(false);
      let deleteIds = [];
      for (const e of selectionModel) {
        deleteIds.push(e.Transaction_ID);
      }
      HoursDataService.Bulkdelete(deleteIds)
        .then((response) => {
          if (response.request.status === 200) {
            setStore({
              Notification: {
                color: "success",
                icon: "check",
                title: "Success",
                content: response.data.message,
                dateTime: moment(),
              },
            });
            let rows = [...elements.rows];
            rows = rows.filter((e) => {
              return !deleteIds.includes(e.Transaction_ID);
            });
            setElements((state) => ({ ...state, rows: rows }));
          }
        })
        .catch((e) => {
          setStore({
            Notification: {
              color: "error",
              icon: "warning",
              title: "Failed",
              content: e.response.data.message,
              dateTime: moment(),
            },
          });
        });
    }
  }, [selectionModel, elements, setStore]);

  return (
  <>
      <Card style={{ marginTop: 0, height: "100%" }}>
        <CardHeader>
          <CardActions sx={{ justifyContent: "flex-start" }}>
            <Stack direction='row' spacing={5}>
              <div style={{ marginTop: "auto" }}>
                <DatePicker
                  label='Select date'
                  value={Date}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <Stack direction='column'>
                <label className='ManualLabel' htmlFor='FilterPeople'>
                  Filter by person
                </label>
                <PeoplePickerComp
                  passedDown={selected}
                  mode={"single"}
                ></PeoplePickerComp>
              </Stack>
              <MDButton
                style={{ marginTop: "auto" }}
                onClick={() => handleOpen()}
                variant='contained'
                endIcon={<ModeEditIcon />}
                color='info'
              >
                Edit selected
              </MDButton>
              <MDButton
                style={{ marginTop: "auto" }}
                onClick={() => confirmDeletion()}
                variant='contained'
                endIcon={<DeleteIcon />}
                color='error'
              >
                Delete selected
              </MDButton>
            </Stack>
          </CardActions>
        </CardHeader>
        <CardBody style={{ marginBottom: "2rem" }}>
          <div className={elements.Hidden ? "show warning" : "hidden warning"}>
            No logged hours
          </div>
          {elements.rows ? (
            <div style={{ height: "75vh", width: "100%" }}>
              <DataGrid
                rows={FilteredElements ? FilteredElements.rows : elements.rows}
                columns={
                  FilteredElements ? FilteredElements.columns : elements.columns
                }
                
                pageSize={elements.rows.length}
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.Transaction_ID}
                onSelectionModelChange={(newSelectionModel) => {
                  const selectedIDs = new Set(newSelectionModel);
                  const selectedRowData = elements.rows.filter((row) =>
                    selectedIDs.has(row.Transaction_ID)
                  );
                  setSelectionModel(selectedRowData);
                }}
                checkboxSelection
                components={{
                  Footer: CustomFooterStatusComponent,
                }}
                componentsProps={{
                  footer: { elements, selectionModel, FilteredElements },
                }}
              />
            </div>
          ) : null}
        </CardBody>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <HoursEdit
          handleOpen={handleOpen}
          handleClose={handleClose}
          selectedRows={selectionModel}
          getHoursReport={getHoursReport}
          Date={Date}
        />
      </Modal>
      <Dialog
        open={openDialogue}
        onClose={handleCloseDialogue}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {"Delete selected inputs"}
        </DialogTitle>
        <DialogContent>
          <MDAlert color='info'>
            {alertContent(
              "This action will not perminently delete the inputs, however will mark them as deleted. This preserves the data, the delete action can be reversed.",
              "Another text"
            )}
          </MDAlert>
        </DialogContent>
        <DialogActions>
          <MDButton
            color='info'
            style={{ marginTop: "auto" }}
            onClick={() => handleCloseDialogue()}
            variant='contained'
            endIcon={<CloseIcon />}
          >
            Disagree
          </MDButton>
          <MDButton
            color='error'
            style={{ marginTop: "auto" }}
            onClick={() => handleConfirmDeletion()}
            variant='contained'
            endIcon={<DeleteIcon />}
          >
            Agree
          </MDButton>
        </DialogActions>
      </Dialog>
      </>
  );
}
