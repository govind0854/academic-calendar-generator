import fs from "fs";

const data = JSON.parse(fs.readFileSync("official_parsed_events.json", "utf8"));

let code = `// Academic Calendar Event Templates for 2025 Admitted Batch
// Generated automatically from official PDF events

export const PDF_TEMPLATES = {
`;

Object.keys(data).forEach(semId => {
  code += `  '${semId}': [\n`;
  data[semId].forEach(ev => {
    let hideProps = "";
    const lowerName = ev.name.toLowerCase();
    
    // Grid vs Table visibility logic
    if (lowerName.includes("registration") || lowerName.includes("declaration") || lowerName.includes("payment") || lowerName.includes("availability") || lowerName.includes("commencement of") || lowerName.includes("summer vacation")) {
      hideProps += ", hideFromGrid: true";
    }
    if (lowerName.includes("registration to") || lowerName.includes("payment of") || lowerName.includes("payment for") || lowerName.includes("availability of") || lowerName.includes("commencement of")) {
      // These are not shown in the grid, but are shown in the academic calendar table
    }
    
    code += `    { n: '${ev.name}', s: ${ev.startOffset}, e: ${ev.endOffset}${hideProps} },\n`;
  });
  code += `  ],\n`;
});

code += `};

export const getTemplate = (semId) => PDF_TEMPLATES[semId] || PDF_TEMPLATES['II'];
`;

fs.writeFileSync("src/data/semesterTemplates.js", code);
console.log("src/data/semesterTemplates.js has been successfully updated!");
