import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { joinedReservations } from '../data';

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  hour: '2-digit',
  minute: '2-digit',
});

type ReservationStatusFilter = 'all' | 'confirmed' | 'draft' | 'cancelled';

const statusLabel = {
  draft: '下書き',
  confirmed: '確定',
  cancelled: '取消',
} as const;

export function ReservationsPage() {
  const [statusFilter, setStatusFilter] = useState<ReservationStatusFilter>('all');
  const [query, setQuery] = useState('');

  const filteredReservations = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return joinedReservations.filter(({ reservation, store, user }) => {
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      const matchesKeyword = [store.name, user.name, reservation.id]
        .some((value) => value.toLowerCase().includes(keyword));
      return matchesStatus && matchesKeyword;
    });
  }, [query, statusFilter]);

  return (
    <Card className="border-none bg-card/95 shadow-soft">
      <CardHeader className="gap-6">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl">予約一覧</CardTitle>
            <CardDescription className="text-base">
              状態やキーワードで絞り込み、来店準備やスタッフ配置に役立ててください。
            </CardDescription>
          </div>
          <Button type="button" variant="outline" className="justify-self-start md:justify-self-end">
            今日の予定を印刷
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="reservation-query">店舗 / 利用者 / 予約ID</Label>
            <Input
              id="reservation-query"
              placeholder="例: Salon-01 / 鈴木"
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
        <Table aria-label="予約一覧">
          <TableHeader>
            <TableRow>
              <TableHead>予約ID</TableHead>
              <TableHead>店舗</TableHead>
              <TableHead>利用者</TableHead>
              <TableHead>開始</TableHead>
              <TableHead>終了</TableHead>
              <TableHead>状態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map(({ reservation, store, user, slot }) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-semibold">{reservation.id}</TableCell>
                <TableCell>{store.name}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{dateTimeFormatter.format(slot.startAt)}</TableCell>
                <TableCell>{timeFormatter.format(slot.endAt)}</TableCell>
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
  );
}
