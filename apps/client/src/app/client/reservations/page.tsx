import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ClientOutletContext } from '../layout';

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const statusLabel: Record<'draft' | 'confirmed' | 'cancelled', string> = {
  draft: '下書き',
  confirmed: '確定',
  cancelled: '取消',
};

export function ReservationsPage() {
  const { reservations } = useOutletContext<ClientOutletContext>();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'draft' | 'cancelled'>('all');

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return reservations.filter(({ client, reservation, store, user }) => {
      const matchesKeyword = [client.name, store.name, user.name, reservation.id]
        .some((value) => value.toLowerCase().includes(keyword));
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });
  }, [reservations, query, statusFilter]);

  return (
    <section aria-labelledby="client-reservations" className="grid gap-8">
      <Card className="border-none bg-card/95 shadow-soft">
        <CardHeader className="gap-6">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle id="client-reservations" className="text-2xl md:text-3xl">
                派遣予約一覧
              </CardTitle>
              <CardDescription className="text-base">
                企業ごとの予約状況を確認し、訪問準備や従業員への周知にご活用ください。
              </CardDescription>
            </div>
            <Button type="button" variant="outline" className="justify-self-start md:justify-self-end">
              Excelにエクスポート
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="client-query">企業名 / 店舗名 / 利用者名</Label>
              <Input
                id="client-query"
                placeholder="例: ACME / Salon / 佐藤"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                inputMode="search"
                aria-label="予約を検索"
              />
            </div>
            <div className="space-y-2">
              <Label>状態</Label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'confirmed', 'draft', 'cancelled'] as const).map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant={statusFilter === status ? 'primary' : 'outline'}
                    className="px-4"
                    onClick={() => setStatusFilter(status)}
                    aria-pressed={statusFilter === status}
                  >
                    {status === 'all' ? 'すべて' : statusLabel[status]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table aria-label="派遣予約一覧">
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
              {filtered.map(({ reservation, store, client, user, slot }) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-semibold">{reservation.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{dateFormatter.format(slot.startAt)}</TableCell>
                  <TableCell>
                    <Badge variant={reservation.status === 'cancelled' ? 'destructive' : 'secondary'}>
                      {statusLabel[reservation.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
