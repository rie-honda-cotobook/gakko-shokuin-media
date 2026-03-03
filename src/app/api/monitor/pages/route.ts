import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { universityName, url, area, isActive, checkIntervalHours, notes } = body;
  if (!universityName || !url) return NextResponse.json({ error: 'universityName and url required' }, { status: 400 });

  try {
    const page = await prisma.monitorPage.create({
      data: {
        universityName,
        url,
        area: area || null,
        isActive: isActive !== false,
        checkIntervalHours: Number(checkIntervalHours) || 24,
        notes: notes || null,
      },
    });
    return NextResponse.json({ ok: true, id: page.id });
  } catch (e) {
    return NextResponse.json({ error: 'URL may already exist' }, { status: 400 });
  }
}
