import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata = {
  title: '運営者情報',
  description: '大学職員転職.comの運営者情報です。',
};

export default function AboutPage() {
  const items = [{ label: '運営者情報', href: undefined }];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={items} />
      <h1 className="text-2xl font-bold text-stone-900 mb-6">運営者情報</h1>
      <div className="prose-article text-stone-700 space-y-4">
        <p>大学職員転職.comは、学校職員・大学職員を目指す方のための情報メディアです。</p>
        <p>求人情報の紹介、採用試験の対策、仕事内容の解説など、転職・就職の参考になる情報を発信しています。</p>
        <p>記事は、大学職員経験者や教育業界に詳しいライターが執筆し、必要に応じて専門家の監修を受けています。</p>
        <p>
          <a href="/authors" className="text-rose-800 hover:underline">
            監修者一覧
          </a>
          からご覧いただけます。
        </p>
        <p>
          無料での転職相談やサイトへのお問い合わせは
          <a href="https://kyouikutenshoku.com/contact/" target="_blank" rel="noopener noreferrer" className="text-rose-800 hover:underline">
            お問い合わせページ
          </a>
          からどうぞ。
        </p>
      </div>
    </div>
  );
}
