"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateEmbedding } from "@/lib/ai";
import { Prisma } from "@prisma/client";

// We cannot export constants from a 'use server' file that is imported by client components.
// We should move config to another file if needed, or just keep it internal.
// If Next.js Route Config needs it, it should be in page.tsx or route.ts, not in the action file.
// But this is a server action file.
// I will just remove the export.

const maxDuration = 60;

export async function uploadPDF(formData: FormData) {
  const file = formData.get("file") as File;
  const userId = "user_default";

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
      user: {
        connectOrCreate: {
          where: { id: userId },
          create: { id: userId },
        },
      },
    },
  });

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await ingestDocument(doc.id, buffer, doc.vectorNamespace);
  } catch (e) {
    console.error("Ingestion failed:", e);
  }

  revalidatePath("/documents");
  redirect(`/exam/${doc.id}`);
}

async function ingestDocument(
  docId: string,
  pdfBuffer: Buffer,
  namespace: string
) {
  const data = await pdf(pdfBuffer);
  const text = data.text;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.createDocuments([text]);

  console.log(`Ingesting ${chunks.length} chunks for doc ${docId}`);

  // Process chunks in batches to avoid overwhelming the database or API
  const BATCH_SIZE = 10;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    // Generate embeddings and save to DB
    await Promise.all(
      batch.map(async (chunk) => {
        try {
          const embedding = await generateEmbedding(chunk.pageContent);

          // Use Prisma raw query to insert vector data because Prisma Client doesn't support vector type directly yet (as a typed field)
          // Wait, Prisma now supports Unsupported types, but we might need raw query to insert the vector array properly casted.
          // Actually, let's try to use $executeRaw to insert.

          // Format embedding array for SQL: '[0.1, 0.2, ...]'
          const embeddingString = `[${embedding.join(",")}]`;

          await prisma.$executeRaw`
            INSERT INTO "DocumentChunk" ("id", "content", "embedding", "documentId", "createdAt")
            VALUES (gen_random_uuid(), ${chunk.pageContent}, ${embeddingString}::vector, ${docId}, NOW())
          `;
        } catch (err) {
          console.error("Error processing chunk:", err);
        }
      })
    );
  }
}
