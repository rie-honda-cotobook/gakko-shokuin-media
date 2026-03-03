/**
 * HTML本文を正規化してハッシュ比較用の文字列を返す。
 * <script>, <style>, コメント除去 / 連続空白を1つに / trim
 */
export function normalizeHtml(html: string): string {
  let s = html;
  // コメント除去
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  // script 除去
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  // style 除去
  s = s.replace(/<style\b[\s\S]*?<\/style>/gi, '');
  // 連続空白・改行を1つに
  s = s.replace(/\s+/g, ' ');
  return s.trim();
}

export function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1].replace(/\s+/g, ' ').trim().slice(0, 200) || null;
}
