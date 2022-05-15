import  { useEffect, useCallback,  useState } from "react";
// Dashboard components
import OrdersOverview from "App/components/OrdersOverview";
import LogsDataService from "services/api_services/logs.service";
import TokenService from "services/api_services/token.service";

export default function UserLogs() {
  const [Logs, setLogs] = useState()
  const GetLogs = useCallback(async () => {
    const APIToken = TokenService.getLocalAccessToken()
    const options = {
      limit: 20,
      offset: 0
    }
    const logs = await LogsDataService.getAllwithOptions(options, APIToken);
    setLogs(logs)
  }, []);

  useEffect(() => {
    GetLogs()
    // eslint-disable-next-line 
  }, []);
  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
    {Logs && 
      <OrdersOverview Logs={Logs} />
    }
    </div>
  );
}
