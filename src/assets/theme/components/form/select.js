
// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";


const { transparent } = colors;

const select = {
  styleOverrides: {
    select: {
      display: "grid",
      alignItems: "center",
      backgroundColor: "white !important",
      // padding: `0 ${pxToRem(12)} !important`,
      minWidth: "10rem",
      "& .Mui-selected":{
        backgroundColor: transparent.main,
      },
     
    },
    // "& .MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper":{
    //   backgroundColor: `white !important`,
    // },
    selectMenu: {
      backgroundColor: "white !important",
      height: "none",
      minHeight: "none",
      overflow: "unset",
    },
    icon: {
      display: "none",
    },
  },
};

export default select;
