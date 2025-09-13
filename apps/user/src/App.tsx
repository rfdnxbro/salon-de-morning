import { useMemo, useState } from 'react';
import { stores, slots } from 'mocks';

export function App() {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const filteredStores = stores.filter((s) => s.name.toLowerCase().includes(keyword));
    const storeIds = new Set(filteredStores.map((s) => s.id));
    const nextSlots = slots
      .filter((sl) => storeIds.has(sl.storeId) && sl.status === 'active')
      .sort((a, b) => a.startAt - b.startAt);
    return { filteredStores, nextSlots };
  }, [q]);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">サロン検索（モック）</h1>
      <input
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="店舗名で検索（例: 銀座）"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="space-y-4">
        {results.filteredStores.map((s) => (
          <div key={s.id} className="border rounded p-3">
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-gray-500">{s.address}</div>
            <div className="mt-2">
              <div className="text-sm font-medium">次の予約枠</div>
              <ul className="list-disc list-inside text-sm">
                {results.nextSlots
                  .filter((sl) => sl.storeId === s.id)
                  .slice(0, 3)
                  .map((sl) => (
                    <li key={sl.id}>
                      {new Date(sl.startAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                      {' '}～{' '}
                      {new Date(sl.endAt).toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                      {' '}（定員{sl.capacity}）
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ))}
        {results.filteredStores.length === 0 && (
          <div className="text-gray-500">該当する店舗がありません</div>
        )}
      </div>
    </div>
  );
}

