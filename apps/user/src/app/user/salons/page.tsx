import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserOutletContext } from '../layout';

const slotFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  hour: '2-digit',
  minute: '2-digit',
});

export function SalonsPage() {
  const { storeSummaries } = useOutletContext<UserOutletContext>();

  const hasUpcoming = useMemo(
    () => storeSummaries.some((summary) => summary.totalUpcoming > 0),
    [storeSummaries],
  );

  return (
    <div className="grid gap-8" aria-labelledby="salon-heading">
      <header className="space-y-4">
        <h1 id="salon-heading" className="text-3xl font-bold text-foreground md:text-4xl">
          サロン一覧
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          ご自宅から通いやすいサロンをお選びください。各枠はスタッフのサポート付きで、必要に応じて付き添いも手配できます。
        </p>
      </header>

      <section aria-label="サロンカード一覧" className="grid gap-6">
        {storeSummaries.map((summary) => (
          <Card key={summary.store.id} className="border-none bg-card/95 shadow-soft">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl text-foreground md:text-3xl">
                  {summary.store.name}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground md:text-xl">
                  {summary.store.address}
                </CardDescription>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <Badge variant={summary.totalUpcoming > 0 ? 'secondary' : 'outline'} className="text-base">
                  {summary.totalUpcoming > 0 ? `空き ${summary.totalUpcoming} 枠` : '次回枠を調整中'}
                </Badge>
                {summary.maxCapacity > 0 && (
                  <p className="text-base text-muted-foreground md:text-lg">
                    最大 {summary.maxCapacity} 名まで一緒にご利用いただけます
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground md:text-2xl">直近の空き枠</h2>
                {summary.upcomingSlots.length > 0 ? (
                  <ol className="space-y-3" aria-label={`${summary.store.name} の空き枠`}>
                    {summary.upcomingSlots.slice(0, 4).map((slot) => (
                      <li
                        key={slot.id}
                        className="flex flex-col gap-2 rounded-2xl border-2 border-border bg-muted/30 px-4 py-3"
                      >
                        <p className="text-lg font-semibold text-foreground md:text-xl">
                          {slotFormatter.format(slot.startAt)} 開始
                        </p>
                        <p className="text-base text-muted-foreground md:text-lg">
                          終了予定: {timeFormatter.format(slot.endAt)} / 定員 {slot.capacity} 名
                        </p>
                        {slot.title && (
                          <p className="text-base text-muted-foreground md:text-lg">内容: {slot.title}</p>
                        )}
                      </li>
                    ))}
                    {summary.upcomingSlots.length > 4 && (
                      <li className="text-base text-muted-foreground md:text-lg">
                        ほか {summary.upcomingSlots.length - 4} 枠ございます。ゆっくりお選びください。
                      </li>
                    )}
                  </ol>
                ) : (
                  <p className="text-base text-muted-foreground md:text-lg">
                    現在次の枠を準備中です。ご希望があればスタッフが優先的にお知らせします。
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="button" size="lg" className="w-full justify-center">
                  電話で予約を相談する
                </Button>
                <Button type="button" size="lg" variant="outline" className="w-full justify-center">
                  サロンの詳細を聞く
                </Button>
                <p className="text-sm text-muted-foreground md:text-base">
                  ご家族の同席や送迎のご相談も受け付けています。お気軽にお問い合わせください。
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {!hasUpcoming && (
          <div className="rounded-3xl border-2 border-dashed border-border bg-muted/20 px-6 py-8 text-center text-lg text-muted-foreground md:text-xl">
            現在は予約枠の準備中です。お困りの場合はお電話での相談をご利用ください。（050-1234-5678）
          </div>
        )}
      </section>
    </div>
  );
}
