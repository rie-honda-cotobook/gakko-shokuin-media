import { NextResponse } from 'next/server';
import { runMonitor } from '@/lib/monitor/run';

const TOKEN = process.env.MONITOR_RUN_TOKEN;

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || req.headers.get('x-monitor-token');
  const token = auth?.replace(/^Bearer\s+/i, '').trim() || auth?.trim();
  if (!TOKEN || token !== TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { checked, eventsCreated } = await runMonitor();
    return NextResponse.json({ ok: true, checked, eventsCreated });
  } catch (e) {
    console.error('Monitor run error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Run failed' },
      { status: 500 }
    );
  }
}
