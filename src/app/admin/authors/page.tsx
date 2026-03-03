import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminAuthorsPage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">著者一覧</h1>
      <div className="bg-white rounded border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left p-3 font-medium">名前</th>
              <th className="text-left p-3 font-medium">肩書き</th>
              <th className="text-left p-3 font-medium">監修</th>
              <th className="text-left p-3 font-medium">記事数</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a) => (
              <tr key={a.id} className="border-t border-stone-100">
                <td className="p-3">{a.name}</td>
                <td className="p-3 text-stone-600">{a.role}</td>
                <td className="p-3">{a.isSupervisor ? '○' : '-'}</td>
                <td className="p-3">{a._count.articles}</td>
                <td className="p-3">
                  <Link href={`/admin/authors/${a.id}/edit`} className="text-rose-800 hover:underline">編集</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
