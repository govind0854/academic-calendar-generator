export const EVENT_COLORS = [
  { keyword: "Commencement of Class Work", bg: "#04ae4e", text: "#ffffff" },
  { keyword: "Commencement of Project work", bg: "#04ae4e", text: "#ffffff" },
  { keyword: "Internal Examinations", bg: "#c5049f", text: "#ffffff" },
  { keyword: "Finalization of Detentions", bg: "#d90000", text: "#ffffff" },
  { keyword: "Payment of Semester End", bg: "#d9b08c", text: "#000000" },
  { keyword: "Last Date to Pay", bg: "#d9b08c", text: "#000000" },
  { keyword: "Last Date to pay", bg: "#d9b08c", text: "#000000" },
  { keyword: "Makeup Internal", bg: "#2b6477", text: "#ffffff" },
  { keyword: "Examinations – Lab", bg: "#7c5aa6", text: "#ffffff" },
  { keyword: "Examinations - Lab", bg: "#7c5aa6", text: "#ffffff" },
  { keyword: "Examinations – Theory", bg: "#ffc100", text: "#000000" },
  { keyword: "Examinations - Theory", bg: "#ffc100", text: "#000000" },
  { keyword: "Semester End Examinations", bg: "#ffc100", text: "#000000" }
];

export const getEventColorConfig = (name) => {
  if (!name) return null;
  const clean = name.toLowerCase().replace(/[\s\-\—\–\(\)]+/g, " ").trim();
  
  if (clean.includes("commencement of class") || clean.includes("commencement of project")) {
    return { bg: "#04ae4e", text: "#ffffff" };
  }
  if (clean.includes("makeup") && clean.includes("internal")) {
    return { bg: "#2b6477", text: "#ffffff" };
  }
  if (clean.includes("internal exam")) {
    return { bg: "#c5049f", text: "#ffffff" };
  }
  if (clean.includes("finalization of detention")) {
    return { bg: "#d90000", text: "#ffffff" };
  }
  if (clean.includes("payment of semester end") || 
      clean.includes("last date to pay") || 
      (clean.includes("semester end") && (clean.includes("fee") || clean.includes("pay")))) {
    return { bg: "#d9b08c", text: "#000000" };
  }
  if (clean.includes("semester end") && clean.includes("lab")) {
    return { bg: "#7c5aa6", text: "#ffffff" };
  }
  if (clean.includes("semester end")) {
    return { bg: "#ffc100", text: "#000000" };
  }
  if (clean.includes("induction program")) {
    return { bg: "#ffc100", text: "#000000" };
  }
  return null;
};

export const getGridCellColorConfig = (name) => {
  return getEventColorConfig(name);
};