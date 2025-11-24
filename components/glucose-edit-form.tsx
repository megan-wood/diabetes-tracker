"use client"

import { useState, useRef } from "react";

import {
  Dialog, 
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { Pencil } from "lucide-react";

interface GlucoseEditFormProps {
  entry: any; 
  open: boolean; 
  setOpen: (o: boolean) => void;
}

export default function GlucoseEditForm({entry, open, setOpen}: GlucoseEditFormProps) {
  const [glucose, setGlucose] = useState(entry.glucose_value);
  const [date, setDate] = useState(new Date(entry.time));
  const [time, setTime] = useState(getTimeStr(new Date(entry.time))); 
  const [glucoseType, setGlucoseType] = useState(entry.type);
  const [notes, setNotes] = useState(entry.notes);
  const saveButtonRef =  useRef<HTMLButtonElement>(null); 


  function getTimeStr(chosenTime: Date) {
    const hours = chosenTime.getHours().toString().padStart(2, "0");
    const mins = chosenTime.getMinutes().toString().padStart(2, "0");
    const secs = chosenTime.getSeconds().toString().padStart(2, "0");
    return `${hours}:${mins}:${secs}`;
  }

  const handleUpdate = async (e:React.FormEvent) => {
    e.preventDefault();
    console.log("handing update");
    const {data: {user}} = await supabase.auth.getUser();
    
    const [hours, mins, secs] = time.split(":").map(Number);
    const datetime = new Date(date); 
    datetime.setHours(hours, mins, secs || 0); 

    const { data, error } = await supabase
      .from("glucose_logs")
      .update({time: datetime, glucose_value: glucose, type: glucoseType, notes: notes})
      .eq("row_id", entry.row_id)
      .select();
    console.log("updated entry: ", data); 
    setOpen(false); 
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent onOpenAutoFocus={(e) => {
      e.preventDefault();
      saveButtonRef.current?.focus();
      }}
    >
    {/* <DialogContent> */}
      <form onSubmit={handleUpdate}>
        <DialogHeader>
            <DialogTitle>Edit Glucose Entry</DialogTitle>
            <DialogDescription>You can edit all fields of the entry and make sure to click "Save".</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pb-5">
          {/* glucose input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="glucose">Glucose Value</Label>
            <Input 
              id="glucose"
              type="number"
              placeholder="100"
              required
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              autoFocus={false}
            />
          </div>

          {/* date and time picker */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="dateTime">Date and Time</Label>
              <div className="flex justify-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                        variant="outline"
                        id="dateTime"
                        className="w-32 justify-between font-formal"
                    >
                        {/* {date?.toLocaleDateString()} */}
                        {date ? date.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[150%] overflow-hidden p-1" align="start">
                    <Calendar
                      className="w-full text-base"
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date) {
                          setDate(date)
                        }
                          // setOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex flex-col">
                    <p>{time}</p>
                    <Label htmlFor="time-picker" className=""></Label>
                    <Input
                      type="time"
                      id="time-picker"
                      step="1"
                      defaultValue={time.slice(0,5)}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                </div>
              </div>
          </div>
          {/* glucose type picker */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="glucose-type">Glucose Type</Label>
            <ToggleGroup type="single" variant="outline" defaultValue="fasting" aria-label="glucose type"
              value={glucoseType}
              onValueChange={(glucoseType) => {
                if (glucoseType) {
                  setGlucoseType(glucoseType);
                }
              }}
            >
              <ToggleGroupItem value="fasting" aria-label="Fasting type" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors duration-300">Fasting</ToggleGroupItem>
              <ToggleGroupItem value="beforeMeal" aria-label="Before meal type" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors duration-300">Before Meal</ToggleGroupItem>
              <ToggleGroupItem value="afterMeal" aria-label="After meal type" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors duration-300">After Meal</ToggleGroupItem>
              {/* className="transition-colors duration-200 bg-white text-black data-[state=on]:bg-black data-[state=on]:text-white border border-black px-4 py-2 rounded" */}
            </ToggleGroup>
          </div>
          <div className="flex flex-col gap-2">
            {/* notes section */}
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              placeholder="Add any optional notes"
              value={notes}
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
            /> 
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="px-4 py-2">Cancel</Button>
          </DialogClose>
          <Button type="submit" ref={saveButtonRef} className="border px-4 py-2">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  )
}