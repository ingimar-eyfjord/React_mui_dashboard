// Material Dashboard 2 React helper functions
import pxToRem from "assets/theme/functions/pxToRem";
const sidenav = {
  styleOverrides: {
    root: {
      width: pxToRem(250),
      whiteSpace: "nowrap",
      border: "none",
      marginRight: "1rem",
      background: "unset !important",
    },
    paper: {
      width: pxToRem(250),
      height: `100vh`,
      margin: 0,
      borderRadius: 0,
      border: "none",
    },
    paperAnchorDockedLeft: {
      borderRight: "none",
    },
  },
};

export default sidenav;
