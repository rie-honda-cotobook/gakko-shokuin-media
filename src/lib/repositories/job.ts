import { prisma } from '@/lib/db';

const PER_PAGE = 12;

/** 都道府県（県別絞り込み用・表示順） */
const PREFECTURES_ORDER = [
  '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島', '茨城', '栃木', '群馬',
  '埼玉', '千葉', '東京', '神奈川', '新潟', '富山', '石川', '福井', '山梨', '長野',
  '岐阜', '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山',
  '鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '福岡',
  '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄',
];

function sortAreaListByPrefecture(areas: string[]): string[] {
  const set = new Set(areas);
  const inOrder = PREFECTURES_ORDER.filter((p) => set.has(p));
  const rest = areas.filter((a) => !PREFECTURES_ORDER.includes(a)).sort();
  return [...inOrder, ...rest];
}

export async function getJobs(opts?: { page?: number; area?: string }) {
  const page = opts?.page ?? 1;
  const where: { area?: string } = {};
  if (opts?.area) where.area = opts.area;

  const [items, total, areas] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.job.count({ where }),
    prisma.job.findMany({ select: { area: true }, distinct: ['area'] }),
  ]);
  const rawAreas = areas.map((a) => a.area).filter((a) => a !== '関東');
  const areaList = sortAreaListByPrefecture(rawAreas);
  return { items, total, totalPages: Math.ceil(total / PER_PAGE), page, areaList };
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({ where: { id } });
}

export async function getAllJobIds() {
  return prisma.job.findMany({ select: { id: true } });
}
