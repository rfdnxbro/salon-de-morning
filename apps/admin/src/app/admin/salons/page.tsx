import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { salons } from '../data';
import { formatDateTime, formatDate } from '../lib/date';

export function SalonsPage() {
  const [query, setQuery] = useState('');

  const filteredSalons = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return salons;
    return salons.filter((salon) =>
      [salon.name, salon.code, salon.address].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [query]);

  return (
    <Card className="border-none bg-card/95 shadow-soft">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl">参画拠点一覧</CardTitle>
            <CardDescription className="text-base">
              サロン de モーニングに参画している拠点の基本情報です。名称・コード・住所で検索できます。
            </CardDescription>
          </div>
          <Badge variant="outline">表示 {filteredSalons.length} / {salons.length}</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="salon-query">検索ワード</Label>
            <Input
              id="salon-query"
              placeholder="例: 銀座 / 100-0001"
              value={query}
              inputMode="search"
              onChange={(event) => setQuery(event.target.value)}
              aria-label="参画拠点を検索"
            />
          </div>
          <Button type="button" variant="secondary" className="justify-self-start md:justify-self-end">
            新規拠点を登録
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table aria-label="参画拠点一覧">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>拠点名</TableHead>
              <TableHead>コード</TableHead>
              <TableHead>所在地</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead>最終更新</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalons.map((salon) => (
              <TableRow key={salon.id}>
                <TableCell>{salon.id}</TableCell>
                <TableCell className="font-semibold">{salon.name}</TableCell>
                <TableCell>{salon.code}</TableCell>
                <TableCell>{salon.address}</TableCell>
                <TableCell>{formatDate(salon.createdAt)}</TableCell>
                <TableCell>{formatDateTime(salon.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

