'use client';

import { useRouter, useSearchParams } from 'next/navigation';

/** 都道府県プルダウンに表示しない地域名（県別表示のため） */
const HIDDEN_REGIONS = ['関東', '東北', '中部', '中国', '九州', '関西'];

function isHiddenRegion(area: string): boolean {
  const t = area.trim();
  return HIDDEN_REGIONS.some((r) => r === t || t === r);
}

export function JobsFilter({
  areaList,
  currentArea,
}: {
  areaList: string[];
  currentArea?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const options = areaList.filter((a) => !isHiddenRegion(a));

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const area = e.target.value;
    const next = new URLSearchParams(searchParams?.toString() || '');
    next.delete('page');
    if (area) next.set('area', area);
    else next.delete('area');
    router.push(`/jobs?${next.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="area" className="text-sm font-medium text-stone-700">都道府県</label>
      <select
        id="area"
        value={currentArea ?? ''}
        onChange={handleChange}
        className="border border-stone-300 rounded px-3 py-2 text-sm"
      >
        <option value="">すべて</option>
        {options.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
}
