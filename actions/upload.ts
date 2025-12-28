"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateEmbedding } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { Prisma } from "@prisma/client";

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
    // We pass the blobUrl directly to ingestDocument, which will call the Appwrite OCR function
    await ingestDocument(doc.id, blobUrl, doc.vectorNamespace);
  } catch (e) {
    console.error("Ingestion failed:", e);
    // Note: We don't delete the document here so the user can see it failed or try again.
  }

  revalidatePath("/documents");
  redirect(`/exam/${doc.id}`);
}

async function ingestDocument(
  docId: string,
  blobUrl: string,
  namespace: string
) {
  const ocrFunctionUrl = process.env.OCR_FUNCTION_URL;
  if (!ocrFunctionUrl) {
    throw new Error("Missing OCR_FUNCTION_URL environment variable");
  }

  console.log(`Calling OCR function at ${ocrFunctionUrl} for ${blobUrl}`);

  const response = await fetch(ocrFunctionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileUrl: blobUrl,
      mimeType: "application/pdf",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OCR function failed with status ${response.status}: ${errorText}`);
    throw new Error(`OCR function failed: ${response.statusText}`);
  }

  const content = await response.json();

  const paragraphs = content.paragraphs;
  if (!Array.isArray(paragraphs)) {
    throw new Error("Response 'paragraphs' is not an array");
  }

  console.log(`Ingesting ${paragraphs.length} paragraphs for doc ${docId}`);

  // Process chunks in batches to avoid overwhelming the database or API
  const BATCH_SIZE = 10;
  for (let i = 0; i < paragraphs.length; i += BATCH_SIZE) {
    const batch = paragraphs.slice(i, i + BATCH_SIZE);

    try {
      // 1. Generate embeddings for the batch
      // Since generateEmbedding is a single call, we can run them in parallel
      const embeddings = await Promise.all(
        batch.map(async (text: string) => {
          if (!text || text.trim().length === 0) return null;
          return generateEmbedding(text);
        })
      );

      // 2. Filter out nulls (empty texts)
      const validItems = batch
        .map((text, idx) => ({ text, embedding: embeddings[idx] }))
        .filter((item) => item.text && item.text.trim().length > 0 && item.embedding !== null) as { text: string, embedding: number[] }[];

      if (validItems.length === 0) continue;

      // 3. Construct batch insert query
      // We use Prisma.sql to compose the query safely
      const values = validItems.map((item) => {
        const embeddingString = `[${item.embedding.join(",")}]`;
        // We need to return a Sql object for each row
        return Prisma.sql`
          (gen_random_uuid(), ${item.text}, ${embeddingString}::vector, ${docId}, NOW())
        `;
      });

      await prisma.$executeRaw`
        INSERT INTO "DocumentChunk" ("id", "content", "embedding", "documentId", "createdAt")
        VALUES ${Prisma.join(values, ",")}
      `;

      console.log(`Inserted batch of ${validItems.length} chunks.`);
    } catch (err) {
      console.error("Error processing batch:", err);
    }
  }
}
