import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata = {
  title: 'プライバシーポリシー',
  description: '大学職員転職.comのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  const items = [{ label: 'プライバシーポリシー', href: undefined }];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={items} />
      <h1 className="text-2xl font-bold text-stone-900 mb-6">プライバシーポリシー</h1>
      <div className="prose-article text-stone-700 space-y-4">
        <p>当サイトでは、お問い合わせ等の際に氏名・メールアドレス等の個人情報をご登録いただく場合があります。これらはお問い合わせへの対応、サービスの提供の目的でのみ利用し、適切に管理します。第三者に開示・提供することはありません。</p>
        <p>アクセス解析のためCookieを使用する場合があります。ブラウザの設定でCookieを無効にすることができます。</p>
      </div>
    </div>
  );
}
