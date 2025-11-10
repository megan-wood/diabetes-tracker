"use client"

import { useState } from "react"; 
import supabase from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

// type GlucoseEntry = {
//     row_id: string;
//     user_id: string; 
//     time: string; 
//     glucose_value: number; 
//     type: string; 
// };

export default function EditOptions({selectedEntry}: any) {
    const [showedEditDialog, setShowEditDialog] = useState(false); 
    const [showDeleteDialog, setShowDeleteDialog] = useState(false); 

    async function handleDelete() {
        console.log("entry to delete: ", selectedEntry);
        const { data, error }= await supabase
            .from("glucose_logs")
            .delete()
            .eq("row_id", selectedEntry.row_id)
            .select();
        console.log("entry that was deleted: ", data);
    }

    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="Edit options menu"><Ellipsis/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {/* <DrodownmenuLabel></DrodownmenuLabel> */}
                <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                    <Pencil/>Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>
                    <Trash2/>Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent className="sm:max-w-[50%]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this entry?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-5 justify-center">
                    <AlertDialogCancel className="">
                        {/* <Button variant="ghost">Cancel</Button> */}
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            handleDelete(); 
                            setShowDeleteDialog(false); 
                        }}
                        className="bg-red-600 text-white hover:bg-red-700">
                        Delete
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showedEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit this entry</DialogTitle>
                    <DialogDescription>You can edit this entry and click "Save" when done.</DialogDescription>
                </DialogHeader>
                
            </DialogContent>
        </Dialog>
        </>
    )
}