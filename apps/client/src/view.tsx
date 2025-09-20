import { useEffect, useMemo, useState } from 'react';
import { joinReservation, reservations } from 'mocks';
import { Logo } from './components/logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

export function App() {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_CLIENT as string | undefined) ?? '派遣クライアント';
  useEffect(() => {
    document.title = site ? `${site} | ${title}` : title;
  }, [site, title]);

  const joined = useMemo(
    () =>
      reservations
        .map(joinReservation)
        .filter((item): item is NonNullable<ReturnType<typeof joinReservation>> => Boolean(item))
        .filter((item) => Boolean(item.client)),
    [],
  );

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'draft' | 'cancelled'>('all');

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return joined.filter(({ client, reservation, store, user }) => {
      const matchesKeyword = [client?.name ?? '', store.name, user.name, reservation.id]
        .some((value) => value.toLowerCase().includes(keyword));
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });
  }, [joined, query, statusFilter]);

  const stats = useMemo(() => {
    const total = joined.length;
    const confirmed = joined.filter(({ reservation }) => reservation.status === 'confirmed');
    const uniqueClients = new Set(joined.map(({ client }) => client?.name ?? '未設定'));
    return {
      total,
      confirmed: confirmed.length,
      upcoming: confirmed.filter(({ slot }) => slot.startAt > Date.now()).length,
      uniqueClients: uniqueClients.size,
    };
  }, [joined]);

  return (
    <main className="relative min-h-screen pb-20">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 md:gap-14 md:px-10">
        <h1 className="sr-only">{title}</h1>
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-2xl text-base font-medium text-muted-foreground md:text-lg">
              企業向けの訪問スケジュールと利用者情報を一括で確認できます。人事・総務部門での共有にもご活用ください。
            </p>
          </div>
          <Badge variant="secondary" className="self-start">
            提携クライアント {stats.uniqueClients.toLocaleString()} 社
          </Badge>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-none bg-card/95 shadow-soft">
            <CardHeader className="gap-2">
              <CardDescription className="text-sm font-semibold text-muted-foreground">
                予約総数
              </CardDescription>
              <CardTitle className="text-3xl text-primary md:text-4xl">{stats.total.toLocaleString()} 件</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground md:text-base">
              期間内に登録された全ての予約件数です。
            </CardContent>
          </Card>
          <Card className="border-none bg-card/95 shadow-soft">
            <CardHeader className="gap-2">
              <CardDescription className="text-sm font-semibold text-muted-foreground">
                確定（訪問予定）
              </CardDescription>
              <CardTitle className="text-3xl text-primary md:text-4xl">{stats.confirmed.toLocaleString()} 件</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground md:text-base">
              今後の訪問予定は {stats.upcoming.toLocaleString()} 件です。
            </CardContent>
          </Card>
          <Card className="border-none bg-secondary/30 text-secondary-foreground shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl">共有テンプレート</CardTitle>
              <CardDescription className="text-sm text-secondary-foreground/80">
                社内告知や従業員向けの案内にご利用ください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm md:text-base">
              <Button type="button" variant="secondary" className="w-full justify-center">
                メール文面をコピー
              </Button>
              <Button type="button" variant="outline" className="w-full justify-center">
                チラシ（PDF）をダウンロード
              </Button>
            </CardContent>
          </Card>
        </section>

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
                      <TableCell>{client?.name}</TableCell>
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
      </div>
    </main>
  );
}
