import colors from "assets/theme-dark/base/colors";
const { white } = colors;

const buttonBase = {
  defaultProps: {
    disableRipple: false,
  },
  styleOverrides: {
    root: {
      color: white.main,
    },
  },
};

export default buttonBase;
