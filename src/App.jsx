import React, { useState, useEffect } from 'react';
import { EVENT_COLORS } from './data/eventColors';
import { SCHEDULE_RULES } from './data/scheduleRules';
import SemesterView from "./components/SemesterView";
import Overview from "./components/Overview";
import { buildFullCalendar } from "./utils/calendarBuilder";
import { downloadPDF } from "./utils/pdfGenerator";
import { Icons } from "./components/Icons";
import { formatDate } from "./utils/dateUtils";
import { getCellStyles, getCellContent } from "./utils/calendarHelpers";
import Header from "./components/Header";
import CalendarTabs from "./components/CalendarTabs";

// MAIN REACT APPLICATION COMPONENT
export default function App() {
  const [commencementDate, setCommencementDate] = useState('2024-08-27');
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const [calendarData, setCalendarData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

 

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!apiKey) {
        alert("Please enter your Google Calendar API Key.");
        return;
    }
    
    setIsGenerating(true);
    try {
      const data = await buildFullCalendar(commencementDate, apiKey);
      setCalendarData(data);
      setActiveTab('overview');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

 

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-10">
      

      <main className="max-w-[1400px] mx-auto px-4 py-8">
<Header
  commencementDate={commencementDate}
  setCommencementDate={setCommencementDate}
  handleGenerate={handleGenerate}
  isGenerating={isGenerating}
  calendarData={calendarData}
  downloadPDF={downloadPDF}
  scriptsLoaded={scriptsLoaded}
/>
        {!calendarData ? (
           <div className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl p-16 shadow-sm min-h-[500px] text-center">
             <div className="bg-slate-100 p-6 rounded-full text-[#1e3a8a] mb-6 animate-pulse">
               <Icons.Calendar />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-3">Academic Calendar Generator</h2>
             <p className="text-slate-500 max-w-lg leading-relaxed text-sm">
               Configure the classwork commencement date in the header and click <strong>Generate Calendar</strong> to load university holidays and build the schedule.
             </p>
           </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <CalendarTabs
              calendarData={calendarData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            {activeTab === 'overview' ? (
              <Overview
                calendarData={calendarData}
                commencementDate={commencementDate}
                activeTab={activeTab}
              />
            ) : (
              <SemesterView
                calendarData={calendarData}
                activeTab={activeTab}
                EVENT_COLORS={EVENT_COLORS}
                getCellStyles={getCellStyles}
                getCellContent={getCellContent}
                formatDate={formatDate}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}