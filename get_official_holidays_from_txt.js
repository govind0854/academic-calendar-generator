import fs from "fs";
import path from "path";

const dir = "./extracted_pages";
const files = fs.readdirSync(dir).filter(f => f.startsWith("page_") && f.endsWith(".txt"));

files.sort((a, b) => {
  const numA = parseInt(a.match(/\d+/)[0]);
  const numB = parseInt(b.match(/\d+/)[0]);
  return numA - numB;
});

const semNames = {
  4: "I Semester",
  6: "II Semester",
  8: "III Semester",
  10: "IV Semester",
  12: "Summer Semester 1",
  14: "V Semester",
  16: "VI Semester",
  18: "Summer Semester 2",
  20: "VII Semester",
  22: "VIII Semester"
};

files.forEach(f => {
  const pageNum = parseInt(f.match(/\d+/)[0]);
  if (semNames[pageNum]) {
    console.log(`\n========================================`);
    console.log(`Semester: ${semNames[pageNum]} (Page ${pageNum})`);
    console.log(`========================================`);
    const content = fs.readFileSync(path.join(dir, f), "utf8");
    const lines = content.split("\n");
    const holidayIdx = lines.findIndex(l => l.toLowerCase().includes("list of holidays"));
    if (holidayIdx !== -1) {
      // Print lines after List of Holidays
      const endIdx = lines.findIndex((l, idx) => idx > holidayIdx && (l.toLowerCase().includes("note:") || l.toLowerCase().includes("page")));
      const limit = endIdx !== -1 ? endIdx : holidayIdx + 20;
      for (let i = holidayIdx; i < limit; i++) {
        console.log(lines[i]);
      }
    } else {
      console.log("Holiday list not found on this page.");
    }
  }
});
