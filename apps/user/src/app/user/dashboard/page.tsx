import { useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserOutletContext } from '../layout';

const fullDateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  hour: '2-digit',
  minute: '2-digit',
});

export function DashboardPage() {
  const { stats, reservationSummaries, storeSummaries } = useOutletContext<UserOutletContext>();

  const upcomingReservations = useMemo(
    () => reservationSummaries.filter((reservation) => reservation.isUpcoming).slice(0, 3),
    [reservationSummaries],
  );

  const nextSlot = useMemo(() => {
    const candidate = storeSummaries
      .flatMap((summary) =>
        summary.nextSlot ? [{ slot: summary.nextSlot, storeName: summary.store.name }] : [],
      )
      .sort((a, b) => a.slot.startAt - b.slot.startAt);
    return candidate[0];
  }, [storeSummaries]);

  return (
    <div className="grid gap-10" aria-labelledby="dashboard-heading">
      <header className="space-y-3" aria-live="polite">
        <h1 id="dashboard-heading" className="text-3xl font-bold text-foreground md:text-4xl">
          今日のサマリー
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          ご利用予定や空き状況をひと目で確認できます。気になるサロンは大きなボタンからすぐに絞り込み可能です。
        </p>
      </header>

      <section aria-label="主要指標" className="grid gap-6 md:grid-cols-3">
        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-3">
            <CardDescription className="text-base font-semibold text-muted-foreground md:text-lg">
              予約可能なサロン
            </CardDescription>
            <CardTitle className="text-4xl text-primary md:text-5xl">{stats.activeSalons} 箇所</CardTitle>
          </CardHeader>
          <CardContent className="text-base text-muted-foreground md:text-lg">
            全 {stats.totalSalons} 箇所のうち、現在予約を受け付けているサロンの数です。
          </CardContent>
        </Card>

        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-3">
            <CardDescription className="text-base font-semibold text-muted-foreground md:text-lg">
              空き枠
            </CardDescription>
            <CardTitle className="text-4xl text-primary md:text-5xl">{stats.upcomingSlots} 枠</CardTitle>
          </CardHeader>
          <CardContent className="text-base text-muted-foreground md:text-lg">
            直近で予約可能な枠数です。予約手続きは余裕を持って進められます。
          </CardContent>
        </Card>

        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-3">
            <CardDescription className="text-base font-semibold text-muted-foreground md:text-lg">
              ご自身の予約
            </CardDescription>
            <CardTitle className="text-4xl text-primary md:text-5xl">
              {stats.upcomingReservations} 件
            </CardTitle>
          </CardHeader>
          <CardContent className="text-base text-muted-foreground md:text-lg">
            これから訪問予定の予約件数です。変更が必要な場合は一覧から操作できます。
          </CardContent>
        </Card>
      </section>

      <section aria-label="直近のおすすめ" className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-none bg-primary/10 shadow-soft">
          <CardHeader className="gap-3">
            <CardDescription className="text-base font-semibold text-primary md:text-lg">
              次のおすすめ枠
            </CardDescription>
            <CardTitle className="text-3xl text-primary md:text-4xl">
              {nextSlot
                ? `${fullDateFormatter.format(nextSlot.slot.startAt)} 受付`
                : '現在予約枠を調整中です'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-primary/90 md:text-lg">
            {nextSlot ? (
              <>
                <p>
                  会場: <span className="font-semibold">{nextSlot.storeName}</span>
                </p>
                <p>
                  終了予定: <span className="font-semibold">{timeFormatter.format(nextSlot.slot.endAt)}</span>
                </p>
              </>
            ) : (
              <p>最新の空き枠が入り次第お知らせします。</p>
            )}
            <div className="flex flex-col gap-3 md:flex-row">
              <Button asChild size="lg" className="w-full justify-center">
                <Link to="../salons" aria-label="サロン一覧ページを開く">
                  近くのサロンを探す
                  <ArrowRight className="ml-2 h-6 w-6" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full justify-center">
                <Link to="../reservations" aria-label="予約一覧ページを開く">
                  予約を確認・変更
                  <ArrowRight className="ml-2 h-6 w-6" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/95 shadow-soft">
          <CardHeader className="gap-3">
            <CardDescription className="text-base font-semibold text-muted-foreground md:text-lg">
              直近のご予約
            </CardDescription>
            <CardTitle className="text-2xl text-foreground md:text-3xl">
              {upcomingReservations.length > 0 ? '安心してご来場ください' : '現在予定はありません'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground md:text-lg">
            {upcomingReservations.length > 0 ? (
              <ol className="space-y-3" aria-live="polite">
                {upcomingReservations.map((reservation) => (
                  <li
                    key={reservation.id}
                    className="flex flex-col gap-2 rounded-2xl border-2 border-border bg-muted/40 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-lg font-semibold text-foreground md:text-xl">
                        {reservation.storeName}
                      </p>
                      <Badge variant="secondary" className="text-base">
                        {reservation.statusLabel}
                      </Badge>
                    </div>
                    <p>
                      {fullDateFormatter.format(reservation.startAt)} ～{' '}
                      {timeFormatter.format(reservation.endAt)}
                    </p>
                    <p className="text-sm text-muted-foreground md:text-base">
                      受付スタッフがサポートします。困りごとは当日でもご相談ください。
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p>予約がまだ無い方は、サロン一覧からお好きな拠点を選んでお申し込みください。</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
