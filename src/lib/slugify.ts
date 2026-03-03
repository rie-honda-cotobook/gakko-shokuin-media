import slugifyLib from 'slugify';

export function slugify(text: string): string {
  const s = slugifyLib(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
  });
  return (s && s.replace(/\s+/g, '-')) || 'article';
}

/** 重複時は末尾に連番を付与 */
export async function uniqueSlug(base: string, exists: (s: string) => Promise<boolean>): Promise<string> {
  let slug = base;
  let n = 1;
  while (await exists(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}
