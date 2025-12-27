import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import WorkspaceClient from './client'; // Client component for interactivity

export const dynamic = 'force-dynamic';

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
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
