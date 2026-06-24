import fs from "fs";

const semNamesMapping = {
  3: "I",
  5: "II",
  7: "III",
  9: "IV",
  11: "S1",
  13: "V",
  15: "VI",
  17: "S2",
  19: "VII",
  21: "VIII"
};

const templates = {};

function parseDate(dStr) {
  if (!dStr) return null;
  const parts = dStr.trim().split(/[.-]/);
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

function dateDiffInDays(date1, date2) {
  const diffTime = date1.getTime() - date2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

for (let pageNum = 1; pageNum <= 22; pageNum++) {
  const semId = semNamesMapping[pageNum];
  if (!semId) continue;

  const pagePath = `extracted_pages/page_${pageNum}.txt`;
  if (!fs.existsSync(pagePath)) {
    continue;
  }

  const pageContent = fs.readFileSync(pagePath, "utf8");
  const lines = pageContent.split("\n").map(l => l.replace("\r", ""));
  const events = [];
  let commencementDate = null;

  // Find commencement date with combined next line if split
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const low = line.toLowerCase();
    if (low.includes("commencement of class work") || low.includes("commencement of project work")) {
      let combined = line;
      if (!line.match(/\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4}/) && lines[i+1]) {
        combined += " " + lines[i+1];
      }
      const m = combined.match(/(commencement.*?)\s+(\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4})/i);
      if (m) {
        commencementDate = parseDate(m[2]);
        break;
      }
    }
  }

  if (!commencementDate) {
    console.log(`Page ${pageNum} (Sem ${semId}) FAILED to find commencement date!`);
    continue;
  }

  console.log(`Page ${pageNum} (Sem ${semId}): Commencement Date is ${commencementDate.toDateString()}`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let combined = line;
    // Check if line matches an index but has no date, and the next line has a date
    const idxMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
    if (idxMatch) {
      const hasDate = line.match(/\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4}/);
      if (!hasDate && lines[i+1] && lines[i+1].match(/\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4}/)) {
        combined = line.trim() + " " + lines[i+1].trim();
      }
      
      const m = combined.match(/^\s*(\d+)\.\s+(.*?)\s+(\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4})(?:\s+(\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4}))?/);
      if (m) {
        const index = parseInt(m[1]);
        const name = m[2].trim().replace(/\s+/g, " ");
        const startStr = m[3];
        const endStr = m[4];

        const start = parseDate(startStr);
        const end = parseDate(endStr);

        const startOffset = dateDiffInDays(start, commencementDate);
        const endOffset = end ? dateDiffInDays(end, commencementDate) : null;

        events.push({
          name,
          startOffset,
          endOffset,
          startStr,
          endStr: endStr || null
        });
      }
    }
  }

  templates[semId] = events;
}

// Print templates in JS format
console.log("\n=== GENERATED TEMPLATES ===");
Object.keys(templates).forEach(semId => {
  console.log(`  '${semId}': [`);
  templates[semId].forEach(ev => {
    let hideProps = "";
    const lowerName = ev.name.toLowerCase();
    if (lowerName.includes("registration") || lowerName.includes("declaration") || lowerName.includes("payment") || lowerName.includes("availability") || lowerName.includes("commencement of") || lowerName.includes("summer vacation")) {
      hideProps = ", hideFromGrid: true";
    }
    console.log(`    { n: '${ev.name}', s: ${ev.startOffset}, e: ${ev.endOffset}${hideProps} },`);
  });
  console.log(`  ],`);
});

fs.writeFileSync("official_parsed_events.json", JSON.stringify(templates, null, 2));
