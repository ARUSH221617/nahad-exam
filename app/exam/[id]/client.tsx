'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft, Loader2, Archive, FileText } from 'lucide-react';
import Link from 'next/link';
import { askQuestion } from '@/actions/ask';
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface Exam {
    id: string;
    question: string;
    answer: string;
}

interface Document {
    id: string;
    name: string;
    blobUrl: string;
}

export default function WorkspaceClient({ doc, initialHistory }: { doc: Document, initialHistory: Exam[] }) {
    const [history, setHistory] = useState<Exam[]>(initialHistory);
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setIsLoading(true);
        // Optimistic update could happen here, but we wait for response for simplicity
        try {
            const result = await askQuestion(doc.id, question, []); // Passing empty history context for now
            const newExam: Exam = {
                id: Date.now().toString(), // Temp ID
                question: question,
                answer: result.answer
            };
            setHistory([...history, newExam]);
            setQuestion("");
        } catch (error) {
            console.error(error);
            toast({
                title: "خطا",
                description: "دریافت پاسخ با شکست مواجه شد",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden flex-col">
            {/* Header */}
            <header className="h-14 border-b flex items-center px-4 justify-between bg-card z-10">
                <div className="flex items-center gap-4">
                    <Link href="/documents">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Archive className="w-4 h-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle className="text-right">اسناد ضمیمه شده</SheetTitle>
                                <SheetDescription className="text-right">
                                    لیست اسناد مرتبط با این نشست.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center gap-2 p-2 border rounded-md">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm truncate" title={doc.name}>{doc.name}</span>
                                </div>
                                {/* In the future, if multiple docs are supported, list them here */}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <h1 className="font-semibold truncate max-w-xs" title={doc.name}>{doc.name}</h1>
                </div>
                <div>
                   {/* User profile or settings could go here */}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden justify-center">
                {/* Chat / Solver Panel (Center) */}
                <div className="w-full max-w-3xl flex flex-col bg-background border-x">
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {history.length === 0 && (
                            <div className="text-center text-muted-foreground mt-20">
                                <p>سوالی در مورد محتوای آزمون بپرسید.</p>
                            </div>
                        )}

                        {history.map((item) => (
                            <div key={item.id} className="space-y-4">
                                {/* User Question */}
                                <div className="flex justify-end">
                                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg rounded-tl-none max-w-[80%]">
                                        <p className="whitespace-pre-wrap">{item.question}</p>
                                    </div>
                                </div>

                                {/* AI Answer */}
                                <div className="flex justify-start">
                                    <div className="bg-muted px-4 py-2 rounded-lg rounded-tr-none max-w-[90%] prose dark:prose-invert text-sm">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {item.answer}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted px-4 py-2 rounded-lg rounded-tr-none flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>در حال پردازش...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t bg-card">
                        <form onSubmit={handleAsk} className="flex gap-2">
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="سوال خود را اینجا بنویسید..."
                                className="flex-1 min-h-[50px] max-h-[150px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAsk(e);
                                    }
                                }}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !question.trim()} className="h-auto">
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
