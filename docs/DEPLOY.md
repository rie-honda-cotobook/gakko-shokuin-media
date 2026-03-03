# 本番環境へのデプロイ手順

## 入稿用ページ（管理画面）のURL

本番でサイトを公開したあと、入稿用ページは次のURLで開けます。

| ページ | URL（例） |
|--------|------------|
| **ログイン（入稿の入口）** | `https://あなたのドメイン/admin/login` |
| ダッシュボード | `https://あなたのドメイン/admin` |
| 記事一覧・新規・編集 | `https://あなたのドメイン/admin/articles` など |

**手順**: ブラウザで **`https://あなたのドメイン/admin/login`** を開く → 本番用の管理者メール・パスワードでログイン → 入稿作業ができます。

---

## 1. 本番環境の例（Vercel）

Next.js は **Vercel** にデプロイするのが簡単です。

### 事前準備

- **GitHub** にプロジェクトをプッシュしておく
- **本番用データベース**: 現在は SQLite ですが、Vercel では **PostgreSQL** が必要です  
  - [Vercel Postgres](https://vercel.com/storage/postgres) または [Neon](https://neon.tech/) などで無料枠の DB を作成し、接続URL（`DATABASE_URL`）を取得

### Vercel でデプロイ

1. [vercel.com](https://vercel.com) にログイン
2. 「Add New」→「Project」で、GitHub のこのリポジトリをインポート
3. **Environment Variables** で次を設定（本番用の値に変更すること）

   | 変数名 | 説明 | 例 |
   |--------|------|-----|
   | `NEXTAUTH_URL` | 本番のサイトURL | `https://あなたのドメイン.vercel.app` |
   | `NEXTAUTH_SECRET` | ランダムな文字列（32文字以上） | 生成ツールで作成 |
   | `ADMIN_EMAIL` | 管理画面ログイン用メール | 本番用アドレス |
   | `ADMIN_PASSWORD` | 管理画面ログイン用パスワード | 強めのパスワード |
   | `DATABASE_URL` | 本番用 PostgreSQL の接続URL | `postgresql://...` |
   | `NEXT_PUBLIC_SITE_URL` | サイトのURL（canonical・OGP用） | `https://あなたのドメイン.vercel.app` |

4. 「Deploy」でデプロイ

### 本番で DB を Postgres にする場合

- `prisma/schema.prisma` の `datasource db` を `provider = "postgresql"` に変更
- `DATABASE_URL` に Postgres の URL を設定
- デプロイ後に Vercel の「Build」で `prisma generate` と `prisma db push`（またはマイグレーション）が実行されるようにする（多くの場合は `postinstall` や build スクリプトで対応）

---

## 2. 入稿用ページを開く流れ（本番）

1. ブラウザで **`https://あなたのドメイン/admin/login`** を開く
2. 本番で設定した **ADMIN_EMAIL** と **ADMIN_PASSWORD** を入力
3. ログインすると `/admin` ダッシュボードへ遷移
4. 左メニュー「記事」→「＋ 新規」で入稿、または「記事」一覧から編集

※ 本番では必ず **ADMIN_PASSWORD** を推測されにくい強めのパスワードにし、**NEXTAUTH_SECRET** も本番用に別の値にしてください。
