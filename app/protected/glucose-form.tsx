"use client"

import { useState } from "react";
import supabase  from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface GlucoseFormProps {
  onNewEntry?: (entry: any) => void;
  filter: string 
}
export default function GlucoseForm( {onNewEntry, filter }: GlucoseFormProps) {
   function getCurTimeStr() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      const secs = now.getSeconds().toString().padStart(2, "0");
      return `${hours}:${mins}:${secs}`;
    };

    const router = useRouter(); 
    const [glucose, setGlucose] = useState("");
    const [open, setOpen] = useState(false); 
    // const [date, setDate] = useState<Date | undefined>(undefined);
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState(getCurTimeStr()); 
    // const [date, setDate] = useState<Date>(new Date());
    // const [curTime, setCurTime] = useState(getCurTimeStr());
    const [glucoseType, setGlucoseType] = useState("fasting");

    function handleOpenChange(isOpen: boolean) {
      setOpen(isOpen);  // maintain the currrent boolean value for open
      if (isOpen) {
        // console.log("isOpen true"); 
        setTime(getCurTimeStr()); 
      }
    }

    const handleNewData = async (e: React.FormEvent) => {
        e.preventDefault();
        // const supabase = createClient(); 
        const {data: { user } } = await supabase.auth.getUser();
        // const user = await supabase.auth.getUser();
        // console.log("user data: ", user); 

        if (!user) {
          console.log("user is not logged in"); 
          return alert("You must be logged in!");
        }

        console.log("logged in user: ", user.id); 

        const { data, error : profileError} = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id);
        // console.log("profile data: ", data); 

        // const profilesUserId = await supabase.
        
        // combines selected date and time into single Date element to insert in db
        const [hours, mins, secs] = time.split(":").map(Number);
        // const [hours, mins] = curTime.split(":").map(Number);
        
        const datetime = new Date(date);
        datetime.setHours(hours, mins, secs || 0);


        // make sure id is unique to identify the row and user id should keep track of val from
        const { data: insertedData, error } = await supabase
          .from("glucose_logs")
          .insert({user_id: user.id, time: datetime, glucose_value: glucose, type: glucoseType})
          .select();
        // console.log("insertedData: ", insertedData); 
        if (!error) {
          // console.log("insertedData: ", insertedData); 
          console.log("filter in form: ", filter); 
          console.log("filter of new entry: ", insertedData[0].type);
          console.log("first: ", (filter == "all"), " second: ", (filter == insertedData[0].type));
          if (filter == "all" || filter == insertedData[0].type) {
            onNewEntry?.(insertedData[0]);  // notify parent that there is new entry and pass actual new entry value
          }
          setGlucose("");
          setGlucoseType("fasting");
          setOpen(false);
          // onNewEntry(insertedData[0]);
          // console.log("refreshing page"); 
          // router.refresh(); 
          // window.location.reload();  // reload the page after entry so that new one can appear in recent data
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="w-[25%]" >Add a glucose value</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleNewData}>
                <DialogHeader>
                  <DialogTitle>Adding Glucose Value</DialogTitle>
                  <DialogDescription className="mb-2">
                    Please type in the glucose value. 
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-6 pb-5">
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
                      />
                  </div>
                  {/* date and time picker */}
                  <div className="flex flex-col gap-2">
                      <Label htmlFor="dateTime">Date and Time</Label>
                      <div className="flex justify-center">
                          {/* <Popover open={open} onOpenChange={setOpen}> */}
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
                      {/* glucose type picker */}
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
                      </ToggleGroup>
                      <div>

                      </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="px-4 py-2">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" className="border px-4 py-2">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>

        </Dialog>
    )
}
