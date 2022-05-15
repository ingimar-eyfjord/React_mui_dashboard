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
import DatePicker from "@mui/lab/DatePicker";
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
import ScheduleDataService from "services/api_services/schedule.service.js";

export default function EditSchedule() {
  const render = useRef(0);

  useEffect(() => {
    render.current = render.current + 1;
  }, []);

  const [Date, setSelectedDate] = useState();
  const [elements, setElements] = useState({});
  const [FilteredElements, setFilteredElements] = useState(undefined);

  const [hidden] = useState(undefined);
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

  const handleClose = () => {
    setOpen(false);
  };

  const getHoursReport = useCallback(
    async (param) => {
      const HoursReport = await ScheduleDataService.ExportReport(
        param
      );
      setElements((elements) => ({
        ...elements,
        Data: HoursReport,
        Hidden: HoursReport.length === 0 ? true : false,
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
    if (elements.Data === undefined) {
      return null;
    } else {
      const headersArray = [
        "User",
        "Hours",
        "Location",
        "Break",
        "Date_start_time",
        "Date_end_time",
        "Table_number",
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
        if (e === "Break") {
          ob.flex = 0.4;
          ob.renderCell = (params) =>
            parseInt(params.formattedValue) ? "Yes" : "No";
        }
        if (e.includes("Date")) {
          ob.flex = 0.5;
          ob.renderCell = (params) =>
            moment(params.formattedValue).format("DD-MM-YYYY HH:mm");
        }
        if (e === "Hours") {
          ob.flex = 0.5;
          ob.renderCell = (params) => `${params.formattedValue} hr`;
        }
        return columns.push(ob);
      });
      let rows = [];

      elements.Data.map((e, index) => {
        let right = deepFind(Store.Options.Departments, function (obj) {
          return obj.id === e.Team;
        });
        if (right === null) {
          right = Object.values(Store.Options.Departments).filter((x) => {
            return x.id === e.Team;
          });
        }
        const row = {
          //   Transaction_ID: e.Transaction_ID,
          Transaction_ID: e.id,
          Date_end_time: e.Date_end_time,
          Date_start_time: e.Date_start_time,
          Location: e.Location,
          Break: e.Break,
          Team: right.title,
          User: e.User_UUID,
          Hours: e.Hours,
          Table_number: e.Table_number,
          TeamID: right.id,
        };
        return rows.push(row);
      });
      setElements({
        rows: rows,
        columns: columns,
      });
    }
  }, [
    elements.Data,
    hidden,
    getHoursReport,
    deepFind,
    Store.Options.Departments,
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
          Date={Date}
          getHoursReport={getHoursReport}
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
