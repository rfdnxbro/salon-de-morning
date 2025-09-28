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
  const context = useOutletContext<UserOutletContext>();
  return context.audience === 'family' ? (
    <FamilyDashboard context={context} />
  ) : (
    <SeniorDashboard context={context} />
  );
}

interface DashboardViewProps {
  context: UserOutletContext;
}

function SeniorDashboard({ context }: DashboardViewProps) {
  const { stats, reservationSummaries, storeSummaries } = context;

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
          audience="senior"
          label="予約可能なサロン"
          value={`${stats.activeSalons} 箇所`}
          description="現在予約受付中の拠点数です。"
        />
        <DashboardStat
          audience="senior"
          label="空き枠"
          value={`${stats.upcomingSlots} 枠`}
          description="直近で予約できる枠数です。"
        />
        <DashboardStat
          audience="senior"
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
                      {fullDateFormatter.format(reservation.startAt)} ～ {timeFormatter.format(reservation.endAt)}
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

function FamilyDashboard({ context }: DashboardViewProps) {
  const { stats, reservationSummaries, storeSummaries } = context;

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
    <div className="flex flex-col gap-10" aria-labelledby="dashboard-heading">
      <header className="flex flex-col gap-6" aria-live="polite">
        <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6">
          <h1 id="dashboard-heading" className="text-2xl font-bold text-primary lg:text-[1.9rem]">
            今日のサポート状況
          </h1>
          <p className="text-base leading-relaxed text-primary/80 lg:text-lg">
            ご家族が把握したい予約や相談の進捗をまとめました。気になる項目を順番にチェックしましょう。
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-5 lg:p-6">
          <h2 className="text-lg font-semibold text-foreground lg:text-xl">次にやると安心なステップ</h2>
          <div className="space-y-3 rounded-xl border border-accent/40 bg-white/90 p-4 text-accent-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground/80">
              次の利用枠
            </p>
            <p className="text-2xl font-bold lg:text-[1.8rem]">
              {nextSlot
                ? `${fullDateFormatter.format(nextSlot.slot.startAt)} 受付`
                : '現在スタッフが調整中です'}
            </p>
            {nextSlot ? (
              <div className="space-y-1 text-sm text-muted-foreground lg:text-base">
                <p>
                  会場: <span className="font-semibold text-foreground">{nextSlot.storeName}</span>
                </p>
                <p>
                  終了予定: <span className="font-semibold text-foreground">{timeFormatter.format(nextSlot.slot.endAt)}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground lg:text-base">決まり次第LINEでお知らせします。</p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg" className="justify-center">
              <Link to="../salons" aria-label="サロン一覧ページを開く">
                近くのサロンを探す
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="justify-center">
              <Link to="../reservations" aria-label="予約一覧ページを開く">
                予約を確認・変更
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section aria-label="主要指標" className="grid gap-4 md:grid-cols-3">
        <DashboardStat
          audience="family"
          label="予約できるサロン"
          value={`${stats.activeSalons} 箇所`}
          description="現在予約受付中の拠点数"
        />
        <DashboardStat
          audience="family"
          label="空き枠"
          value={`${stats.upcomingSlots} 枠`}
          description="直近で予約可能な枠数"
        />
        <DashboardStat
          audience="family"
          label="家族の予約"
          value={`${stats.upcomingReservations} 件`}
          description="今後予定されている予約件数"
        />
      </section>

      <section aria-label="直近の予約" className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card className="rounded-2xl border border-primary/20 bg-card/95 shadow-soft">
          <CardHeader className="gap-3">
            <CardDescription className="text-base font-semibold text-primary lg:text-lg">
              おすすめの利用枠
            </CardDescription>
            <CardTitle className="text-2xl text-foreground lg:text-[1.9rem]">
              {nextSlot
                ? `${fullDateFormatter.format(nextSlot.slot.startAt)} に空きあり`
                : '空き枠は現在調整中です'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
            {nextSlot ? (
              <p>スタッフが健康状態を確認し、必要な手続きまでフォローします。余裕を持ってお越しください。</p>
            ) : (
              <p>枠が確定すると連絡が届きます。通知が届くまでしばらくお待ちください。</p>
            )}
            <p className="rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground/90 lg:text-sm">
              不安な点があれば、事前にサポート窓口までご相談ください。
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-muted bg-muted/30 shadow-soft">
          <CardHeader className="gap-2">
            <CardDescription className="text-base font-semibold text-muted-foreground lg:text-lg">
              直近の予約一覧
            </CardDescription>
            <CardTitle className="text-xl text-foreground lg:text-2xl">
              {upcomingReservations.length > 0 ? '予定の確認と共有' : '直近の予定はありません'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground lg:text-base">
            {upcomingReservations.length > 0 ? (
              <ol className="space-y-3" aria-live="polite">
                {upcomingReservations.map((reservation) => (
                  <li
                    key={reservation.id}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-card/90 px-3 py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-semibold text-foreground lg:text-lg">
                        {reservation.storeName}
                      </p>
                      <Badge variant="secondary" className="w-fit text-xs lg:text-sm">
                        {reservation.statusLabel}
                      </Badge>
                    </div>
                    <p>
                      {fullDateFormatter.format(reservation.startAt)} ～ {timeFormatter.format(reservation.endAt)}
                    </p>
                    <p className="text-xs text-muted-foreground/90 lg:text-sm">
                      メモ: {reservation.note ?? '特記事項はありません。'}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p>新しく予約する場合は「サロン一覧」から空き枠をご確認ください。</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface DashboardStatProps {
  audience: 'senior' | 'family';
  label: string;
  value: string;
  description: string;
}

function DashboardStat({ audience, label, value, description }: DashboardStatProps) {
  return (
    <Card className="rounded-2xl border border-primary/15 bg-white/90 shadow-soft">
      <CardHeader className={audience === 'family' ? 'gap-2' : 'gap-4'}>
        <CardDescription
          className={
            audience === 'family'
              ? 'text-sm font-semibold text-primary/90 lg:text-base'
              : 'text-base font-semibold text-primary/90 lg:text-lg'
          }
        >
          {label}
        </CardDescription>
        <CardTitle
          className={
            audience === 'family' ? 'text-3xl text-primary lg:text-[2.3rem]' : 'text-4xl text-primary lg:text-[3rem]'
          }
        >
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={
          audience === 'family'
            ? 'text-sm leading-relaxed text-muted-foreground lg:text-base'
            : 'text-base leading-relaxed text-muted-foreground lg:text-lg'
        }
      >
        {description}
      </CardContent>
    </Card>
  );
}
