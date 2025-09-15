import { useEffect, useMemo, useState } from 'react';
import { users, clients } from 'mocks';
import { Logo } from './components/logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';

export function App() {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_ADMIN as string | undefined) ?? '管理ダッシュボード';
  useEffect(() => {
    document.title = site ? `${site} | ${title}` : title;
  }, [site, title]);

  const [uq, setUq] = useState('');
  const [cq, setCq] = useState('');

  const filteredUsers = useMemo(() => {
    const k = uq.trim().toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(k));
  }, [uq]);

  const filteredClients = useMemo(() => {
    const k = cq.trim().toLowerCase();
    return clients.filter((c) =>
      [c.name, c.code, c.address].some((v) => v.toLowerCase().includes(k)),
    );
  }, [cq]);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <header className="mb-2 flex items-center justify-between">
        <Logo />
      </header>
      <h1 className="text-2xl font-bold">{title}</h1>

      <Card>
        <CardHeader>
          <CardTitle>ユーザー一覧</CardTitle>
          <CardDescription>モックデータから読み込んだ利用者一覧です。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3 space-y-2">
            <Label htmlFor="uq">名前でフィルタ</Label>
            <Input id="uq" placeholder="例: 山田" value={uq} onChange={(e) => setUq(e.target.value)} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>名前</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead>更新日</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</TableCell>
                  <TableCell>{new Date(u.updatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>クライアント一覧</CardTitle>
          <CardDescription>派遣クライアント（企業）の一覧です。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3 space-y-2">
            <Label htmlFor="cq">名前/コード/住所でフィルタ</Label>
            <Input id="cq" placeholder="例: ACME / 100-0001" value={cq} onChange={(e) => setCq(e.target.value)} />
          </div>
          <Table>
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
              {filteredClients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.code}</TableCell>
                  <TableCell>{c.address}</TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</TableCell>
                  <TableCell>{new Date(c.updatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

