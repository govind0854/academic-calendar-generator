import { addDays } from "./dateUtils.js";
import { VACATION_RULES } from "../data/vacationRules.js";

const getPreviousSunday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 7 : day;
  d.setDate(d.getDate() - diff);
  return d;
};

const getFollowingSunday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 7 : (7 - day);
  d.setDate(d.getDate() + diff);
  return d;
};

export const generateVacationsFromHolidays = (
  holidays
) => {

  const vacations = [];
  const seenYearsDasara = new Set();
  const seenYearsSankranti = new Set();

  // Sort holidays to ensure consistent ordering
  const sortedHolidays = [...holidays].sort((a, b) => a.date - b.date);

  sortedHolidays.forEach(h => {
    const nameLower = h.name.toLowerCase();
    const year = h.date.getFullYear();

    if (nameLower.includes("dussehra") || nameLower.includes("vijaya dashami")) {
      if (!seenYearsDasara.has(year)) {
        seenYearsDasara.add(year);
        const start = getPreviousSunday(h.date);
        const end = getFollowingSunday(h.date);
        vacations.push({
          name: "Dasara Holidays",
          start,
          end
        });
      }
    } else if (nameLower.includes("makar sankranti") || nameLower.includes("pongal") || nameLower.includes("sankranti")) {
      if (!seenYearsSankranti.has(year)) {
        seenYearsSankranti.add(year);
        const start = getPreviousSunday(h.date);
        const end = getFollowingSunday(h.date);
        vacations.push({
          name: "Sankranthi Holidays",
          start,
          end
        });
      }
    }
  });

  return vacations;
};