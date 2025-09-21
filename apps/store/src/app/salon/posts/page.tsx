import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { salonPosts } from '../data';

const statusLabel = {
  draft: '下書き',
  scheduled: '予約',
  published: '公開済み',
} as const;

type PostStatusFilter = 'all' | keyof typeof statusLabel;

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export function PostsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<PostStatusFilter>('all');

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return salonPosts.filter((post) => {
      const matchesKeyword = keyword
        ? [post.title, post.summary, post.audience]
            .join(' ')
            .toLowerCase()
            .includes(keyword)
        : true;
      const matchesStatus = status === 'all' ? true : post.status === status;
      return matchesKeyword && matchesStatus;
    });
  }, [query, status]);

  return (
    <Card className="border-none bg-card/95 shadow-soft">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl md:text-3xl">お知らせ配信</CardTitle>
            <CardDescription className="text-base">
              利用者・店舗・医療機関向けの配信内容と公開予定を管理します。
            </CardDescription>
          </div>
          <Badge variant="outline">表示 {filteredPosts.length} / {salonPosts.length}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          <div className="md:col-span-2">
            <Label htmlFor="post-query">タイトル・概要で検索</Label>
            <Input
              id="post-query"
              placeholder="例: 説明会"
              value={query}
              inputMode="search"
              onChange={(event) => setQuery(event.target.value)}
              aria-label="お知らせを検索"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-status">ステータス</Label>
            <select
              id="post-status"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(event) => setStatus(event.target.value as PostStatusFilter)}
            >
              <option value="all">すべて</option>
              <option value="draft">下書き</option>
              <option value="scheduled">予約</option>
              <option value="published">公開済み</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table aria-label="お知らせ一覧">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>対象</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>公開日時</TableHead>
              <TableHead>最終更新</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell className="font-semibold">{post.title}</TableCell>
                <TableCell>{post.audience}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === 'published'
                        ? 'secondary'
                        : post.status === 'scheduled'
                        ? 'outline'
                        : 'destructive'
                    }
                  >
                    {statusLabel[post.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {post.publishedAt ? dateTimeFormatter.format(post.publishedAt) : '未設定'}
                </TableCell>
                <TableCell>{dateTimeFormatter.format(post.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline">
            CSVをエクスポート
          </Button>
          <Button type="button" variant="secondary">
            新しいお知らせを作成
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
