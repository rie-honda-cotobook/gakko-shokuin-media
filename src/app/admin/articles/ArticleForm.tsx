'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createArticle,
  updateArticle,
  generateSlug,
  insertArticleTemplate,
  type ArticleFormData,
} from './actions';

type Author = { id: string; name: string };

const INIT: ArticleFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  publishedAt: '',
  category: '',
  tags: '',
  seoTitle: '',
  seoDescription: '',
  ogImageUrl: '',
  authorId: '',
  faq: '[]',
  references: '[]',
  externalUrl: '',
};

export function ArticleForm({
  authors,
  articleId,
  initial,
}: {
  authors: Author[];
  articleId?: string;
  initial?: Partial<ArticleFormData>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleFormData>({ ...INIT, ...initial });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerateSlug() {
    if (!form.title.trim()) return;
    const slug = await generateSlug(form.title, articleId);
    setForm((f) => ({ ...f, slug }));
  }

  async function handleInsertTemplate() {
    const template = await insertArticleTemplate();
    setForm((f) => ({ ...f, content: f.content ? f.content + '\n\n' + template : template }));
  }

  async function handleSubmit(action: 'draft' | 'publish' | 'schedule') {
    setError('');
    setLoading(true);
    const data = {
      ...form,
      status: action === 'draft' ? 'draft' : action === 'publish' ? 'published' : 'scheduled',
    };
    
    const result: { ok: boolean; error?: string; id?: string } = articleId
  ? await updateArticle(articleId, data)
  : await createArticle(data);
    if (!result.ok) {
      setError(result.error || 'エラー');
      setLoading(false);
      return;
    }
    if (result.id) router.push(`/admin/articles/${result.id}/edit`);
    else router.push('/admin/articles');
    router.refresh();
  }

  return (
    <form className="space-y-6 max-w-4xl">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">タイトル *</label>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border border-stone-300 rounded px-3 py-2"
        />
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-stone-700 mb-1">スラッグ *</label>
          <input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2"
          />
        </div>
        <button type="button" onClick={handleGenerateSlug} className="px-4 py-2 bg-stone-200 rounded hover:bg-stone-300 text-sm">
          自動生成
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">要約（一覧用）</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          rows={2}
          className="w-full border border-stone-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">記事の種類</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="articleType"
              checked={!form.externalUrl}
              onChange={() => setForm((f) => ({ ...f, externalUrl: '' }))}
              className="rounded"
            />
            <span>直接作成（このサイトで本文を書く）</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="articleType"
              checked={!!form.externalUrl}
              onChange={() => setForm((f) => ({ ...f, externalUrl: f.externalUrl || 'https://' }))}
              className="rounded"
            />
            <span>引用（外部サイトの記事へリンクする）</span>
          </label>
        </div>
      </div>

      {form.externalUrl ? (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">外部URL（引用先）*</label>
          <input
            type="url"
            value={form.externalUrl}
            onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full border border-stone-300 rounded px-3 py-2"
          />
          <p className="text-xs text-stone-500 mt-1">タイトル・要約はこのサイトに表示し、続きはこのURLへ誘導します。</p>
        </div>
      ) : null}

      {!form.externalUrl && (
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-stone-700">本文（Markdown）</label>
          <button type="button" onClick={handleInsertTemplate} className="text-sm text-rose-800 hover:underline">
            テンプレ挿入
          </button>
        </div>
        <p className="text-xs text-stone-500 mb-2">
          見出し: ## H2 / ### H3（全角＃＃でも表示されます）　ハイライト: &lt;mark&gt;文字&lt;/mark&gt;　アクセント色: &lt;span class=&quot;text-accent&quot;&gt;文字&lt;/span&gt;
        </p>
        <textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          rows={16}
          className="w-full border border-stone-300 rounded px-3 py-2 font-mono text-sm"
        />
      </div>
      )}

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">著者 *</label>
        <select
          value={form.authorId}
          onChange={(e) => setForm((f) => ({ ...f, authorId: e.target.value }))}
          className="w-full border border-stone-300 rounded px-3 py-2"
        >
          <option value="">選択</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">ステータス</label>
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="border border-stone-300 rounded px-3 py-2"
        >
          <option value="draft">下書き</option>
          <option value="scheduled">公開予約</option>
          <option value="published">公開</option>
        </select>
      </div>

      {form.status === 'scheduled' && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">公開日時</label>
          <input
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
            className="border border-stone-300 rounded px-3 py-2"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">カテゴリ</label>
          <input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full border border-stone-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">タグ（JSON配列）</label>
          <input
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            placeholder='["学校職員","大学職員"]'
            className="w-full border border-stone-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">SEOタイトル（空ならタイトルを使用）</label>
        <input
          value={form.seoTitle}
          onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
          className="w-full border border-stone-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">SEO説明（120文字目安）*</label>
        <textarea
          value={form.seoDescription}
          onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
          rows={2}
          maxLength={160}
          className="w-full border border-stone-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">OGP画像URL</label>
        <input
          value={form.ogImageUrl}
          onChange={(e) => setForm((f) => ({ ...f, ogImageUrl: e.target.value }))}
          className="w-full border border-stone-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">FAQ（JSON: [{'"'}q{'"'},{'"'}a{'"'}]）</label>
        <textarea
          value={form.faq}
          onChange={(e) => setForm((f) => ({ ...f, faq: e.target.value }))}
          rows={4}
          className="w-full border border-stone-300 rounded px-3 py-2 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">参考リンク（JSON: [{'"'}title{'"'},{'"'}url{'"'}]）</label>
        <textarea
          value={form.references}
          onChange={(e) => setForm((f) => ({ ...f, references: e.target.value }))}
          rows={3}
          className="w-full border border-stone-300 rounded px-3 py-2 font-mono text-sm"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          disabled={loading}
          className="px-6 py-2 bg-stone-200 text-stone-800 rounded font-medium hover:bg-stone-300 disabled:opacity-50"
        >
          下書き保存
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('schedule')}
          disabled={loading}
          className="px-6 py-2 bg-amber-600 text-white rounded font-medium hover:bg-amber-700 disabled:opacity-50"
        >
          公開予約
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('publish')}
          disabled={loading}
          className="px-6 py-2 bg-rose-800 text-white rounded font-medium hover:bg-rose-900 disabled:opacity-50"
        >
          公開する
        </button>
      </div>
    </form>
  );
}
