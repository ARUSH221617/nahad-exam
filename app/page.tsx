import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold mb-6 text-primary">حل‌کننده آزمون هوشمند نهاد</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
        فایل‌های PDF آزمون خود را آپلود کنید و با استفاده از هوش مصنوعی پیشرفته، پاسخ‌های فوری و دقیق بر اساس محتوای سند دریافت کنید.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/upload" className="w-full">
           <div className="border rounded-lg p-6 hover:bg-accent transition-colors flex flex-col items-center cursor-pointer h-full">
              <Upload className="w-12 h-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">آپلود آزمون جدید</h2>
              <p className="text-muted-foreground">یک نشست جدید با آپلود فایل PDF شروع کنید.</p>
           </div>
        </Link>

        <Link href="/documents" className="w-full">
           <div className="border rounded-lg p-6 hover:bg-accent transition-colors flex flex-col items-center cursor-pointer h-full">
              <FileText className="w-12 h-12 mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">اسناد من</h2>
              <p className="text-muted-foreground">فایل‌های آپلود شده خود را مرور کنید.</p>
           </div>
        </Link>
      </div>
    </main>
  );
}
