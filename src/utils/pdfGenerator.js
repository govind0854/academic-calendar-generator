import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getCellContent } from "./calendarHelpers";
export const downloadPDF = (
  calendarData,
  commencementDate,
  EVENT_COLORS,
  SCHEDULE_RULES,
  formatDate
) => {
    if (!calendarData) return;
    const doc = new jsPDF();
    
    // ==========================================
    // PAGE 1: SCHEDULE OVERVIEW
    // ==========================================
    doc.setFontSize(16);
    doc.text("ADITYA UNIVERSITY", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("ACADEMIC CALENDAR SCHEDULE", 105, 28, { align: "center" });
    doc.setFontSize(10);
    const startYStr = commencementDate.split('-')[0];
    const endYStr = (parseInt(startYStr)+1).toString().slice(-2);
    doc.text(`(Applicable for the Students admitted in B.Tech in the A.Y ${startYStr}-${endYStr})`, 105, 34, { align: "center" });

    const scheduleBody = SCHEDULE_RULES.map(r => [r.sem, r.cw, r.vac, r.lab, r.theory]);
    autoTable(doc, {
        startY: 45,
        head: [["Semester", "Classwork", "Vacation", "SEE-Lab", "SEE-Theory"]],
        body: scheduleBody,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
        styles: { fontSize: 10, cellPadding: 3, halign: 'center', valign: 'middle', lineColor: [30, 58, 138] }
    });

    const finalYPage1 = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.text("Regular Semesters: July to April", 20, finalYPage1);
    doc.text("Internal Examinations I - 8th Week of Instruction", 20, finalYPage1 + 6);
    doc.text("Internal Examinations II - 17th Week of Instruction", 20, finalYPage1 + 12);
    doc.text("Summer Semesters: May to June", 20, finalYPage1 + 22);
    doc.text("Internal Examinations I - 4th Week of Instruction", 20, finalYPage1 + 28);
    doc.text("Internal Examinations II - 7th Week of Instruction", 20, finalYPage1 + 34);

    // ==========================================
    // PAGE 2: MASTER ACADEMIC CALENDAR OVERVIEW
    // ==========================================
    doc.addPage();
    doc.setFontSize(16);
    doc.text("ADITYA UNIVERSITY", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`ACADEMIC CALENDAR FOR THE ${startYStr} ADMITTED BATCH`, 105, 28, { align: "center" });

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
        startY: 35,
        head: [["A.Y", "Semester", "Commencement\nof Class Work", "Internal\nExaminations-I", "Internal\nExaminations-II", "Semester End\nExaminations- Lab", "Semester End\nExaminations- Theory"]],
        body: masterBody,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center', valign: 'middle' },
        styles: { fontSize: 8, cellPadding: 2, halign: 'center', valign: 'middle', lineColor: [30, 58, 138] }
    });

    // ==========================================
    // SEMESTER LOOP (2 Pages per Semester = 22 total pages)
    // ==========================================
    calendarData.semesters.forEach((sem) => {
      
      // --- ODD PAGE: EVENTS CALENDAR ---
      doc.addPage();
      doc.setFontSize(16);
      doc.text("ADITYA UNIVERSITY", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text(`ACADEMIC CALENDAR (A.Y ${sem.academicYear})`, 105, 28, { align: "center" });
      doc.setFontSize(14);
      doc.text(sem.name, 105, 38, { align: "center" });
      
      const tableColumn = ["S.No.", "Description", "From", "To"];
      const tableRows = [];
      sem.events.forEach(event => {
        tableRows.push([event.sNo, event.name, formatDate(event.start), event.end ? formatDate(event.end) : '']);
      });
      
      autoTable(doc, {
        startY: 45,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 3, lineColor: [30, 58, 138] },
        columnStyles: { 0: { cellWidth: 15, halign: 'center' }, 1: { cellWidth: 100 }, 2: { cellWidth: 35, halign: 'center' }, 3: { cellWidth: 35, halign: 'center' } }
      });

      // --- EVEN PAGE: WORKING DAYS MATRIX & HOLIDAYS ---
      doc.addPage();
      doc.setFontSize(16);
      doc.text("ADITYA UNIVERSITY", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text(`WORKING DAYS IN THE ${sem.name.toUpperCase()} FOR THE A.Y ${sem.academicYear}`, 105, 28, { align: "center" });

      const numWeeks = sem.gridData.weeks.length;
      
      // Matrix Header
      const gridHead = [
        [
          {content: 'Days', rowSpan: 2, styles: {valign: 'middle', halign: 'center'}}, 
          {content: 'Months', colSpan: numWeeks, styles: {halign: 'center'}}, 
          {content: 'Total\nWorking\nDays', rowSpan: 2, styles: {valign: 'middle', halign: 'center', cellWidth: 16}}
        ],
        sem.gridData.months.map(m => ({content: m.name, colSpan: m.span, styles: {halign: 'center'}}))
      ];

      // Matrix Body
      const gridBody = [];
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day, dIdx) => {
        const row = [{content: day, styles: {fontStyle: 'bold', halign: 'center'}}];
        sem.gridData.weeks.forEach(w => {
           const dObj = w.days[dIdx];
           let content = getCellContent(dObj).toString();
           let cellStyles = { halign: 'center', textColor: '#000000' };
           
           if (dObj.event) {
               const cConfig = EVENT_COLORS.find(c => dObj.event.name.includes(c.keyword));
               if (cConfig) {
                   cellStyles.fillColor = cConfig.bg;
                   cellStyles.textColor = cConfig.text;
               }
           }
           row.push({content, styles: cellStyles});
        });
        row.push({content: sem.gridData.dayTotals[dIdx].toString(), styles: {fontStyle: 'bold', halign: 'center'}});
        gridBody.push(row);
      });

      // Week Labels Row
      const weekRow = [{content: 'Week', styles: {fontStyle: 'bold', halign: 'center'}}];
      sem.gridData.weekLabels.forEach(lbl => {
         weekRow.push({content: lbl.label.toString(), colSpan: lbl.span, styles: {halign: 'center', fontStyle: 'bold'}});
      });
      weekRow.push('');
      gridBody.push(weekRow);

      // Total Days Row
      const totalRow = [{content: 'Total\nDays', styles: {fontStyle: 'bold', halign: 'center'}}];
      sem.gridData.months.forEach(m => {
        let totalInMonth = 0;
        m.weeks.forEach(w => w.days.forEach(d => { if (d.isInstructional) totalInMonth++; }));
        totalRow.push({content: totalInMonth.toString(), colSpan: m.span, styles: {halign: 'center', fontStyle: 'bold'}});
      });
      totalRow.push({content: sem.gridData.dayTotals.reduce((a,b)=>a+b, 0).toString(), styles: {fontStyle: 'bold', halign: 'center'}});
      gridBody.push(totalRow);

      // Draw Matrix
      autoTable(doc, {
        startY: 35,
        head: gridHead,
        body: gridBody,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: [30, 58, 138] },
        headStyles: { fillColor: [255, 255, 255], textColor: [30, 58, 138], fontStyle: 'bold', lineColor: [30, 58, 138] },
      });

      const finalYMatrix = doc.lastAutoTable.finalY || 35;
      
      // Legends (Bottom Left)
      const legendBody = [];
      sem.gridEvents.forEach(ev => {
        const cConfig = EVENT_COLORS.find(c => ev.name.includes(c.keyword)) || { bg: '#ffffff', text: '#000000' };
        legendBody.push([
          { content: ev.name, styles: { fillColor: cConfig.bg, textColor: cConfig.text } },
          { content: `${formatDate(ev.start)}${ev.end && ev.start !== ev.end ? ` - ${formatDate(ev.end)}` : ''}`, styles: { fillColor: cConfig.bg, textColor: cConfig.text } }
        ]);
      });

      autoTable(doc, {
        startY: finalYMatrix + 10,
        body: legendBody,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [30, 58, 138] },
        columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 35, halign: 'center' } },
        margin: { left: 14 } // Lock to left side
      });

      // Holidays (Bottom Right)
      const holTable = [];
      sem.holidaysList.forEach(hol => holTable.push([hol.name, hol.dateText, hol.dayText]));
      holTable.push([{content: 'Note: Holidays are subject to change as per the AP Government notification', colSpan: 3, styles: {fontStyle: 'italic', halign: 'center', fillColor: [250,250,250]}}]);

      autoTable(doc, {
        startY: finalYMatrix + 10,
        head: [[{content: 'List of Holidays', colSpan: 3, styles: {fillColor: [30, 58, 138], textColor: [255, 255, 255], halign: 'center'}}]],
        body: holTable,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2, lineWidth: 0.1, lineColor: [30, 58, 138] },
        columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 30, halign: 'center' }, 2: { cellWidth: 25, halign: 'center' } },
        margin: { left: 105 } // Push to right side next to legend
      });
    });

    doc.save(`Aditya_Univ_Academic_Calendar.pdf`);
  };