'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MessageSquarePlus, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Exam {
    id: string;
    question: string;
    answer: string;
    createdAt: Date;
}

interface Document {
    id: string;
    name: string;
}

export default function ExamOverviewClient({ doc, exams }: { doc: Document, exams: Exam[] }) {

    // Prepare data for the chart
    // Group by date (simple day grouping)
    const chartDataMap = new Map<string, number>();
    exams.forEach(exam => {
        const date = new Date(exam.createdAt).toLocaleDateString('fa-IR');
        chartDataMap.set(date, (chartDataMap.get(date) || 0) + 1);
    });

    const chartData = Array.from(chartDataMap.entries()).map(([date, count]) => ({
        date,
        count
    })).reverse(); // Reverse to show chronological order if needed, but map iteration order is insertion order usually.
    // Actually map entries iteration order is insertion order. If we iterate exams (desc), then dates are reverse chrono.
    // So reverse again to have left-to-right time.

    // If exams are desc (newest first), dates are newest first. Chart usually wants old -> new.
    // chartData.reverse();

    return (
        <div className="flex h-screen overflow-hidden flex-col bg-background">
            {/* Header */}
            <header className="h-14 border-b flex items-center px-4 justify-between bg-card">
                <div className="flex items-center gap-4">
                    <Link href="/documents">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                         <FileText className="w-4 h-4 text-muted-foreground" />
                        <h1 className="font-semibold">{doc.name} - نمای کلی</h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Action Section */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">آمار و سوالات اخیر</h2>
                        <Link href={`/exam/${doc.id}/chat`}>
                            <Button className="gap-2">
                                <MessageSquarePlus className="w-4 h-4" />
                                طرح سوال جدید
                            </Button>
                        </Link>
                    </div>

                    {/* Chart Section */}
                    {chartData.length > 0 ? (
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-medium mb-4">تعداد سوالات پرسیده شده در روز</h3>
                            <div className="h-[300px] w-full" dir="ltr">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            cursor={{fill: 'transparent'}}
                                        />
                                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-muted/50 border rounded-lg p-8 text-center text-muted-foreground">
                            هنوز سوالی پرسیده نشده است.
                        </div>
                    )}

                    {/* Recent Questions List */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">سوالات اخیر</h3>
                        {exams.length === 0 && <p className="text-muted-foreground">لیست خالی است.</p>}

                        <div className="grid gap-4">
                            {exams.map((exam) => (
                                <div key={exam.id} className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="mb-2">
                                        <h4 className="font-medium text-primary mb-1">{exam.question}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(exam.createdAt).toLocaleString('fa-IR')}
                                        </p>
                                    </div>
                                    <div className="text-sm text-foreground/90 line-clamp-3 prose dark:prose-invert">
                                         <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {exam.answer}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
