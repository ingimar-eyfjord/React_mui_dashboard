import colors from "assets/theme-dark/base/colors";

const { white } = colors;

const link = {
  styleOverrides: {
    root: {
      color: `${white.main} !important`,
      "& p": {
        color: 'white !important'
      }
    },
  },
  defaultProps: {
    underline: "none",
    color: `${white.main} !important`,
  },
};

export default link;
