const WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';

export type SlackEventPayload = {
  universityName: string;
  url: string;
  changeType: string;
  detectedAt: string;
  eventId: string;
  pageId: string;
  reviewToken: string;
  titleGuess?: string | null;
};

export async function sendMonitorAlert(payload: SlackEventPayload): Promise<boolean> {
  if (!WEBHOOK) return false;
  const reviewUrl = `${SITE_URL}/r/monitor-events/${payload.eventId}/review?token=${payload.reviewToken}`;
  const eventsUrl = `${SITE_URL}/admin/monitor-events?eventId=${payload.eventId}`;
  const pageEditUrl = `${SITE_URL}/admin/monitor-pages/${payload.pageId}/edit`;

  const text = [
    `*大学採用ページの更新を検知*`,
    `*大学名:* ${payload.universityName}`,
    `*URL:* ${payload.url}`,
    `*種別:* ${payload.changeType}`,
    payload.titleGuess ? `*タイトル:* ${payload.titleGuess}` : null,
    `*検知時刻:* ${payload.detectedAt}`,
    '',
    `・<${eventsUrl}|イベント一覧で見る>`,
    `・<${pageEditUrl}|監視ページを編集>`,
    `・<${reviewUrl}|確認済みにする（1クリック）>`,
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.ok;
}
