import React from "react";
import useModal from "./useModal";
import ScheduleAlert from "./components/Schedule_alert.jsx";
import PersonModal from "./components/Person_modal";
import ChooseTableModal from "./components/chooseTable"
import OfficeScheduleModal from "./components/OfficeSchedule_modal.jsx";

let ModalContext;
let { Provider } = (ModalContext = React.createContext());

let ModalProvider = ({ children }) => {
  let { modal, handleModal, modalContent } = useModal();

  const path = modalContent.modal;

  return (
    <Provider value={{ modal, handleModal, modalContent }}>
      {path === "ScheduleAlert" && <ScheduleAlert />}
      {path === "PersonModal" && <PersonModal />}
      {path === "OfficeSchedule_modal" && <OfficeScheduleModal />}
      {path === "ChooseTableModal" && <ChooseTableModal />}
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
