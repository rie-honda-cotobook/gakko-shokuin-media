'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/toc';

/** Markdown本文から h2/h3 を抽出して目次を生成（クライアントでID付与） */
export function Toc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="rounded-lg border border-stone-200 bg-stone-50 p-4" aria-label="目次">
      <h2 className="text-sm font-bold text-stone-700 mb-3">目次</h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: item.level === 3 ? '1rem' : 0 }}
            className={activeId === item.id ? 'text-accent font-medium' : 'text-stone-600'}
          >
            <a href={`#${item.id}`} className="hover:text-accent transition-colors">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type { TocItem } from '@/lib/toc';

