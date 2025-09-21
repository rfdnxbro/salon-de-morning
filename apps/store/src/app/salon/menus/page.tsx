import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { salonMenus } from '../data';

const publishLabel = {
  published: '公開中',
  draft: '非公開',
} as const;

type PublishFilter = 'all' | 'published' | 'draft';

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function MenusPage() {
  const [query, setQuery] = useState('');
  const [publishFilter, setPublishFilter] = useState<PublishFilter>('all');

  const filteredMenus = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return salonMenus.filter((menu) => {
      const matchesKeyword = keyword
        ? [menu.title, menu.category, menu.salonName]
            .join(' ')
            .toLowerCase()
            .includes(keyword)
        : true;
      const matchesPublish =
        publishFilter === 'all'
          ? true
          : publishFilter === 'published'
          ? menu.isPublished
          : !menu.isPublished;
      return matchesKeyword && matchesPublish;
    });
  }, [query, publishFilter]);

  return (
    <Card className="border-none bg-card/95 shadow-soft">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl">提供メニュー</CardTitle>
            <CardDescription className="text-base">
              各拠点で提供するサービス内容・料金を整理し、公開状況を調整できます。
            </CardDescription>
          </div>
          <Badge variant="outline">表示 {filteredMenus.length} / {salonMenus.length}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          <div className="md:col-span-2">
            <Label htmlFor="menu-query">メニュー名で検索</Label>
            <Input
              id="menu-query"
              placeholder="例: 健康"
              value={query}
              inputMode="search"
              onChange={(event) => setQuery(event.target.value)}
              aria-label="メニュー名で検索"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="menu-publish">公開状況</Label>
            <select
              id="menu-publish"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={publishFilter}
              onChange={(event) => setPublishFilter(event.target.value as PublishFilter)}
            >
              <option value="all">すべて</option>
              <option value="published">公開中</option>
              <option value="draft">非公開</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table aria-label="提供メニュー一覧">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>メニュー名</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>拠点</TableHead>
              <TableHead>料金</TableHead>
              <TableHead>所要時間</TableHead>
              <TableHead>公開状況</TableHead>
              <TableHead>最終更新</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMenus.map((menu) => (
              <TableRow key={menu.id}>
                <TableCell>{menu.id}</TableCell>
                <TableCell className="font-semibold">{menu.title}</TableCell>
                <TableCell>{menu.category}</TableCell>
                <TableCell>{menu.salonName}</TableCell>
                <TableCell>{menu.price === 0 ? '無料' : `¥${menu.price.toLocaleString()}`}</TableCell>
                <TableCell>{menu.durationMinutes}分</TableCell>
                <TableCell>
                  <Badge variant={menu.isPublished ? 'secondary' : 'outline'}>
                    {menu.isPublished ? publishLabel.published : publishLabel.draft}
                  </Badge>
                </TableCell>
                <TableCell>{dateTimeFormatter.format(menu.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline">
            CSVをエクスポート
          </Button>
          <Button type="button" variant="secondary">
            メニューを追加
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
