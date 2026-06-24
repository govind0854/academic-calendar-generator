import fs from "fs";

const parsed = JSON.parse(fs.readFileSync("official_parsed_events.json", "utf8"));
const events2025 = {};

Object.keys(parsed).forEach(semId => {
  events2025[semId] = parsed[semId].map(ev => ({
    name: ev.name,
    start: ev.startStr,
    end: ev.endStr
  }));
});

fs.writeFileSync("official_calendar_events.json", JSON.stringify(events2025, null, 2));
console.log("official_calendar_events.json successfully updated for the 2025 batch!");
