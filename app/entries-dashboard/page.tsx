"use client"

import supabase from "@/lib/supabase/client";
import { useState, useEffect } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react"; 
import EditOptions from "./edit-options"



export default function EntriesDashboard() {
  const [filter, setFilter] = useState("all");
  const [entries, setEntries] = useState<any[]>([]);

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
      console.log("filter: ", filter); 
      let query = supabase.from("glucose_logs").select("*").order("time", {ascending: false})
      if (filter != "all") {
        query = query.eq("type", filter);
      }
      const { data, error } = await query;

      setEntries(data ?? []); 
      console.log("entries dashboard: ", entries); 
    };
    fetchEntries();
  }, [filter]);  // refetches when filter changes

  return (
      <div className="m-5 space-y-2">
        <Link href="/protected"><Button variant="outline">Go back to dashboard homepage</Button></Link>
        <ToggleGroup type="single" variant="outline" defaultValue="all" aria-label="filter type"
          value={filter}
          onValueChange={(filter) => {
              if (filter) {
                  setFilter(filter);
              }
          }}
        >
          <ToggleGroupItem value="all" aria-label="All filter" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors duration-300">All</ToggleGroupItem>
          <ToggleGroupItem value="fasting" aria-label="Fasting filter" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors duration-300">Fasting</ToggleGroupItem>
          <ToggleGroupItem value="beforeMeal" aria-label="Before meal fitler" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors duration-300">Before Meal</ToggleGroupItem>
          <ToggleGroupItem value="afterMeal" aria-label="After meal filter" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors duration-300">After Meal</ToggleGroupItem>
        </ToggleGroup>

        <Table className="w-[50%]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Glucose Value</TableHead>
              <TableHead className="w-[10%]">Type</TableHead>
              <TableHead className="w-[5%]">Time</TableHead>
              <TableHead className="w-[1%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.row_id}>
                <TableCell>{entry.glucose_value}</TableCell>
                <TableCell>{getTypeString(entry.type)}</TableCell>
                <TableCell>{new Date(entry.time).toLocaleString()}</TableCell>
                {/* <TableCell>
                  <Button variant="outline" size="sm">
                    <Pencil/>Edit
                  </Button></TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Trash2/>Delete
                  </Button></TableCell> */}
                  <TableCell>
                    <EditOptions/>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

  )
}
