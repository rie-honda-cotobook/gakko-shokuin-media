'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAuthor } from './actions';

type AuthorData = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string | null;
  credentials: string | null;
  avatarUrl: string | null;
  social: string | null;
  isSupervisor: boolean;
};

export function AuthorEditForm({ author }: { author: AuthorData }) {
  const router = useRouter();
  const [name, setName] = useState(author.name);
  const [slug, setSlug] = useState(author.slug);
  const [role, setRole] = useState(author.role);
  const [bio, setBio] = useState(author.bio || '');
  const [credentials, setCredentials] = useState(author.credentials || '');
  const [avatarUrl, setAvatarUrl] = useState(author.avatarUrl || '');
  const [social, setSocial] = useState(author.social || '{}');
  const [isSupervisor, setIsSupervisor] = useState(author.isSupervisor);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await updateAuthor(author.id, {
      name,
      slug,
      role,
      bio: bio || null,
      credentials: credentials || null,
      avatarUrl: avatarUrl || null,
      social: social.trim() ? social : null,
      isSupervisor,
    });
    if (!result.ok) {
      setError(result.error || 'エラー');
      setLoading(false);
      return;
    }
    router.push('/admin/authors');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">名前 *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">スラッグ *</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">肩書き *</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} required className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">プロフィール</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">経歴・実績</label>
        <textarea value={credentials} onChange={(e) => setCredentials(e.target.value)} rows={2} className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">アバターURL</label>
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">SNS（JSON）</label>
        <input value={social} onChange={(e) => setSocial(e.target.value)} placeholder='{"twitter":"","linkedin":""}' className="w-full border border-stone-300 rounded px-3 py-2 font-mono text-sm" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="supervisor" checked={isSupervisor} onChange={(e) => setIsSupervisor(e.target.checked)} />
        <label htmlFor="supervisor">監修者</label>
      </div>
      <button type="submit" disabled={loading} className="px-6 py-2 bg-rose-800 text-white rounded font-medium hover:bg-rose-900 disabled:opacity-50">
        保存
      </button>
    </form>
  );
}
