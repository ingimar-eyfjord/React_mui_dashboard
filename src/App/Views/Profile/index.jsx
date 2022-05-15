//? This is the file that opens when the Tab "Schedule" is clicked.
//? It has Three sub pages that can be navigated from here.
import { useEffect, useState, useContext } from "react";
import CardBody from "App/components/Card/CardBody.js";
import Cards from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import { GlobalState } from "context/store";
import EmplyService from "services/api_services/Emply_API_service/user.service";
import { TextField } from "@mui/material";
import { DefaultBtn } from "App/components/MUIComponents";
import LinearProgress from "@mui/material/LinearProgress";
import { Person, PersonViewType } from "@microsoft/mgt-react";
import moment from "moment";
import { Button } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import { Stack } from "@mui/material";
import styles from "App/components/classes";
import { Divider } from "@mui/material";
import GridItem from "App/components/Grid/GridItem.js";
import GridContainer from "App/components/Grid/GridContainer.js";
import MDBox from "App/components/MDBox";
import Grid from "@mui/material/Grid";
// @mui icons
import Functions from "App/Functions/functions";
import ProfileInfoCard from "App/components/ProfileInfoCard";
import breakpoints from "assets/theme/base/breakpoints";
import Modal from "@mui/material/Modal";
// Images
import EditIcon from "@mui/icons-material/Edit";
import UserLogs from "./logs";
import CardFooter from "App/components/Card/CardFooter";
import CheckCircle from "@mui/icons-material/CheckCircle";
import TokenService from "services/api_services/token.service";

import SimpleBar from "simplebar-react";
import DashboardLayout from "App/components/DashboardLayout";
import DashboardNavbar from "App/components/DashboardNavbar";
const useStyles = makeStyles(styles);

export default function Settings(props) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [File, StoreFile] = useState();
  const [Store, setStore] = useContext(GlobalState);
  const [Feedback, setFeedback] = useState();
  async function changeImage() {
    const status = await Functions.changeUserImage(
      File,
      Store.APITokens.Bearer
    );
    StoreFile(undefined);
    setFeedback(status);
  }

  const [disabledBtn, setDisabledBtn] = useState(false);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const classes = useStyles();
  const [elements, setElements] = useState(null);
  const [status, setStatus] = useState("original");
  function informHR() {
    const message = {
      Intent: "Inform HR Master Data Change",
      Sender: Store.UserDetails.UserName,
      SenderId: Store.UserDetails.UserUUID,
      UserID: TokenService.getUserID(),
      Bearer: TokenService.getLocalBearerToken(),
      APIToken: TokenService.getLocalAccessToken(),
    };
    Store.websocket.send(JSON.stringify(message));
  }

  async function SubmitChanges(e) {
    e.preventDefault();
    e.persist(e);
    setStatus("pending");
    const elements = e.target.elements;
    const copy = [...Store.UserDetails.EmplyMasterData];
    for (const e of elements) {
      if (e.value === "" || e.value === null) {
        continue;
      }
      copy.forEach((t) => {
        if (t.dataTypeId === e.name) {
          t.text = e.value;
        }
      });
    }
    try {
      setDisabledBtn(true);

      await EmplyService.UpdateEmployeeInfo(
        copy,
        Store.UserDetails.EmplyID
      );
      setStatus("complete");
      setStore({
        Notification: {
          color: "success",
          icon: "check",
          title: "Success",
          content: "Successfully updated personal info, HR has been informed.",
          dateTime: moment(),
        },
      });
      setDisabledBtn(false);

      informHR();
    } catch (error) {
      setStatus("failed");
      setDisabledBtn(false);

      setStore({
        Notification: {
          color: "error",
          icon: "warning",
          title: "Failed",
          content: "Something went wrong, please inform HR",
          dateTime: moment(),
        },
      });
    }
  }
  useEffect(() => {
    const Disabled = [
      "3f605ca9-3892-4f5d-bede-ee047fb79d26",
      "0e3b3bb2-990e-4369-9839-130878532171",
    ];
    const elements = Store.UserDetails.UserSelfServedMasterData.map(
      (s, index2) => (
        <TextField
          label={
            s.titleDataType.localization[0].value +
            " | " +
            s.titleDataType.localization[1].value
          }
          variant="outlined"
          id="outlined-basic"
          defaultValue={s.text === undefined ? s.number : s.text}
          disabled={Disabled.includes(s.dataTypeId) ? true : false}
          name={s.dataTypeId}
          key={index2}
        ></TextField>
      )
    );
    setElements(elements);
  }, [Store]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const Personal = Store.UserDetails.Personal;
  return (
    <DashboardLayout>
    <DashboardNavbar />
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Cards className="Settings" style={{ marginTop: 0 }}>
          <Grid
            container
            spacing={3}
            alignItems="center"
            sx={{ padding: "2rem" }}
          >
            <Grid item>
              <div className="personlarge">
                <Person
                  personQuery="me"
                  view={PersonViewType.avatar}
                  showPresence={false}
                  fetchImage={true}
                ></Person>
              </div>
            </Grid>
            <Grid item>
              <MDBox height="100%" mt={0.5} lineHeight={1}>
                <h4 className={classes.cardTitle}>
                  {`${Store.UserDetails.EmplyEmployee[0].firstName} ${Store.UserDetails.EmplyEmployee[0].lastName}`}
                </h4>
                <h5 className={classes.cardCategory}>
                  {Store.UserDetails.EmplyUser.jobTitle}
                </h5>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
              <Stack direction="row" spacing={2} position="static">
                <Button
                  variant="outlined"
                  onClick={handleOpen}
                  endIcon={<EditIcon />}
                >
                  Update information
                </Button>

                <Stack spacing={2} className="UploadImageContainer">
                  {!File && (
                    <>
                      <label htmlFor="avatar">Update image</label>
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          StoreFile(e.target.files[0]);
                        }}
                      />
                    </>
                  )}

                  {File && (
                    <Button
                      variant="contained"
                      onClick={changeImage}
                      endIcon={<CheckCircle />}
                    >
                      Confirm upload
                    </Button>
                  )}
                  {Feedback && (
                    <div style={{ marginBottom: "1rem" }}>{Feedback}</div>
                  )}
                </Stack>
              </Stack>
              {File && (
                <div style={{ marginTop: "1rem" }}>File: {File.name}</div>
              )}
            </Grid>
          </Grid>

          <MDBox mt={0} mb={3} sx={{ padding: "2rem" }}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4}>
                <ProfileInfoCard
                  title="profile information"
                  description='Profile information is stored inside our HR software which follows GDPR practices, you can update this information by clicking on "Update information"'
                  info={{
                    fullName: `${Personal.FirstName} ${Personal.LastName}`,
                    mobile: Personal.Phone,
                    email: Personal.PrivateEmail,
                    keycardNumber: Personal.KeyCard,
                    keycardAccessnumber: Personal.KeyCardAccNo,
                    companyPhone: Personal.CompanyPhone,
                  }}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="Personal details"
                  description='Personal information is stored inside our HR software which follows GDPR practices, you can update this information by clicking on "Update information"'
                  info={{
                    address: Personal.Address,
                    zip: Personal.ZIP,
                    City: Personal.City,
                    AccNo: Personal.AccNo,
                    RegNo: Personal.RegNo,
                    Birthday: moment(Personal.Birthday).format("DD-MM-YYYY"),
                  }}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
                <Divider orientation="vertical" sx={{ mx: 0 }} />
              </Grid>
              <Grid item xs={12} xl={4}>
                <UserLogs></UserLogs>
              </Grid>
            </Grid>
          </MDBox>
        </Cards>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <SimpleBar style={{ maxHeight: "100%" }} autoHide={false}>

          <Cards
            className="Settings"
            style={{ width: "60%", margin: "auto", marginTop: "1%" }}
          >
            <form
              className="EmplyStackForm"
              style={{
                marginBottom: "2rem",
                width: "60%",
                margin: "auto",
              }}
              onSubmit={SubmitChanges}
              component={"form"}
            >
              <CardHeader title>
                <h4 className={classes.cardTitle}>
                  Change personal information
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <Stack
                      dircetion="column"
                      spacing={2}
                      style={{ width: "100%", marginTop: "1rem" }}
                    >
                      {elements === null ? (
                        <LinearProgress />
                      ) : (
                        elements.slice(0, Math.floor(elements.length / 2))
                      )}
                    </Stack>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={6}>
                    <Stack
                      dircetion="column"
                      spacing={2}
                      style={{ width: "100%", marginTop: "1rem" }}
                    >
                      {elements === null ? (
                        <LinearProgress />
                      ) : (
                        elements.slice(-Math.ceil(elements.length / 2))
                      )}
                    </Stack>
                  </GridItem>
                </GridContainer>
                <CardFooter>
                  {status === "pending" ? <LinearProgress /> : null}

                  <Stack
                    spacing={2}
                    justifyItems="center"
                    alignItems="center"
                    width="100%"
                    alignConent="center"
                    direction="column"
                  >
                    <DefaultBtn
                      BtnType={"submit"}
                      text={"Confirm Changes"}
                      disabled={disabledBtn}
                    ></DefaultBtn>
                    <Button
                      style={{ width: "100%" }}
                      variant="outlined"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </CardFooter>
              </CardBody>
            </form>
          </Cards>
        </SimpleBar>
        </Modal>
      </GridItem>
    </GridContainer>
    </DashboardLayout>

  );
}
