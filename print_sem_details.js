import { buildFullCalendar } from "./src/utils/calendarBuilder.js";

const apiKey = "AIzaSyD8iLzk973U9wRlSUR48jBy_xRPk_QeBJ0";
const commencementDate = "2024-08-27";

async function run() {
  const data = await buildFullCalendar(commencementDate, apiKey);
  const sem2 = data.semesters.find(s => s.name === "II Semester");
  console.log("=== II SEMESTER EVENTS ===");
  sem2.events.forEach(e => {
    console.log(`${e.name}: ${e.start.toISOString().split('T')[0]} to ${e.end ? e.end.toISOString().split('T')[0] : 'null'}`);
  });
}

run();
