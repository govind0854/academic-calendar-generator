export const generateExtraHolidays = (
  startYear,
  endYear
) => {
  const holidays = [];

  for (let year = startYear; year <= endYear; year++) {

    holidays.push({
      date: new Date(year, 9, 2), // October 2
      name: "Gandhi Jayanti"
    });

    holidays.push({
      date: new Date(year, 11, 25), // December 25
      name: "Christmas"
    });

    // Babu Jagjivan Ram's Birthday: April 5
    holidays.push({
      date: new Date(year, 3, 5),
      name: "Babu Jagjivan Ram's Birthday"
    });

  }

  // Eid-Milad-un-Nabi specific historical dates
  holidays.push({ date: new Date(2024, 8, 16), name: "Eid-Milad-un-Nabi" });
  holidays.push({ date: new Date(2025, 8, 5), name: "Eid-Milad-un-Nabi" });
  holidays.push({ date: new Date(2026, 7, 25), name: "Eid-Milad-un-Nabi" });

  return holidays;
};