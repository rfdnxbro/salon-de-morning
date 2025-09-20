import { useEffect, useMemo, useState } from 'react';
import { clients, users } from 'mocks';
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

export function App() {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_ADMIN as string | undefined) ?? '管理ダッシュボード';
  useEffect(() => {
    document.title = site ? `${site} | ${title}` : title;
  }, [site, title]);

  const [uq, setUq] = useState('');
  const [cq, setCq] = useState('');

  const filteredUsers = useMemo(() => {
    const keyword = uq.trim().toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(keyword));
  }, [uq]);

  const filteredClients = useMemo(() => {
    const keyword = cq.trim().toLowerCase();
    return clients.filter((client) =>
      [client.name, client.code, client.address].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [cq]);

  const stats = {
    users: users.length,
    clients: clients.length,
    recentUsers: filteredUsers.slice(0, 3),
  };

  return (
    <main className="relative min-h-screen pb-20">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 md:gap-14 md:px-10">
        <h1 className="sr-only">{title}</h1>
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-2xl text-base font-medium text-muted-foreground md:text-lg">
              利用者・クライアントの管理、予約状況の確認、資料出力をここから行えます。
            </p>
          </div>
          <Badge variant="secondary" className="self-start">
            最終更新 {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
          </Badge>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="border-none bg-card/90 shadow-soft">
            <CardHeader className="gap-1">
              <CardDescription className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                登録利用者数
              </CardDescription>
              <CardTitle className="text-3xl text-primary md:text-4xl">{stats.users.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              今月の新規登録は 0 名（モックデータ）。
            </CardContent>
          </Card>
          <Card className="border-none bg-card/90 shadow-soft">
            <CardHeader className="gap-1">
              <CardDescription className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                連携クライアント数
              </CardDescription>
              <CardTitle className="text-3xl text-primary md:text-4xl">{stats.clients.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              定期訪問契約は {Math.round(stats.clients * 0.6)} 社（概算）。
            </CardContent>
          </Card>
          <Card className="border-none bg-secondary/30 text-secondary-foreground shadow-soft">
            <CardHeader className="gap-2">
              <CardTitle className="text-2xl">直近の利用者</CardTitle>
              <CardDescription className="text-sm text-secondary-foreground/80">
                直近3件の更新を表示しています。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm md:text-base">
                {stats.recentUsers.map((user) => (
                  <li key={user.id} className="rounded-xl bg-secondary/40 px-4 py-3">
                    <p className="font-semibold text-secondary-foreground">{user.name}</p>
                    <p className="text-xs text-secondary-foreground/80 md:text-sm">
                      更新 {dateFormatter.format(user.updatedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="user-table" className="grid gap-8">
          <Card className="border-none bg-card/95 shadow-soft">
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle id="user-table" className="text-2xl md:text-3xl">
                    利用者一覧
                  </CardTitle>
                  <CardDescription className="text-base">
                    モックデータから読み込んだ利用者一覧です。名前で絞り込みができます。
                  </CardDescription>
                </div>
                <Badge variant="outline">表示 {filteredUsers.length} / {users.length}</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="uq">名前でフィルタ</Label>
                  <Input
                    id="uq"
                    placeholder="例: 山田"
                    value={uq}
                    inputMode="search"
                    onChange={(event) => setUq(event.target.value)}
                    aria-label="利用者を名前で検索"
                  />
                </div>
                <Button type="button" variant="outline" className="justify-self-start md:justify-self-end">
                  CSVとして書き出す
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table aria-label="利用者一覧">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>名前</TableHead>
                    <TableHead>作成日</TableHead>
                    <TableHead>更新日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-semibold">{user.name}</TableCell>
                      <TableCell>{dateFormatter.format(user.createdAt)}</TableCell>
                      <TableCell>{dateFormatter.format(user.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/95 shadow-soft">
            <CardHeader className="gap-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl md:text-3xl">クライアント一覧</CardTitle>
                  <CardDescription className="text-base">
                    派遣クライアント（企業）の一覧です。名前・コード・住所で検索できます。
                  </CardDescription>
                </div>
                <Badge variant="outline">表示 {filteredClients.length} / {clients.length}</Badge>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cq">検索ワード</Label>
                <Input
                  id="cq"
                  placeholder="例: ACME / 100-0001"
                  value={cq}
                  inputMode="search"
                  onChange={(event) => setCq(event.target.value)}
                  aria-label="クライアントを検索"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table aria-label="クライアント一覧">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>企業名</TableHead>
                    <TableHead>コード</TableHead>
                    <TableHead>住所</TableHead>
                    <TableHead>作成日</TableHead>
                    <TableHead>更新日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.id}</TableCell>
                      <TableCell className="font-semibold">{client.name}</TableCell>
                      <TableCell>{client.code}</TableCell>
                      <TableCell>{client.address}</TableCell>
                      <TableCell>{dateFormatter.format(client.createdAt)}</TableCell>
                      <TableCell>{dateFormatter.format(client.updatedAt)}</TableCell>
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
