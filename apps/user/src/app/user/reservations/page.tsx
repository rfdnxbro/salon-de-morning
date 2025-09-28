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
  const { reservationSummaries } = useOutletContext<UserOutletContext>();

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

      <section aria-label="これからの予約" className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">これからの予約</h2>
        {upcoming.length > 0 ? (
          <ol className="flex flex-col gap-5">
            {upcoming.map((reservation) => (
              <li key={reservation.id}>
                <ReservationCard kind="upcoming" item={reservation} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-[2rem] border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center text-lg text-muted-foreground lg:text-xl">
            直近の予約はありません。気になるサロンがあれば一覧からご予約いただけます。
          </p>
        )}
      </section>

      <section aria-label="これまでの予約" className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">これまでの予約</h2>
        {past.length > 0 ? (
          <ol className="flex flex-col gap-5">
            {past.map((reservation) => (
              <li key={reservation.id}>
                <ReservationCard kind="past" item={reservation} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-lg text-muted-foreground lg:text-xl">
            過去の利用履歴はまだありません。訪問が完了するとこちらに表示されます。
          </p>
        )}
      </section>
    </div>
  );
}

interface ReservationCardProps {
  item: UserOutletContext['reservationSummaries'][number];
  kind: 'upcoming' | 'past';
}

function ReservationCard({ item, kind }: ReservationCardProps) {
  const toneClass =
    item.tone === 'positive'
      ? 'border-primary/60 bg-primary/10'
      : item.tone === 'attention'
        ? 'border-accent/60 bg-accent/12'
        : 'border-border/60 bg-card/90';

  return (
    <Card
      className={cn(
        'flex flex-col gap-5 rounded-[2rem] border-2 px-6 py-6 shadow-soft transition-colors',
        toneClass,
      )}
    >
      <CardHeader className="flex flex-col gap-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl text-foreground lg:text-[2.1rem]">{item.storeName}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground lg:text-xl">
            {dateRangeFormatter.format(item.startAt)} ～ {dateRangeFormatter.format(item.endAt)}
          </CardDescription>
        </div>
        <Badge variant="secondary" className="rounded-full px-4 py-1 text-base lg:text-lg">
          状態: {item.statusLabel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-base text-muted-foreground lg:text-lg">
        {item.slotTitle && <p>メニュー: {item.slotTitle}</p>}
        <p>利用者: {item.userName}</p>
        {item.clientName && <p>担当医療機関: {item.clientName}</p>}
        {item.note && <p>メモ: {item.note}</p>}
        {kind === 'upcoming' ? (
          <p className="rounded-[1.5rem] bg-white/70 px-4 py-3 text-sm text-muted-foreground lg:text-base">
            ご不安な点は前日までにお気軽にご相談ください。
          </p>
        ) : (
          <p className="rounded-[1.5rem] bg-muted/40 px-4 py-3 text-sm text-muted-foreground lg:text-base">
            次回のご希望があればスタッフまでお知らせください。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
