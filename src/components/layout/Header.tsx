'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/jobs', label: '求人' },
  { href: '/articles', label: '記事' },
  { href: '/about', label: '運営' },
];

export function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold text-stone-900 hover:text-accent transition-colors duration-200 whitespace-nowrap"
          >
            大学職員転職.com
          </Link>
          <nav className="flex flex-wrap items-center gap-8" aria-label="メインナビゲーション">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-stone-600 hover:text-accent font-medium transition-colors duration-200 relative after:absolute after:left-0 after:bottom-[-2px] after:h-px after:w-0 after:bg-accent after:transition-all after:duration-200 hover:after:w-full"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
