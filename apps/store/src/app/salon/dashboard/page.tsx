import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUpcomingPosts, getRecentReservations, reservationStats, salonTotals, activeStylistCount, publishedMenuCount, upcomingPostCount } from '../data';

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  hour: '2-digit',
  minute: '2-digit',
});

const reservationStatusLabel = {
  confirmed: '確定',
  draft: '下書き',
  cancelled: '取消',
} as const;

export function DashboardPage() {
  const recentReservations = useMemo(() => getRecentReservations(4), []);
  const upcomingPosts = useMemo(() => getUpcomingPosts(3), []);

  const summaryItems = [
    {
      key: 'reservations',
      label: '予約一覧',
      count: salonTotals.reservations,
      highlight: `確定 ${reservationStats.confirmed.toLocaleString()} 件 / 取消 ${reservationStats.cancelled.toLocaleString()} 件`,
      to: '../reservations',
      buttonLabel: '予約を管理',
    },
    {
      key: 'stylists',
      label: '専門スタッフ',
      count: salonTotals.stylists,
      highlight: `稼働中 ${activeStylistCount.toLocaleString()} 名`,
      to: '../stylists',
      buttonLabel: 'スタッフを確認',
    },
    {
      key: 'menus',
      label: '提供メニュー',
      count: salonTotals.menus,
      highlight: `公開中 ${publishedMenuCount.toLocaleString()} 件`,
      to: '../menus',
      buttonLabel: 'メニューを編集',
    },
    {
      key: 'posts',
      label: 'お知らせ配信',
      count: salonTotals.posts,
      highlight: `公開待ち ${upcomingPostCount.toLocaleString()} 件`,
      to: '../posts',
      buttonLabel: '配信内容を見る',
    },
  ];

  return (
    <div className="grid gap-10">
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <Card key={item.key} className="border-none bg-card/95 shadow-soft">
            <CardHeader className="gap-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </CardDescription>
              <CardTitle className="text-3xl text-primary md:text-4xl">
                {item.count.toLocaleString()} 件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{item.highlight}</p>
              <Button type="button" size="sm" variant="outline" asChild>
                <Link to={item.to} relative="path">
                  {item.buttonLabel}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-1">
            <CardTitle className="text-2xl">直近の予約</CardTitle>
            <CardDescription className="text-sm">
              最新の予約を開始順に4件表示しています。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReservations.length === 0 ? (
              <p className="text-sm text-muted-foreground">表示できる予約がありません。</p>
            ) : (
              <ul className="space-y-3 text-sm md:text-base">
                {recentReservations.map(({ reservation, slot, store, user }) => (
                  <li key={reservation.id} className="rounded-xl border border-border/60 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <Badge variant={reservation.status === 'cancelled' ? 'destructive' : 'secondary'}>
                        {reservationStatusLabel[reservation.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground/80 md:text-sm">{store.name}</p>
                    <p className="text-xs text-muted-foreground/80 md:text-sm">
                      {dateTimeFormatter.format(slot.startAt)} 〜 {timeFormatter.format(slot.endAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-none bg-secondary/20 text-secondary-foreground shadow-soft">
          <CardHeader className="gap-1">
            <CardTitle className="text-2xl">公開待ちのお知らせ</CardTitle>
            <CardDescription className="text-sm text-secondary-foreground/80">
              ステータスが「下書き」「予約」の投稿を表示しています。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingPosts.length === 0 ? (
              <p className="text-sm">公開待ちのお知らせはありません。</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {upcomingPosts.map((post) => (
                  <li key={post.id} className="rounded-xl bg-secondary/40 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{post.title}</p>
                      <Badge variant="outline">{post.status === 'draft' ? '下書き' : '予約公開'}</Badge>
                    </div>
                    <p className="text-xs text-secondary-foreground/80 md:text-sm">対象: {post.audience}</p>
                    <p className="text-xs text-secondary-foreground/80 md:text-sm">
                      {post.publishedAt ? `公開予定 ${dateTimeFormatter.format(post.publishedAt)}` : '公開日時未設定'}
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
                <CardTitle className="text-2xl md:text-3xl">設備準備メモ</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  予約内容から推奨される準備事項です。毎朝の確認リストとしてご活用ください。
                </CardDescription>
              </div>
              <Button type="button" variant="secondary" size="sm" asChild>
                <Link to="../reservations" relative="path">
                  予約一覧へ移動
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm md:text-base">
              <li className="rounded-xl bg-muted/40 px-4 py-3">血圧計・体組成計の動作確認</li>
              <li className="rounded-xl bg-muted/40 px-4 py-3">段差解消スロープの設置</li>
              <li className="rounded-xl bg-muted/40 px-4 py-3">受付票と問診票の印刷（5部）</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
