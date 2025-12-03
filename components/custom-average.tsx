"use client"
import { useState } from "react"; 
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
import { Input } from "@/components/ui/input";
import { calculateFastingAvg } from "@/app/analytics-dashboard/utils";

export default function CustomAverage(entries: any) {
  const [formOpen, setFormOpen] = useState(false); 
  const [avgOpen, setAvgOpen] = useState(false); 
  const [months, setMonths] = useState(""); 
  const [avg, setAvg] = useState(0); 

  function handleAvgRequest() {
    // console.log("button clicked");
    setFormOpen(false); 
    setAvg(calculateFastingAvg(parseInt(months), entries));
    setAvgOpen(true); 
  }

  function handleAvg() {
    setAvgOpen(true);
  }

  return (
    <>
      <Dialog open={formOpen} onOpenChange={setFormOpen}> 
          <DialogTrigger asChild>
            <Button className="w-[33%]">
                Calculate a custom fasting average
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form
            onSubmit={(e) => {
              e.preventDefault;
              handleAvgRequest();
            }}>
              <DialogHeader>
                <DialogTitle>Calculate fasting average over a custom range</DialogTitle>
                <DialogDescription className="mb-2">Please enter how many months from today that you would like to use to calculate the fasting average.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-3 pb-5 w-[33%]">
                <Input type="number" 
                  id="months" 
                  placeholder="ex: 1"
                  onChange={(e) => setMonths(e.target.value)}></Input>
                <p>months</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Calculate</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
      
      {/* Display average popup dialog */}
      <Dialog open={avgOpen} onOpenChange={setAvgOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your fasting average for {months} months:</DialogTitle>
            </DialogHeader>
            <p>average:{avg}</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAvgOpen(false)}>Close</Button>
              <Button onClick={() => {
                setAvgOpen(false);
                setFormOpen(true);
              }}>Calculate another custom average</Button>
            </DialogFooter>
          </DialogContent>

      </Dialog>
    </>
  ); 
}