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
            title: "در حال حذف سند...",
            description: "لطفا صبر کنید.",
            variant: "loading",
        });

        try {
            await onDelete(id);
            // Dismiss loading toast and show success
            loadingToast.dismiss();
            toast({
                title: "سند حذف شد",
                description: "سند با موفقیت حذف شد.",
                variant: "success",
            });
            setOpen(false);
        } catch (error) {
            // Dismiss loading toast and show error
            loadingToast.dismiss();
            toast({
                title: "خطا",
                description: "حذف سند با شکست مواجه شد.",
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
                    <AlertDialogTitle className="text-right">آیا کاملاً مطمئن هستید؟</AlertDialogTitle>
                    <AlertDialogDescription className="text-right">
                        این عمل قابل بازگشت نیست. این کار سند شما را برای همیشه حذف کرده و داده‌های شما را از سرورهای ما پاک می‌کند.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-start">
                    <AlertDialogCancel disabled={isLoading}>انصراف</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                        حذف
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
