"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function GlucoseForm() {
   function getCurTimeStr() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      return `${hours}:${mins}`;
    };

    const [glucose, setGlucose] = useState("");
    const [open, setOpen] = useState(false); 
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState(new Date()); 
    // const [date, setDate] = useState<Date>(new Date());
    const [curTime, setCurTime] = useState(getCurTimeStr());

   

    const handleNewData = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient(); 
    }

    return (
        <Dialog>
          <form onSubmit={handleNewData}>
            <DialogTrigger asChild>
              <Button>Add a glucose value</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adding Glucose Value</DialogTitle>
                <DialogDescription>
                  Please type in the glucose value. 
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="glucose">Glucose Value</Label>
                    <Input 
                        id="glucose"
                        type="number"
                        placeholder="100"
                        required
                        value={glucose}
                        onChange={(e) => setGlucose(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="dateTime">Date and Time</Label>
                    <div className="flex justify-center">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="outline"
                                    id="dateTime"
                                    className="w-32 justify-between font-formal"
                                >
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
                                        setDate(date)
                                        setOpen(false)
                                    }}
                                        />
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-col">
                            <Label htmlFor="time-picker" className=""></Label>
                            <Input
                                type="time"
                                id="time-picker"
                                step="1"
                                defaultValue={curTime}
                                value={curTime}
                                onChange={(e) => setCurTime(e.target.value)}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                        </div>
                    </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save data</Button>
              </DialogFooter>
            </DialogContent>

          </form>
        </Dialog>
    )
}
