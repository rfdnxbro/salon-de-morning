import { reservations, joinReservation } from 'mocks';

export function App() {
  const joined = reservations
    .map(joinReservation)
    .filter((r): r is NonNullable<ReturnType<typeof joinReservation>> => !!r)
    .filter((jr) => !!jr.client);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-4">予約一覧（派遣クライアント・モック）</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">予約ID</th>
            <th className="border p-2 text-left">クライアント</th>
            <th className="border p-2 text-left">店舗</th>
            <th className="border p-2 text-left">利用者</th>
            <th className="border p-2 text-left">開始</th>
            <th className="border p-2 text-left">状態</th>
          </tr>
        </thead>
        <tbody>
          {joined.map(({ reservation, store, client, user, slot }) => (
            <tr key={reservation.id}>
              <td className="border p-2">{reservation.id}</td>
              <td className="border p-2">{client?.name}</td>
              <td className="border p-2">{store.name}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">
                {new Date(slot.startAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
              </td>
              <td className="border p-2">{reservation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

