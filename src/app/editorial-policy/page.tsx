import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata = {
  title: '編集方針',
  description: '大学職員転職.comの編集方針・コンテンツポリシーです。',
};

export default function EditorialPolicyPage() {
  const items = [{ label: '編集方針', href: undefined }];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={items} />
      <h1 className="text-2xl font-bold text-stone-900 mb-6">編集方針</h1>
      <div className="prose-article text-stone-700 space-y-4">
        <p>当メディアでは、学校職員・大学職員を目指す方に役立つ情報を、正確かつ分かりやすくお届けすることを心がけています。</p>
        <h2 className="text-lg font-semibold mt-6">情報の取り扱い</h2>
        <ul className="list-disc pl-6">
          <li>求人情報は公式発表・公式サイトに基づいて紹介しています。応募の際は必ず各機関の公式採用ページで最新情報をご確認ください。</li>
          <li>記事内容は公開時点の情報に基づいています。制度・採用状況は変更される場合があります。</li>
        </ul>
      </div>
    </div>
  );
}
