import { buildFullCalendar } from "./src/utils/calendarBuilder.js";

const apiKey = "AIzaSyD8iLzk973U9wRlSUR48jBy_xRPk_QeBJ0";
const commencementDate = "2025-08-25";

const officialTotals = {
  "I Semester": 115,
  "II Semester": 112,
  "III Semester": 121,
  "IV Semester": 117,
  "Summer Semester": 46, // S1
  "V Semester": 122,
  "VI Semester": 119,
  "Summer Semester (S2)": 46, // S2
  "VII Semester": 123,
  "VIII Semester": 105
};

async function run() {
  try {
    const data = await buildFullCalendar(commencementDate, apiKey);
    console.log("=== WORKING DAYS COMPARISON ===");
    let summerCount = 0;
    data.semesters.forEach(sem => {
      let key = sem.name;
      if (sem.name === "Summer Semester") {
        summerCount++;
        if (summerCount === 2) {
          key = "Summer Semester (S2)";
        }
      }
      const official = officialTotals[key];
      const generated = sem.gridData.dayTotals.reduce((a, b) => a + b, 0);
      console.log(`Semester: ${sem.name} (${key})`);
      console.log(`  Official: ${official}`);
      console.log(`  Generated: ${generated}`);
      console.log(`  Difference: ${generated - official} days`);
      console.log(`  Holidays Count: ${sem.holidaysList.length}`);
      console.log("--------------------------------");
    });
  } catch (err) {
    console.error("Error running calendar simulation:", err);
  }
}

run();
