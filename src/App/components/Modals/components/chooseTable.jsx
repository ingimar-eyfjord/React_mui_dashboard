import React, { useState, useContext, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { ModalContext } from "../modalContext";
import { GlobalState } from "context/store";
import ScheduleDataService from "services/api_services/schedule.service";
import moment from "moment";
import NewTables from "App/components/newTables";
import { PrimaryBtn } from "App/components/MUIComponents";
import ConverterClass from "App/Functions/converterClass";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";

const ChooseTableModal = () => {
  let { modalContent, handleModal, modal } = React.useContext(ModalContext);
  // eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  const [booked, setBooked] = useState(undefined);
  const [Tables, setTables] = useState();
  const FindDate = useCallback(async () => {
    const param = {
      start: ConverterClass.makeMomentDateWithTime(
        modalContent.booked.date,
        modalContent.booked.start
      ),
      end: ConverterClass.makeMomentDateWithTime(
        modalContent.booked.date,
        modalContent.booked.end
      ),
    };
    //? Find the dates from the schedule
    let people = await ScheduleDataService.ExportReport(param);
    let NewArray = [];
    if (people?.length > 0) {
      for (const e of people) {
        if (e.Table_number !== null) {
          const ob = {
            BookedFrom: moment(e.Date_start_time).format("HH:mm"),
            BookedTo: moment(e.Date_end_time).format("HH:mm"),
            Table: `tb${e.Table_number}`,
            User: e.User,
            date: moment(e.Date_end_time).format(),
            email: e.Email,
          };
          NewArray.push(ob);
        }
      }
    }

    setBooked(NewArray);
  }, [modalContent]);
  useEffect(() => {
    FindDate();
  }, [modalContent.start, FindDate]);

  function getTableFromChild(parameter) {
    setStore({ table: parameter });
  }

  useEffect(() => {
    if (booked !== undefined) {
      const BookedTable = booked.map((e, index) => {
        return (
          <tr key={index + e.User}>
            <td>{e.Table.substring(2, 8)}</td>
            <td>{e.User}</td>
            <td>{e.BookedFrom}</td>
            <td>{e.BookedTo}</td>
          </tr>
        );
      });
      setTables(BookedTable);
    }
  }, [booked]);

  if (modal) {
    return ReactDOM.createPortal(
      <div className='PersonModal'>
        <div className='addToSchedule editScheduleContainer'>
          <Button
            onClick={() => handleModal()}
            className='CloseModalButton'
            color='error'
            variant='contained'
            endIcon={<CloseIcon sx={{ color: "white" }} />}
          ></Button>
        </div>

        <div className='addToScheduleCommand'>
          <SimpleBar style={{ maxHeight: "100%" }} autoHide={false}>
            <div style={{ marginBottom: "2rem" }}></div>
            <div className='TableBookingFlexing'>
              <table
                style={{
                  marginBottom: "2rem",
                }}
                className='TableBookingsTable'
              >
                <thead>
                  <tr>
                    <th>Table nr</th>
                    <th>Booked by</th>
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>{Tables}</tbody>
              </table>
              <NewTables
                NotifyParent={getTableFromChild}
                booked={booked}
              ></NewTables>
            </div>
            <div style={{ marginTop: "1rem" }}></div>
            <PrimaryBtn
              onClickFunction={() => handleModal()}
              text={"Close"}
            ></PrimaryBtn>
          </SimpleBar>
        </div>
      </div>,
      document.querySelector("#modal-root")
    );
  } else return null;
};

export default ChooseTableModal;
