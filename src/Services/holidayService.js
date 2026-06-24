// Static holiday and vacation data for exact alignment with the 2025 Admitted Batch PDF

const parseDate = (dStr) => {
  const parts = dStr.split('.');
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

export const STATIC_HOLIDAYS = [
  // Semester I (A.Y: 2025-26)
  { name: "Independence Day", date: parseDate("15.08.2025"), type: "holiday" },
  { name: "Sri Krishna Ashtami", date: parseDate("16.08.2025"), type: "holiday" },
  { name: "Vinayaka Chavithi", date: parseDate("27.08.2025"), type: "holiday" },
  { name: "Eid-Milad-un-Nabi", date: parseDate("05.09.2025"), type: "holiday" },
  { name: "Deepavali", date: parseDate("20.10.2025"), type: "holiday" },
  { name: "Christmas", date: parseDate("25.12.2025"), type: "holiday" },
  { name: "New Year", date: parseDate("01.01.2026"), type: "holiday" },

  // Semester II (A.Y: 2025-26)
  { name: "Holi", date: parseDate("04.03.2026"), type: "holiday" },
  { name: "Ugadi", date: parseDate("20.03.2026"), type: "holiday" },
  { name: "Ramzan", date: parseDate("21.03.2026"), type: "holiday" },
  { name: "Sri Ramanavami", date: parseDate("26.03.2026"), type: "holiday" },
  { name: "Good Friday", date: parseDate("03.04.2026"), type: "holiday" },
  { name: "Dr. B.R. Ambedkar’s Birthday", date: parseDate("14.04.2026"), type: "holiday" },
  { name: "Bakrid", date: parseDate("27.05.2026"), type: "holiday" },
  { name: "Moharram", date: parseDate("26.06.2026"), type: "holiday" },

  // Semester III (A.Y: 2026-27)
  { name: "Independence Day", date: parseDate("15.08.2026"), type: "holiday" },
  { name: "Eid-Milad-un Nabi", date: parseDate("25.08.2026"), type: "holiday" },
  { name: "Sri Krishna Ashtami", date: parseDate("04.09.2026"), type: "holiday" },
  { name: "Vinayaka Chavithi", date: parseDate("15.09.2026"), type: "holiday" },
  { name: "Mahatma Gandhi Jayanthi", date: parseDate("02.10.2026"), type: "holiday" },

  // Semester IV (A.Y: 2026-27)
  { name: "Christmas", date: parseDate("25.12.2026"), type: "holiday" },
  { name: "NewYear", date: parseDate("01.01.2027"), type: "holiday" },
  { name: "Republic day", date: parseDate("26.01.2027"), type: "holiday" },
  { name: "Maha Shivaratri", date: parseDate("06.03.2027"), type: "holiday" },
  { name: "Ramzan/ Eid-ul-Fitr", date: parseDate("10.03.2027"), type: "holiday" },
  { name: "Holi", date: parseDate("22.03.2027"), type: "holiday", excludeFromGrid: true },
  { name: "Good Friday", date: parseDate("26.03.2027"), type: "holiday" },
  { name: "Ugadi", date: parseDate("08.04.2027"), type: "holiday" },
  { name: "Dr. B.R. Ambedkar’s Birthday", date: parseDate("14.04.2027"), type: "holiday" },
  { name: "Sri Rama Navami", date: parseDate("15.04.2027"), type: "holiday" },

  // Summer Semester 1 (A.Y: 2026-27)
  { name: "Bakrid", date: parseDate("17.05.2027"), type: "holiday" },
  { name: "Muharram", date: parseDate("15.06.2027"), type: "holiday" },

  // Semester V (A.Y: 2027-28)
  { name: "Sri Krishna Ashtami", date: parseDate("25.08.2027"), type: "holiday" },
  { name: "Vinayaka Chavithi", date: parseDate("04.09.2027"), type: "holiday" },
  { name: "Mahatma Gandhi Jayanthi", date: parseDate("02.10.2027"), type: "holiday" },
  { name: "Deepavali", date: parseDate("29.10.2027"), type: "holiday" },

  // Semester VI (A.Y: 2027-28)
  { name: "Christmas", date: parseDate("25.12.2027"), type: "holiday" },
  { name: "NewYear", date: parseDate("01.01.2028"), type: "holiday", excludeFromGrid: true },
  { name: "Republic day", date: parseDate("26.01.2028"), type: "holiday" },
  { name: "Maha Shivaratri", date: parseDate("23.02.2028"), type: "holiday" },
  { name: "Holi", date: parseDate("10.03.2028"), type: "holiday" },
  { name: "Ugadi", date: parseDate("27.03.2028"), type: "holiday" },
  { name: "Srirama Navami", date: parseDate("04.04.2028"), type: "holiday" },
  { name: "Good Friday & Dr. B.R. Ambedkar’s Birthday", date: parseDate("14.04.2028"), type: "holiday" },

  // Summer Semester 2 (A.Y: 2027-28)
  { name: "Bakrid", date: parseDate("05.05.2028"), type: "holiday" },
  { name: "Muharram", date: parseDate("03.06.2028"), type: "holiday" },

  // Semester VII (A.Y: 2028-29)
  { name: "Eid-Milad-un Nabi", date: parseDate("03.08.2028"), type: "holiday" },
  { name: "Independence Day", date: parseDate("15.08.2028"), type: "holiday" },
  { name: "Vinayaka Chavithi", date: parseDate("23.08.2028"), type: "holiday" },
  { name: "Mahatma Gandhi Jayanthi", date: parseDate("02.10.2028"), type: "holiday", excludeFromGrid: true },
  { name: "Deepavali", date: parseDate("17.10.2028"), type: "holiday", excludeFromGrid: true },

  // Semester VIII (A.Y: 2028-29)
  { name: "Christmas", date: parseDate("25.12.2028"), type: "holiday" },
  { name: "NewYear", date: parseDate("01.01.2029"), type: "holiday" },
  { name: "Republic day", date: parseDate("26.01.2029"), type: "holiday" },
  { name: "Ramzan", date: parseDate("15.02.2029"), type: "holiday" },
  { name: "Holi", date: parseDate("01.03.2029"), type: "holiday" },
  { name: "Ugadi", date: parseDate("16.03.2029"), type: "holiday" },
  { name: "Good Friday", date: parseDate("30.03.2029"), type: "holiday" },
  { name: "Dr. B.R. Ambedkar’s Birthday", date: parseDate("14.04.2029"), type: "holiday" }
];

export const STATIC_VACATIONS = [
  // Semester I (A.Y: 2025-26)
  { name: "Dasara Holidays", start: parseDate("28.09.2025"), end: parseDate("05.10.2025"), type: "vacation" },
  { name: "Sankranthi Holidays", start: parseDate("11.01.2026"), end: parseDate("18.01.2026"), type: "vacation" },

  // Semester II (A.Y: 2025-26)
  { name: "Summer Vacation", start: parseDate("18.05.2026"), end: parseDate("30.05.2026"), type: "vacation" },

  // Semester III (A.Y: 2026-27)
  { name: "Dasara Holidays", start: parseDate("18.10.2026"), end: parseDate("25.10.2026"), type: "vacation" },

  // Semester IV (A.Y: 2026-27)
  { name: "Pongal", start: parseDate("10.01.2027"), end: parseDate("17.01.2027"), type: "vacation" },

  // Semester V (A.Y: 2027-28)
  { name: "Dasara Holidays", start: parseDate("03.10.2027"), end: parseDate("10.10.2027"), type: "vacation" },

  // Semester VI (A.Y: 2027-28)
  { name: "Pongal", start: parseDate("09.01.2028"), end: parseDate("16.01.2028"), type: "vacation" },

  // Semester VII (A.Y: 2028-29)
  { name: "Dasara Holidays", start: parseDate("24.09.2028"), end: parseDate("01.10.2028"), type: "vacation" },

  // Semester VIII (A.Y: 2028-29)
  { name: "Pongal", start: parseDate("13.01.2029"), end: parseDate("21.01.2029"), type: "vacation" }
];

export const fetchLiveHolidays = async (startYear, endYear, apiKey) => {
  // Return the static list directly to align perfectly with the PDF
  return STATIC_HOLIDAYS;
};