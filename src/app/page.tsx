import Link from 'next/link';
import { getLatestArticleSlugs, getPopularArticleSlugs } from '@/lib/repositories/article';
import { getJobs } from '@/lib/repositories/job';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [popular, latest, jobsData] = await Promise.all([
    getPopularArticleSlugs(6),
    getLatestArticleSlugs(5),
    getJobs({ page: 1, area: undefined }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* ヒーロー（背景画像つき） */}
      <section className="relative mb-20 overflow-hidden rounded-3xl">
        {/* 背景画像 */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: "url('/hero-campus.png')" }}
        />
        {/* グラデーションオーバーレイ（少しだけ暗くする） */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/5" />

        <div className="relative px-6 sm:px-12 py-14 sm:py-18 text-center text-white">
          <div className="inline-block rounded-full bg-white/10 text-sm font-medium px-4 py-1.5 mb-6 backdrop-blur">
            大学職員への転職を考えている方へ
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            大学職員転職.com
            <span className="text-base sm:text-lg block mt-2 font-normal text-white/80">
              大学職員になりたい社会人のための転職・情報サイト
            </span>
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed text-white/80">
            大学職員の求人情報・選考フロー・試験対策・リアルな働き方までを一箇所に集約。
            未経験からのチャレンジやキャリアアップを、実例とノウハウでサポートします。
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/jobs"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-semibold shadow-soft hover:bg-accent-dark hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              大学職員の求人を見る
              <span className="text-white/80" aria-hidden>
                →
              </span>
            </Link>
            <Link
              href="/articles"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/40 bg-white/10 text-white font-semibold hover:bg-white/15 transition-all duration-200"
            >
              記事を読む
              <span aria-hidden>→</span>
            </Link>
            <a
              href="https://timerex.net/s/y-ito_f24a_9d69/4cd3d89e"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-accent font-semibold shadow-soft hover:bg-stone-100 transition-all duration-200"
            >
              無料で相談する
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 求人 */}
      <section className="mb-16">
        <h2 className="section-title">求人情報（エリア別）</h2>
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200">
          <p className="text-stone-600 mb-4">
            現在 <span className="font-semibold text-stone-900">{jobsData.total}</span> 件の求人があります。エリアで絞り込んで検索できます。
          </p>
          <Link href="/jobs" className="inline-flex items-center gap-1 text-accent font-semibold hover:gap-2 transition-all">
            求人一覧へ
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* 人気記事 */}
      <section className="mb-16">
        <div className="md:grid md:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] md:gap-8 items-start">
          <div>
            <h2 className="section-title">人気の記事</h2>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="group block bg-white rounded-2xl border border-stone-200/80 shadow-card hover:shadow-card-hover hover:border-stone-300/80 overflow-hidden transition-all duration-200"
                  >
                    <div className="relative w-full pt-[56%] bg-stone-100">
                      <img
                        src={a.ogImageUrl || '/hero-campus.png'}
                        alt={a.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      {a.publishedAt && (
                        <p className="text-xs text-stone-500 mb-1">
                          {format(new Date(a.publishedAt), 'yyyy年M月d日', { locale: ja })}
                        </p>
                      )}
                      <p className="font-semibold text-stone-900 group-hover:text-accent line-clamp-2">
                        {a.title}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/articles"
              className="mt-6 inline-flex items-center gap-1 text-accent font-semibold hover:gap-2 transition-all"
            >
              記事一覧へ
              <span aria-hidden>→</span>
            </Link>
          </div>

          <aside className="mt-8 md:mt-0">
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 shadow-card md:sticky md:top-24">
              <h3 className="text-base font-semibold text-stone-900 mb-2">まずは相談してみる</h3>
              <p className="text-sm text-stone-600 mb-4">
                大学職員への転職について、選考対策やキャリアの相談をプロに無料で相談できます。
              </p>
              <a
                href="https://timerex.net/s/y-ito_f24a_9d69/4cd3d89e"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-full bg-accent text-white font-semibold shadow-soft hover:bg-accent-dark hover:shadow-card-hover transition-all"
              >
                転職エージェントに相談する
                <span aria-hidden>→</span>
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* 新着記事 */}
      <section>
        <h2 className="section-title">新着記事</h2>
        <ul className="space-y-4">
          {latest.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/articles/${a.slug}`}
                className="group flex gap-4 rounded-xl p-5 bg-white border border-stone-200/80 shadow-card hover:shadow-card-hover hover:border-stone-300/80 transition-all duration-200"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                  <img
                    src={a.ogImageUrl || '/hero-campus.png'}
                    alt={a.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-stone-900 group-hover:text-accent block mb-1 line-clamp-2">
                    {a.title}
                  </span>
                  <span className="text-sm text-stone-500">
                    {a.publishedAt && format(new Date(a.publishedAt), 'yyyy年M月d日', { locale: ja })}
                    {a.author?.name && ` · ${a.author.name}`}
                  </span>
                  {a.excerpt && (
                    <p className="mt-2 text-sm text-stone-600 line-clamp-2">{a.excerpt}</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/articles" className="inline-flex items-center gap-1 text-accent font-semibold hover:gap-2 transition-all">
            記事一覧へ <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
