import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getCellContent } from "./calendarHelpers.js";
import { LOGO_BASE64 } from "../data/logoBase64.js";
import { getEventColorConfig, getGridCellColorConfig } from "../data/eventColors.js";

const getEventColor = (name) => {
  return getEventColorConfig(name);
};

const getGridCellColor = (name) => {
  return getGridCellColorConfig(name);
};


const drawHeader = (doc, title, subtitle, subsubtitle, logoBase64) => {
   if (logoBase64) {
      doc.addImage(logoBase64, 'JPEG', 36, 12, 50, 50);
   }
   
   doc.setFont("Helvetica", "bold");
   doc.setFontSize(18);
   doc.setTextColor(30, 58, 138); // Dark Blue
   doc.text("ADITYA UNIVERSITY", 306, 30, { align: "center" });
   
   if (subtitle) {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      if (subtitle.includes("WORKING DAYS")) {
         doc.setTextColor(249, 115, 22); // Orange
      } else {
         doc.setTextColor(51, 65, 85); // Dark grey
      }
      doc.text(subtitle, 306, 46, { align: "center" });
   }
   
   if (subsubtitle) {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate grey
      doc.text(subsubtitle, 306, 58, { align: "center" });
   }
};

const drawFooter = (doc, pageNum) => {
   doc.setFont("Helvetica", "normal");
   doc.setFontSize(10);
   doc.setTextColor(30, 58, 138); // Dark Blue
   
   doc.text("B.Tech – 2025 Batch", 36, 755);
   doc.text("ADITYA UNIVERSITY", 306, 755, { align: "center" });
   doc.text(`Page ${pageNum} of 22`, 576, 755, { align: "right" });
};

const drawSignature = (doc, yStart) => {
   doc.setFont("Helvetica", "bold");
   doc.setFontSize(8);
   doc.setTextColor(51, 65, 85);
   doc.text("Pro Vice-Chancellor", 576, yStart, { align: "right" });
   doc.text("Academics", 576, yStart + 10, { align: "right" });
   doc.setFont("Helvetica", "bold");
   doc.setFontSize(8);
   doc.setTextColor(30, 58, 138); // Dark Blue
   doc.text("ADITYA UNIVERSITY", 576, yStart + 20, { align: "right" });
};

export const downloadPDF = (
  calendarData,
  commencementDate,
  ignored_EVENT_COLORS,
  SCHEDULE_RULES,
  formatDate
) => {
    if (!calendarData) return;
    
    // Initialize jsPDF with letter size, portrait orientation, and points (pt) units
    const doc = new jsPDF({
       orientation: "portrait",
       format: "letter",
       unit: "pt"
    });
    
    let pageNum = 1;
    
    // ==========================================
    // PAGE 1: SCHEDULE OVERVIEW
    // ==========================================
    drawHeader(doc, "ADITYA UNIVERSITY", "ACADEMIC CALENDAR SCHEDULE", "(Applicable for the 2025 batch students admitted in B.Tech)", LOGO_BASE64);
    
    const scheduleBody = SCHEDULE_RULES.map(r => [r.sem, r.cw, r.vac, r.lab, r.theory]);
    autoTable(doc, {
        startY: 75,
        margin: { left: 36, right: 36 },
        head: [["Semester", "Classwork", "Vacation", "SEE-Lab", "SEE-Theory"]],
        body: scheduleBody,
        theme: 'grid',
        tableLineWidth: 1.5,
        tableLineColor: [30, 58, 138],
        headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', lineWidth: 0.8, lineColor: [30, 58, 138] },
        styles: { fontSize: 10, cellPadding: { top: 6, bottom: 6, left: 4, right: 4 }, halign: 'center', valign: 'middle', lineWidth: 0.8, lineColor: [30, 58, 138] }
    });

    const finalYPage1 = doc.lastAutoTable.finalY + 20;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text("Regular Semesters: July to April", 36, finalYPage1);
    
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text("Internal Examinations I - 8th Week of Instruction", 36, finalYPage1 + 12);
    doc.text("Internal Examinations II - 17th Week of Instruction", 36, finalYPage1 + 22);

    doc.setFont("Helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Summer Semesters: May to June", 36, finalYPage1 + 38);
    
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text("Internal Examinations I - 4th Week of Instruction", 36, finalYPage1 + 50);
    doc.text("Internal Examinations II - 7th Week of Instruction", 36, finalYPage1 + 60);

    drawSignature(doc, finalYPage1 + 80);

    drawFooter(doc, pageNum++);

    // ==========================================
    // PAGE 2: MASTER ACADEMIC CALENDAR OVERVIEW
    // ==========================================
    doc.addPage();
    drawHeader(doc, "ADITYA UNIVERSITY", "ACADEMIC CALENDAR SCHEDULE", "(Applicable for the 2025 batch students admitted in B.Tech)", LOGO_BASE64);

    const masterBody = [];
    Object.entries(calendarData.groupedMaster).forEach(([ay, sems]) => {
        sems.forEach((sem, idx) => {
            const row = [];
            if (idx === 0) row.push({ content: ay, rowSpan: sems.length, styles: { valign: 'middle', halign: 'center' }});
            row.push(sem.name);
            row.push(sem.commencement);

            if (sem.fullName === 'VIII Semester') {
                row.push({ content: `Project Work & Project Work Viva Voce - ${sem.theory.replace('\n', '')}`, colSpan: 4, styles: { halign: 'center', valign: 'middle' }});
            } else {
                row.push(sem.internal1);
                row.push(sem.internal2);
                row.push(sem.lab);
                row.push(sem.theory);
            }
            masterBody.push(row);
        });
    });

    autoTable(doc, {
        startY: 75,
        margin: { left: 36, right: 36 },
        head: [["A.Y", "Semester", "Commencement\nof Class Work", "Internal\nExaminations-I", "Internal\nExaminations-II", "Semester End\nExaminations- Lab", "Semester End\nExaminations- Theory"]],
        body: masterBody,
        theme: 'grid',
        tableLineWidth: 1.5,
        tableLineColor: [30, 58, 138],
        columnStyles: {
           0: { cellWidth: 60 },
           1: { cellWidth: 60 },
           2: { cellWidth: 80 },
           3: { cellWidth: 85 },
           4: { cellWidth: 85 },
           5: { cellWidth: 85 },
           6: { cellWidth: 85 }
        },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center', valign: 'middle', lineWidth: 0.8, lineColor: [30, 58, 138] },
        styles: { fontSize: 8, cellPadding: { top: 12, bottom: 12, left: 3, right: 3 }, halign: 'center', valign: 'middle', lineWidth: 0.8, lineColor: [30, 58, 138] }
    });

    drawSignature(doc, doc.lastAutoTable.finalY + 25);

    drawFooter(doc, pageNum++);

    // ==========================================
    // SEMESTER LOOP
    // ==========================================
    calendarData.semesters.forEach((sem) => {
      
      // --- ODD PAGE: EVENTS CALENDAR ---
      doc.addPage();
      const isTentative = !["I Semester", "II Semester"].includes(sem.name);
      const prefix = isTentative ? "TENTATIVE " : "";
      drawHeader(
         doc, 
         "ADITYA UNIVERSITY", 
         `${prefix}ACADEMIC CALENDAR (A.Y: ${sem.academicYear})`, 
         `(Applicable for the 2025 batch students admitted in B.Tech) - ${sem.name}`, 
         LOGO_BASE64
      );

      const tableColumn = ["S.No.", "Description", "From", "To"];
      const tableRows = [];
      sem.events.forEach(event => {
        tableRows.push([event.sNo, event.name, formatDate(event.start), event.end ? formatDate(event.end) : '']);
      });

       const startY = 85;
       const targetEnd = 620;
       const availableHeight = targetEnd - startY;
       const numRows = tableRows.length + 1;
       const cellPaddingY = Math.min(15, Math.max(3, (availableHeight / numRows - 10) / 2));

       autoTable(doc, {
        startY: startY,
        margin: { left: 36, right: 36 },
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        tableLineWidth: 1.5,
        tableLineColor: [224, 155, 96],
        headStyles: { fillColor: [27, 18, 133], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center', lineWidth: 0.8, lineColor: [224, 155, 96] },
        styles: { fontSize: 9, cellPadding: { top: cellPaddingY, bottom: cellPaddingY, left: 6, right: 6 }, lineWidth: 0.8, lineColor: [224, 155, 96] },
        columnStyles: { 
           0: { cellWidth: 35, halign: 'center' }, 
           1: { cellWidth: 345 }, 
           2: { cellWidth: 80, halign: 'center' }, 
           3: { cellWidth: 80, halign: 'center' } 
        }
      });

      drawSignature(doc, doc.lastAutoTable.finalY + 25);

      drawFooter(doc, pageNum++);

      // --- EVEN PAGE: WORKING DAYS MATRIX & HOLIDAYS ---
      doc.addPage();
      drawHeader(
         doc, 
         "ADITYA UNIVERSITY", 
         `WORKING DAYS IN THE ${sem.name.toUpperCase()} FOR THE A.Y ${sem.academicYear}`, 
         null, 
         LOGO_BASE64
      );

      // Build flat list of columns (weeks with separators)
      const cols = [];
      sem.gridData.months.forEach((m, mIdx) => {
         m.weeks.forEach(w => {
            cols.push({ type: 'week', week: w, monthName: m.name });
         });
         if (mIdx < sem.gridData.months.length - 1) {
            cols.push({ type: 'separator', monthName: m.name });
         }
      });

      // Matrix Header
      const gridHead = [
        [
          {content: 'Days', rowSpan: 2, styles: {valign: 'middle', halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138], fontStyle: 'bold'}}, 
          {content: 'Months', colSpan: cols.length, styles: {halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138], fontStyle: 'bold'}}, 
          {content: 'Total\nWorking\nDays', rowSpan: 2, styles: {valign: 'middle', halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138], fontStyle: 'bold'}}
        ],
        []
      ];

      sem.gridData.months.forEach((m, mIdx) => {
         gridHead[1].push({ content: m.name, colSpan: m.weeks.length, styles: { halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138], fontStyle: 'bold' } });
         if (mIdx < sem.gridData.months.length - 1) {
            gridHead[1].push({ content: "", colSpan: 1, styles: { fillColor: [255, 255, 255], lineWidth: 0, lineColor: [255, 255, 255] } });
         }
      });

      // Matrix Body
      const gridBody = [];
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day, dIdx) => {
        const row = [{content: day, styles: {fontStyle: 'bold', halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138]}}];
        cols.forEach(col => {
           if (col.type === 'separator') {
              row.push({
                 content: "",
                 styles: {
                    fillColor: [255, 255, 255],
                    lineWidth: 0,
                    lineColor: [255, 255, 255]
                 }
              });
              return;
           }
           const dObj = col.week.days[dIdx];
           let content = getCellContent(dObj).toString();
           let cellStyles = { halign: 'center', textColor: '#000000', fillColor: '#ffffff' };
           
           if (!dObj.isOutsideSemester) {
              const evColor = getGridCellColor(dObj.event?.name);
              if (evColor) {
                 cellStyles.fillColor = evColor.bg;
                 cellStyles.textColor = evColor.text;
              }
           } else {
              cellStyles.fillColor = '#ffffff';
           }
           row.push({content, styles: cellStyles});
        });
        
        row.push({
           content: sem.gridData.dayTotals[dIdx].toString(),
           styles: { fontStyle: 'bold', halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138] }
        });
        gridBody.push(row);
      });

      // Week Labels Row
      const weekRow = [{content: 'Week', styles: {fontStyle: 'bold', halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138]}}];
      sem.gridData.months.forEach((m, mIdx) => {
         const weekLabelsInMonth = [];
         if (m.weeks.length > 0) {
            let currentLabel = m.weeks[0].label;
            let span = 1;
            for (let i = 1; i < m.weeks.length; i++) {
               if (m.weeks[i].label === currentLabel) {
                  span++;
               } else {
                  weekLabelsInMonth.push({ label: currentLabel, span });
                  currentLabel = m.weeks[i].label;
                  span = 1;
               }
            }
            weekLabelsInMonth.push({ label: currentLabel, span });
         }
         
         weekLabelsInMonth.forEach(lbl => {
            weekRow.push({ content: lbl.label.toString(), colSpan: lbl.span, styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255], textColor: [0, 0, 0] } });
         });
         
         if (mIdx < sem.gridData.months.length - 1) {
            weekRow.push({ content: "", styles: { fillColor: [255, 255, 255], lineWidth: 0, lineColor: [255, 255, 255] } });
         }
      });
      weekRow.push({ content: "", styles: { fillColor: [255, 255, 255] } }); 
      gridBody.push(weekRow);

      // Total Days Row
      const totalRow = [{content: 'Total\nDays', styles: {fontStyle: 'bold', halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138]}}];
      sem.gridData.months.forEach((m, mIdx) => {
         let totalInMonth = 0;
         m.weeks.forEach(w => w.days.forEach(d => { if (d.isInstructional) totalInMonth++; }));
         totalRow.push({ content: totalInMonth.toString(), colSpan: m.weeks.length, styles: { halign: 'center', fontStyle: 'bold', fillColor: [255, 255, 255], textColor: [0, 0, 0] } });
         
         if (mIdx < sem.gridData.months.length - 1) {
            totalRow.push({ content: "", styles: { fillColor: [255, 255, 255], lineWidth: 0, lineColor: [255, 255, 255] } });
         }
      });
      const grandTotal = sem.gridData.dayTotals.reduce((a,b)=>a+b, 0);
      totalRow.push({ content: grandTotal.toString(), styles: { fontStyle: 'bold', halign: 'center', fillColor: [255, 255, 255], textColor: [30, 58, 138] } });
      gridBody.push(totalRow);

      const separatorCount = sem.gridData.months.length - 1;
      const weekCount = cols.length - separatorCount;
      const dayWidth = 30;
      const totalDaysWidth = 40;
      const separatorWidth = 2;
      const remainingWidth = 540 - dayWidth - totalDaysWidth - separatorCount * separatorWidth;
      const weekWidth = remainingWidth / weekCount;

      const columnStyles = {
         0: { cellWidth: dayWidth }
      };
      cols.forEach((col, idx) => {
         if (col.type === 'separator') {
            columnStyles[idx + 1] = { cellWidth: separatorWidth };
         } else {
            columnStyles[idx + 1] = { cellWidth: weekWidth };
         }
      });
      columnStyles[cols.length + 1] = { cellWidth: totalDaysWidth };

      // Draw main matrix table
      autoTable(doc, {
        startY: 75,
        margin: { left: 36, right: 36 },
        head: gridHead,
        body: gridBody,
        theme: 'grid',
        tableLineWidth: 1.5,
        tableLineColor: [30, 58, 138],
        columnStyles: columnStyles,
        styles: { fontSize: 7.5, cellPadding: 2, lineWidth: 0.8, lineColor: [30, 58, 138] },
        headStyles: { lineWidth: 0.8, lineColor: [30, 58, 138] },
      });

      const finalYMatrix = doc.lastAutoTable.finalY || 75;

      // Legends (Bottom Left Event Table)
      const legendBody = [];
      sem.gridEvents.forEach(ev => {
        legendBody.push([
          { content: ev.name },
          { content: `${formatDate(ev.start)}${ev.end && ev.start !== ev.end ? ` - ${formatDate(ev.end)}` : ''}` }
        ]);
      });

      autoTable(doc, {
        startY: finalYMatrix + 25,
        margin: { left: 36 },
        body: legendBody,
        theme: 'grid',
        tableWidth: 260,
        tableLineWidth: 1.5,
        tableLineColor: [30, 58, 138],
        styles: { fontSize: 8, cellPadding: 3, lineWidth: 0.8, lineColor: [30, 58, 138] },
        columnStyles: { 0: { cellWidth: 150 }, 1: { cellWidth: 110, halign: 'center' } },
        didParseCell: (data) => {
          if (data.row.section === 'body') {
            const eventName = data.row.raw[0].content || data.row.raw[0];
            const evColor = getEventColor(eventName);
            if (evColor) {
              data.cell.styles.fillColor = evColor.bg;
              data.cell.styles.textColor = evColor.text;
            }
          }
        }
      });

      // Holidays List Table (Bottom Right)
      const holTable = [];
      sem.holidaysList.forEach(hol => holTable.push([hol.name, hol.dateText, hol.dayText]));

      autoTable(doc, {
        startY: finalYMatrix + 25,
        margin: { left: 316 },
        head: [[{content: 'List of Holidays', colSpan: 3, styles: {fillColor: [30, 58, 138], textColor: [255, 255, 255], halign: 'center', fontStyle: 'bold', lineWidth: 0.8, lineColor: [30, 58, 138]}}]],
        body: holTable,
        theme: 'grid',
        tableWidth: 260,
        tableLineWidth: 1.5,
        tableLineColor: [30, 58, 138],
        styles: { fontSize: 8, cellPadding: 3, lineWidth: 0.8, lineColor: [30, 58, 138] },
        columnStyles: { 0: { cellWidth: 130, halign: 'left' }, 1: { cellWidth: 80, halign: 'center' }, 2: { cellWidth: 50, halign: 'center' } },
      });

      const finalYBottom = Math.max(doc.lastAutoTable.finalY || 0, finalYMatrix + 180);

      // Holiday Notice text
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text("Note: Holidays are subject to change as per the AP Government notification", 36, finalYBottom + 15);

      drawSignature(doc, finalYBottom + 30);

      drawFooter(doc, pageNum++);
    });

    // Save final generated calendar
    doc.save(`Aditya_Univ_Academic_Calendar.pdf`);
};