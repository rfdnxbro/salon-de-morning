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
    <div className="grid gap-8" aria-labelledby="reservation-heading">
      <header className="space-y-4">
        <h1 id="reservation-heading" className="text-3xl font-bold text-foreground md:text-4xl">
          予約一覧
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          日程の変更やキャンセルの相談は、各カードの担当スタッフに直接お伝えください。色だけでなくラベルでも状態を表記しています。
        </p>
      </header>

      <section aria-label="これからの予約" className="grid gap-4">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">これからの予約</h2>
        {upcoming.length > 0 ? (
          <ol className="grid gap-4">
            {upcoming.map((reservation) => (
              <li key={reservation.id}>
                <ReservationCard kind="upcoming" item={reservation} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-3xl border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center text-lg text-muted-foreground md:text-xl">
            直近の予約はありません。気になるサロンがあれば一覧からご予約いただけます。
          </p>
        )}
      </section>

      <section aria-label="これまでの予約" className="grid gap-4">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">これまでの予約</h2>
        {past.length > 0 ? (
          <ol className="grid gap-4">
            {past.map((reservation) => (
              <li key={reservation.id}>
                <ReservationCard kind="past" item={reservation} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-lg text-muted-foreground md:text-xl">
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
        ? 'border-accent/60 bg-accent/10'
        : 'border-border bg-card/95';

  return (
    <Card
      className={cn(
        'flex flex-col gap-4 rounded-3xl border-2 px-6 py-5 shadow-soft transition-colors',
        toneClass,
      )}
    >
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-2xl text-foreground md:text-3xl">{item.storeName}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground md:text-xl">
            {dateRangeFormatter.format(item.startAt)} ～ {dateRangeFormatter.format(item.endAt)}
          </CardDescription>
        </div>
        <Badge variant="secondary" className="text-base md:text-lg">
          状態: {item.statusLabel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-base text-muted-foreground md:text-lg">
        {item.slotTitle && <p>メニュー: {item.slotTitle}</p>}
        <p>利用者: {item.userName}</p>
        {item.clientName && <p>担当医療機関: {item.clientName}</p>}
        {item.note && <p>メモ: {item.note}</p>}
        {kind === 'upcoming' ? (
          <p className="text-sm text-muted-foreground md:text-base">
            当日は校閲済みチェックリストをスタッフがサポートします。ご不安な点は前日までにご連絡ください。
          </p>
        ) : (
          <p className="text-sm text-muted-foreground md:text-base">
            ご利用ありがとうございます。次回のご希望があればサロンスタッフまでお知らせください。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
