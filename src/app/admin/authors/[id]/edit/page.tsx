import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { AuthorEditForm } from '../../AuthorEditForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function EditAuthorPage({ params }: Props) {
  const { id } = await params;
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/authors" className="text-stone-600 hover:text-stone-900">← 著者一覧</Link>
        <h1 className="text-2xl font-bold text-stone-900">編集: {author.name}</h1>
      </div>
      <AuthorEditForm author={author} />
    </div>
  );
}
