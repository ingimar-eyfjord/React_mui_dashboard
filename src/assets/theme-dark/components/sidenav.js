// Material Dashboard 2 React helper functions
import colors from "assets/theme-dark/base/colors";
import pxToRem from "assets/theme/functions/pxToRem";
const hexToRgb = (input) => {
  input = input + "";
  input = input.replace("#", "");
  let hexRegex = /[0-9A-Fa-f]/g;
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error("input is not a valid hex color.");
  }
  if (input.length === 3) {
    let first = input[0];
    let second = input[1];
    let last = input[2];
    input = first + first + second + second + last + last;
  }
  input = input.toUpperCase();
  let first = input[0] + input[1];
  let second = input[2] + input[3];
  let last = input[4] + input[5];
  return (
    parseInt(first, 16) +
    ", " +
    parseInt(second, 16) +
    ", " +
    parseInt(last, 16)
  );
};
const {background, white } = colors;

const sidenav = {
  styleOverrides: {
    root: {
      width: pxToRem(250),
      whiteSpace: "nowrap",
      border: "none",
      marginRight: "1rem",
    },
    paper: {
      width: pxToRem(250),
      height: `100vh`,
      margin: 0,
      borderRadius: 0,
      border: "none",
      background: `${background.card} !important`,
      "&:before": {
        position: "absolute",
        content: '""',
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
        background: "rgba(" +
        hexToRgb(white.main) +
        ", 0.16)",
        // background:
        // "linear-gradient(45deg, " + blackColor + ", " + infoColor[1] + ") !important",
        color: "unset",
        zIndex: `${0} !important`,
      },
    },
    paperAnchorDockedLeft: {
      borderRight: "none",
    },
  },
};

export default sidenav;
