"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabase/server";

export default function RecentData({ entries }: {entries: any[]}) {
    // const supabase = createClient(); 
    // const {data: {user}} = await supabase.auth.getUser(); 
    // console.log("user recent data: ", user); 
    return (
        // <></>
        <ul className="space-y-2">
        {entries.map((e) => (
            <li key={e.id} className="border p-2 rounded">
                <span className="font-semibold">{e.glucose_value}</span>{" "}
                <span className="text-sm text-muted-foreground">
                {new Date(e.time).toLocaleString()}
            </span>
            </li>
            ))}
        </ul>
    );
}


/* 
function EntriesList({ entries }: { entries: any[] }) {
  return (
    <ul className="space-y-2">
      {entries.map((e) => (
        <li key={e.id} className="border p-2 rounded">
          <span className="font-semibold">{e.glucose_value}</span>{" "}
          <span className="text-sm text-muted-foreground">
            {new Date(e.created_at).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}

*/ 