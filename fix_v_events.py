import json

with open("official_calendar_events.json", "r", encoding="utf-8") as f:
    data = json.load(f)

correct_v_events = [
    {
      "name": "Registration to V Semester Courses",
      "start": "17.06.2026",
      "end": "20.06.2026"
    },
    {
      "name": "Commencement of Class Work",
      "start": "29.06.2026",
      "end": None
    },
    {
      "name": "Last date to register or drop a Course with Fine",
      "start": "06.07.2026",
      "end": None
    },
    {
      "name": "Internal Examinations - I",
      "start": "19.08.2026",
      "end": "21.08.2026"
    },
    {
      "name": "Finalization of Detentions based on attendance",
      "start": "17.10.2026",
      "end": None
    },
    {
      "name": "Payment of Semester End Examination(SEE) fee",
      "start": "19.10.2026",
      "end": "21.10.2026"
    },
    {
      "name": "Internal Examinations - II",
      "start": "26.10.2026",
      "end": "28.10.2026"
    },
    {
      "name": "Makeup Internal Examinations",
      "start": "29.10.2026",
      "end": "31.10.2026"
    },
    {
      "name": "Semester End Examinations - Lab",
      "start": "02.11.2026",
      "end": "14.11.2026"
    },
    {
      "name": "Semester End Examinations - Theory",
      "start": "16.11.2026",
      "end": "28.11.2026"
    },
    {
      "name": "Declaration of Results",
      "start": "05.12.2026",
      "end": None
    },
    {
      "name": "Payment for SEE script viewing",
      "start": "05.12.2026",
      "end": "07.12.2026"
    },
    {
      "name": "SEE Script viewing by students",
      "start": "08.12.2026",
      "end": "09.12.2026"
    },
    {
      "name": "Payment for revaluation of SEE scripts",
      "start": "05.12.2026",
      "end": "10.12.2026"
    },
    {
      "name": "Declaration of Revaluation results",
      "start": "17.12.2026",
      "end": None
    },
    {
      "name": "Availability of Online Grade Sheet",
      "start": "21.12.2026",
      "end": None
    },
    {
      "name": "Commencement of VI Semester",
      "start": "30.11.2026",
      "end": None
    }
]

data["V"] = correct_v_events

with open("official_calendar_events.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("V Semester events updated successfully in official_calendar_events.json")
