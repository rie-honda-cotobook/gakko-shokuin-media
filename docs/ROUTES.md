# 主要ルート一覧

## 公開側

| パス | 説明 | レンダリング |
|------|------|--------------|
| `/` | トップ（求人導線・人気記事・新着記事） | SSR |
| `/jobs` | 求人一覧（エリア絞り込み） | SSR |
| `/jobs/[id]` | 求人詳細（公式URLへ誘導・免責あり） | SSR |
| `/articles` | 記事一覧（ページネーション） | SSR |
| `/articles/[slug]` | 記事詳細（目次・関連・著者カード・更新日・参考リンク） | SSR |
| `/career-guide` | 対策ガイドハブ（カテゴリ別記事一覧） | SSR |
| `/authors` | 著者一覧 | SSR |
| `/authors/[slug]` | 著者詳細 | SSR |
| `/about` | 運営者情報 | 静的 |
| `/editorial-policy` | 編集方針 | 静的 |
| `/contact` | お問い合わせ | 静的 |
| `/privacy` | プライバシーポリシー | 静的 |
| `/terms` | 利用規約 | 静的 |
| `/disclaimer` | 免責事項 | 静的 |

## 管理側

| パス | 説明 |
|------|------|
| `/admin/login` | ログイン（Credentials） |
| `/admin` | ダッシュボード（今月の投稿数・下書き・公開予約・直近公開記事） |
| `/admin/articles` | 記事一覧（タイトル検索） |
| `/admin/articles/new` | 新規記事作成 |
| `/admin/articles/[id]/edit` | 記事編集 |
| `/admin/authors` | 著者一覧 |
| `/admin/authors/[id]/edit` | 著者編集 |
| `/admin/media` | メディア（現状は説明のみ、画像は /public に保存） |

## API

| パス | 説明 |
|------|------|
| `/api/auth/[...nextauth]` | NextAuth（ログイン・ログアウト・セッション） |

## SEO用

| パス | 説明 |
|------|------|
| `/sitemap.xml` | サイトマップ（記事・求人・固定ページ） |
| `robots.txt` | クロール制御（/admin, /api を disallow） |
