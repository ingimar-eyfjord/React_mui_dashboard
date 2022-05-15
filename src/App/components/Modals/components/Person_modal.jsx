import React from "react";
import ReactDOM from "react-dom";
import { ModalContext } from "../modalContext";
import GraphInfoService from "services/graph_services/graph.service.js";
import {PersonaCard} from "App/components/CustomComponents"

const PersonModal = () => {
  let { modalContent, handleModal, modal } = React.useContext(ModalContext);
  const userInfo = modalContent.userInfo;
  const Bearer = modalContent.Bearer;
  function PersonaClicked() {
    return;
  }
  function sendMessage(e) {
    e.preventDefault();
    e.persist(e);
    // let elements = ConverterClass.formToJSON(e.target.elements);
    // const message = encodeURI(elements.TeamsMessage);
    // microsoftTeams.executeDeepLink(
    //   `https://teams.microsoft.com/l/chat/0/0?users=${userInfo.Me.mail}&message=${message}`
    // );
    // microsoftTeams.executeDeepLink(`Example: https://teams.microsoft.com/l/chat/0/0?users=${userInfo.Me.mail}&message=`);
    // Example: https://teams.microsoft.com/l/chat/0/0?users=joe@contoso.com,bob@contoso.com&topicName=Prep%20For%20Meeting%20Tomorrow&message=Hi%20folks%2C%20kicking%20off%20a%20chat%20about%20our%20meeting%20tomorrow
  }
  if (modal && modalContent.userInfo) {
    return ReactDOM.createPortal(
      <div className="PersonModal">
        <button className="CloseModalButton" onClick={() => handleModal()}>
          <span>&#10005;</span>
        </button>
        <section className="PersonaSection">
          <h3 >User profile</h3>
          <PersonaCard
            GraphInfoService={GraphInfoService}
            Image={userInfo.IMG}
            Bearer={Bearer}
            userInfo={userInfo}
            ID={userInfo.Me.id}
            PersonaClicked={PersonaClicked}
          ></PersonaCard>
        </section>
        {/* <NextDays ScheduleDataService={ScheduleDataService} Mail={userInfo.Me.mail}></NextDays> */}
        <section className="TeamsMessageSection">
          <h3>Send a Teams message</h3>
          <form onSubmit={sendMessage} className="flexColumn">
            <label className="ManualLabel" htmlFor="TeamsMessage">
              Message:
            </label>
            <textarea name="TeamsMessage" id="TeamsMessage" cols="30" rows="10"></textarea>
            <button type="submit" className="btn-Primary">
              Send Message
            </button>
          </form>
        </section>
      </div>,
      document.querySelector("#modal-root")
    );
  } else return null;
};
export default PersonModal;