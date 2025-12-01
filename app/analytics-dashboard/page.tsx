"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

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

  function calculateThreeMonthFastingAvg() {

  }


  return (
    <>
    <div className="flex flex-col w-full m-5 space-y-2">
      <Link href="/protected"><Button variant="outline">Go back to dashboard homepage</Button></Link>
      <h1 className="font-bold">Your analytics:</h1>

    </div>
    </>
  )
}