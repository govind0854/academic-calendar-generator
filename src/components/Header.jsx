import React from "react";
import { EVENT_COLORS } from "../data/eventColors";
import { SCHEDULE_RULES } from "../data/scheduleRules";
import { Icons } from "./Icons";
import { formatDate } from "../utils/dateUtils";

export default function Header({
  commencementDate,
  setCommencementDate,
  handleGenerate,
  isGenerating,
  calendarData,
  downloadPDF,
  scriptsLoaded
}) {
  return (
    <header className="bg-white border-b border-slate-300 shadow-sm sticky top-0 z-10">
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="College Logo"
            style={{
              width: "120px",
              height: "120px",
              border: "3px solid white",
            }}
          />

          <div>
            <h1 className="text-xl font-bold text-[#1e3a8a] tracking-tight">
              Intelligent Academic Planner
            </h1>

            <p className="text-xs text-orange-600 font-semibold uppercase">
              Aditya University
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <form onSubmit={handleGenerate} className="flex gap-2 items-center">
            <input
              type="date"
              className="border border-slate-300 rounded px-3 py-1.5 text-sm"
              value={commencementDate}
              onChange={(e) => setCommencementDate(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isGenerating}
              className="bg-[#1e3a8a] text-white text-sm font-medium py-1.5 px-4 rounded"
            >
              {isGenerating
                ? "Fetching Live Data..."
                : "Generate Calendar"}
            </button>
          </form>

          {calendarData && (
            <button
              onClick={() =>
                downloadPDF(
  calendarData,
  commencementDate,
  EVENT_COLORS,
  SCHEDULE_RULES,
  formatDate
)
              }
              disabled={false}
              className="bg-orange-600 text-white text-sm font-medium py-1.5 px-4 rounded flex items-center gap-2"
            >
              <Icons.Download />
              Download PDF
            </button>
          )}
        </div>
      </div>
    </header>
  );
}