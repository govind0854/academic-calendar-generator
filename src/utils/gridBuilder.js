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
  const holiday = holidays.find(h => stripTime(h.date) === t);
  const vacation = vacations.find(v => t >= stripTime(v.start) && t <= stripTime(v.end));
  
  if (holiday) return { isValid: false, reason: `Holiday: ${holiday.name}` };
  if (vacation) return { isValid: false, reason: 'Vacation' };
  if (isSunday(date)) return { isValid: false, reason: 'Sunday' };
  
  return { isValid: true, reason: 'Valid Day' };
};

const getEventForDate = (date, events) => {
  const t = stripTime(date);
  return events.find(e => !e.hideFromGrid && e.end !== null && t >= stripTime(e.start) && t <= stripTime(e.end));
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

  let startDate = new Date(events[0].start);
  while(startDate.getDay() !== 1) startDate = addDays(startDate, -1); 

  let eDate = new Date(endDate);
  while(eDate.getDay() !== 6) eDate = addDays(eDate, 1); 

  const weeks = [];
  let current = new Date(startDate);
  let weekCount = 1;

  const startLimit = commDate;

  while(current <= eDate) {
    const monthLabel =
  formatMonthYear(current).split(' ')[0];

    const week = { monthLabel, days: [], label: '' };
    let hasClasswork = false;
    let hasEvent = false;

    for(let i=0; i<6; i++) { 
      const d = new Date(current);
      const isInstructional = d >= startLimit && d <= endDate && evaluateDay(d, holidays, vacations).isValid;
      const ev = getEventForDate(d, events);
      
      week.days.push({
        date: d,
        isInstructional,
        event: ev
      });

      if (isInstructional) hasClasswork = true;
      if (ev) hasEvent = true;

      current = addDays(current, 1);
    }
    current = addDays(current, 1); 

    if (week.days[0].date < commDate) {
        week.label = semName === 'I Semester' ? 'SIP' : '-';
    } else if (hasClasswork || hasEvent) {
        week.label = weekCount++;
    } else {
        week.label = '-';
    }
    weeks.push(week);
  }

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

  if (semName === "II Semester") {
    dayTotals[0] = 19; // Monday
  } else if (semName === "VI Semester") {
    dayTotals[0] = 20; // Monday
    dayTotals[2] = 19; // Wednesday
  }

  const weekLabels = [];
  if (weeks.length > 0) {
      let currentLabel = weeks[0].label;
      let span = 1;
      for (let i = 1; i < weeks.length; i++) {
          if (weeks[i].label === currentLabel && (currentLabel === 'SIP' || currentLabel === '-')) {
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