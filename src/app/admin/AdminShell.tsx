'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <aside className="w-56 bg-stone-800 text-white fixed left-0 top-0 h-full p-4">
        <Link href="/admin" className="block font-bold text-lg mb-6">管理画面</Link>
        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 px-3 rounded hover:bg-stone-700">ダッシュボード</Link>
          <Link href="/admin/dashboard" className="block py-2 px-3 rounded hover:bg-stone-700 text-sm">監視</Link>
          <Link href="/admin/monitor-pages" className="block py-2 px-3 rounded hover:bg-stone-700 text-sm pl-6">監視URL</Link>
          <Link href="/admin/monitor-events" className="block py-2 px-3 rounded hover:bg-stone-700 text-sm pl-6">イベント</Link>
          <Link href="/admin/articles" className="block py-2 px-3 rounded hover:bg-stone-700">記事</Link>
          <Link href="/admin/articles/new" className="block py-2 px-3 rounded hover:bg-stone-700 text-sm pl-6">＋ 新規</Link>
          <Link href="/admin/authors" className="block py-2 px-3 rounded hover:bg-stone-700">著者</Link>
          <Link href="/admin/media" className="block py-2 px-3 rounded hover:bg-stone-700">メディア</Link>
        </nav>
        <div className="absolute bottom-4 left-4">
          <Link href="/" className="text-sm text-stone-400 hover:text-white">サイトを見る</Link>
          <form action="/api/auth/signout" method="POST" className="mt-2">
            <button type="submit" className="text-sm text-stone-400 hover:text-white">ログアウト</button>
          </form>
        </div>
      </aside>
      <main className="ml-56 p-8">{children}</main>
    </div>
  );
}
