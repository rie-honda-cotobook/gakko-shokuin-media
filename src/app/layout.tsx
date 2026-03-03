import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: '大学職員転職.com | 学校・大学職員を目指す人の情報サイト', template: '%s | 大学職員転職.com' },
  description: '学校職員・大学職員を目指す方のための求人情報とキャリアガイド。採用試験の対策、仕事内容、転職のポイントを解説します。',
  openGraph: { type: 'website', locale: 'ja_JP' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={noto.variable}>
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-stone-50 via-white to-stone-50/80 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
