import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ExamOverviewClient from './client-overview';

export const dynamic = 'force-dynamic';

export default async function ExamOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doc = await prisma.document.findUnique({
    where: { id },
    include: { exams: { orderBy: { createdAt: 'desc' } } } // Order by desc for recent list
  });

  if (!doc) {
    notFound();
  }

  return <ExamOverviewClient doc={doc} exams={doc.exams} />;
}
