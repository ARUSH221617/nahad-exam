'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface DeleteButtonProps {
    id: string;
    onDelete: (id: string) => Promise<void>;
}

export function DeleteButton({ id, onDelete }: DeleteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        // Show loading toast
        const loadingToast = toast({
            title: "Deleting document...",
            description: "Please wait.",
            variant: "loading",
        });

        try {
            await onDelete(id);
            // Dismiss loading toast and show success
            loadingToast.dismiss();
            toast({
                title: "Document deleted",
                description: "The document has been successfully deleted.",
                variant: "success",
            });
            setOpen(false);
        } catch (error) {
            // Dismiss loading toast and show error
            loadingToast.dismiss();
            toast({
                title: "Error",
                description: "Failed to delete document.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your document
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
