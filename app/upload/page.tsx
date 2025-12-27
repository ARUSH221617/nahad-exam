'use client';

import { useState } from 'react';
import { uploadPDF } from '@/actions/upload';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (formData: FormData) => {
      setIsUploading(true);
      try {
          await uploadPDF(formData);
      } catch (error) {
          console.error("Upload failed", error);
          alert("Upload failed");
      } finally {
          setIsUploading(false);
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Upload Exam PDF</h1>

      <div className="w-full max-w-md p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-card">
        <form action={handleUpload} className="flex flex-col items-center w-full">
           <Upload className="w-16 h-16 text-muted-foreground mb-4" />
           <p className="text-muted-foreground mb-6 text-center">
             Drag and drop your PDF here, or click to browse.
           </p>
           <input
             type="file"
             name="file"
             accept=".pdf"
             required
             className="mb-6 w-full text-sm text-muted-foreground
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
                   Processing...
                 </>
             ) : (
                 "Upload PDF"
             )}
           </Button>
        </form>
      </div>
    </div>
  );
}
