import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { stylists } from '../data';
import { formatDateTime, formatDate } from '../lib/date';

const statusLabel: Record<typeof stylists[number]['status'], string> = {
  active: '稼働中',
  inactive: '離職',
  sabbatical: '休職中',
};

type FilterStatus = 'all' | keyof typeof statusLabel;

export function StylistsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<FilterStatus>('all');

  const filteredStylists = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return stylists.filter((stylist) => {
      const matchesKeyword = keyword
        ? [stylist.name, stylist.role, stylist.salonName]
            .join(' ')
            .toLowerCase()
            .includes(keyword)
        : true;
      const matchesStatus = status === 'all' ? true : stylist.status === status;
      return matchesKeyword && matchesStatus;
    });
  }, [query, status]);

  return (
    <Card className="border-none bg-card/95 shadow-soft">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl">専門サポーター</CardTitle>
            <CardDescription className="text-base">
              看護師・理学療法士などの専門スタッフと稼働状況を管理します。
            </CardDescription>
          </div>
          <Badge variant="outline">表示 {filteredStylists.length} / {stylists.length}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          <div className="md:col-span-2">
            <Label htmlFor="stylist-query">名前・資格で検索</Label>
            <Input
              id="stylist-query"
              placeholder="例: 看護師"
              value={query}
              inputMode="search"
              onChange={(event) => setQuery(event.target.value)}
              aria-label="専門スタッフを検索"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stylist-status">ステータス</Label>
            <select
              id="stylist-status"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(event) => setStatus(event.target.value as FilterStatus)}
            >
              <option value="all">すべて</option>
              <option value="active">稼働中</option>
              <option value="inactive">離職</option>
              <option value="sabbatical">休職中</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table aria-label="専門サポーター一覧">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>氏名</TableHead>
              <TableHead>資格</TableHead>
              <TableHead>拠点</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead>最終更新</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStylists.map((stylist) => (
              <TableRow key={stylist.id}>
                <TableCell>{stylist.id}</TableCell>
                <TableCell className="font-semibold">{stylist.name}</TableCell>
                <TableCell>{stylist.certifications.join(' / ')}</TableCell>
                <TableCell>{stylist.salonName}</TableCell>
                <TableCell>
                  <Badge variant={stylist.status === 'active' ? 'secondary' : 'outline'}>
                    {statusLabel[stylist.status]}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(stylist.createdAt)}</TableCell>
                <TableCell>{formatDateTime(stylist.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="secondary">
            新しいサポーターを追加
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

