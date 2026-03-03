'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/about', label: '運営者情報' },
  { href: '/editorial-policy', label: '編集方針' },
  { href: '/privacy', label: 'プライバシーポリシー' },
  { href: '/terms', label: '利用規約' },
  { href: '/disclaimer', label: '免責事項' },
  { href: 'https://kyouikutenshoku.com/contact/', label: 'お問い合わせ', external: true },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <footer className="bg-stone-800 text-stone-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap gap-8 justify-center text-sm">
          {links.map(({ href, label, external }) =>
            external ? (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
                {label}
              </a>
            ) : (
              <Link key={href} href={href} className="hover:text-white transition-colors duration-200">
                {label}
              </Link>
            )
          )}
        </div>
        <p className="text-center text-stone-500 text-sm mt-8">
          © {new Date().getFullYear()} 大学職員転職.com
        </p>
      </div>
    </footer>
  );
}
