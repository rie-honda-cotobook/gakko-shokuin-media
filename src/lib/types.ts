// データ層の型（後から外部CMS等に差し替え可能にするため）

export type ArticleStatus = 'draft' | 'scheduled' | 'published';

export interface FaqItem {
  q: string;
  a: string;
}

export interface ReferenceItem {
  title: string;
  url: string;
}

export interface AuthorSocial {
  twitter?: string;
  linkedin?: string;
  website?: string;
}
