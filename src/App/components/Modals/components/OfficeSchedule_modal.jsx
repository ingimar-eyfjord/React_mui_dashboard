import React from "react";
import ReactDOM from "react-dom";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { ModalContext } from "../modalContext";
import NewTables from "App/components/newTables";
import Card from "App/components/Card/Card.js";
import CardHeader from "App/components/Card/CardHeader.js";
import CardBody from "App/components/Card/CardBody.js";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import { TablesWithBookings } from "App/components/CustomComponents";
import ConverterClass from "App/Functions/converterClass";
import CardActions from "@mui/material/CardActions";
import styles from "App/components/classes";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(styles);

const OfficeScheduleModal = () => {
  const classes = useStyles();

  function NotifyParent() {
    return;
  }
  let { modalContent, handleModal, modal } = React.useContext(ModalContext);
  if (modal && modalContent.Booked !== undefined) {

    let booked = [];
    for (const e of modalContent.Booked){
      booked.push({
        Table_number: e.Table.substring(2, 8),
        BookedFrom: e.BookedFrom,
        BookedTo: e.BookedTo,
        User: e.User,
        Email: e.email,
        date: new Date(),
      });
    }
    
    return ReactDOM.createPortal(
      <SimpleBar
        style={{ maxHeight: "100%" }}
        autoHide={false}
        className='PersonModal'
      >
        <Card style={{ margin: "auto", width: "100%", height: "100vh" }}>
          <CardHeader stats>
            <CardActions sx={{justifyContent:"flex-end"}}>
              <Button
                className={classes.cardCategory}
                onClick={() => handleModal()}
                sx={{ backgroundColor: "red"}}
                variant='contained'
                endIcon={<CloseIcon sx={{ color: "white" }} />}
              ></Button>
            </CardActions>
          </CardHeader>

          <CardBody>
            <Stack direction='row'>
              <div style={{ width: "50%" }}>
                <NewTables
                  NotifyParent={NotifyParent}
                  booked={modalContent.Booked}
                ></NewTables>
              </div>
              <div style={{ width: "50%" }}>
              <TablesWithBookings
                ConverterClass={ConverterClass}
                scheduled={booked}
                buttonText={"CloseModal"}
              ></TablesWithBookings>
              </div>

            </Stack>
          </CardBody>
        </Card>
      </SimpleBar>,
      document.querySelector("#modal-root")
    );
  } else return null;
};

export default OfficeScheduleModal;
