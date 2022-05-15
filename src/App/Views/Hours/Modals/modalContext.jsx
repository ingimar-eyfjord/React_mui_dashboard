import {createContext} from "react";
import useModal from "App/Views/Hours/Modals/useModal";
import HoursOnCalander from './components/HoursOnCalander'

let HoursModalContext;
let { Provider } = (HoursModalContext = createContext());

let HoursModalProvider = ({ children }) => {
  let { modal, handleHoursModal, modalContent } = useModal();

  const path = modalContent.modal;

  return (
    <Provider value={{ modal, handleHoursModal, modalContent }}>
           {path === "ShowOnCalander" && <HoursOnCalander />}
      {children}
    </Provider>
  );
};

export { HoursModalContext, HoursModalProvider };