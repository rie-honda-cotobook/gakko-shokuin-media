export const dynamic = 'force-dynamic';

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">メディア</h1>
      <div className="bg-white rounded border border-stone-200 p-6 text-stone-600">
        <p className="mb-4">
          画像は <code className="bg-stone-100 px-1 rounded">/public</code> フォルダに保存し、記事編集画面の「OGP画像URL」や本文でパス（例: <code className="bg-stone-100 px-1 rounded">/uploads/xxx.jpg</code>）を指定してください。
        </p>
        <p className="text-sm">
          後から UploadThing 等の外部ストレージに差し替え可能な構成です。
        </p>
      </div>
    </div>
  );
}
