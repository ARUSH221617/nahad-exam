import prisma from '@/lib/prisma';
import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DeleteButton } from './delete-button';

export const dynamic = 'force-dynamic';

async function deleteDocumentAction(id: string) {
    'use server';
    await prisma.document.delete({ where: { id } });
    revalidatePath('/documents');
}

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const documents = await prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <Link href="/upload">
           <Button>Upload New</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.length === 0 ? (
            <p className="text-muted-foreground col-span-3 text-center py-12">No documents found.</p>
        ) : (
            documents.map(doc => (
                <div key={doc.id} className="border rounded-lg p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <FileText className="w-8 h-8 text-primary" />
                        <DeleteButton id={doc.id} onDelete={deleteDocumentAction} />
                    </div>
                    <h3 className="font-semibold truncate mb-2" title={doc.name}>{doc.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                        {new Date(doc.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                    <Link href={`/exam/${doc.id}`} className="block">
                        <Button variant="outline" className="w-full">
                            Open Solver <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
