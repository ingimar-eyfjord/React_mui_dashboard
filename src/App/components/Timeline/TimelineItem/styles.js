import borders from "assets/theme/base/borders";
function timelineItem(theme, ownerState) {
  const { lastItem, isDark } = ownerState;

  const { borderWidth, borderColor } = borders;

  return {
    "&:after": {
      content: !lastItem && "''",
      position: "absolute",
      top: "2rem",
      left: "11.5rem",
      height: "100%",
      opacity: isDark ? 0.1 : 1,
      borderRight: `${borderWidth[2]} solid ${borderColor}`,
    },
  };
}

export default timelineItem;
