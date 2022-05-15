
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
// @mui material components
// Material Dashboard 2 React components
import MDBox from "App/components/MDBox";
import MDTypography from "App/components/Typography";
// Timeline context
import { useTimeline } from "../context";
import {
  Person,
  PersonViewType,
  PersonCardInteraction,
} from "@microsoft/mgt-react";
// Custom styles for the TimelineItem
import timelineItem from "./styles";

function TimelineItem({ color, type, title, dateTime, description, lastItem, TransactionID, Account }) {
  const isDark = useTimeline();

  return (
    <MDBox position="relative" mb={3} sx={(theme) => timelineItem(theme, { lastItem, isDark })}>
     
     <MDBox ml={0} pt={description ? 0.7 : 0} lineHeight={0} maxWidth="9rem" style={{textAlign:"right"}} >
       
        <MDTypography   variant="button" fontWeight="medium" color={isDark ? "white" : "dark"}>
          {title}
        </MDTypography>
        <MDBox mt={0.5}>
          <MDTypography variant="caption" color={isDark ? "secondary" : "text"}>
            {dateTime}
          </MDTypography>
        </MDBox>
        <MDBox mt={0.5} mb={1.5}>
          {TransactionID ? (
            <MDTypography variant="button" color={isDark ? "white" : "dark"}>
              Transaction ID {TransactionID}
            </MDTypography>
          ) : null}
        </MDBox>

      </MDBox>
      <MDBox
        display="flex"
        // justifyContent="center"
        alignItems="center"
        // bgColor={color}
        // color="white"
        // width="2rem"
        // height="2rem"
        // borderRadius="50%"
        position="absolute"
        top="0%"
        left="10rem"
        zIndex={2}
        sx={{ fontSize: ({ typography: { size } }) => size.sm }}
      >
        {/* {type === "logged" ? <AddIcon></AddIcon> : <EditIcon></EditIcon>} */}

        <div style={{alignSelf:"flex-end"}} >
          <Person
            view={PersonViewType.twolines}
            showPresence={true}
            line1Property='givenName'
            personCardInteraction={PersonCardInteraction.hover}
            userId={Account}></Person>
        </div>

      </MDBox>

      

    </MDBox>
  );
}

// Setting default values for the props of TimelineItem
TimelineItem.defaultProps = {
  color: "info",
  lastItem: false,
  description: "",
};

// Typechecking props for the TimelineItem
TimelineItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  description: PropTypes.string,
  lastItem: PropTypes.bool,
};

export default TimelineItem;
