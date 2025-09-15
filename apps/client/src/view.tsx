import { reservations, joinReservation } from 'mocks';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function App() {
  const joined = reservations
    .map(joinReservation)
    .filter((r): r is NonNullable<ReturnType<typeof joinReservation>> => !!r)
    .filter((jr) => !!jr.client);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4">予約一覧（派遣クライアント・モック）</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>予約ID</TableHead>
            <TableHead>クライアント</TableHead>
            <TableHead>店舗</TableHead>
            <TableHead>利用者</TableHead>
            <TableHead>開始</TableHead>
            <TableHead>状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {joined.map(({ reservation, store, client, user, slot }) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.id}</TableCell>
              <TableCell>{client?.name}</TableCell>
              <TableCell>{store.name}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                {new Date(slot.startAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
              </TableCell>
              <TableCell>
                <Badge variant={reservation.status === 'cancelled' ? 'destructive' : 'secondary'}>
                  {reservation.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
