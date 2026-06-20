import React from "react";

export default function CalendarTabs({
  calendarData,
  activeTab,
  setActiveTab
}) {
  return (
    <div className="bg-slate-50 border-b border-slate-200 flex overflow-x-auto scrollbar-hide p-2 gap-2">
      <button
        onClick={() => setActiveTab("overview")}
        className={`px-5 py-2 text-sm font-bold rounded transition-colors whitespace-nowrap ${
          activeTab === "overview"
            ? "bg-[#1e3a8a] text-white shadow"
            : "bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100"
        }`}
      >
        MASTER ACADEMIC CALENDAR
      </button>

      <div className="w-px bg-slate-300 mx-2 my-1"></div>

      {calendarData.semesters.map((sem, idx) => (
        <button
          key={idx}
          onClick={() => setActiveTab(idx)}
          className={`px-5 py-2 text-sm font-bold rounded transition-colors whitespace-nowrap ${
            activeTab === idx
              ? "bg-[#1e3a8a] text-white shadow"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          {sem.name}
        </button>
      ))}
    </div>
  );
}