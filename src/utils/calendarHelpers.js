import { EVENT_COLORS } from "../data/eventColors";

export const getCellStyles = (dayObj) => {
  if (dayObj.event) {
    const colorConfig = EVENT_COLORS.find(
      (c) => dayObj.event.name.includes(c.keyword)
    );

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
  if (dayObj.event) return dayObj.date.getDate();
  if (!dayObj.isInstructional) return "-";
  return dayObj.date.getDate();
};