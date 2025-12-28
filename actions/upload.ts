"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import { generateEmbedding } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";

const maxDuration = 60;

export async function uploadPDF(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file uploaded");
  }

  let blobUrl = "";
  try {
    const blob = await put(file.name, file, {
      access: "public",
    });
    blobUrl = blob.url;
  } catch (error) {
    console.error("Blob upload failed:", error);
    throw new Error("Failed to upload file");
  }

  const doc = await prisma.document.create({
    data: {
      name: file.name,
      blobUrl: blobUrl,
      vectorNamespace: file.name + "_" + Date.now(),
      userId: user.id,
    },
  });

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await ingestDocument(doc.id, buffer, doc.vectorNamespace);
  } catch (e) {
    console.error("Ingestion failed:", e);
    // Note: We don't delete the document here so the user can see it failed or try again.
    // But maybe we should? For now keeping existing behavior.
  }

  revalidatePath("/documents");
  redirect(`/exam/${doc.id}`);
}

async function ingestDocument(
  docId: string,
  pdfBuffer: Buffer,
  namespace: string
) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Use gemini-3.0-flash as it is available and supports JSON mode well.
  const model = "gemini-3-flash-preview";

  const config = {
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.MINIMAL,
    },
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      required: ["subject", "paragraphs", "language"],
      properties: {
        subject: {
          type: Type.STRING,
        },
        paragraphs: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
        language: {
          type: Type.STRING,
        },
      },
    },
    systemInstruction: [
      {
        text: `you are a high level content extractor
user give you a pdf and you must extract content and split paragraphs
and detect language of content.
Make sure to handle Persian language correctly (RTL).`,
      },
    ],
  };

  const contents = [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            data: pdfBuffer.toString("base64"),
            mimeType: "application/pdf",
          },
        },
      ],
    },
  ];

  console.log(`Sending PDF to Gemini (${model}) for parsing...`);

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });

  if (!response) {
    throw new Error("No response from Gemini");
  }

  const responseText = response.text;
  if (!responseText) {
    throw new Error("Empty response from Gemini");
  }

  let content;
  try {
    content = JSON.parse(responseText);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", responseText);
    throw new Error("Invalid JSON response from Gemini");
  }

  const paragraphs = content.paragraphs;
  if (!Array.isArray(paragraphs)) {
    throw new Error("Response 'paragraphs' is not an array");
  }

  console.log(`Ingesting ${paragraphs.length} paragraphs for doc ${docId}`);

  // Process chunks in batches to avoid overwhelming the database or API
  const BATCH_SIZE = 10;
  for (let i = 0; i < paragraphs.length; i += BATCH_SIZE) {
    const batch = paragraphs.slice(i, i + BATCH_SIZE);

    // Generate embeddings and save to DB
    await Promise.all(
      batch.map(async (text: string) => {
        if (!text || text.trim().length === 0) return;

        try {
          const embedding = await generateEmbedding(text);
          const embeddingString = `[${embedding.join(",")}]`;

          await prisma.$executeRaw`
            INSERT INTO "DocumentChunk" ("id", "content", "embedding", "documentId", "createdAt")
            VALUES (gen_random_uuid(), ${text}, ${embeddingString}::vector, ${docId}, NOW())
          `;
        } catch (err) {
          console.error("Error processing chunk:", err);
        }
      })
    );
  }
}
