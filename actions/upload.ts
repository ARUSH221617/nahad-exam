"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

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
}
