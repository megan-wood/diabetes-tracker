"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import CustomAverage from "@/components/custom-average";
import { calculateFastingAvg } from "./utils";

export default function AnalyticsDashboard() {
  // get entries from database to do calculations with
  // const entries = await fetchEntries();
  // console.log("entries: ", entries);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEntries() {
      const { data, error } = await supabase
        .from("glucose_logs")
        .select("*")
        .eq("type", "fasting");

      if (error) console.log(error);
      else setEntries(data);
    }
    fetchEntries();
  }, []);

  console.log("entries on analytics: ", entries);

  // function calculateFastingAvg(months: number): number {
  //   let avg = 0; 
  //   const values = getFastingEntriesInRange(months);
  //   console.log("values: ", values); 
  //   avg = computeAvg(values); 
  //   return avg; 
  // }

  // function getFastingEntriesInRange(months: number) {
  //   const fastingEntries = entries.filter((entry) => entry.type === "fasting"); 
  //   console.log("fasting entries: ", fastingEntries); 
  //   const curDate = new Date();
  //   const thirtyDaysAgo = new Date(curDate.getTime() - (months * 30) * 24 * 60 * 60 * 1000);  // uses 30 days per month * 24 hours

  //   const values = fastingEntries
  //     .filter((entry) => {
  //       const entryDate = new Date(entry.time); 
  //       return entryDate >= thirtyDaysAgo && entryDate <= curDate; 
  //     })
  //     .map(entry => entry.glucose_value); 

  //   return values;
  // }

  // function computeAvg(values: number[]) {
  //   let sum = 0; 
  //   for (let i = 0; i < values.length; ++i) {
  //     sum += values[i];
  //   }
  //   return sum / values.length;
  // }


  return (
    <>
    <div className="flex flex-col w-full m-5 space-y-2">
      <Link href="/protected"><Button variant="outline">Go back to dashboard homepage</Button></Link>
      <h1 className="font-bold">Your analytics:</h1>
      <h2>One month fasting average: {calculateFastingAvg(1, entries)}</h2>
      <h2>Two month fasting average: {calculateFastingAvg(2, entries)}</h2>
      <h2>Three month fasting average: {calculateFastingAvg(3, entries)}</h2>
      <CustomAverage entries={entries}/>
    </div>
    </>
  )
}