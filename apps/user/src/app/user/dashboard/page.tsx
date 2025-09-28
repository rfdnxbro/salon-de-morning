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
    <div className="flex flex-col gap-12" aria-labelledby="dashboard-heading">
      <header className="flex flex-col gap-8" aria-live="polite">
        <div className="flex flex-col gap-5 rounded-[2rem] border border-primary/15 bg-primary/5 p-6 lg:p-8">
          <h1 id="dashboard-heading" className="text-[2rem] font-bold leading-tight text-primary lg:text-[2.4rem]">
            今日のご様子とおすすめ行動
          </h1>
          <p className="text-lg leading-relaxed text-primary/80 lg:text-xl">
            今日把握したい情報をこの画面に集約しました。気になる項目を順番に確認してください。
          </p>
        </div>
        <div className="flex flex-col gap-5 rounded-[2rem] border border-accent/30 bg-accent/10 p-6 lg:p-8">
          <h2 className="text-xl font-semibold text-foreground lg:text-2xl">次のおすすめ行動</h2>
          <div className="space-y-3 rounded-[1.75rem] border border-accent/40 bg-white/80 p-5 text-accent-foreground">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-foreground/80">
              次の空き枠
            </p>
            <p className="text-3xl font-bold lg:text-[2.2rem]">
              {nextSlot
                ? `${fullDateFormatter.format(nextSlot.slot.startAt)} 受付`
                : '現在枠を調整中です'}
            </p>
            {nextSlot ? (
              <div className="space-y-2 text-base lg:text-lg">
                <p>
                  会場: <span className="font-semibold">{nextSlot.storeName}</span>
                </p>
                <p>
                  終了予定: <span className="font-semibold">{timeFormatter.format(nextSlot.slot.endAt)}</span>
                </p>
              </div>
            ) : (
              <p className="text-base text-muted-foreground lg:text-lg">登録次第お知らせします。</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
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
        </div>
      </header>

      <section aria-label="主要指標" className="flex flex-col gap-6">
        <DashboardStat
          label="予約可能なサロン"
          value={`${stats.activeSalons} 箇所`}
          description="現在予約受付中の拠点数です。"
        />
        <DashboardStat
          label="空き枠"
          value={`${stats.upcomingSlots} 枠`}
          description="直近で予約できる枠数です。"
        />
        <DashboardStat
          label="ご自身の予約"
          value={`${stats.upcomingReservations} 件`}
          description="今後のご予約件数です。"
        />
      </section>

      <section aria-label="直近のご予約" className="flex flex-col gap-6">
        <Card className="rounded-[2rem] border border-primary/20 bg-card/95 shadow-soft">
          <CardHeader className="gap-4">
            <CardDescription className="text-lg font-semibold text-primary lg:text-xl">
              直近のおすすめ枠
            </CardDescription>
            <CardTitle className="text-3xl text-foreground lg:text-[2.2rem]">
              {nextSlot
                ? `${fullDateFormatter.format(nextSlot.slot.startAt)} に空きあり`
                : '空き枠は現在調整中です'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground lg:text-lg">
            {nextSlot ? (
              <p>現地スタッフが体調確認まで対応します。ゆとりを持ってお越しください。</p>
            ) : (
              <p>登録され次第、メールまたはLINEでご案内します。</p>
            )}
            <p className="rounded-2xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground lg:text-base">
              体調に不安があれば事前にお電話ください。
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-muted bg-muted/30 shadow-soft">
          <CardHeader className="gap-3">
            <CardDescription className="text-lg font-semibold text-muted-foreground lg:text-xl">
              直近のご予約
            </CardDescription>
            <CardTitle className="text-2xl text-foreground lg:text-3xl">
              {upcomingReservations.length > 0 ? '安心してご来場ください' : '現在予定はありません'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground lg:text-lg">
            {upcomingReservations.length > 0 ? (
              <ol className="space-y-3" aria-live="polite">
                {upcomingReservations.map((reservation) => (
                  <li
                    key={reservation.id}
                    className="flex flex-col gap-2 rounded-[1.75rem] border border-border bg-card/90 px-4 py-4"
                  >
                    <div className="flex flex-col gap-2">
                      <p className="text-lg font-semibold text-foreground lg:text-xl">
                        {reservation.storeName}
                      </p>
                      <Badge variant="secondary" className="w-fit text-base">
                        {reservation.statusLabel}
                      </Badge>
                    </div>
                    <p>
                      {fullDateFormatter.format(reservation.startAt)} ～{' '}
                      {timeFormatter.format(reservation.endAt)}
                    </p>
                    <p className="text-sm text-muted-foreground/90 lg:text-base">当日はスタッフがフォローします。</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-base text-muted-foreground lg:text-lg">ご予約がまだ無い方はサロン一覧をご確認ください。</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface DashboardStatProps {
  label: string;
  value: string;
  description: string;
}

function DashboardStat({ label, value, description }: DashboardStatProps) {
  return (
    <Card className="rounded-[2rem] border border-primary/15 bg-white/85 shadow-soft">
      <CardHeader className="gap-4">
        <CardDescription className="text-base font-semibold text-primary/90 lg:text-lg">
          {label}
        </CardDescription>
        <CardTitle className="text-4xl text-primary lg:text-[3rem]">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-base leading-relaxed text-muted-foreground lg:text-lg">
        {description}
      </CardContent>
    </Card>
  );
}
