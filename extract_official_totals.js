import fs from "fs";
import path from "path";

const dir = "./extracted_pages";
const files = fs.readdirSync(dir).filter(f => f.startsWith("page_") && f.endsWith(".txt"));

files.sort((a, b) => {
  const numA = parseInt(a.match(/\d+/)[0]);
  const numB = parseInt(b.match(/\d+/)[0]);
  return numA - numB;
});

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), "utf8");
  if (content.toUpperCase().includes("WORKING DAYS") || content.toUpperCase().includes("WORKING PAYS")) {
    console.log(`\nFile: ${f}`);
    const lines = content.split("\n");
    // Find lines with numbers at the end, or look around "Total Working days" / "Total"
    const totalLineIdx = lines.findIndex(l => l.toLowerCase().includes("total working") || l.toLowerCase().includes("total days") || l.toLowerCase().includes("total working da s"));
    if (totalLineIdx !== -1) {
      console.log(`Found Total Days text around line ${totalLineIdx}:`);
      for (let i = Math.max(0, totalLineIdx - 10); i < Math.min(lines.length, totalLineIdx + 15); i++) {
        console.log(`  ${i}: ${lines[i]}`);
      }
    } else {
      console.log("Total Days row not found directly, showing last 15 lines of content:");
      lines.slice(-15).forEach((l, idx) => console.log(`  ${idx}: ${l}`));
    }
  }
});
