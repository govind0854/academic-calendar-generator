import { buildFullCalendar } from "./src/utils/calendarBuilder.js";
import { downloadPDF } from "./src/utils/pdfGenerator.js";
import { EVENT_COLORS } from "./src/data/eventColors.js";
import { SCHEDULE_RULES } from "./src/data/scheduleRules.js";
import { formatDate } from "./src/utils/dateUtils.js";

const apiKey = "AIzaSyD8iLzk973U9wRlSUR48jBy_xRPk_QeBJ0";
const commencementDate = "2025-08-25";

async function main() {
  const data = await buildFullCalendar(commencementDate, apiKey);
  downloadPDF(data, commencementDate, EVENT_COLORS, SCHEDULE_RULES, formatDate);
  console.log("PDF generated successfully.");
}

main().catch(err => {
  console.error("Error:", err);
});
