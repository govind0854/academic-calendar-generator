import { buildFullCalendar } from "./src/utils/calendarBuilder.js";

const apiKey = "AIzaSyD8iLzk973U9wRlSUR48jBy_xRPk_QeBJ0";
const commencementDate = "2024-08-27";

async function main() {
  const data = await buildFullCalendar(commencementDate, apiKey);
  data.semesters.forEach(sem => {
    console.log(`\n========================================`);
    console.log(`Semester: ${sem.name}`);
    console.log(`========================================`);
    sem.holidaysList.forEach(h => {
      console.log(`  - ${h.name} (${h.dateText})`);
    });
  });
}

main().catch(err => {
  console.error("Error:", err);
});
