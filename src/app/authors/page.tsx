import { Breadcrumbs, BreadcrumbJsonLd } from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '監修者一覧',
  description: '大学職員転職.comの監修者一覧。',
};

const SUPERVISORS = [
  {
    name: '田中',
    role: '代表取締役兼キャリアコンサルタント',
    bio: '教員の道を志すもまずはビジネス経験を積もうとコンサルティングファームに入社の後、リクルートに転職。人事採用領域と教育領域で12年間、法人営業および営業責任者として従事し、年間最優秀マネジャーとして表彰。退職後、海外教育ベンチャーの取締役などを経て株式会社コトブックを創業。大手学習塾や私立大学など教育系企業のコンサルティングなど教育領域に関する知見を活かし、教育領域の転職支援を行う傍ら、京都精華大学キャリア科目の非常勤講師も務める。',
  },
  {
    name: '吉田',
    role: 'キャリアコンサルタント',
    bio: '新卒で会計コンサルティングファームに入社し内部統制構築支援や決算早期化支援プロジェクト等に携わった後、リクルートへ転職。教育領域で大学を中心とした高等教育機関の募集戦略の策定やマーケティング支援に携わる。その後学習塾を立ち上げ、創業2か月で単月黒字を達成。学習塾運営のみならず、高校大学受験のための進路指導講演会、高校入試問題の作成等、「教育」分野へ広範にわたって関わり、2022年株式会社コトブックへ参画。',
  },
];

export default function SupervisorsPage() {
  const breadcrumbs = [{ label: '監修者一覧', href: undefined }];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-2xl font-bold text-stone-900 mb-8">監修者一覧</h1>

      <ul className="space-y-10">
        {SUPERVISORS.map((s) => (
          <li key={s.name} className="rounded-xl border border-stone-200/80 bg-white p-6 shadow-card">
            <p className="text-lg font-semibold text-stone-900">{s.name}</p>
            <p className="text-sm font-medium text-accent mt-1">{s.role}</p>
            <p className="text-stone-600 mt-4 leading-relaxed whitespace-pre-line">{s.bio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
