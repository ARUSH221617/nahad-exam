"use server";

import { GoogleGenAI } from "@google/genai";
import prisma from "@/lib/prisma";
import { generateEmbedding } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

export async function askQuestion(
  docId: string,
  question: string,
  history: { role: string; parts: string[] }[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "anonymous";

  // 1. Retrieve context
  const doc = await prisma.document.findUnique({
    where: { id: docId },
  });

  if (!doc) throw new Error("Document not found");

  // Generate embedding for the question
  const questionEmbedding = await generateEmbedding(question);
  const embeddingString = `[${questionEmbedding.join(",")}]`;

  // Search for relevant chunks using vector similarity
  // We use cosine similarity (<=> operator) or Euclidean distance (<->) or Inner product (<#>)
  // Cosine distance (<=>) is common for embeddings. Lower is better/closer.
  const chunks = await prisma.$queryRaw<Array<{ content: string; similarity: number }>>`
    SELECT content, 1 - (embedding <=> ${embeddingString}::vector) as similarity
    FROM "DocumentChunk"
    WHERE "documentId" = ${docId}
    ORDER BY embedding <=> ${embeddingString}::vector
    LIMIT 5;
  `;

  const context = chunks.map((c) => c.content).join("\n\n");

  if (!context) {
     // Fallback if no chunks found (shouldn't happen if doc is ingested)
     console.warn("No context found for docId:", docId);
  }

  // 2. Generate Answer
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return {
      answer:
        "Error: API Key not found. Please set GOOGLE_GENERATIVE_AI_API_KEY.",
      references: [],
    };
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const config = {};
  const model = "gemini-2.5-flash-lite";

  const prompt = `You are an expert in Nahad exams. Using ONLY the provided context from the PDF, answer the multiple-choice or descriptive question.
    If the answer is not in the context, say "پاسخ در متن یافت نشد".

    Context:
    ${context}

    Question: ${question}

    Answer in Persian (RTL). Format as Markdown.`;

  const contents = [
    // Include history if needed, but primarily prompt with context
    ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.parts.join('') }] })),
    {
      role: "user",
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let text = "";
  for await (const chunk of response) {
    text += chunk.text;
  }

  // 3. Save to History
  // We can also store the "chunks" references if we want
  const references = chunks.map((c, i) => `Source ${i+1}: ${c.content.substring(0, 50)}...`);

  await prisma.exam.create({
    data: {
      question,
      answer: text,
      references: JSON.stringify(references),
      documentId: docId,
      userId: userId,
    },
  });

  return { answer: text, references };
}
