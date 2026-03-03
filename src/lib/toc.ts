/** 目次アイテム（h2/h3） */
export interface TocItem {
  id: string;
  text: string;
  level: number; // 2 = h2, 3 = h3
}

function slugifyHeadline(text: string): string {
  return (
    text
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf-]/g, '')
      .slice(0, 30) || 'section'
  );
}

/** Markdownの見出しからTocItemを抽出（h2/h3のみ）。idはslug化して付与 */
export function extractTocFromMarkdown(content: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = content.split('\n');
  let h2Index = 0;
  let h3Index = 0;
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      h2Index += 1;
      h3Index = 0;
      items.push({
        id: `h2-${h2Index}-${slugifyHeadline(h2[1])}`,
        text: h2[1].trim(),
        level: 2,
      });
    } else if (h3) {
      h3Index += 1;
      items.push({
        id: `h3-${h2Index}-${h3Index}-${slugifyHeadline(h3[1])}`,
        text: h3[1].trim(),
        level: 3,
      });
    }
  }
  return items;
}
