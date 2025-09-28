import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { UserOutletContext } from '../layout';

const dateRangeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function ReservationsPage() {
  const context = useOutletContext<UserOutletContext>();
  return context.audience === 'family' ? (
    <FamilyReservations context={context} />
  ) : (
    <SeniorReservations context={context} />
  );
}

interface ReservationsViewProps {
  context: UserOutletContext;
}

function SeniorReservations({ context }: ReservationsViewProps) {
  const { reservationSummaries } = context;

  const { upcoming, past } = useMemo(() => {
    const upcomingReservations = reservationSummaries.filter((reservation) => reservation.isUpcoming);
    const pastReservations = reservationSummaries.filter((reservation) => !reservation.isUpcoming);
    return { upcoming: upcomingReservations, past: pastReservations };
  }, [reservationSummaries]);

  return (
    <div className="flex flex-col gap-10" aria-labelledby="reservation-heading">
      <header className="space-y-6 rounded-[2rem] border border-primary/15 bg-primary/5 p-6 lg:p-8">
        <h1 id="reservation-heading" className="text-[2.1rem] font-bold text-primary lg:text-[2.5rem]">
          予約一覧（ご来場予定の確認）
        </h1>
        <p className="text-lg leading-relaxed text-primary/80 lg:text-xl">
          会場や担当者をひと目で確認できます。ラベル表示で状態が分かります。
        </p>
        <div className="flex flex-col gap-4">
          <div className="rounded-[1.75rem] border border-primary/20 bg-white/85 p-4 text-base text-muted-foreground lg:text-lg">
            <p className="font-semibold text-primary">変更したいときは電話またはLINEでご連絡ください。</p>
          </div>
          <div className="rounded-[1.75rem] border border-accent/20 bg-accent/10 p-4 text-base text-muted-foreground lg:text-lg">
            <p className="font-semibold text-accent-foreground">ご来場は受付時間の10分前を目安にお願いします。</p>
          </div>
          <div className="rounded-[1.75rem] border border-muted bg-muted/30 p-4 text-base text-muted-foreground lg:text-lg">
            <p className="font-semibold text-muted-foreground">代理で操作する場合はメモ欄に共有事項を残してください。</p>
          </div>
        </div>
      </header>

      <UpcomingReservations audience="senior" reservations={upcoming} />
      <PastReservations audience="senior" reservations={past} />
    </div>
  );
}

function FamilyReservations({ context }: ReservationsViewProps) {
  const { reservationSummaries } = context;

  const { upcoming, past } = useMemo(() => {
    const upcomingReservations = reservationSummaries.filter((reservation) => reservation.isUpcoming);
    const pastReservations = reservationSummaries.filter((reservation) => !reservation.isUpcoming);
    return { upcoming: upcomingReservations, past: pastReservations };
  }, [reservationSummaries]);

  return (
    <div className="flex flex-col gap-8" aria-labelledby="reservation-heading">
      <header className="space-y-5 rounded-2xl border border-primary/15 bg-primary/5 p-5 lg:p-6">
        <h1 id="reservation-heading" className="text-[1.8rem] font-bold text-primary lg:text-[2.2rem]">
          予約一覧（来場予定の確認）
        </h1>
        <p className="text-base leading-relaxed text-primary/80 lg:text-lg">
          担当スタッフや会場、メモをまとめて確認できます。状態ラベルで準備段階が分かります。
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <InfoCallout
            tone="primary"
            title="変更やキャンセルはサポートへ"
            message="電話またはLINEでご連絡いただければスタッフが代わりに手続きを行います。"
          />
          <InfoCallout
            tone="accent"
            title="当日は10分前の到着が安心"
            message="受付と体調ヒアリングの時間を確保するためにご協力ください。"
          />
          <InfoCallout
            tone="neutral"
            title="共有事項はメモ欄へ"
            message="付き添いや送迎の希望など、覚えておきたい情報を残せます。"
          />
        </div>
      </header>

      <UpcomingReservations audience="family" reservations={upcoming} />
      <PastReservations audience="family" reservations={past} />
    </div>
  );
}

interface UpcomingProps {
  audience: 'senior' | 'family';
  reservations: UserOutletContext['reservationSummaries'];
}

function UpcomingReservations({ audience, reservations }: UpcomingProps) {
  const headingClass = audience === 'family' ? 'text-xl font-semibold text-foreground lg:text-2xl' : 'text-2xl font-semibold text-foreground lg:text-3xl';
  return (
    <section aria-label="これからの予約" className="flex flex-col gap-4">
      <h2 className={headingClass}>これからの予約</h2>
      {reservations.length > 0 ? (
        <ol className="flex flex-col gap-4">
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <ReservationCard audience={audience} kind="upcoming" item={reservation} />
            </li>
          ))}
        </ol>
      ) : (
        <p
          className={
            audience === 'family'
              ? 'rounded-2xl border-2 border-dashed border-border bg-muted/30 px-5 py-8 text-center text-sm text-muted-foreground lg:text-base'
              : 'rounded-[2rem] border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center text-lg text-muted-foreground lg:text-xl'
          }
        >
          直近の予約はありません。新しい予約は「サロン一覧」からお申し込みください。
        </p>
      )}
    </section>
  );
}

function PastReservations({ audience, reservations }: UpcomingProps) {
  const headingClass = audience === 'family' ? 'text-xl font-semibold text-foreground lg:text-2xl' : 'text-2xl font-semibold text-foreground lg:text-3xl';
  return (
    <section aria-label="これまでの予約" className="flex flex-col gap-4">
      <h2 className={headingClass}>これまでの予約</h2>
      {reservations.length > 0 ? (
        <ol className="flex flex-col gap-4">
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <ReservationCard audience={audience} kind="past" item={reservation} />
            </li>
          ))}
        </ol>
      ) : (
        <p className={audience === 'family' ? 'text-sm text-muted-foreground lg:text-base' : 'text-lg text-muted-foreground lg:text-xl'}>
          過去の利用履歴はまだありません。利用後にこちらへ自動的に反映されます。
        </p>
      )}
    </section>
  );
}

interface ReservationCardProps {
  audience: 'senior' | 'family';
  item: UserOutletContext['reservationSummaries'][number];
  kind: 'upcoming' | 'past';
}

function ReservationCard({ audience, item, kind }: ReservationCardProps) {
  const toneClass =
    item.tone === 'positive'
      ? 'border-primary/60 bg-primary/8'
      : item.tone === 'attention'
        ? 'border-accent/60 bg-accent/12'
        : 'border-border/60 bg-card/90';

  const shellClass =
    audience === 'family'
      ? 'flex flex-col gap-4 rounded-2xl border-2 px-5 py-5 shadow-soft transition-colors'
      : 'flex flex-col gap-5 rounded-[2rem] border-2 px-6 py-6 shadow-soft transition-colors';

  return (
    <Card className={cn(shellClass, toneClass)}>
      <CardHeader className={audience === 'family' ? 'flex flex-col gap-3' : 'flex flex-col gap-4'}>
        <div className="space-y-1">
          <CardTitle className={audience === 'family' ? 'text-lg text-foreground lg:text-xl' : 'text-2xl text-foreground lg:text-[2.1rem]'}>
            {item.storeName}
          </CardTitle>
          <CardDescription className={audience === 'family' ? 'text-sm text-muted-foreground lg:text-base' : 'text-lg text-muted-foreground lg:text-xl'}>
            {dateRangeFormatter.format(item.startAt)} ～ {dateRangeFormatter.format(item.endAt)}
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className={audience === 'family' ? 'w-fit rounded-full px-3 py-1 text-xs lg:text-sm' : 'rounded-full px-4 py-1 text-base lg:text-lg'}
        >
          状態: {item.statusLabel}
        </Badge>
      </CardHeader>
      <CardContent className={audience === 'family' ? 'space-y-3 text-sm text-muted-foreground lg:text-base' : 'space-y-4 text-base text-muted-foreground lg:text-lg'}>
        {item.slotTitle && <p>メニュー: {item.slotTitle}</p>}
        <p>利用者: {item.userName}</p>
        {item.clientName && <p>担当医療機関: {item.clientName}</p>}
        <p>メモ: {item.note ?? '特記事項はありません。'}</p>
        {kind === 'upcoming' ? (
          <p
            className={
              audience === 'family'
                ? 'rounded-xl bg-white/70 px-3 py-2 text-xs text-muted-foreground lg:text-sm'
                : 'rounded-[1.5rem] bg-white/70 px-4 py-3 text-sm text-muted-foreground lg:text-base'
            }
          >
            ご不安な点は前日までにサポートへご相談ください。
          </p>
        ) : (
          <p
            className={
              audience === 'family'
                ? 'rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground lg:text-sm'
                : 'rounded-[1.5rem] bg-muted/40 px-4 py-3 text-sm text-muted-foreground lg:text-base'
            }
          >
            次回のご希望があればスタッフまでお知らせください。
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface InfoCalloutProps {
  title: string;
  message: string;
  tone: 'primary' | 'accent' | 'neutral';
}

function InfoCallout({ title, message, tone }: InfoCalloutProps) {
  const toneClass =
    tone === 'accent'
      ? 'border-accent/40 bg-accent/10 text-accent-foreground'
      : tone === 'neutral'
        ? 'border-muted bg-muted/30 text-muted-foreground'
        : 'border-primary/25 bg-white/85 text-primary';

  return (
    <div className={cn('rounded-xl border px-4 py-4 text-sm lg:text-base', toneClass)}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed opacity-80 lg:text-sm">{message}</p>
    </div>
  );
}
