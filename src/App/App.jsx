import { useEffect, useState, useCallback, useContext } from "react";
import { GlobalState } from "context/store";
import { ModalProvider } from "App/components/Modals/modalContext";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import gbLocale from "date-fns/locale/en-GB";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MDBox from "App/components/MDBox";
import { NotificationBot } from "./Websocket";
// Theming
import Icon from "@mui/material/Icon";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import routes from "App/routes";
import Sidenav from "App/components/Sidenav";
import brandWhite from "assets/img/logo.png";
import brandDark from "assets/img/logo.png";
// import forOfor from "assets/img/notifications/404.png";
import "assets/css/mgt.css";
import Notification from "App/components/Notification";
import Configurator from "App/components/Configurator";
import TokenService from "services/api_services/token.service";

export default function App() {
  const [Store, setStore] = useContext(GlobalState);

  const getGraphData = useCallback(async () => {
    let roles = await TokenService.getRoles();
    setTimeout(() => {
      setStore({ Roles: roles });
    }, 500);
  }, [setStore]);

  useEffect(() => {
    getGraphData();
    // eslint-disable-next-line
  }, []);

  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // const configsButton = (
  //   <MDBox
  //     display='flex'
  //     justifyContent='center'
  //     alignItems='center'
  //     width='3.25rem'
  //     height='3.25rem'
  //     bgColor='white'
  //     shadow='sm'
  //     borderRadius='50%'
  //     position='fixed'
  //     right='2rem'
  //     bottom='2rem'
  //     zIndex={99}
  //     color='dark'
  //     sx={{ cursor: "pointer" }}
  //     onClick={handleConfiguratorOpen}
  //   >
  //     <Icon fontSize='small' color='inherit'>
  //       settings
  //     </Icon>
  //   </MDBox>
  // );
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Attach the scroll listener to the div

  const getRoutes = (allRoutes) => {
    let Routes = [];
    allRoutes.map((e) => {
      return e.map((t) => {
        if (t.type === "collapse") {
          return Routes.push(t);
        }else{
          return null
        }
      });
    });
    return Routes.map((route) => {
      return (
        <Route
          exact
          path={route.subroute}
          // render={() => route.component}
          element={route.component}
          key={route.key}
        />
      );
    });
  };
  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <ModalProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={gbLocale}>
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={
                  (transparentSidenav && !darkMode) || whiteSidenav
                    ? brandDark
                    : brandWhite
                }
                brandName='Dialogue Time'
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />

              {/* <Configurator />
              {configsButton} */}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            {getRoutes(routes)}
            <Route path='*' element={<Navigate to='/Dashboard' />} />
          </Routes>
          {Store.Notification && <Notification></Notification>}
          <NotificationBot></NotificationBot>
        </ThemeProvider>
      </LocalizationProvider>
    </ModalProvider>
  );
}
