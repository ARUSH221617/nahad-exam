'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

// Simple in-memory mock for vector store if DB is not available
// In a real app, this would be pgvector
// We can't persist this easily in serverless/server actions without a DB,
// so this mock is only good for the current request or if we had a stateful server.
// But for the exam solver, we need to retrieve based on the document.

// Let's assume we have a retrieval function.

export async function askQuestion(docId: string, question: string, history: { role: string, parts: string[] }[]) {
    // 1. Retrieve context
    // In a real implementation:
    //  - Embed question
    //  - Search pgvector for docId
    //  - Get top k chunks

    // MOCK Retrieval for Sandbox:
    // We don't have the PDF content here easily unless we read it again or stored it.
    // For this prototype, let's assume we can answer generic questions or we Mock the context.
    // OR we fetch the blob text (if we stored it).

    // Let's try to get the document from Prisma
    const doc = await prisma.document.findUnique({
        where: { id: docId }
    });

    if (!doc) throw new Error("Document not found");

    // SIMULATED CONTEXT:
    // In a real app, we would do: const context = await searchVectors(doc.vectorNamespace, question);
    const context = "This is a simulated context from the document. The document discusses Nahad exam topics.";

    // 2. Generate Answer
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
        return { answer: "Error: API Key not found. Please set GOOGLE_GENERATIVE_AI_API_KEY.", references: [] };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });

    const prompt = `You are an expert in Nahad exams. Using ONLY the provided context from the PDF, answer the multiple-choice or descriptive question.
    If the answer is not in the context, say "پاسخ در متن یافت نشد".

    Context: ${context}

    Question: ${question}

    Answer in Persian (RTL). Format as Markdown.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 3. Save to History
    await prisma.exam.create({
        data: {
            question,
            answer: text,
            references: JSON.stringify(["page 1"]), // Mock references
            documentId: docId,
            userId: "user_default"
        }
    });

    return { answer: text };
}
