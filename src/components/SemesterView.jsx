
import React from "react";
import { getEventColorConfig } from "../data/eventColors";

export default function SemesterView({
  calendarData,
  activeTab,
  EVENT_COLORS,
  formatDate,
  getCellStyles,
  getCellContent
}) {
  return (
    <>
            {activeTab !== 'overview' && (
              <div className="p-8">
                
                {/* 1. Academic Calendar Events Table */}
                <div className="mb-16">
                  <div className="text-center mb-6">
                    <div className="flex justify-center items-center gap-4 mb-2">
                     <img
  src="/logo.jpeg"
  alt="College Logo"
  style={{
    width: "120px",
    height: "120px",
    border: "3px solid white"
  }}
/>
                      <h1 className="text-3xl font-bold text-[#1e3a8a] tracking-wider font-serif">ADITYA UNIVERSITY</h1>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 underline decoration-slate-400 underline-offset-4 uppercase">
                      ACADEMIC CALENDAR (A.Y {calendarData.semesters[activeTab].academicYear})
                    </h2>
                    <h3 className="text-lg font-semibold text-slate-600 mt-2">{calendarData.semesters[activeTab].name}</h3>
                  </div>

                  <div className="overflow-x-auto shadow-sm border-2 border-[#e09b60]">
                    <table className="w-full text-left text-sm text-slate-800 border-collapse">
                      <thead className="bg-[#1b1285] text-white font-bold">
                        <tr>
                          <th className="px-4 py-3 w-16 text-center border-r border-b border-[#e09b60]">S.No.</th>
                          <th className="px-4 py-3 border-r border-b border-[#e09b60]">Description</th>
                          <th className="px-4 py-3 border-r border-b border-[#e09b60] w-40 text-center">From</th>
                          <th className="px-4 py-3 w-40 text-center border-b border-[#e09b60]">To</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white font-medium">
                        {calendarData.semesters[activeTab].events.map((event, idx) => {
                          const isLastRow = idx === calendarData.semesters[activeTab].events.length - 1;
                          const cellBorderClass = `px-4 py-3 border-[#e09b60] ${isLastRow ? "" : "border-b"}`;
                          return (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className={`${cellBorderClass} text-center border-r`}>{event.sNo}.</td>
                              <td className={`${cellBorderClass} border-r`}>{event.name}</td>
                              <td className={`${cellBorderClass} text-center border-r`}>{formatDate(event.start)}</td>
                              <td className={`${cellBorderClass} text-center`}>{event.end ? formatDate(event.end) : ''}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-300 mb-16 shadow-sm"></div>

                {/* 2. Working Days Grid & Holidays */}
                <div className="text-center mb-6">
                  <div className="flex justify-center items-center gap-4 mb-2">
                   <img
  src="/logo.jpeg"
  alt="College Logo"
  style={{
    width: "120px",
    height: "120px",
    border: "3px solid white"
  }}
/>
                    <h1 className="text-3xl font-bold text-[#1e3a8a] tracking-wider font-serif">ADITYA UNIVERSITY</h1>
                  </div>
                  <h2 className="text-xl font-bold text-orange-500 underline decoration-orange-500 underline-offset-4 uppercase">
                    WORKING DAYS IN THE {calendarData.semesters[activeTab].name} FOR THE A.Y {calendarData.semesters[activeTab].academicYear}
                  </h2>
                </div>

                <div className="w-full overflow-x-auto mb-8 shadow-sm">
                  <table className="w-full border-collapse border-2 border-[#1e3a8a] text-xs text-center font-medium font-sans">
                    <thead>
                      <tr className="bg-white">
                        <th rowSpan={2} className="border-2 border-[#1e3a8a] p-2 text-[#1e3a8a] w-16">Days</th>
                        <th colSpan={calendarData.semesters[activeTab].gridData.weeks.length} className="border-2 border-[#1e3a8a] p-1 text-[#1e3a8a]">Months</th>
                        <th rowSpan={2} className="border-2 border-[#1e3a8a] p-2 text-[#1e3a8a] w-20 leading-tight">Total<br/>Working<br/>days</th>
                      </tr>
                      <tr className="bg-white text-[#1e3a8a]">
                        {calendarData.semesters[activeTab].gridData.months.map((m, i) => (
                          <th key={i} colSpan={m.span} className="border-2 border-[#1e3a8a] p-1">{m.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, dayIndex) => (
                        <tr key={dayName}>
                          <td className="border border-[#1e3a8a] font-bold text-[#1e3a8a] bg-white p-1">{dayName}</td>
                          {calendarData.semesters[activeTab].gridData.weeks.map((w, wIdx) => {
                             const dayObj = w.days[dayIndex];
                             const style = getCellStyles(dayObj);
                             return (
                               <td key={wIdx} className="border border-[#1e3a8a] p-1 min-w-[24px]" style={style}>
                                 {getCellContent(dayObj)}
                               </td>
                             )
                          })}
                          <td className="border-2 border-[#1e3a8a] font-bold bg-white p-1">
                              {calendarData.semesters[activeTab].gridData.dayTotals[dayIndex]}
                          </td>
                        </tr>
                      ))}
                      
                      <tr>
                        <td className="border-2 border-[#1e3a8a] font-bold text-[#1e3a8a] bg-white p-1">Week</td>
                        {calendarData.semesters[activeTab].gridData.weekLabels.map((lbl, i) => (
                          <td key={i} colSpan={lbl.span} className="border border-[#1e3a8a] font-bold bg-white p-1">
                            {lbl.label}
                          </td>
                        ))}
                        <td className="border-2 border-[#1e3a8a] bg-slate-100"></td>
                      </tr>

                      <tr>
                        <td className="border-2 border-[#1e3a8a] font-bold text-[#1e3a8a] bg-white p-1">Total<br/>Days</td>
                        {calendarData.semesters[activeTab].gridData.months.map((m, i) => {
                          let totalInMonth = 0;
                          m.weeks.forEach(w => w.days.forEach(d => { if (d.isInstructional) totalInMonth++; }));
                          return (
                            <td key={i} colSpan={m.span} className="border-2 border-[#1e3a8a] font-bold bg-white p-1">
                              {totalInMonth}
                            </td>
                          );
                        })}
                        <td className="border-2 border-[#1e3a8a] font-bold bg-white p-1 text-[#1e3a8a]">
                          {calendarData.semesters[activeTab].gridData.dayTotals.reduce((a,b)=>a+b, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                  
                  {/* Visual Legend strictly matched to screenshot */}
                  <div className="w-full xl:w-1/2 overflow-x-auto shadow-sm border-2 border-[#1e3a8a]">
                    <table className="w-full text-xs font-bold text-left border-collapse">
                      <tbody>
                        {calendarData.semesters[activeTab].gridEvents.map((ev, i) => {
                          const colorConfig = getEventColorConfig(ev.name) || { bg: '#ffffff', text: '#000000' };
                          return (
                            <tr key={i} className="border-b border-[#1e3a8a]">
                              <td className="p-2 border-r border-[#1e3a8a]" style={{ backgroundColor: colorConfig.bg, color: colorConfig.text }}>
                                {ev.name}
                              </td>
                              <td className="p-2" style={{ backgroundColor: colorConfig.bg, color: colorConfig.text, textAlign: 'center' }}>
                                {formatDate(ev.start)} {ev.end && ev.start !== ev.end ? `- ${formatDate(ev.end)}` : ''}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Visual Holidays List strictly matched to screenshot */}
                  <div className="w-full xl:w-1/2 overflow-x-auto shadow-sm border-2 border-[#1e3a8a]">
                    <table className="w-full text-xs font-bold text-center border-collapse">
                      <thead>
                        <tr>
                          <th colSpan="3" className="bg-[#1e3a8a] text-white p-2 text-sm border-b border-[#1e3a8a]">List of Holidays</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {calendarData.semesters[activeTab].holidaysList.map((hol, i) => (
                          <tr key={i} className="border-b border-[#1e3a8a]">
                            <td className="p-2 border-r border-[#1e3a8a] text-left pl-4">{hol.name}</td>
                            <td className="p-2 border-r border-[#1e3a8a]">{hol.dateText}</td>
                            <td className="p-2">{hol.dayText}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="3" className="p-3 text-left font-semibold text-slate-800 bg-slate-50">
                            Note: Holidays are subject to change as per the AP Government notification
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            )}
             </>
  );
}