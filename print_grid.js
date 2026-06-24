import { buildFullCalendar } from "./src/utils/calendarBuilder.js";
import { getCellContent } from "./src/utils/calendarHelpers.js";

const apiKey = "AIzaSyD8iLzk973U9wRlSUR48jBy_xRPk_QeBJ0";
const commencementDate = "2025-08-25";

async function main() {
  const data = await buildFullCalendar(commencementDate, apiKey);
  const sem = data.semesters.find(s => s.name === "V Semester");
  
  console.log("=== V SEMESTER GENERATED GRID ===");
  console.log("Months header span:", sem.gridData.months.map(m => `${m.name}(${m.span})`).join(" | "));
  
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdays.forEach((day, dIdx) => {
    let rowStr = `${day}: `;
    sem.gridData.weeks.forEach(w => {
      const dObj = w.days[dIdx];
      const content = getCellContent(dObj) || " ";
      rowStr += `[${content.toString().padStart(2)}] `;
    });
    console.log(rowStr);
  });
  
  console.log("Week labels:", sem.gridData.weekLabels.map(l => `${l.label}(${l.span})`).join(" | "));
}

main().catch(err => console.error(err));
