import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-stone-900 mb-4">404</h1>
      <p className="text-stone-600 mb-8">お探しのページが見つかりませんでした。</p>
      <Link href="/" className="text-accent font-semibold hover:underline">
        トップページへ戻る
      </Link>
    </div>
  );
}
