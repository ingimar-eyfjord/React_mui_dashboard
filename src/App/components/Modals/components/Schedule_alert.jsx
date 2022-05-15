

import React from "react";
import ReactDOM from "react-dom";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ModalContext } from "../modalContext";


const ScheduleAlert = () => {
let { handleModal, modal } = React.useContext(ModalContext);
  if (modal) {
    return ReactDOM.createPortal(
      <div className="Edit_Schedule_Modal PersonModal ">
        <SimpleBar autoHide={false}>
        <div className="addToSchedule editScheduleContainer">
          <button className="CloseModalButton" onClick={() => handleModal()}>
            <span>&#10005;</span>
          </button>
        </div>

            <h2>Alert please schedule hours</h2>
        </SimpleBar>
      </div>,
      document.querySelector("#modal-root")
    );
  } else return null;
};

export default ScheduleAlert;
