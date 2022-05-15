// Material Dashboard 2 React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

// Material Dashboard 2 React base styles
import boxShadows from "assets/theme/base/boxShadows";
import borders from "assets/theme/base/borders";

const { lg } = boxShadows;
const { borderRadius } = borders;

const popover = {
  styleOverrides: {
    paper: {
      backgroundColor: `white !important`,
      boxShadow: `${lg} !important`,
      padding: `${pxToRem(8)} !important`,
      borderRadius: `${borderRadius.md} !important`,
    },
  },
};

export default popover;
