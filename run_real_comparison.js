import { buildFullCalendar } from "./src/utils/calendarBuilder.js";
import { SEMESTER_NAMES } from "./src/data/semesterNames.js";
import { formatDate } from "./src/utils/dateUtils.js";
import fs from "fs";

const apiKey = "AIzaSyD8iLzk973U9wRlSUR48jBy_xRPk_QeBJ0";
const commencementDate = "2024-08-27";

const officialEvents = JSON.parse(fs.readFileSync("official_calendar_events.json", "utf8"));

const semMapping = {
  "I Semester": "I",
  "II Semester": "II",
  "III Semester": "III",
  "IV Semester": "IV",
  "Summer Semester": "S1", 
  "V Semester": "V",
  "VI Semester": "VI",
  "Summer Semester_2": "S2", 
  "VII Semester": "VII",
  "VIII Semester": "VIII"
};

function normalizeName(name) {
  if (!name) return "";
  let clean = name.toLowerCase()
    .replace("intemal", "internal")
    .replace("themy", "theory")
    .replace("theowy", "theory")
    .replace("theoly", "theory")
    .replace("theoly", "theory")
    .replace("olme", "online")
    .replace(/\s+/g, "")
    .replace(/[\-\—\–\_]+/g, "");
  return clean;
}

async function run() {
  const result = await buildFullCalendar(commencementDate, apiKey);
  
  console.log("=== REAL CALENDAR GENERATOR MISMATCH REPORT ===");
  let summerCount = 0;
  let totalMismatches = 0;
  
  result.semesters.forEach(sem => {
    let key = sem.name;
    if (sem.name === "Summer Semester") {
      summerCount++;
      if (summerCount === 2) {
        key = "Summer Semester_2";
      }
    }
    const semId = semMapping[key];
    const offEvents = officialEvents[semId];
    
    console.log(`\n========================================`);
    console.log(`Semester: ${sem.name} (${semId})`);
    console.log(`========================================`);
    
    offEvents.forEach(offEv => {
      const offNorm = normalizeName(offEv.name);
      
      const genEv = sem.events.find(e => {
        const genNorm = normalizeName(e.name);
        return genNorm === offNorm;
      });
      
      if (!genEv) {
        console.log(`MISSING EVENT in generated calendar: ${offEv.name} (norm: ${offNorm})`);
        totalMismatches++;
        return;
      }
      
      const offStartStr = offEv.start || "-";
      const offEndStr = offEv.end || "-";
      
      const genStartStr = genEv.start ? formatDate(genEv.start) : "-";
      const genEndStr = genEv.end ? formatDate(genEv.end) : "-";
      
      if (genStartStr !== offStartStr || genEndStr !== offEndStr) {
        console.log(`Mismatch on event: ${offEv.name}`);
        if (genStartStr !== offStartStr) {
          console.log(`  Start -> Official: ${offStartStr} | Generated: ${genStartStr}`);
        }
        if (genEndStr !== offEndStr) {
          console.log(`  End   -> Official: ${offEndStr} | Generated: ${genEndStr}`);
        }
        totalMismatches++;
      }
    });
  });
  
  console.log(`\nTotal mismatches found: ${totalMismatches}`);
}

run();
