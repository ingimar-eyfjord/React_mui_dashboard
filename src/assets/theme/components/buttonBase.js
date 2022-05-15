import colors from "assets/theme-dark/base/colors";
const { dark } = colors;

const buttonBase = {
  defaultProps: {
    disableRipple: false,
  },
  styleOverrides: {
    root: {
      color: dark.main,
    },
  },
};

export default buttonBase;
