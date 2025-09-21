import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminUsers, posts, salons, summaryCounts } from '../data';
import { formatDateTime, formatDate } from '../lib/date';
import { AdminRouteKey, useAdminNavigate } from '../navigation';

type SummaryRouteKey = Exclude<AdminRouteKey, 'dashboard'>;

const summaryOrder: { key: SummaryRouteKey; highlight: string }[] = [
  { key: 'users', highlight: '利用者数' },
  { key: 'salons', highlight: '参画拠点' },
  { key: 'stylists', highlight: '専門サポーター' },
  { key: 'menus', highlight: '提供メニュー' },
  { key: 'posts', highlight: '配信コンテンツ' },
];

export function DashboardPage() {
  const navigate = useAdminNavigate();

  const recentUsers = useMemo(
    () =>
      [...adminUsers]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 3)
        .map((user) => ({
          id: user.id,
          name: user.name,
          updatedAt: user.updatedAt,
          createdAt: user.createdAt,
        })),
    [],
  );

  const upcomingPosts = useMemo(
    () =>
      posts
        .filter((post) => post.status !== 'published')
        .sort((a, b) => (b.publishedAt ?? b.updatedAt) - (a.publishedAt ?? a.updatedAt))
        .slice(0, 3),
    [],
  );

  return (
    <div className="grid gap-10">
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {summaryOrder.map((item) => {
          const count = summaryCounts[item.key];
          return (
            <Card key={item.key} className="border-none bg-card/95 text-muted-foreground shadow-soft">
              <CardHeader className="gap-2">
                <CardDescription className="text-xs font-semibold uppercase tracking-wide">
                  {item.highlight}
                </CardDescription>
                <CardTitle className="text-3xl text-primary md:text-4xl">{count.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">最新状況を確認するには一覧ページを開きます。</p>
                <Button type="button" size="sm" variant="outline" onClick={() => navigate(item.key)}>
                  一覧を見る
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-none bg-secondary/20 text-secondary-foreground shadow-soft">
          <CardHeader className="gap-1">
            <CardTitle className="text-2xl">直近の利用者アップデート</CardTitle>
            <CardDescription className="text-sm text-secondary-foreground/80">
              更新日の新しい順に3件を表示しています。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm md:text-base">
              {recentUsers.map((user) => (
                <li key={user.id} className="rounded-xl bg-secondary/40 px-4 py-3">
                  <p className="font-semibold text-secondary-foreground">{user.name}</p>
                  <p className="text-xs text-secondary-foreground/80 md:text-sm">
                    更新 {formatDateTime(user.updatedAt)} / 登録 {formatDate(user.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-1">
            <CardTitle className="text-2xl">公開待ちのお知らせ</CardTitle>
            <CardDescription className="text-sm">
              ステータスが「下書き」「予約」の投稿を表示しています。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">公開待ちのお知らせはありません。</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {upcomingPosts.map((post) => (
                  <li key={post.id} className="rounded-xl border border-border/60 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">{post.title}</p>
                      <Badge variant="outline">{post.status === 'draft' ? '下書き' : '予約公開'}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/80 md:text-sm">対象: {post.audience}</p>
                    <p className="text-xs text-muted-foreground/80 md:text-sm">
                      {post.publishedAt ? `公開予定 ${formatDateTime(post.publishedAt)}` : '公開日時未設定'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6">
        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-3">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl">参画拠点スナップショット</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  モックデータから参画中の拠点を抜粋表示しています。
                </CardDescription>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={() => navigate('salons')}>
                全ての拠点を確認
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table aria-label="参画拠点スナップショット">
              <TableHeader>
                <TableRow>
                  <TableHead>拠点名</TableHead>
                  <TableHead>コード</TableHead>
                  <TableHead>所在地</TableHead>
                  <TableHead>登録日</TableHead>
                  <TableHead>更新日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...salons]
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .slice(0, 5)
                  .map((salon) => (
                    <TableRow key={salon.id}>
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
      </section>
    </div>
  );
}
