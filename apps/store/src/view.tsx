import { useEffect, useMemo, useState } from 'react';
import { joinReservation, reservations } from 'mocks';
import { Logo } from './components/logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

type ReservationStatus = 'draft' | 'confirmed' | 'cancelled';

const statusLabel: Record<ReservationStatus, string> = {
  draft: '下書き',
  confirmed: '確定',
  cancelled: '取消',
};

export function App() {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_STORE as string | undefined) ?? '店舗ダッシュボード';
  useEffect(() => {
    document.title = site ? `${site} | ${title}` : title;
  }, [site, title]);

  const joined = useMemo(
    () =>
      reservations
        .map(joinReservation)
        .filter((item): item is NonNullable<ReturnType<typeof joinReservation>> => Boolean(item)),
    [],
  );

  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return joined.filter(({ reservation, store, user }) => {
      const byStatus = statusFilter === 'all' || reservation.status === statusFilter;
      const byKeyword = [store.name, user.name, reservation.id]
        .some((value) => value.toLowerCase().includes(keyword));
      return byStatus && byKeyword;
    });
  }, [joined, query, statusFilter]);

  const stats = useMemo(() => {
    const total = joined.length;
    const confirmed = joined.filter(({ reservation }) => reservation.status === 'confirmed').length;
    const cancelled = joined.filter(({ reservation }) => reservation.status === 'cancelled').length;
    const draft = total - confirmed - cancelled;
    return { total, confirmed, cancelled, draft };
  }, [joined]);

  return (
    <main className="relative min-h-screen pb-20">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 md:gap-14 md:px-10">
        <h1 className="sr-only">{title}</h1>
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-2xl text-base font-medium text-muted-foreground md:text-lg">
              当日の準備やスタッフ手配に役立つ予約状況をリアルタイムで確認できます。
            </p>
          </div>
          <Badge variant="secondary" className="self-start">
            予約総数 {stats.total.toLocaleString()} 件
          </Badge>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-none bg-card/95 shadow-soft">
            <CardHeader className="gap-2">
              <CardDescription className="text-sm font-semibold text-muted-foreground">
                確定済み予約
              </CardDescription>
              <CardTitle className="text-3xl text-primary md:text-4xl">
                {stats.confirmed.toLocaleString()} 件
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground md:text-base">
              直近1週間での確定率は
              {stats.total > 0 ? ` ${(Math.round((stats.confirmed / stats.total) * 1000) / 10).toFixed(1)}%` : ' -'}。
            </CardContent>
          </Card>

          <Card className="border-none bg-card/95 shadow-soft">
            <CardHeader className="gap-2">
              <CardDescription className="text-sm font-semibold text-muted-foreground">
                取消・要フォロー
              </CardDescription>
              <CardTitle className="text-3xl text-primary md:text-4xl">
                {stats.cancelled.toLocaleString()} 件
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground md:text-base">
              キャンセル理由のヒアリングを行い、再来店に向けたフォローをご検討ください。
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/30 text-secondary-foreground shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl">設備準備メモ</CardTitle>
              <CardDescription className="text-sm text-secondary-foreground/80">
                予約内容から推奨される準備事項です。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm md:text-base">
                <li className="rounded-xl bg-secondary/40 px-4 py-3">血圧計・体組成計の動作確認</li>
                <li className="rounded-xl bg-secondary/40 px-4 py-3">段差解消スロープの設置</li>
                <li className="rounded-xl bg-secondary/40 px-4 py-3">受付票と問診票の印刷（5部）</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="reservation-table" className="grid gap-8">
          <Card className="border-none bg-card/95 shadow-soft">
            <CardHeader className="gap-6">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle id="reservation-table" className="text-2xl md:text-3xl">
                    予約一覧
                  </CardTitle>
                  <CardDescription className="text-base">
                    予約状況をフィルタし、来店準備やスタッフ配置にお役立てください。
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
                  {filtered.map(({ reservation, store, user, slot }) => (
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
        </section>
      </div>
    </main>
  );
}
