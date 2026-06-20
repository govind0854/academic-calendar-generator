import { UNIVERSITY_HOLIDAYS } from "../data/universityHolidays.js";
import { generateExtraHolidays } from "../data/extraHolidays.js";

export const fetchLiveHolidays = async (
  startYear,
  endYear,
  apiKey
) => {
  const calendarId = encodeURIComponent(
    "en.indian#holiday@group.v.calendar.google.com"
  );

  const timeMin = new Date(
    startYear,
    0,
    1
  ).toISOString();

  const timeMax = new Date(
    endYear,
    11,
    31
  ).toISOString();

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
    `?key=${apiKey}` +
    `&timeMin=${timeMin}` +
    `&timeMax=${timeMax}` +
    `&singleEvents=true` +
    `&orderBy=startTime`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(
  "Google Holidays:",
  data.items?.map(item => item.summary)
);

    if (!data.items) {
      return [];
    }

  const holidays = data.items
  .map(item => ({
    date: new Date(
      item.start.date ||
      item.start.dateTime
    ),
    name: item.summary
  }))
  .filter(
    holiday =>
      holiday.name !== "Holika Dahana"  && holiday.name !== "Parsi New Year"
  )
  .filter(holiday =>
    UNIVERSITY_HOLIDAYS.some(
      approvedHoliday =>
        holiday.name
          .toLowerCase()
          .includes(
            approvedHoliday.toLowerCase()
          )
    )
  );
  const seenDates = new Set();
  const uniqueHolidays = holidays.filter(holiday => {
    if (holiday.name === "Janmashtami (Smarta)") return false;
    const dayStr = holiday.date.toDateString();
    if (seenDates.has(dayStr)) return false;
    seenDates.add(dayStr);
    return true;
  });

  console.log("University Holidays:", uniqueHolidays);
  console.log("Filtered Holidays (Deduplicated):", uniqueHolidays);
  
  const extraHolidays = generateExtraHolidays(startYear, endYear);

  return [
    ...uniqueHolidays,
    ...extraHolidays
  ];

  } catch (error) {

    console.error(
      "Failed to fetch holidays:",
      error
    );

    alert(
      "API Error: Check your API Key or Internet Connection."
    );

    return [];
  }
};