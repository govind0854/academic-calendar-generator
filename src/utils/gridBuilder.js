import {
  addDays,
  formatDate,
  stripTime,
  getDayName,
  formatMonthYear
} from "./dateUtils.js";
const isSunday = (date) => date.getDay() === 0;
export const evaluateDay = (date, holidays, vacations) => {
  const t = stripTime(date);
  const holiday = holidays.find(h => stripTime(h.date) === t && !h.excludeFromGrid);
  const vacation = vacations.find(v => t >= stripTime(v.start) && t <= stripTime(v.end));
  
  if (holiday) return { isValid: false, reason: `Holiday: ${holiday.name}` };
  if (vacation) return { isValid: false, reason: 'Vacation' };
  if (isSunday(date)) return { isValid: false, reason: 'Sunday' };
  
  return { isValid: true, reason: 'Valid Day' };
};

const getEventForDate = (date, events) => {
  const t = stripTime(date);
  return events.find(e => {
    const nameLower = e.name.toLowerCase();
    
    // We want to highlight Commencement, Detention Finalization, and SEE fee payments in the grid,
    // even if they have end === null or hideFromGrid === true.
    const isCommencement = nameLower.includes("commencement of class") || nameLower.includes("commencement of project work");
    const isDetention = nameLower.includes("finalization of detention");
    const isFee = nameLower.includes("payment of semester end") || nameLower.includes("last date to pay");
    
    if (isCommencement || isDetention || isFee) {
      if (e.end !== null) {
        return t >= stripTime(e.start) && t <= stripTime(e.end);
      } else {
        return t === stripTime(e.start);
      }
    }
    
    if (e.hideFromGrid) return false;
    if (e.end !== null) {
      return t >= stripTime(e.start) && t <= stripTime(e.end);
    } else {
      return t === stripTime(e.start);
    }
  });
};


export const buildGridForSemester = (events, commDate, endDate, holidays, vacations, semName) => {
  const seeEvents = events.filter(e => {
    const nameLower = e.name.toLowerCase();
    return nameLower.includes("semester end examinations") || 
           nameLower.includes("project viva") ||
           nameLower.includes("project work viva") ||
           nameLower.includes("project viva voce") ||
           nameLower.includes("project work viva voce");
  });

  const isDuringSEE = (date) => {
    const t = stripTime(date);
    return seeEvents.some(e => 
      e.start && e.end && 
      t >= stripTime(e.start) && t <= stripTime(e.end)
    );
  };

  let gridStart = commDate;
  if (semName === "I Semester") {
    const sipEvent = events.find(e => e.name.includes("Student Induction Program"));
    if (sipEvent) {
      gridStart = sipEvent.start;
    }
  }

  let startDate = new Date(gridStart);
  while(startDate.getDay() !== 1) startDate = addDays(startDate, -1); 

  let eDate = new Date(endDate);
  while(eDate.getDay() !== 6) eDate = addDays(eDate, 1); 

  const initialWeeks = [];
  let current = new Date(startDate);
  let weekCount = 1;

  while(current <= eDate) {
    const monthLabel =
  formatMonthYear(current).split(' ')[0];

    const week = { monthLabel, days: [], label: '' };
    let hasClasswork = false;
    let hasEvent = false;

    for(let i=0; i<6; i++) { 
      const d = new Date(current);
      const isOutsideSemester = d < gridStart || d > endDate;
      const isInstructional = !isOutsideSemester && evaluateDay(d, holidays, vacations).isValid;
      const ev = getEventForDate(d, events);
      
      week.days.push({
        date: d,
        isInstructional,
        event: ev,
        isOutsideSemester
      });

      if (isInstructional) hasClasswork = true;
      if (ev) hasEvent = true;

      current = addDays(current, 1);
    }
    current = addDays(current, 1); // skip Sunday

    if (week.days[0].date < gridStart) {
        week.label = semName === 'I Semester' ? 'SIP' : '-';
    } else if (hasClasswork || hasEvent) {
        week.label = weekCount++;
    } else {
        week.label = '-';
    }
    initialWeeks.push(week);
  }

  // Now, split weeks that span multiple months
  const weeks = [];
  initialWeeks.forEach(w => {
    const monthsInWeek = [];
    w.days.forEach(d => {
      const m = formatMonthYear(d.date).split(' ')[0];
      if (!monthsInWeek.includes(m)) {
        monthsInWeek.push(m);
      }
    });

    if (monthsInWeek.length <= 1) {
      weeks.push(w);
    } else {
      const monthA = monthsInWeek[0];
      const monthB = monthsInWeek[1];

      const weekA = {
        monthLabel: monthA,
        days: w.days.map(d => {
          const m = formatMonthYear(d.date).split(' ')[0];
          if (m === monthA) return d;
          return { date: d.date, isInstructional: false, event: null, isBlank: true, isOutsideSemester: d.isOutsideSemester };
        }),
        label: w.label
      };

      const weekB = {
        monthLabel: monthB,
        days: w.days.map(d => {
          const m = formatMonthYear(d.date).split(' ')[0];
          if (m === monthB) return d;
          return { date: d.date, isInstructional: false, event: null, isBlank: true, isOutsideSemester: d.isOutsideSemester };
        }),
        label: w.label
      };

      weeks.push(weekA);
      weeks.push(weekB);
    }
  });

  const months = [];
  weeks.forEach(w => {
    const last = months[months.length - 1];
    if (last && last.name === w.monthLabel) {
      last.span++;
      last.weeks.push(w);
    } else {
      months.push({ name: w.monthLabel, span: 1, weeks: [w] });
    }
  });

  const dayTotals = [0, 0, 0, 0, 0, 0];
  weeks.forEach(w => {
    w.days.forEach((dayObj, idx) => {
        if (dayObj.isInstructional) dayTotals[idx]++;
    });
  });

  // if (semName === "II Semester") {
  //   dayTotals[0] = 19; // Monday
  // } else if (semName === "VI Semester") {
  //   dayTotals[0] = 20; // Monday
  //   dayTotals[2] = 19; // Wednesday
  // }

  const weekLabels = [];
  if (weeks.length > 0) {
      let currentLabel = weeks[0].label;
      let span = 1;
      for (let i = 1; i < weeks.length; i++) {
          if (weeks[i].label === currentLabel) {
              span++;
          } else {
              weekLabels.push({ label: currentLabel, span });
              currentLabel = weeks[i].label;
              span = 1;
          }
      }
      weekLabels.push({ label: currentLabel, span });
  }

  return { weeks, months, dayTotals, weekLabels };
};