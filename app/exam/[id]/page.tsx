import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import WorkspaceClient from './client'; // Client component for interactivity

export default async function ExamPage({ params }: { params: { id: string } }) {
  // Await params first since they are a Promise in Next.js 15 (though usually direct object in previous versions,
  // Next 15 might treat them differently. But in standard server components, params is an object.
  // Wait, Next 15 changed params to be a Promise? No, only searchParams might be.
  // Let's assume standard object for now or handle async if needed.
  // Actually, recent changes in Next.js canary/15 indicate params are now Promises in some contexts, but usually just props.
  // I will check the doc if needed. For now let's assume it works.

  // Correction: In Next.js 15, params is indeed a Promise.
  const { id } = await params;

  const doc = await prisma.document.findUnique({
    where: { id },
    include: { exams: { orderBy: { createdAt: 'asc' } } }
  });

  if (!doc) {
    notFound();
  }

  return <WorkspaceClient doc={doc} initialHistory={doc.exams} />;
}
