import { reservations, joinReservation } from 'mocks';
import { useEffect } from 'react';
import { Logo } from './components/logo';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function App() {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_CLIENT as string | undefined) ?? '派遣クライアント';
  useEffect(() => {
    document.title = site ? `${site} | ${title}` : title;
  }, [site, title]);
  const statusJa: Record<'draft' | 'confirmed' | 'cancelled', string> = {
    draft: '下書き',
    confirmed: '確定',
    cancelled: '取消'
  };
  const joined = reservations
    .map(joinReservation)
    .filter((r): r is NonNullable<ReturnType<typeof joinReservation>> => !!r)
    .filter((jr) => !!jr.client);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-4 flex items-center justify-between">
        <Logo />
      </header>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
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
                {new Date(slot.startAt).toLocaleString('ja-JP', {
                  timeZone: 'Asia/Tokyo',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>
                <Badge variant={reservation.status === 'cancelled' ? 'destructive' : 'secondary'}>
                  {statusJa[reservation.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
