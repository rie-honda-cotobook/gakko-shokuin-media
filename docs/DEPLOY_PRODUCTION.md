# 本番公開ガイド（大学職員転職.com）

本番環境で公開するときの「何を使うか」「いくらかかるか」「どうやるか」をまとめています。

---

## 1. 何を使うか（推奨構成）

| 役割 | サービス | 理由 |
|------|----------|------|
| **ホスティング** | [Vercel](https://vercel.com) | Next.js の開発元。ビルド・デプロイが簡単で無料枠が使える |
| **データベース** | [Neon](https://neon.tech) または [Supabase](https://supabase.com)（PostgreSQL） | 本番では SQLite が使えないため、PostgreSQL に移行する必要がある |
| **ドメイン**（任意） | お名前.com / ムームードメイン など | 独自ドメインを使う場合（例: `daigaku-shokuin-tenshoku.com`） |

### なぜデータベースを変えるか

- 現在は **SQLite**（ローカルファイル）を使用しています。
- Vercel はサーバーレスで、ファイル保存が永続しないため **SQLite は本番では使えません**。
- そのため本番用に **PostgreSQL** をクラウドで用意し、Prisma の接続先を切り替えます（スキーマはほぼそのまま使えます）。

---

## 2. いくらかかるか

### パターンA: 無料で始める（小規模・社内共有レベル）

| 項目 | 費用 | 備考 |
|------|------|------|
| Vercel（Hobby） | **0円** | 個人・小規模利用。帯域 100GB/月 など制限あり |
| Neon（Free） | **0円** | PostgreSQL 0.5GB、ブランチ1本 |
| ドメイン | 0円（Vercel の xxx.vercel.app を使う場合） | 独自ドメインは別途 1,000円/年 程度 |
| **合計** | **0円** | アクセスが少ないうちはこれで十分 |

### パターンB: 本格公開（商用・SEO・安定運用）

| 項目 | 費用（目安） | 備考 |
|------|----------------|------|
| Vercel（Pro） | **$20/月**（約3,000円） | チーム利用・ analytics・帯域増 |
| Neon（Scale） または Supabase（Pro） | **$19/月 前後**（約2,800円） | DB容量・バックアップ・サポート |
| 独自ドメイン | **約1,000円/年** | 任意 |
| **合計** | **約6,000円/月〜** | 安定運用・サポート付き |

※ 為替・各社の料金改定により変動します。最新は各サイトで確認してください。

---

## 3. どうやるか（手順の流れ）

### 事前準備

- [GitHub](https://github.com) アカウント
- プロジェクトを GitHub リポジトリにプッシュ済みであること

### Step 1: PostgreSQL を用意する（Neon の場合）

1. [Neon](https://neon.tech) にアクセスし、サインアップ（GitHub 連携可）。
2. 新規プロジェクト作成。リージョンは **Asia Pacific (Tokyo)** を推奨。
3. 作成後、**Connection string** が表示される。  
   例: `postgresql://user:password@ep-xxx.ap-northeast-1.aws.neon.tech/neondb?sslmode=require`
4. この URL をコピーしておく（後で `DATABASE_URL` に設定）。

### Step 2: Prisma を PostgreSQL 用に変更する

プロジェクト内で以下を実施します。

1. **prisma/schema.prisma** の `datasource` を変更：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **.env** に本番用の DB URL を設定（Neon の Connection string を貼る）：

```
DATABASE_URL="postgresql://..."
```

3. マイグレーションを実行（ローカルで一度試す場合）：

```bash
npx prisma migrate dev --name init_postgres
```

4. 既存の SQLite データを移行したい場合は、`prisma db pull` や手動でデータ投入が必要です。新規スタートなら `npx prisma db seed` でシードを流せます。

### Step 3: Vercel にデプロイする

1. [Vercel](https://vercel.com) にアクセスし、サインアップ（GitHub 連携推奨）。
2. **Add New Project** → 対象の GitHub リポジトリを選択。
3. **Environment Variables** で以下を追加：
   - `DATABASE_URL` … Neon の PostgreSQL 接続文字列
   - `NEXT_PUBLIC_SITE_URL` … 本番のURL（例: `https://xxx.vercel.app` または独自ドメイン）
   - その他、アプリが参照している環境変数（例: NextAuth のシークレットなど）があれば追加。
4. **Deploy** を実行。ビルドが成功すると `https://プロジェクト名.vercel.app` で公開されます。

### Step 4: 本番用データの準備

- 管理画面（`/admin`）から記事・求人・著者などを登録するか、  
  または **Neon の DB にシードを流す**（`DATABASE_URL` を本番用にしたうえで `npx prisma db seed` をローカルから実行、もしくは Vercel の設定でビルド時にシードを実行する方法もあります）。

### Step 5: 独自ドメインを使う場合（任意）

1. ドメイン取得（お名前.com など）。
2. Vercel のプロジェクト設定 → **Domains** でドメインを追加。
3. ドメイン側の DNS で、Vercel の指示どおり CNAME または A レコードを設定。
4. `NEXT_PUBLIC_SITE_URL` を独自ドメインの URL に更新し、再デプロイ。

---

## 4. 注意点・運用のコツ

- **環境変数**: 本番と開発で `DATABASE_URL` を切り替える（開発は SQLite、本番は PostgreSQL）。
- **管理画面**: `/admin` は本番でも有効です。Basic 認証や NextAuth で保護することを推奨します。
- **画像**: 記事の OGP 画像などは `public/` に置くか、Vercel にデプロイしたファイルに含めます。大量・大容量の場合は S3 や Cloudinary などの外部ストレージを検討してください。
- **Slack 通知など**: 監視スクリプトや Webhook は、Vercel の Cron や外部の定期実行サービスから本番 URL を叩く形にするとよいです。

---

## 5. まとめ

| 目的 | 使うもの | 月額目安 |
|------|----------|----------|
| 社内共有・お試し | Vercel (Hobby) + Neon (Free) | 0円 |
| 本番公開・安定運用 | Vercel (Pro) + Neon/Supabase (有料) + 独自ドメイン | 約6,000円〜 |

まずは **Vercel + Neon 無料枠** でデプロイし、アクセスや運用が増えてきたら Pro や有料 DB に乗り換える形がおすすめです。

不明点があれば、このドキュメントをベースに社内や開発者と相談してください。

---

## 6. 他の選択肢（安い・無料の比較）

**前提**: 記事の入稿と求人情報の更新は、いずれも **管理画面（/admin）** で行います。どの構成でも「アプリ＋データベースが常に動いていること」が必要です。以下はすべてその前提を満たします。

### 比較表

| 選択肢 | 月額目安 | 特徴 | 記事・求人更新 |
|--------|----------|------|----------------|
| **Vercel + Neon**（本文の推奨） | 0円〜約3,000円 | 設定が簡単。無料枠あり。商用は Pro 推奨 | ✅ /admin で可能 |
| **さくらのVPS** / **ConoHa VPS** | **約500〜1,000円** | 制作会社の WordPress に近い「1台サーバーを借りる」形。Node と DB を自分で構築 | ✅ /admin で可能 |
| **Railway** | 0円（$5クレジット/月）〜 | GitHub 連携でデプロイが簡単。無料枠はクレジット制で使い切ると有料 | ✅ /admin で可能 |
| **Render** | 0円（スリープあり）〜$7〜 | 無料枠はアクセスがないとスリープし、起動に数十秒かかることがある | ✅ /admin で可能 |

### 安く・無料でやりたい場合の選び方

- **運用をあまり触りたくない・まずは無料で試したい**  
  → **Vercel + Neon 無料** のままがおすすめ（記事・求人とも /admin で更新可能）。

- **「さくらのような月額数百円のサーバー」でまとめたい**  
  → **さくらのVPS** や **ConoHa VPS** を1台借り、その上で Next.js + SQLite（または PostgreSQL）を動かす。  
  - 月額はサーバー代のみ（約500〜1,000円程度）。  
  - 初期に Nginx・Node・SSL（Let's Encrypt）の設定が必要。制作会社やエンジニアに依頼する場合は、その分の費用が別途かかる。

- **Vercel は使わず、無料に近い PaaS で**  
  → **Railway** の無料クレジット（$5/月）で、Next.js + PostgreSQL をデプロイ。  
  - トラフィックが少なければ無料の範囲で収まることも。記事・求人更新は /admin で可能。

**まとめ**: 記事入稿・求人更新は「どの案でも /admin で可能」です。コスト重視なら「無料＝Vercel+Neon または Railway」「安い月額＝さくらVPS/ConoHa」から選ぶ形になります。
