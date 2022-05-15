import colors from "assets/theme/base/colors";
const { white, dark } = colors;

const dashboardStyle = {
  upArrowCardCategory: {
    width: "16px",
    height: "16px",
  },
  stats: {
    display: "inline-flex",
    fontSize: "14px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px",
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px",
    },
  },
  cardCategory: {
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0",
  },
  calendarWeekNames:{
    margin: "0",
    fontSize: "10px",
    marginTop: "0",
    paddingTop: "5px",
    marginBottom: "0",
    fontWeight: 500
  },
  calendarDates:{
    margin: "0",
    fontSize: "10px",
    marginTop: "0",
    paddingTop: "5px",
    marginBottom: "10px",
    fontWeight: 400
  },
  calendarText:{
    margin: "0",
    fontSize: "12px",
    marginTop: "0",
    paddingTop: "5px",
    marginBottom: "0",
    fontWeight: 400
  },
 
  menuTitles: {
    margin: "0",
    fontSize: "16px",
    marginTop: "0",
    paddingTop: "0",
    marginBottom: "0",
  },
  cardCategoryWhite: {
    fontWeight: "800",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
    color: white.main,
  },
  cardTitle: {
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "600",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  cardEmailContainer: {
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
    color: dark.main,
    "& *": {
      fontWeight: "600",

      fontSize: "14px",
      color: dark.main,
      lineHeight: "1",
    },
  },
  cardEmailContainerDark: {
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
    color: `${white.main} !important`,
    "& *": {
      fontWeight: "600",
      fontSize: "14px",
      color: `${white.main} !important`,
      lineHeight: "1",
    },
    "& p": {
      fontWeight: "400",
    },
    "& .person-root, mgt-person .person-root": {
      color: `${white.main} !important`,
    },
    "& span": {
      backgroundColor: `transparent !important`,
    },
    
  },
  cardTitleWhite: {
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "600",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    color: "white",
    "& small": {
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  cardTitleForViews: {
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "600",
    fontSize: "2rem",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      fontWeight: "400",
      lineHeight: "1",
    },
  },

};

export default dashboardStyle;
