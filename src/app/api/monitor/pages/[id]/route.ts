import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { universityName, url, area, isActive, checkIntervalHours, notes } = body;
  if (!universityName) return NextResponse.json({ error: 'universityName required' }, { status: 400 });

  await prisma.monitorPage.update({
    where: { id },
    data: {
      universityName,
      area: area || null,
      isActive: isActive !== false,
      checkIntervalHours: Number(checkIntervalHours) || 24,
      notes: notes || null,
    },
  });
  return NextResponse.json({ ok: true });
}
