"use client";

import { useState } from "react";
import { uploadPDF } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (formData: FormData) => {
    setIsUploading(true);
    const loadingToast = toast({
      title: "در حال آپلود...",
      description: "در حال پردازش سند PDF شما.",
      variant: "loading",
    });

    try {
      await uploadPDF(formData);
      loadingToast.dismiss();
      toast({
        title: "موفقیت",
        description: "PDF با موفقیت آپلود شد.",
        variant: "success",
      });
    } catch (error) {
      console.error("Upload failed", error);
      loadingToast.dismiss();
      toast({
        title: "خطا",
        description: "آپلود PDF با شکست مواجه شد.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">آپلود PDF آزمون</h1>

      <div className="w-full max-w-md p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-card">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            await handleUpload(formData);
          }}
          className="flex flex-col items-center w-full"
        >
          <Upload className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-6 text-center">
            فایل PDF خود را اینجا بکشید و رها کنید، یا برای انتخاب فایل کلیک کنید.
          </p>
          <Input
            type="file"
            name="file"
            accept=".pdf"
            required
            className="mb-6 h-100 w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
          />
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                در حال پردازش...
              </>
            ) : (
              "آپلود PDF"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
