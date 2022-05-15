import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import Fab from "@mui/material/Fab";
import NotificationsIcon from '@mui/icons-material/Notifications';
import Box from "@mui/material/Box";
import { GlobalState } from "context/store";
import Badge from "@mui/material/Badge";
import { Notification } from "./notification";
import TokenService from "services/api_services/token.service";

//? Todo
//? * Send more connection information to server so the server knows which client to send if group message
//? * Add on server side routing for different groups.
//? * Don't show read messages

export function NotificationBot() {
  const [Store, setStore] = useContext(GlobalState);
  //   let audio = new Audio("/content/sounds/notification.mp3")
  // const [isPaused, setPause] = useState(false);
  const [isPaused] = useState(false);
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageElements, setMessageElements] = useState();
  const [sideBar, handleSidebar] = useState(false);
  const [amountShown, setAmountShown] = useState(0);

  useEffect(() => {

    ws.current = new WebSocket("wss://api-dev.dialogueone.com/websockets");
    ws.current.onopen = () => {
      const sign = {
        Intent: "Sign",
        UserID: TokenService.getUserID(),
        Bearer: TokenService.getLocalBearerToken(),
        APIToken: TokenService.getLocalAccessToken(),
      };
      ws.current.send(JSON.stringify(sign));
      setStore({ websocket: ws.current });

      const getMessages = {
        Intent: "Get unread messages",
        UserID: TokenService.getUserID(),
        Bearer: TokenService.getLocalBearerToken(),
        APIToken: TokenService.getLocalAccessToken(),
      };
      ws.current.send(JSON.stringify(getMessages));
    };
    ws.current.onclose = () => console.log("ws closed");
    const wsCurrent = ws.current;
    return () => {
      wsCurrent.close();
    };
  }, [setStore, Store.UserDetails, Store.APITokens]);

  useEffect(() => {
    setAmountShown(messages.length);
  }, [sideBar, messages.length]);

  useEffect(() => {
    if (amountShown === 0) {
      handleSidebar(false);
    }
  }, [amountShown]);

  const concatMessages = useCallback(
    (message) => {
      const Messages = [...messages, message.flat()];
      setMessages(Messages.flat());
    },
    [messages]
  );

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = (e) => {
      if (isPaused) return;
      const message = JSON.parse(e.data);
      if (!message.Group) {
        if (message.Intent === "Unread Messages") {
          // for (const e of message.messages){
          concatMessages(message.messages);
          // }
        }
      } else {
        concatMessages([message]);
      }
    };
  }, [isPaused, concatMessages]);

  const removeMessage = useCallback(
    (id) => {
      const copy = [...messages];
      let newArr = [];
      for (const e of copy) {
        const Mid = !e.mongoId ? e._id : e.mongoId
        if (Mid !== id) {
          newArr.push(e);
        }
      }
      setMessages(newArr);
    },
    [messages]
  );
  useEffect(() => {
    if (messages.length === 0) {
      handleSidebar(false);
    }
    if (messages.length >= 0) {
      setAmountShown(messages.length);
      handleSidebar(true);
      const elements = messages.map((e, index) => {
        return (
          <Notification
            setAmountShown={setAmountShown}
            removeMessage={removeMessage}
            date={e.Date}
            sender={e.Sender}
            title={e.Title}
            message={e.Message}
            propskey={e.Tntent + index}
            Group={e.Group}
            mongoId={!e.mongoId ? e._id : e.mongoId}
            key={!e.mongoId ? e._id : e.mongoId}
          ></Notification>
        );
      });
      setMessageElements(elements);
    }
  }, [messages, removeMessage, handleSidebar]);

  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1 },
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        zIndex: 500,
      }}
    >
      {/* {messageElements} */}
      {sideBar && <> {messageElements} </>}
      <Fab
        color="primary"
        onClick={(e) => {
          handleSidebar(!sideBar);
        }}
        style={{ marginLeft: "auto" }}
      >
        <Badge
          badgeContent={messages.length}
          color="error"
          overlap="circular"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <NotificationsIcon
            style={{ color: "white" }}
            sx={{ fontSize: "1.8rem !important" }}
          />
        </Badge>
      </Fab>
    </Box>
  );
}