import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { csv } = await req.json().catch(() => ({}));
  if (typeof csv !== 'string') return NextResponse.json({ error: 'csv required' }, { status: 400 });

  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  let imported = 0;
  for (const line of lines) {
    const parts = line.split(',').map((p: string) => p.trim());
    const universityName = parts[0];
    const url = parts[1];
    const area = parts[2] || undefined;
    if (!universityName || !url) continue;
    try {
      await prisma.monitorPage.upsert({
        where: { url },
        update: { universityName, area: area || null },
        create: { universityName, url, area: area || null },
      });
      imported++;
    } catch {
      // skip duplicate or invalid
    }
  }
  return NextResponse.json({ ok: true, imported });
}
