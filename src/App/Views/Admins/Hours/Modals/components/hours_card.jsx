import { useContext, useState, useEffect, useCallback } from "react";
import { GlobalState } from "context/store";
import GridItem from "App/components/Grid/GridItem.js";
import GridContainer from "App/components/Grid/GridContainer.js";
//MUI
import IconButton from "@mui/material/IconButton";
import { Divider } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@material-ui/styles";
//
import CustomTable from "App/components/Table/Table";
//CUSTOM COMPONENTS
import NewTeam from "./newTeam";
import styles from "App/components/classes";
import CardHeader from "App/components/Card/CardHeader.js";
import moment from "moment";
import EditMetadata from "./editMetadata";
import Card from "App/components/Card/Card.js";
import CardBody from "App/components/Card/CardBody.js";
import CardFooter from "App/components/Card/CardFooter";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
//
import MDButton from "App/components/MDButton";
import CheckIcon from "@mui/icons-material/Check";
import Pagination from "@mui/material/Pagination";
import {
  Person,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";
import HoursDataService from "services/api_services/hours.service";
import MDTypography from "App/components/MDTypography";
import MDAlert from "App/components/MDAlert";

const alertContent = (name, text) => (
  <MDTypography variant='body2' color='white'>
    {name}
    <MDTypography
      component='p'
      variant='body2'
      fontWeight='medium'
      color='white'
    >
      {text}
    </MDTypography>
  </MDTypography>
);

const HoursCard = (props) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  // eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  const [selection, setSelection] = useState();
  const [toChange, setTochange] = useState({ User: props.rowData.User });
  useEffect(() => {
    if (props.rowData?.User) {
      setSelection({
        Date: props.rowData.Date,
        Transaction_ID: props.rowData.Transaction_ID,
        User: props.rowData.User,
        Team: props.rowData.Team,
        Project: props.rowData.Project,
        Task: props.rowData.Task,
        Type: props.rowData.Type,
        Contacts: props.rowData.Contacts,
        Meetings: props.rowData.Meetings,
        Hours: 0,
        OriginalHours: props.rowData.Hours,
        TeamID: props.rowData.TeamID,
      });
    }
  }, [props.rowData]);

  const [Table, setTable] = useState();

  const change = useCallback(
    (value) => {
      const key = Object.keys(value);
      const values = Object.values(value);
      setSelection((state) => ({
        ...state,
        [key]: values[0],
      }));
      setTochange((state) => ({
        ...state,
        [key]: values[0],
      }));
    },
    [setSelection]
  );

  const handleConfirm = useCallback((index) => {
    HoursDataService.update(
      selection.Transaction_ID,
      toChange
    )
      .then((response) => {
        if (response.request.statusText === "OK") {
          setStore({
            Notification: {
              color: "success",
              icon: "check",
              title: "Success",
              content: response.data.message,
              dateTime: moment(),
            },
          });
          props.handleDeleteCard(index)
          // setDisabledBtn(false);
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
        // setDisabledBtn(false);
      });
  }, [toChange, selection, setStore]);

  const tableHead = [
    "Person",
    "Date",
    "Hours",
    "Project",
    "Task",
    "Type",
    "Contacts",
    "Meetings",
  ];
  const tableHeaderColor = "red";

  useEffect(() => {
    if (selection?.User !== undefined) {
      const BookedTable = [selection].map((e, index) => {
        return [
          <Person
            view={PersonViewType.twolines}
            showPresence={true}
            line1Property='givenName'
            personCardInteraction={PersonCardInteraction.hover}
            userId={e.User}
          ></Person>,
          moment(e.Date).format("DD-MMMM-YYYY"),
          e.OriginalHours,
          e.Project,
          e.Task,
          e.Type,
          e.Contacts,
          e.Meetings,
        ];
      });
      setTable(BookedTable);
    }
  }, [selection]);

  return (
    <>
      {selection?.User && (
        <Card
          style={{
            marginTop: "5rem",
            width: "70%",
            height: "100%",
            padding: "2rem",
          }}
        >
          <CardHeader
            style={{
              padding: 0,
              margin: 0,
            }}
          >
            <CardActions sx={{ justifyContent: "flex-end" }}>
              {Table && (
                <CustomTable
                  tableHeaderColor={tableHeaderColor}
                  tableHead={tableHead}
                  tableData={Table}
                ></CustomTable>
              )}
              <IconButton
                sx={{
                  padding: 0,
                  margin: 0,
                  marginBottom: "auto",
                  marginLeft: "auto",
                }}
                onClick={() => props.handleClose()}
                color='info'
                aria-label='upload picture'
                component='span'
              >
                <CloseIcon size='large' sx={{ color: "white" }} />
              </IconButton>
            </CardActions>
          </CardHeader>
          <CardBody style={{ marginTop: "1rem" }}>
            <Stack direction='row' justifyContent='space-between' spacing={2}>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  style={{ marginBottom: "3rem" }}
                >
                  <Stack
                    direction='column'
                    alignContent='flex-end'
                    alignItems='flex-start'
                  >
                    <EditMetadata selection={selection} change={change} />
                  </Stack>
                </GridItem>

                <GridItem
                  justifyContent='center'
                  alignItems='center'
                  xs={12}
                  sm={12}
                  md={4.5}
                  sx={{ display: "flex" }}
                >
                  <Divider orientation='vertical' sx={{ margin: "auto" }} />
                  <NewTeam selection={selection} change={change} />
                  <Divider orientation='vertical' sx={{ margin: "auto" }} />
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={3.5}
                  style={{ marginBottom: "3rem" }}
                >
                  <Stack
                    ml='auto'
                    direction='column'
                    justifyContent='center'
                    alignItems='flex-end'
                    spacing={3}
                  >
                    <MDButton
                      style={{ marginLeft: "auto" }}
                      onClick={() => props.handleDeleteCard(props.index)}
                      variant='outlined'
                      color='warning'
                      endIcon={<DoubleArrowIcon />}
                      startIcon={<CloseIcon />}
                    >
                      Cancel this edit and continue
                    </MDButton>
                    <MDButton
                      variant='outlined'
                      disabled={false}
                      type='submit'
                      disableElevation
                      color='success'
                      onClick={() => handleConfirm(props.index)}
                      endIcon={<DoubleArrowIcon />}
                      startIcon={<CheckIcon />}
                    >
                      Confirm this edit and continue
                    </MDButton>
                    <h4 className={classes.cardTitle}>
                      Editing transaction id {selection.Transaction_ID}
                    </h4>
                    {selection.Hours !== 0 ? (
                      <MDAlert color='warning'>
                        {alertContent(
                          null,
                          // "Important info about editing hours",
                          `You have edited hours, please make sure that you read the info about editing hours. You are now making a new transaction with ${selection.Hours} hours`
                        )}
                      </MDAlert>
                    ) : null}
                  </Stack>
                </GridItem>
              </GridContainer>
            </Stack>

            <CardFooter
              style={{
                justifyItems: "center",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Pagination
                color='info'
                count={props.cardCount}
                page={props.page}
                onChange={props.handlePageChange}
              />
            </CardFooter>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default HoursCard;
