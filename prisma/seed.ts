import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PREFECTURES = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島', '茨城', '栃木', '群馬',
  '埼玉', '千葉', '東京', '神奈川', '新潟', '富山', '石川', '福井', '山梨', '長野',
  '岐阜', '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山',
  '鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '福岡',
  '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄',
];

const JOB_TITLES = [
  '事務職員', '学生支援係', '入試広報係', '教務係', '図書館司書', '就職支援係',
  '人事係', '総務係', '経理係', '施設管理係', '国際交流係', '研究支援係',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pastDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

async function main() {
  const author1 = await prisma.author.upsert({
    where: { slug: 'yamada-taro' },
    update: {},
    create: {
      slug: 'yamada-taro',
      name: '山田 太郎',
      role: '元大学職員・キャリアアドバイザー',
      bio: '国立大学で10年以上の職員経験を持ち、現在は学校職員を目指す方のキャリア支援を行う。',
      credentials: '某国立大学 事務職員（10年）、キャリアコンサルタント資格',
      avatarUrl: null,
      social: JSON.stringify({ twitter: null, linkedin: null }),
      isSupervisor: false,
    },
  });

  const author2 = await prisma.author.upsert({
    where: { slug: 'sato-hanako' },
    update: {},
    create: {
      slug: 'sato-hanako',
      name: '佐藤 花子',
      role: '大学人事・採用担当（監修）',
      bio: '私立大学で人事・採用を担当。学校職員の採用動向と試験対策に詳しい。',
      credentials: '私立大学 人事部（8年）、産業カウンセラー',
      avatarUrl: null,
      social: JSON.stringify({ twitter: null, website: null }),
      isSupervisor: true,
    },
  });

  const articlesData = [
    { title: '学校職員とは？仕事内容と魅力を解説', category: '基礎知識', slug: 'gakko-shokuin-toha' },
    { title: '大学職員の仕事内容・一日の流れ', category: '基礎知識', slug: 'daigaku-shokuin-nichijo' },
    { title: '学校職員になるには？採用の種類と流れ', category: '就職・転職', slug: 'naru-niwa' },
    { title: '大学職員の公募採用の流れと対策', category: '就職・転職', slug: 'koubo-saiyou' },
    { title: '学校職員の試験対策｜教養・専門の勉強法', category: '試験対策', slug: 'shiken-taisaku' },
    { title: '論文試験の書き方と頻出テーマ', category: '試験対策', slug: 'ronbun-kakikata' },
    { title: '面接で聞かれる質問と回答例', category: '試験対策', slug: 'mensetsu-qanda' },
    { title: '大学職員の年収・給与の実態', category: '待遇・キャリア', slug: 'nenshu-kyuyo' },
    { title: '公立と私立でどう違う？学校職員の比較', category: '基礎知識', slug: 'kouritsu-shiritsu' },
    { title: '学校職員のキャリアパスと昇進', category: '待遇・キャリア', slug: 'career-path' },
    { title: '事務職員と教員の違い・連携', category: '基礎知識', slug: 'jimu-kyoin' },
    { title: '学生支援の仕事とは', category: '仕事内容', slug: 'gakusei-shien' },
    { title: '入試・広報の仕事内容', category: '仕事内容', slug: 'nyushi-koho' },
    { title: '学校職員の志望動機の書き方', category: '就職・転職', slug: 'shibou-douki' },
    { title: '転職で大学職員になる方法', category: '就職・転職', slug: 'tenshoku-method' },
    { title: '大学職員の求人の探し方', category: '就職・転職', slug: 'kyujin-sagashikata' },
    { title: 'エリア別の求人傾向（関東・関西など）', category: '就職・転職', slug: 'area-kyujin' },
    { title: '学校職員のやりがいと大変なこと', category: '基礎知識', slug: 'yarigaki-taihen' },
    { title: '未経験から学校職員を目指すには', category: '就職・転職', slug: 'mikeiken' },
    { title: '学校職員の休日・残業の実態', category: '待遇・キャリア', slug: 'kyujitsu-zangyo' },
  ];

  const excerpt = '学校職員・大学職員を目指す方のための解説記事です。仕事内容、採用の流れ、試験対策まで分かりやすくまとめています。';
  const seoDesc = '学校職員・大学職員の仕事内容、採用試験、転職のポイントを解説。対策ガイドと求人情報で志望動機から面接までサポート。';

  for (const a of articlesData) {
    const author = Math.random() > 0.5 ? author1 : author2;
    const publishedAt = pastDate(Math.floor(Math.random() * 90));
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        title: a.title,
        slug: a.slug,
        excerpt,
        content: `## はじめに\n\n${a.title}について、実務経験を踏まえて解説します。\n\n## 概要\n\n学校職員の仕事は多岐にわたります。\n\n## まとめ\n\n本記事では${a.title}のポイントをまとめました。`,
        status: 'published',
        publishedAt,
        updatedAt: publishedAt,
        category: a.category,
        tags: JSON.stringify(['学校職員', '大学職員', a.category]),
        seoTitle: null,
        seoDescription: seoDesc.slice(0, 120),
        ogImageUrl: null,
        authorId: author.id,
        faq: JSON.stringify([
          { q: `${a.title}で押さえるポイントは？`, a: '仕事内容と採用の流れを理解することが重要です。' },
          { q: '未経験でも目指せますか？', a: 'はい。多くの大学で未経験者を募集しています。' },
        ]),
        references: JSON.stringify([
          { title: '文部科学省', url: 'https://www.mext.go.jp/' },
        ]),
      },
    });
  }

  const jobCount = await prisma.job.count();
  if (jobCount === 0) {
    for (let i = 0; i < 30; i++) {
      await prisma.job.create({
        data: {
          title: pick(JOB_TITLES),
          schoolName: `${pick(PREFECTURES)}の大学・短大`,
          area: pick(PREFECTURES),
          employmentType: pick(['正職員', '契約職員', '常勤']),
          deadline: pastDate(-Math.floor(Math.random() * 60)),
          officialUrl: 'https://example.com/recruit',
          summary: '学生支援・事務業務全般。詳細は公式採用ページをご確認ください。',
          updatedAt: pastDate(Math.floor(Math.random() * 30)),
        },
      });
    }
  }

  console.log('Seed: authors 2, articles 20, jobs 30');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
