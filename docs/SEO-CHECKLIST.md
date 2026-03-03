# SEOチェックリスト（本実装対応）

## 構造化データ

- [x] **BreadcrumbList**  
  記事詳細・求人詳細・カテゴリハブ・固定ページでパンくずUI + JSON-LD（`Breadcrumbs.tsx` / `BreadcrumbJsonLd`）
- [x] **Article**  
  記事詳細ページで `Article` 構造化データ（日付・著者含む）
- [x] **FAQPage**  
  FAQがある記事で `faq` フィールドと同期した JSON-LD

## メタ・OGP

- [x] **canonical**  
  記事詳細の `metadata.alternates.canonical`（`NEXT_PUBLIC_SITE_URL` と slug で生成）
- [x] **title / description**  
  各ページの `metadata`（記事は `seoTitle` / `seoDescription`）
- [x] **OGP / Twitterカード**  
  記事詳細の `openGraph`・`twitter`（`ogImageUrl` を利用）

## クロール・サイトマップ

- [x] **robots.txt**  
  `src/app/robots.ts`（`/admin/`, `/api/` を disallow、sitemap URL 記載）
- [x] **sitemap.xml**  
  `src/app/sitemap.ts`（トップ・求人・記事・著者・固定ページを動的生成）

## ページ構成

- [x] **H1は1つ**  
  各ページで単一の `h1`
- [x] **目次（TOC）**  
  記事詳細で `Toc` コンポーネント + 見出し id 連動（`extractTocFromMarkdown` / `Markdown` の headingIds）
- [x] **404ページ**  
  `src/app/not-found.tsx`

## 内部リンク

- [x] **記事末「次に読む」**  
  career-guide ハブ + 関連記事 3 本へのリンク
- [x] **グロナビ・フッター**  
  求人 / 対策ガイド / 記事 / 著者 / 運営系リンク

## 運用時確認

- [ ] 本番の `NEXT_PUBLIC_SITE_URL` を実際のドメインに設定
- [ ] Google Search Console で sitemap 送信
- [ ] 記事の `seoDescription` は 120 文字前後で入力
- [ ] 必要に応じて OGP 画像（`ogImageUrl`）を設定
