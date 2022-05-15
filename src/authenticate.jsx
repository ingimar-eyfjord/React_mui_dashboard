import React, { useEffect, useState, useContext, useCallback } from "react";
// import * as microsoftTeams from "@microsoft/teams-js";
// import {useMsal} from "@azure/msal-react";
import { Login } from "@microsoft/mgt-react";
import { GlobalState } from "context/store";
import { Providers, ProviderState } from "@microsoft/mgt";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import EmplyService from "services/api_services/Emply_API_service/user.service";
import TaskDataService from "services/api_services/tasks.service";
import ProjectDataService from "services/api_services/projects.service";
import SupplementDataService from "services/api_services/supplement.service";
import salaryService from "services/api_services/salary.service";
import App from "./App/App";
import { isArray } from "lodash";
import { MaterialUIControllerProvider } from "context";
import { BrowserRouter } from "react-router-dom";
// import { read } from "xlsx";
import LocationsDataService from "services/api_services/locations.service";
import AuthService from "services/api_services/auth.service";

let render = 0;
function useIsSignedIn() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const updateState = () => {
      const provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };
    Providers.onProviderUpdated(updateState);
    updateState();
    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    };
  }, []);
  return [isSignedIn];
}

export function TheAppComp() {
  const [AppComp, setApp] = useState(<div>Loading</div>);
  // eslint-disable-next-line
  const [Store, setStore] = useContext(GlobalState);
  const getToken = useCallback(async () => {
    let token;
    try {
      token = await Providers.globalProvider.getAccessToken({
        scopes: ["User.Read"],
      });
    } catch (error) {
      return;
    }
    try {
      await AuthService.login(token);
    } catch (error) {
      return;
    }

    const Allowed = [
      "2d2bf7f2-a7d4-4369-a0a1-5a29f1196021",
      "50f68c58-e648-4c09-b51b-1dfefe2a61b6",
      "1e65c703-3d75-428b-9e04-b54e9b3f16ff",
      "f1930117-4642-4ee7-8b37-96d73c6b2cac",
      "db7d63a6-6372-4220-a004-e917e3bb6951",
      "964d6bb9-19a7-461b-9280-23086cf036a5",
      "f2f7bd59-a656-4d78-a584-975dbae84a7d",
      "ba557698-fcf2-4ca6-897b-5314474ba7b0",
      "060e2d63-0416-4d2b-b454-547b25b7be8c",
      "85e59d17-8afc-4ee4-93ca-54dba960c892",
      "313380e5-b252-4197-badb-d9f2a4ab0e8f",
      "3f605ca9-3892-4f5d-bede-ee047fb79d26",
      "b73a0c32-769f-4d3d-be15-79632f78d430",
      "ad0d3c85-e23b-45fa-afdf-ac59b65c160b",
      "388621d0-278d-4e14-b627-4d49e523ccb0",
      "0e3b3bb2-990e-4369-9839-130878532171",
    ];

    let emplyEmployee;
    let emplyMasterData;
    try {
      emplyEmployee = await EmplyService.GetEmployeeByEmail();
    } catch (error) {
      console.log(error);
    }
    try {
      emplyMasterData = await EmplyService.GetMasterDataID(
        emplyEmployee[0]?.id
      );
    } catch (error) {
      console.log(error);
    }

    let array = [];
    let department;
    if (emplyMasterData !== undefined) {
      for (const e of emplyMasterData) {
        if (Allowed.includes(e.dataTypeId)) {
          if (e.dataTypeId === "388621d0-278d-4e14-b627-4d49e523ccb0") {
            department = e.relations;
          } else {
            array.push(e);
          }
        }
      }
    }

    let currentPeriod = await salaryService.get_current_period();
    const dep = await EmplyService.RetrieveDepartments();
    const emplyUser = await EmplyService.GetUserWUUID();
    const employees = await EmplyService.GetAllEmplyEmployees();
    const users = await EmplyService.GetAllEmplyUsers();
    let departments = {};
    let index = 2;
    let EmployeeDep;

    for (const e of await dep) {
      e.index = index++;
      e.SubDepartments = [];

      if (!e.parentId) {
        departments.HQ = e;
      }
    }

    for (const e of await dep) {
      if (e.parentId) {
        if (e.parentId === departments.HQ.id) {
          e.parentIndex = departments.HQ.index;
          departments.HQ.SubDepartments.push(e);
        }
      }
    }

    for (const e of await dep) {
      if (e.parentId) {
        if (e.parentId !== departments.HQ.id) {
          for (const t of departments.HQ.SubDepartments) {
            if (e.parentId === t.id) {
              e.parentIndex = t.index;
              t.SubDepartments.push(e);
            }
          }
        }
      }
    }

    for (const e of await dep) {
      if (department[0]?.departmentId === e.id) {
        EmployeeDep = e;
      }
      if (e.SubDepartments.length === 0) {
        delete e.SubDepartments;
      }
    }

    const tasks = await TaskDataService.getAll();
    const projects = await ProjectDataService.getAll();
    let Type = await SupplementDataService.GetEverything();
    const locations = await LocationsDataService.getAll();
    const object = {
      FirstName: "2d2bf7f2-a7d4-4369-a0a1-5a29f1196021",
      LastName: "50f68c58-e648-4c09-b51b-1dfefe2a61b6",
      Birthday: "20afabbf-2fa8-4321-9480-4feca9e1b6b2",
      Address: "ba557698-fcf2-4ca6-897b-5314474ba7b0",
      ZIP: "060e2d63-0416-4d2b-b454-547b25b7be8c",
      City: "85e59d17-8afc-4ee4-93ca-54dba960c892",
      Phone: "f1930117-4642-4ee7-8b37-96d73c6b2cac",
      CompanyPhone: "f1930117-4642-4ee7-8b37-96d73c6b2cac",
      PrivateEmail: "f2f7bd59-a656-4d78-a584-975dbae84a7d",
      KeyCard: "3f605ca9-3892-4f5d-bede-ee047fb79d26",
      KeyCardAccNo: "0e3b3bb2-990e-4369-9839-130878532171",
      RegNo: "b73a0c32-769f-4d3d-be15-79632f78d430",
      AccNo: "ad0d3c85-e23b-45fa-afdf-ac59b65c160b",
    };
    for (const g of Object.keys(object)) {
      let res = emplyMasterData.filter((element) => {
        return element.dataTypeId === object[g];
      });
      res = res[0];
      object[g] = res.text
        ? res.text
        : res.number
        ? res.number
        : res.date
        ? res.date
        : "";
    }
    const user = AuthService.getCurrentUser();

    setStore({
      UserDetails: {
        UserUUID: user.id,
        UserEmail: user.email,
        UserName: user.name,
        Department: EmployeeDep,
        EmplyEmployee: emplyEmployee,
        EmplyUser: emplyUser,
        EmplyID: emplyEmployee[0]?.id,
        UserSelfServedMasterData: array,
        EmplyMasterData: emplyMasterData,
        Personal: object,
      },
    });
    setStore({ EmplyEmployees: employees });
    setStore({ EmplyUsers: users });
    setStore({
      Options: {
        Departments: departments,
        Task: tasks,
        Project: projects,
        Type: Type,
        CurrentPeriod: currentPeriod.data[0],
        Locations: locations,
      },
    });
    setStore({
      SalaryOverviewOptions: {
        type: "Normal",
      },
    });
    setApp(
      <BrowserRouter>
        <MaterialUIControllerProvider>
          <App></App>
        </MaterialUIControllerProvider>
      </BrowserRouter>
    );
    // console log master data inside a table
    let arr = [];
    emplyMasterData.forEach((e, index) => {
      let value;
      if (e.text) {
        value = e.text;
      }
      if (e.number) {
        value = e.number;
      }
      if (e.date) {
        value = e.date;
      }
      if (e.options) {
        try {
          value = e.options[0].optionTitle.localization[0];
        } catch (error) {
          value = null;
        }
      }
      if (e.relations) {
        value = e.relations[0].id;
      }
      const table = {
        dataTypeId: e.dataTypeId,
        titleDataType: `${e.titleDataType.localization[0].value}`,
        options: e.options && isArray(e.options) ? e.options[0] : null,
        relations: e.relations && isArray(e.relations) ? e.relations[0] : null,
        value: value,
      };
      arr.push(table);
    });
  }, [setStore]);

  useEffect(() => {
    /// ? old teams login if ends
    const Scopes = [
      "Calendars.Read",
      "Directory.AccessAsUser.All",
      "Directory.Read.All",
      "email",
      "Mail.Read",
      "Group.Read.All",
      "Group.ReadWrite.All",
      "GroupMember.Read.All",
      "GroupMember.ReadWrite.All",
      "Mail.ReadBasic",
      "offline_access",
      "openid",
      "People.Read.All",
      "Presence.Read",
      "Presence.Read.All",
      "profile",
      "Sites.Read.All",
      "Tasks.Read",
      "Tasks.ReadWrite",
      "User.Read",
      "User.Read.All",
      "User.ReadBasic.All",
      "User.ReadWrite",
      "User.ReadWrite.All",
    ];
    const config = {
      redirectUri: `${window.location.origin}`,
      authority:
        "https://login.microsoftonline.com/dd9fe8e0-ee42-4b62-b9a4-b796431bfdfe",
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
      },
      scopes: Scopes,
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true,
      clientId: "380f1112-8e95-4f6e-bd18-9a3e44ca9272",
    };
    Providers.globalProvider = new Msal2Provider(config);

  }, []);

  const [isSignedIn] = useIsSignedIn();

  useEffect(() => {
    if (isSignedIn && render === 0) {
      getToken();
      render++;
    }
    // eslint-disable-next-line
  }, [isSignedIn]);

  const user = AuthService.getCurrentUser();
  if (isSignedIn) {
    if (user) {
      return (
        <React.Suspense fallback={<div> Loading</div>}>
          {AppComp}
        </React.Suspense>
      );
    } else {
      return (
        <div className='NotAuthorized'>
          <div>Please wait</div>
        </div>
      );
    }
  }
  if (!isSignedIn) {
    return (
      <div className='NotAuthorized'>
        <div className='logo'>
          <div className='logoForHeader'></div>
        </div>
        <h3>Welcome to Dialogue Time</h3>
        <Login></Login>
      </div>
    );
  }
}
export default TheAppComp;
