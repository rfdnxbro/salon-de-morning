import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminUsers } from '../data';
import { formatDateTime, formatDate } from '../lib/date';

export function UsersPage() {
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return adminUsers;
    return adminUsers.filter((user) => user.name.toLowerCase().includes(keyword));
  }, [query]);

  return (
    <Card className="border-none bg-card/95 shadow-soft">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl">利用者一覧</CardTitle>
            <CardDescription className="text-base">
              モックデータの利用者情報を表示しています。名前で検索できます。
            </CardDescription>
          </div>
          <Badge variant="outline">表示 {filteredUsers.length} / {adminUsers.length}</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="user-query">名前でフィルタ</Label>
            <Input
              id="user-query"
              placeholder="例: 山田"
              value={query}
              inputMode="search"
              onChange={(event) => setQuery(event.target.value)}
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
              <TableHead>登録日</TableHead>
              <TableHead>最終更新</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-semibold">{user.name}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{formatDateTime(user.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

