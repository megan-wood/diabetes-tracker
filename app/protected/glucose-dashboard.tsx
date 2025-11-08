"use client" 

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase/client";
import GlucoseForm from "./glucose-form";
import RecentData from "./recent-data";

export default function GlucoseDashboard() {
    const [entries, setEntries] = useState<any[]>([]);
    const [filter, setFilter] = useState("all"); 

    //  channel for realtime database changes

    useEffect(() => {
        const channel = supabase 
            .channel("glucose_logs")
            .on(
                "postgres_changes", 
                { event: "*", schema: "public", table: "glucose_logs" }, 
                (payload) => {
                    const entry = payload.new as { type: string; glucose_value: number; row_id: string; time: string };
                    if (!entry) return; 

                    setEntries(prev => {
                        // checks if new entry found from database is already in entries and skips adding it
                        const isInEntries = prev.some(e => e.row_id === entry.row_id);
                        if (isInEntries) return prev;

                        return [entry, ...prev].slice(0, 5); 
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel); 
        }
    }, [filter]); 

    return (
        <>
            <h2>Current Trends:</h2>
            <GlucoseForm onNewEntry={(newEntry) => {
                // console.log("new entry: ", newEntry); 
                // console.log("new entry glucose: ", newEntry.glucose_value); 
                setEntries(prev => [newEntry, ...prev].slice(0, 5));
                }}
            />
            <h2>Your last 5 entries:</h2>
            <h2>Filter Option:</h2>
            <RecentData 
                entries={entries}
                setEntries={setEntries}
                filter={filter}
                setFilter={setFilter}
            /> 
        </>
    )
}