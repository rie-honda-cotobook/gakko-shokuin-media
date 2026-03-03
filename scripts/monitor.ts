/**
 * 監視ジョブを実行するスクリプト。
 * 使用例: npx tsx scripts/monitor.ts
 * 環境変数 DATABASE_URL が必要。
 */
import { runMonitor } from '../src/lib/monitor/run';

async function main() {
  const result = await runMonitor();
  console.log(JSON.stringify({ checked: result.checked, eventsCreated: result.eventsCreated }));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
