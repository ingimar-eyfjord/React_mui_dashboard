import { useState, useEffect, useContext } from "react";
import MDSnackbar from "App/components/MDSnackbar";
import moment from "moment";
import { GlobalState } from "context/store";
import { useDebouncedCallback } from "App/Functions/debounce";

export default function Notification() {
  const [Notification, setNotification] = useContext(GlobalState);
  const [errorSB, setErrorSB] = useState(false);
  const closeErrorSB = () => setErrorSB(false);

  const debounce = useDebouncedCallback((callback, value) => {
    setNotification({Notification:false});
    callback(value);
  }, 10000);

  useEffect(() => {
    setErrorSB(true)
    return () => {
      debounce(setErrorSB, false);
    };
  }, [Notification.Notification, debounce]);

  const renderErrorSB = (
    <MDSnackbar
      color={Notification.Notification.color}
      icon={Notification.Notification.icon}
      title={Notification.Notification.title}
      content={Notification.Notification.content}
      dateTime={moment(Notification.Notification.time).fromNow()}
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );
  return <> {errorSB && renderErrorSB} </>;
}
