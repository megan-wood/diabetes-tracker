"use client"

import { useState } from "react"; 
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

export default function EditOptions() {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); 
    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="Edit options menu"><Ellipsis/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {/* <DrodownmenuLabel></DrodownmenuLabel> */}
                <DropdownMenuItem>
                    <Pencil/>Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
                    <Trash2/>Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="sm:max-w-[50%]">
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this entry?</DialogTitle>
                    <DialogDescription>This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <div className="flex gap-5 justify-center">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" variant="destructive">Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}