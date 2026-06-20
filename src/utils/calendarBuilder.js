import { fetchLiveHolidays } from "../Services/holidayService.js";

import { generateVacationsFromHolidays } from "./VacationGenerator.js";
import { SEMESTER_NAMES } from "../data/semesterNames.js";

import { getTemplate } from "../data/semesterTemplates.js";

import {
  addDays,
  formatDate,
  stripTime,
  getDayName
} from "./dateUtils.js";

import { buildGridForSemester } from "./gridBuilder.js";

const isExamEvent = (name) => {
  return false;
};

const getNextWorkingDay = (date, holidays, vacations) => {
  let current = new Date(date);
  while (true) {
    const t = stripTime(current);
    const isHoliday = holidays.some(h => stripTime(h.date) === t);
    const isVacation = vacations.some(v => t >= stripTime(v.start) && t <= stripTime(v.end));
    const isSun = current.getDay() === 0;
    
    if (!isHoliday && !isVacation && !isSun) {
      return current;
    }
    current = addDays(current, 1);
  }
};

const getWorkingDaysRange = (startDate, durationDays, holidays, vacations) => {
  const dates = [];
  let current = new Date(startDate);
  
  while (dates.length < durationDays) {
    current = getNextWorkingDay(current, holidays, vacations);
    dates.push(new Date(current));
    current = addDays(current, 1);
  }
  
  return {
    start: dates[0],
    end: dates[dates.length - 1]
  };
};

export const buildFullCalendar = async (initialDateStr, apiKey) => {
  const userCommencement = new Date(initialDateStr);
  const startYear = userCommencement.getFullYear();
  
  const liveHolidays = await fetchLiveHolidays(startYear, startYear + 4, apiKey);
  const dynamicVacations = generateVacationsFromHolidays(liveHolidays);

  for (let y = startYear; y <= startYear + 5; y++) {
      dynamicVacations.push({
          start: new Date(y, 4, 18), 
          end: new Date(y, 4, 31),   
          name: 'Summer Vacation (Heat Waves)'
      });
  }

  const semesters = [];
  let currentSemStart = new Date(userCommencement);
  let currentAYStartYear = userCommencement.getFullYear();

  for (let i = 0; i < SEMESTER_NAMES.length; i++) {
    const semId = SEMESTER_NAMES[i].id;
    const template = getTemplate(semId);
    const events = [];
    let sNo = 1;
    let endOfClassworkOrExams = currentSemStart;
    let lastExamEnd = null;
    
    template.forEach(tmpl => {
      let eventStart = addDays(currentSemStart, tmpl.s);
      let eventEnd = tmpl.e !== null ? addDays(currentSemStart, tmpl.e) : null;
      
      if (isExamEvent(tmpl.n)) {
        let preferredStart = eventStart;
        if (lastExamEnd !== null) {
          const nextDayAfterLastExam = addDays(lastExamEnd, 1);
          if (preferredStart < nextDayAfterLastExam) {
            preferredStart = nextDayAfterLastExam;
          }
        }
        
        const durationDays = tmpl.e !== null ? (tmpl.e - tmpl.s + 1) : 1;
        const range = getWorkingDaysRange(preferredStart, durationDays, liveHolidays, dynamicVacations);
        eventStart = range.start;
        eventEnd = tmpl.e !== null ? range.end : null;
        
        lastExamEnd = eventEnd !== null ? eventEnd : eventStart;
      }
      
      events.push({
        sNo: !tmpl.hideFromTable ? sNo++ : '-',
        name: tmpl.n,
        start: eventStart,
        end: eventEnd,
        hideFromTable: tmpl.hideFromTable,
        hideFromGrid: tmpl.hideFromGrid
      });

      if (tmpl.n.includes("Examinations") || tmpl.n.includes("Viva")) {
          if(eventEnd > endOfClassworkOrExams) endOfClassworkOrExams = eventEnd;
      }
    });

    const nextSem = SEMESTER_NAMES[i + 1];
    let nextSemStart = null;
    if (nextSem) {
      let searchKey = "";
      if (nextSem.id === "II") searchKey = "Commencement of II";
      else if (nextSem.id === "III") searchKey = "Commencement of III";
      else if (nextSem.id === "IV") searchKey = "Commencement of IV";
      else if (nextSem.id === "S1" || nextSem.id === "S2") searchKey = "Commencement of Summer";
      else if (nextSem.id === "V") searchKey = "Commencement of V";
      else if (nextSem.id === "VI") searchKey = "Commencement of VI";
      else if (nextSem.id === "VII") searchKey = "Commencement of VII";
      else if (nextSem.id === "VIII") searchKey = "Commencement of VIII";

      const nextSemKey = template.find(t => t.n.includes(searchKey));
      nextSemStart = nextSemKey ? addDays(currentSemStart, nextSemKey.s) : null;
    }

    const semVacations = dynamicVacations.filter(v => {
      if (SEMESTER_NAMES[i].id === 'S1' || SEMESTER_NAMES[i].id === 'S2') {
        return v.name !== 'Summer Vacation (Heat Waves)';
      }
      return true;
    });

    const semHolidays = liveHolidays.filter(h => stripTime(h.date) >= stripTime(currentSemStart) && stripTime(h.date) <= stripTime(endOfClassworkOrExams));
console.log(
  "Semester:",
  SEMESTER_NAMES[i].name
);

console.log(
  "Semester Holidays:",
  semHolidays
);    
    const displayHolidays = semHolidays.map(h => ({ dateText: formatDate(h.date), name: h.name, dayText: getDayName(h.date) }))
    .concat(semVacations.filter(v => stripTime(v.start) >= stripTime(currentSemStart) && stripTime(v.start) <= stripTime(endOfClassworkOrExams)).map(v => ({
        dateText: `${formatDate(v.start)} - ${formatDate(v.end)}`, name: v.name, dayText: `${getDayName(v.start).split(' ')[0]} - ${getDayName(v.end).split(' ')[0]}`
    })));

    if (['I Semester', 'III Semester', 'V Semester', 'VII Semester'].includes(SEMESTER_NAMES[i].name)) {
        currentAYStartYear = currentSemStart.getFullYear();
    }
    const academicYearStr = `${currentAYStartYear}-${(currentAYStartYear+1).toString().slice(-2)}`;
    console.log("Semester:", SEMESTER_NAMES[i].name);
console.log("Holidays Passed:", liveHolidays);
console.log("Vacations Passed:", semVacations);

    semesters.push({
      name: SEMESTER_NAMES[i].name,
      academicYear: academicYearStr,
      events: events.filter(e => !e.hideFromTable),
      gridEvents: events.filter(e => !e.hideFromGrid),
      holidaysList: displayHolidays,
      
      gridData: buildGridForSemester(events, currentSemStart, endOfClassworkOrExams, liveHolidays, semVacations, SEMESTER_NAMES[i].name)
    });

    if (nextSemStart) currentSemStart = nextSemStart;
  }

  const masterSchedule = semesters.map(sem => {
    const getEventStr = (keyword) => {
      const ev = sem.events.find(e => e.name.includes(keyword));
      if (!ev) return '-';
      return ev.end && ev.start !== ev.end ? `${formatDate(ev.start)}-\n${formatDate(ev.end)}` : formatDate(ev.start);
    };

    return {
      ay: sem.academicYear,
      name: sem.name.replace(' Semester', ''), 
      fullName: sem.name,
      commencement: getEventStr('Commencement of Class Work'),
      internal1: getEventStr('Internal Examinations - I'),
      internal2: getEventStr('Internal Examinations - II'),
      lab: getEventStr('Semester End Examinations - Lab'),
      theory: sem.name === 'VIII Semester' ? getEventStr('Project Viva') : getEventStr('Semester End Examinations - Theory')
    };
  });

  const groupedMaster = {};
  masterSchedule.forEach(sem => {
      if(!groupedMaster[sem.ay]) groupedMaster[sem.ay] = [];
      groupedMaster[sem.ay].push(sem);
  });

  return { semesters, groupedMaster };
};