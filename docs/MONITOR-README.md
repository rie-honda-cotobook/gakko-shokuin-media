# 大学採用ページ監視システム 導入手順

採用ページのURLをDBに登録し、更新を検知すると Slack で通知します。Slack のリンクから1クリックで「確認済み」にできます。

---

## 1. DB マイグレーション

```bash
npx prisma db push
```

MonitorPage / MonitorEvent テーブルが作成されます。

---

## 2. 環境変数（.env）

| 変数 | 説明 |
|------|------|
| `DATABASE_URL` | Prisma 用（SQLite または Postgres） |
| `NEXTAUTH_SECRET` | NextAuth 用 |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | 管理画面ログイン |
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook URL |
| `SITE_URL` | サイトのURL（Slack 内リンク・確認済みリンクのベース） |
| `SLACK_ACTION_TOKEN` | 確認済みリンクの署名用（32文字以上推奨） |
| `MONITOR_RUN_TOKEN` | 監視ジョブ実行用（POST /api/monitor/run の Bearer トークン） |

`.env.example` をコピーして `.env` を作成し、上記を設定してください。

---

## 3. 管理者ログイン

1. 開発サーバー起動: `npm run dev`
2. ブラウザで `http://localhost:3000/admin/login`
3. `.env` の `ADMIN_EMAIL` / `ADMIN_PASSWORD` でログイン

---

## 4. 監視URLの登録

- **管理画面** → **監視** → **監視URL**（`/admin/monitor-pages`）
- 「追加」から1件ずつ登録、または **CSVインポート** で一括登録
- CSV形式: `大学名,URL,エリア`（1行1件。エリアは任意）

例:
```
○○大学,https://www.xxx.ac.jp/recruit/,関東
△△大学,https://www.yyy.ac.jp/jobs/,関西
```

---

## 5. 監視の実行

### 方法A: API で実行（Vercel 等にデプロイしている場合）

```bash
curl -X POST "https://あなたのサイト/api/monitor/run" \
  -H "Authorization: Bearer あなたのMONITOR_RUN_TOKEN"
```

### 方法B: スクリプトで実行（ローカル・cron 等）

```bash
npx tsx scripts/monitor.ts
```

`.env` に `DATABASE_URL` 等が設定されている必要があります。

### 実行間隔

- 各ページの「チェック間隔（時間）」で制御（デフォルト 24 時間）
- 1回の実行で「前回チェックから指定時間経過したページ」のみ対象

---

## 6. Slack 通知 → 1クリックで確認済み

1. 更新検知時に Slack に通知が届く
2. 通知内の **「確認済みにする（1クリック）」** リンクを開く
3. 表示されたページで **「確認済みにする」** ボタンを押す
4. ログイン不要で、そのイベントが「確認済み」になる
5. 完了ページから「イベント一覧」「採用ページを開く」「監視ページを編集」に遷移可能

確認済みリンクは **検知から14日間** 有効です。期限切れの場合は管理画面のイベント一覧から「確認済み」にしてください。

---

## 7. GitHub Actions で定期実行（例）

`.github/workflows/monitor.yml` を参照してください。

- **Secrets** に `SITE_URL`, `MONITOR_RUN_TOKEN` を設定（方法A の場合）
- または `DATABASE_URL`, `SLACK_WEBHOOK_URL`, `SITE_URL`, `SLACK_ACTION_TOKEN` を設定して方法B（スクリプト実行）を使用
- 例では 6 時間ごとの cron を設定

---

## 主な画面

| パス | 説明 |
|------|------|
| `/admin/dashboard` | 直近24hの検知件数・未確認件数・エラー多発ページ |
| `/admin/monitor-pages` | 監視URL一覧・追加・CSVインポート・編集 |
| `/admin/monitor-pages/[id]/edit` | 監視URLの編集 |
| `/admin/monitor-events` | イベント一覧・未確認フィルタ・確認済みボタン |
| `/r/monitor-events/[id]/review?token=...` | 確認済みリンク（ログイン不要） |

---

## 注意

- 無断でページ内容を転載しません。差分検知・URL記録が目的です。
- User-Agent を明示し、robots.txt で `Disallow: /` の場合は自動で監視を停止します。
