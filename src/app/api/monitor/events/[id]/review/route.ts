import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { verifyReviewToken } from '@/lib/monitor/token';
import { REVIEW_TOKEN_EXPIRY_DAYS } from '@/lib/monitor/types';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const body = await req.json().catch(() => ({}));
  const token = (body.token as string) || new URL(req.url).searchParams.get('token') || '';

  const ev = await prisma.monitorEvent.findUnique({
    where: { id },
    include: { page: true },
  });
  if (!ev) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  if (ev.isReviewed) {
    return NextResponse.json({ ok: true, alreadyReviewed: true });
  }

  let allowed = false;
  if (session) {
    allowed = true; // 管理画面から
  } else if (token) {
    const expiry = new Date(ev.detectedAt);
    expiry.setDate(expiry.getDate() + REVIEW_TOKEN_EXPIRY_DAYS);
    if (new Date() > expiry) {
      return NextResponse.json({ error: 'Token expired' }, { status: 410 });
    }
    if (!verifyReviewToken(token, ev.reviewTokenHash)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
    allowed = true;
  }
  if (!allowed) {
    return NextResponse.json({ error: 'token or login required' }, { status: 400 });
  }

  await prisma.monitorEvent.update({
    where: { id },
    data: {
      isReviewed: true,
      reviewedAt: new Date(),
      reviewedBy: session ? 'admin' : 'link',
    },
  });
  return NextResponse.json({ ok: true });
}
