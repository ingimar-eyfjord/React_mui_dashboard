import { useEffect, useCallback, useContext, useState } from "react";
// Dashboard components
import OrdersOverview from "App/components/OrdersOverview";
import LogsDataService from "services/api_services/logs.service";
import { GlobalState } from "context/store";

export default function UserLogs() {
  const [Store] = useContext(GlobalState);
  const [Logs, setLogs] = useState()
  const GetLogs = useCallback(async () => {
    
    const UserUUID = Store.UserDetails.UserUUID;
    const logs = await LogsDataService.GetLogsForUser(UserUUID, 5);
    setLogs(logs.data)
  }, [Store]);

  useEffect(() => {
    GetLogs()
    // eslint-disable-next-line 
  }, []);
  return (
    <>
    {Logs && 
      <OrdersOverview Logs={Logs} />
    }
    </>
  );
}
