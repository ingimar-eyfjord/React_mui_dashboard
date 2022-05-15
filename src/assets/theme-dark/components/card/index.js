// Material Dashboard 2 React Base Styles
import colors from "assets/theme-dark/base/colors";
import borders from "assets/theme-dark/base/borders";
import boxShadows from "assets/theme-dark/base/boxShadows";
import rgba from "assets/theme-dark/functions/rgba";
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

// Material Dashboard 2 React Helper Function

const { black, background, white } = colors;
const { borderWidth, borderRadius } = borders;
const { md } = boxShadows;

const card = {
  styleOverrides: {
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minWidth: 0,
      wordWrap: "break-word",
      backgroundImage: "none",
      backgroundColor: `${background.card} !important`,
      backgroundClip: "border-box",
      border: `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
      borderRadius: borderRadius.xl,
      boxShadow: md,
      overflow: "visible",
      color: `${white.main} !important`,
      zIndex: `${5} !important`,
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
        borderRadius: borderRadius.xl,
      },
    },
  },
};

export default card;
