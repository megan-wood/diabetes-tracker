export function calculateFastingAvg(months: number, entries: any[]): number {
  let avg = 0; 
  const values = getFastingEntriesInRange(months, entries);
  console.log("values: ", values); 
  avg = computeAvg(values); 
  return avg; 
}

function getFastingEntriesInRange(months: number, entries: any[]) {
  const fastingEntries = entries.filter((entry) => entry.type === "fasting"); 
  console.log("fasting entries: ", fastingEntries); 
  const curDate = new Date();
  const thirtyDaysAgo = new Date(curDate.getTime() - (months * 30) * 24 * 60 * 60 * 1000);  // uses 30 days per month * 24 hours

  const values = fastingEntries
    .filter((entry) => {
      const entryDate = new Date(entry.time); 
      return entryDate >= thirtyDaysAgo && entryDate <= curDate; 
    })
    .map(entry => entry.glucose_value); 

  return values;
}

function computeAvg(values: number[]) {
  let sum = 0; 
  for (let i = 0; i < values.length; ++i) {
    sum += values[i];
  }
  return sum / values.length;
}