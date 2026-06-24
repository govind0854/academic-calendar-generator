import { getGridCellColorConfig } from "../data/eventColors.js";

export const getCellStyles = (dayObj) => {
  if (dayObj && dayObj.event) {
    const colorConfig = getGridCellColorConfig(dayObj.event.name);
    if (colorConfig) {
      return {
        backgroundColor: colorConfig.bg,
        color: colorConfig.text,
      };
    }
  }
  return {};
};


export const getCellContent = (dayObj) => {
  if (dayObj.isOutsideSemester) return "";
  if (dayObj.isBlank) return "-";
  if (dayObj.event) return dayObj.date.getDate();
  if (!dayObj.isInstructional) return "-";
  return dayObj.date.getDate();
};