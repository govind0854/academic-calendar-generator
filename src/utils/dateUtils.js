export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`; 
};

export const formatMonthYear = (date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const getDayName = (date) => {
  return date.toLocaleString('default', { weekday: 'short' });
};

export const stripTime = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();