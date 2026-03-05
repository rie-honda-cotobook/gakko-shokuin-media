import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles } from '@/lib/repositories/article';
import { Breadcrumbs, BreadcrumbJsonLd } from '@/components/Breadcrumbs';
import { Toc } from '@/components/Toc';
import { extractTocFromMarkdown, normalizeMarkdownHeadings } from '@/lib/toc';
import { Markdown } from '@/components/Markdown';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Metadata } from 'next';
import type { FaqItem, ReferenceItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: '記事が見つかりません' };
  const title = article.seoTitle || article.title;
  const desc = article.seoDescription;
  const ogImage = article.ogImageUrl ? `${SITE_URL}${article.ogImageUrl.startsWith('/') ? '' : '/'}${article.ogImageUrl}` : undefined;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description: desc },
    alternates: { canonical: `${SITE_URL}/articles/${slug}` },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.id, 3);
  const isReference = !!article.externalUrl;
  const contentNormalized = normalizeMarkdownHeadings(article.content);
  const tocItems = isReference ? [] : extractTocFromMarkdown(contentNormalized);
  const faq: FaqItem[] = article.faq ? JSON.parse(article.faq) : [];
  const references: ReferenceItem[] = article.references ? JSON.parse(article.references) : [];

  const breadcrumbs = [
    { label: '記事', href: '/articles' },
    { label: article.title, href: undefined },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <article className="md:grid md:grid-cols-[1fr_240px] md:gap-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">{article.title}</h1>
          <p className="text-stone-500 text-sm mb-6">
            {article.publishedAt && (
              <time dateTime={article.publishedAt.toISOString()}>
                公開：{format(new Date(article.publishedAt), 'yyyy年M月d日', { locale: ja })}
              </time>
            )}
            {article.updatedAt && (
              <span className="ml-4">
                更新：{format(new Date(article.updatedAt), 'yyyy年M月d日', { locale: ja })}
              </span>
            )}
            {isReference && (
              <span className="ml-2 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">外部記事を引用</span>
            )}
          </p>

          <div className="mb-8">
            <img
              src={article.ogImageUrl || '/hero-campus.png'}
              alt={article.title}
              className="w-full max-h-80 object-cover rounded-xl border border-stone-200"
            />
          </div>

          {isReference ? (
            <div className="mb-10">
              {article.excerpt && <p className="text-stone-700 mb-6 whitespace-pre-wrap">{article.excerpt}</p>}
              <a
                href={article.externalUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent text-white px-8 py-4 rounded-xl font-semibold shadow-soft hover:bg-accent-dark hover:shadow-card-hover transition-all"
              >
                続きを読む（外部サイト）
              </a>
            </div>
          ) : (
          <div className="prose-article mb-10">
            <Markdown content={contentNormalized} headingIds={tocItems} />
          </div>
          )}

          {references.length > 0 && (
            <section className="mt-10 pt-6 border-t border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-3">参考リンク</h2>
              <ul className="space-y-2">
                {references.map((ref, i) => (
                  <li key={i}>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-rose-800 hover:underline">
                      {ref.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {faq.length > 0 && (
            <section className="mt-10 pt-6 border-t border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-3">よくある質問</h2>
              <dl className="space-y-4">
                {faq.map((item, i) => (
                  <div key={i}>
                    <dt className="font-medium text-stone-900">{item.q}</dt>
                    <dd className="text-stone-600 mt-1">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* 著者カード */}
          <aside className="mt-10 p-4 rounded-lg bg-stone-50 border border-stone-200">
            <div className="flex gap-4">
              {article.author.avatarUrl && (
                <img
                  src={article.author.avatarUrl}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-stone-900">
                  <Link href={`/authors/${article.author.slug}`} className="hover:text-rose-800">
                    {article.author.name}
                  </Link>
                  {article.author.isSupervisor && (
                    <span className="text-xs text-stone-500 ml-2">監修</span>
                  )}
                </p>
                <p className="text-sm text-stone-600">{article.author.role}</p>
                {article.author.bio && <p className="text-sm text-stone-500 mt-1">{article.author.bio}</p>}
              </div>
            </div>
          </aside>

          {/* 次に読む */}
          <section className="mt-12 pt-8 border-t border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">次に読む</h2>
            <ul className="space-y-2">
              {related.slice(0, 3).map((r) => (
                <li key={r.id}>
                  <Link href={`/articles/${r.slug}`} className="text-rose-800 hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {!isReference && tocItems.length > 0 && (
          <aside className="md:order-first md:sticky md:top-24 md:self-start">
            <Toc items={tocItems} />
          </aside>
        )}
      </article>

      {/* Article + FAQ 構造化データ */}
      <ArticleStructuredData article={article} faq={faq} />
    </div>
  );
}

function ArticleStructuredData({
  article,
  faq,
}: {
  article: Awaited<ReturnType<typeof getArticleBySlug>>;
  faq: FaqItem[];
}) {
  if (!article) return null;
  const articleJson = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.seoTitle || article.title,
    description: article.seoDescription,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
  };
  const faqJson =
    faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJson) }}
      />
      {faqJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
        />
      )}
    </>
  );
}
