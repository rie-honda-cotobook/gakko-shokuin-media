const WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';

// Chatwork 用（トークンとルームIDが両方あれば、こちらを優先して使う）
const CHATWORK_API_TOKEN = process.env.CHATWORK_API_TOKEN;
const CHATWORK_ROOM_ID = process.env.CHATWORK_ROOM_ID;

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

async function sendChatworkAlert(payload: SlackEventPayload): Promise<boolean> {
  if (!CHATWORK_API_TOKEN || !CHATWORK_ROOM_ID) return false;

  const reviewUrl = `${SITE_URL}/r/monitor-events/${payload.eventId}/review?token=${payload.reviewToken}`;
  const eventsUrl = `${SITE_URL}/admin/monitor-events?eventId=${payload.eventId}`;
  const pageEditUrl = `${SITE_URL}/admin/monitor-pages/${payload.pageId}/edit`;

  const lines = [
    '[大学採用ページの更新を検知]',
    `大学名: ${payload.universityName}`,
    `URL: ${payload.url}`,
    `種別: ${payload.changeType}`,
    payload.titleGuess ? `タイトル: ${payload.titleGuess}` : null,
    `検知時刻: ${payload.detectedAt}`,
    '',
    `・イベント一覧で見る: ${eventsUrl}`,
    `・監視ページを編集: ${pageEditUrl}`,
    `・確認済みにする（1クリック）: ${reviewUrl}`,
  ].filter(Boolean);

  const body = new URLSearchParams({ body: lines.join('\n') }).toString();

  const res = await fetch(`https://api.chatwork.com/v2/rooms/${CHATWORK_ROOM_ID}/messages`, {
    method: 'POST',
    headers: {
      'X-ChatWorkToken': CHATWORK_API_TOKEN,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  return res.ok;
}

async function sendSlackAlert(payload: SlackEventPayload): Promise<boolean> {
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

export async function sendMonitorAlert(payload: SlackEventPayload): Promise<boolean> {
  // 1. Chatwork が設定されていれば、Chatwork を優先
  if (CHATWORK_API_TOKEN && CHATWORK_ROOM_ID) {
    const ok = await sendChatworkAlert(payload);
    if (ok) return true;
  }

  // 2. フォールバックとして Slack Webhook があればそちらに送る
  if (WEBHOOK) {
    return sendSlackAlert(payload);
  }

  // どちらの設定もない場合
  return false;
}
