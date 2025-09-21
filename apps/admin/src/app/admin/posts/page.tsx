import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { posts } from '../data';
import { formatDateTime, formatDate } from '../lib/date';

const statusLabel = {
  draft: '下書き',
  scheduled: '予約公開',
  published: '公開済み',
};

type StatusFilter = 'all' | keyof typeof statusLabel;

export function PostsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');

  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesKeyword = keyword
        ? [post.title, post.summary, post.audience].join(' ').toLowerCase().includes(keyword)
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
              利用者・拠点・医療機関向けのお知らせを作成・配信します。
            </CardDescription>
          </div>
          <Badge variant="outline">表示 {filteredPosts.length} / {posts.length}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          <div className="md:col-span-2">
            <Label htmlFor="post-query">タイトル・本文で検索</Label>
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
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
            >
              <option value="all">すべて</option>
              <option value="draft">下書き</option>
              <option value="scheduled">予約公開</option>
              <option value="published">公開済み</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table aria-label="お知らせ一覧">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>対象</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>公開予定</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead>更新日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell className="font-semibold">{post.title}</TableCell>
                <TableCell>{post.audience}</TableCell>
                <TableCell>
                  <Badge variant={post.status === 'published' ? 'secondary' : 'outline'}>
                    {statusLabel[post.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {post.status === 'draft'
                    ? '未設定'
                    : post.publishedAt
                    ? formatDateTime(post.publishedAt)
                    : '未設定'}
                </TableCell>
                <TableCell>{formatDate(post.createdAt)}</TableCell>
                <TableCell>{formatDateTime(post.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          <Button type="button" variant="outline">
            下書きを一括エクスポート
          </Button>
          <Button type="button" variant="secondary">
            新しいお知らせを作成
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

