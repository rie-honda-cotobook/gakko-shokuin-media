import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="パンくずリスト" className="text-sm text-stone-600 mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-accent transition-colors">ホーム</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden className="text-stone-400">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-accent transition-colors">{item.label}</Link>
            ) : (
              <span className="text-stone-900 font-medium" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** BreadcrumbList 構造化データ用のJSON-LD */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const list = [
    { '@type': 'ListItem', position: 1, name: 'ホーム', item: base },
    ...items.map((item, i) => ({
      '@type': 'ListItem' as const,
      position: i + 2,
      name: item.label,
      ...(item.href && { item: `${base}${item.href}` }),
    })),
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: list,
        }),
      }}
    />
  );
}
