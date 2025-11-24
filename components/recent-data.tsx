"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecentDataProps {
  entries: any[];
  setEntries: React.Dispatch<React.SetStateAction<any[]>>;
  filter: string; 
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function RecentData({ entries, setEntries, filter, setFilter }: RecentDataProps) {
    // const supabase = createClient(); 
    // const {data: {user}} = await supabase.auth.getUser(); 
    // console.log("user recent data: ", user); 
    // const [entries, setEntries] = useState(initialEntries);
    
    // const [entries, setEntries] = useState<any[]>([]);  // most recently used
    // const [filter, setFilter] = useState("all");  // most recently used 
  
    function getTypeString(typeString: string): string {
      if (typeString == "fasting") {
        return "Fasting";
      } else if (typeString == "beforeMeal") {
        return "Before Meal";
      } else {
        return "After Meal";
      }
    }

    useEffect(() => {
      const fetchEntries = async () => {
        console.log("filter: ", filter, " refetching entries"); 
        if (filter == "all") {
          const { data } = await supabase
            .from("glucose_logs")
            .select("*")
            .order("time", {ascending: false})
            .limit(5); 
          setEntries(data ?? []);
        } else {
          const { data } = await supabase
            .from("glucose_logs")
            .select("*")
            .order("time", {ascending: false})
            .eq("type", filter)
            // .eq("type", filter === "all" ? undefined : filter)
            .limit(5); 
          setEntries(data ?? []);
        }
      };
      fetchEntries();
    }, [filter]);  // refetches when filter changes


    // console.log("realtime client: ", supabase.realtime); 

  //   useEffect(() => {
  //     const channel = supabase 
  //       .channel("glucose_logs")
  //       .on("postgres_changes", { event: "*", schema: "public", table: "glucose_logs" }, 
  //         (payload) => {
  //           const newEntry = payload.new as { type: string; glucose_value: number; row_id: string; time: string };
  //           console.log("new entry: ", newEntry);
  //           // console.log("realtime payload: ", payload); 
  //           setEntries((prev) => {
  //             console.log("filter: ", filter); 
  //             if (filter == "all") {
  //               console.log("new entry: ", newEntry);
  //               console.log("new entry type: ", newEntry.type); 
  //               console.log("adding new entry");
  //               console.log("filter inside: ", filter);
  //               return [newEntry, ...prev].slice(0, 5); 
  //             }
  //             return prev;
  //           });
  //         }
  //       )
  //       .subscribe(); 

  //   return () => {
  //     supabase.removeChannel(channel); 
  //   };
  //  }, []);

    return (
        // <></>
        <>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a filter option"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="fasting">Fasting</SelectItem>
            <SelectItem value="beforeMeal">Before Meal</SelectItem>
            <SelectItem value="afterMeal">After Meal</SelectItem>
          </SelectContent>
        </Select>

        <Table className="w-[75%]">
          {/* <TableCaption>
            The 5 most recent glucose entries. 
          </TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Glucose Value</TableHead>
              <TableHead className="w-[25%]">Type</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.row_id}>
                <TableCell>{entry.glucose_value}</TableCell>
                <TableCell>{getTypeString(entry.type)}</TableCell>
                <TableCell>{new Date(entry.time).toLocaleString()}</TableCell>
                <TableCell className="whitespace-normal break-words">{entry.notes}</TableCell>
              </TableRow>

            ))}

          </TableBody>

          {/* <TableFooter>


          </TableFooter> */}

        </Table>
        </>
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