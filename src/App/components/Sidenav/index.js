import { useEffect } from "react";
// react-router-dom components
import { useLocation, Link } from "react-router-dom";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";
// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Material Dashboard 2 React components
import MDBox from "App/components/MDBox";
import Typography from "App/components/Typography";
// Material Dashboard 2 React example components
import SidenavCollapse from "App/components/Sidenav/SidenavCollapse";
import styles from "App/components/classes";
// Custom styles for the Sidenav
import SidenavRoot from "App/components/Sidenav/SidenavRoot";
import sidenavLogoLabel from "App/components/Sidenav/styles/sidenav";
import { makeStyles } from "@material-ui/styles";
// Material Dashboard 2 React context
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import TokenService from "services/api_services/token.service";

const useStyles = makeStyles(styles);
function Sidenav({ color, brand, brandName, routes, handleDarkMode, ...rest }) {
  const icons = {
    Schedule: (
      <AccessTimeFilledIcon
        style={{ minWidth: "40px", color: "white" }}
      ></AccessTimeFilledIcon>
    ),
    Hours: (
      <HourglassFullIcon
        style={{ minWidth: "40px", color: "white" }}
      ></HourglassFullIcon>
    ),
    Admins: (
      <AdminPanelSettingsIcon
        style={{ minWidth: "40px", color: "white" }}
      ></AdminPanelSettingsIcon>
    ),
  };
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const location = useLocation();
  const collapseName = location.pathname;
  let textColor = "white";
  const classes = useStyles();
  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }
  const closeSidenav = () => setMiniSidenav(dispatch, true);
  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : transparentSidenav
      );
      setWhiteSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : whiteSidenav
      );
    }
    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);
    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
    // eslint-disable-next-line
  }, [dispatch, location]);
  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map((e, index) => {
    if (e[0].type === "divider") {
      return (
        <Divider
          key={e.key}
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
        />
      );
    } else if (e.length === 1) {
      return e.map(
        ({ type, name, icon, title, noCollapse, key, href, route }) => {
          if (type === "collapse") {
            return (
              <Link key={key} to={route}>
                <SidenavCollapse
                  name={name}
                  icon={icon}
                  active={route === collapseName}
                />
              </Link>
            );
          }else{
            return null
          }
        }
      );
    } else {
      let roles = TokenService.getRoles()
      if (e.some((code) => code.parent === "Admins"))
      
        if (!roles.includes('admin')) {
          return null;
        }
      return (
        <Accordion
          sx={{ background: "transparent", border: "unset", boxShadow: "none" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            sx={{ border: "unset", color: "white !important" }}
          >
            <ListItemIcon>{icons[e[0].parent]}</ListItemIcon>
            <p className={classes.menuTitles}>{e[0].parent}</p>
          </AccordionSummary>
          <AccordionDetails>
            {e.map(
              ({ type, name, icon, title, noCollapse, key, href, route }) => {
                let returnValue;
                if (type === "collapse") {
                  returnValue = href ? (
                    <Link
                      key={key}
                      to={route}
                      target='_blank'
                      rel='noreferrer'
                      sx={{ textDecoration: "none" }}
                    >
                      <SidenavCollapse
                        name={name}
                        icon={icon}
                        active={route === collapseName}
                        noCollapse={noCollapse}
                      />
                    </Link>
                  ) : (
                    <Link key={key} to={route}>
                      <SidenavCollapse
                        name={name}
                        icon={icon}
                        active={route === collapseName}
                      />
                    </Link>
                  );
                } else if (type === "title") {
                  returnValue = (
                    <Typography
                      key={key}
                      color={textColor}
                      display='block'
                      variant='caption'
                      fontWeight='bold'
                      textTransform='uppercase'
                      pl={3}
                      mt={2}
                      mb={1}
                      ml={1}
                    >
                      {title}
                    </Typography>
                  );
                } else if (type === "divider") {
                  return (
                    <Divider
                      key={key}
                      light={
                        (!darkMode && !whiteSidenav && !transparentSidenav) ||
                        (darkMode && !transparentSidenav && whiteSidenav)
                      }
                    />
                  );
                }
                return returnValue;
              }
            )}
          </AccordionDetails>
        </Accordion>
      );
    }
  });
  return (
    <SidenavRoot
      {...rest}
      variant='permanent'
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign='center'>
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position='absolute'
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <Typography variant='h6' color='secondary'>
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </Typography>
        </MDBox>
        <MDBox
          component={Link}
          to='/'
          display='flex'
          style={{ flexDirection: "column" }}
          justifyContent='center'
        >
          {brand && (
            <MDBox
              component='img'
              src={brand}
              alt='Brand'
              height='auto'
            />
          )}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          ></MDBox>
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
      <MDBox p={2} mt='auto'>
        {/* <SwitchDarkMode
          darkMode={darkMode}
          handleDarkMode={handleDarkMode}
        ></SwitchDarkMode> */}
      </MDBox>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
