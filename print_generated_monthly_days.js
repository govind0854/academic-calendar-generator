import { buildFullCalendar } from "./src/utils/calendarBuilder.js";

const apiKey = "AIzaSyD8iLzk973U9wRlSUR48jBy_xRPk_QeBJ0";
const commencementDate = "2025-08-25";

async function main() {
  const data = await buildFullCalendar(commencementDate, apiKey);
  data.semesters.forEach(sem => {
    console.log(`\nSemester: ${sem.name}`);
    sem.gridData.months.forEach(m => {
      let totalInMonth = 0;
      m.weeks.forEach(w => w.days.forEach(d => { if (d.isInstructional) totalInMonth++; }));
      console.log(`  ${m.name}: ${totalInMonth} (weeks span: ${m.span})`);
    });
    console.log(`  Total: ${sem.gridData.dayTotals.reduce((a,b)=>a+b, 0)}`);
  });
}

main().catch(err => {
  console.error("Error:", err);
});
