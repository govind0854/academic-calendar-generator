import React from "react";
import { SCHEDULE_RULES } from "../data/scheduleRules";

export default function Overview({
  calendarData,
  commencementDate,
  activeTab
}) {
  if (activeTab !== "overview") return null;

  return (
    <div className="p-8 overflow-x-auto min-h-[500px]">
        
        {/* Page 1 Concept: Schedule Rules */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1e3a8a] tracking-wider font-serif mb-2">ADITYA UNIVERSITY</h1>
          <h2 className="text-lg font-bold text-slate-800 underline decoration-slate-400 underline-offset-4 uppercase">
            ACADEMIC CALENDAR SCHEDULE
          </h2>
        </div>
        <div className="shadow-sm border border-[#1e3a8a] overflow-x-auto mb-16">
           <table className="w-full text-center text-sm border-collapse">
              <thead className="bg-[#1e3a8a] text-white">
                 <tr>
                    <th className="border border-slate-300 p-3">Semester</th>
                    <th className="border border-slate-300 p-3">Classwork</th>
                    <th className="border border-slate-300 p-3">Vacation</th>
                    <th className="border border-slate-300 p-3">SEE-Lab</th>
                    <th className="border border-slate-300 p-3">SEE-Theory</th>
                 </tr>
              </thead>
              <tbody className="bg-white text-slate-800 font-medium">
                 {SCHEDULE_RULES.map((r, i) => (
                    <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="border border-[#1e3a8a] p-3 font-bold">{r.sem}</td>
                      <td className="border border-[#1e3a8a] p-3">{r.cw}</td>
                      <td className="border border-[#1e3a8a] p-3">{r.vac}</td>
                      <td className="border border-[#1e3a8a] p-3">{r.lab}</td>
                      <td className="border border-[#1e3a8a] p-3">{r.theory}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="w-full h-px bg-slate-300 mb-16 shadow-sm"></div>

        {/* Page 2 Concept: Master overview */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1e3a8a] tracking-wider font-serif mb-2">ADITYA UNIVERSITY</h1>
          <h2 className="text-lg font-bold text-slate-800 underline decoration-slate-400 underline-offset-4 uppercase">
            ACADEMIC CALENDAR FOR THE {commencementDate.split('-')[0]} ADMITTED BATCH
          </h2>
        </div>
        <div className="shadow-sm border border-[#1e3a8a] overflow-x-auto">
           <table className="w-full text-center text-sm border-collapse">
              <thead className="bg-[#1e3a8a] text-white">
                 <tr>
                    <th className="border border-slate-300 p-3 w-24">A.Y</th>
                    <th className="border border-slate-300 p-3">Semester</th>
                    <th className="border border-slate-300 p-3 leading-tight">Commencement<br/>of Class Work</th>
                    <th className="border border-slate-300 p-3 leading-tight">Internal<br/>Examinations-I</th>
                    <th className="border border-slate-300 p-3 leading-tight">Internal<br/>Examinations-II</th>
                    <th className="border border-slate-300 p-3 leading-tight">Semester End<br/>Examinations- Lab</th>
                    <th className="border border-slate-300 p-3 leading-tight">Semester End<br/>Examinations- Theory</th>
                 </tr>
              </thead>
              <tbody className="bg-white text-slate-800 font-medium align-middle">
                 {Object.entries(calendarData.groupedMaster).map(([ay, sems]) => (
                    sems.map((sem, idx) => (
                        <tr key={`${ay}-${idx}`} className="hover:bg-slate-50 border-b border-slate-200">
                            {idx === 0 && (
                                <td rowSpan={sems.length} className="border border-[#1e3a8a] p-3 font-bold bg-slate-50">{ay}</td>
                            )}
                            <td className="border border-[#1e3a8a] p-3 font-bold text-[#1e3a8a]">{sem.name}</td>
                            <td className="border border-[#1e3a8a] p-3">{sem.commencement}</td>
                            
                            {sem.fullName === 'VIII Semester' ? (
                                <td colSpan={4} className="border border-[#1e3a8a] p-3 text-slate-600">
                                   Project Work & Project Work Viva Voce - {sem.theory}
                                </td>
                            ) : (
                                <>
                                   <td className="border border-[#1e3a8a] p-3 whitespace-pre-line leading-tight text-slate-600">{sem.internal1}</td>
                                   <td className="border border-[#1e3a8a] p-3 whitespace-pre-line leading-tight text-slate-600">{sem.internal2}</td>
                                   <td className="border border-[#1e3a8a] p-3 whitespace-pre-line leading-tight text-slate-600">{sem.lab}</td>
                                   <td className="border border-[#1e3a8a] p-3 whitespace-pre-line leading-tight text-slate-600">{sem.theory}</td>
                                </>
                            )}
                        </tr>
                    ))
                 ))}
              </tbody>
           </table>
        </div>
    </div>
  );
}