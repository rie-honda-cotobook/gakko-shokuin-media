# 大学職員転職.com（メディア）

学校職員・大学職員を目指す人向けの情報メディアです。求人（エリア絞り込み）と記事の入稿運用を軸に構成しています。

## 技術スタック

- **Next.js 14**（App Router）+ TypeScript + Tailwind CSS
- **SQLite + Prisma**（ローカル完結、後で Postgres に移行可能）
- **NextAuth**（Credentials、.env の管理者 ID/PW）
- 画像は `/public` に保存（UploadThing 等へ差し替え可能な抽象化を想定）

## セットアップ

```bash
# 依存関係
npm install

# 環境変数（.env.example をコピーして .env を作成）
cp .env.example .env
# .env で NEXTAUTH_URL, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL を設定

# DB 作成・マイグレーション
npx prisma db push

# シード（求人30件・記事20本・著者2名）
npm run db:seed

# 開発サーバー
npm run dev
```

- 公開サイト: http://localhost:3000
- 管理画面: http://localhost:3000/admin（ログイン必要）

## 主なコマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run db:push` | Prisma スキーマを DB に反映 |
| `npm run db:seed` | シードデータ投入 |
| `npm run db:studio` | Prisma Studio（DB 閲覧） |

## ドキュメント

- [主要ルート一覧](docs/ROUTES.md)
- [SEOチェックリスト](docs/SEO-CHECKLIST.md)
- [管理画面の操作手順](docs/ADMIN-WORKFLOW.md)
- [月10本の編集フロー提案](docs/MONTHLY-EDITING-FLOW.md)

## 制約・注意

- 実在求人のスクレイピングは禁止。公式 URL はダミー可。
- 日本語 UI。
- データ層（`src/lib/repositories/`）は分離してあり、本格検索や外部 CMS へ後から移行しやすい構成です。
