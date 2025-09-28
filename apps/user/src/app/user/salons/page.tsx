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

const supportPhoneNumber = import.meta.env.VITE_SUPPORT_PHONE ?? '050-1234-5678';

export function SalonsPage() {
  const context = useOutletContext<UserOutletContext>();
  return context.audience === 'family' ? (
    <FamilySalons context={context} />
  ) : (
    <SeniorSalons context={context} />
  );
}

interface SalonsViewProps {
  context: UserOutletContext;
}

function SeniorSalons({ context }: SalonsViewProps) {
  const { storeSummaries } = context;

  const hasUpcoming = useMemo(
    () => storeSummaries.some((summary) => summary.totalUpcoming > 0),
    [storeSummaries],
  );

  return (
    <div className="flex flex-col gap-10" aria-labelledby="salon-heading">
      <header className="space-y-6 rounded-[2rem] border border-primary/15 bg-primary/5 p-6 lg:p-8">
        <div className="space-y-3">
          <h1 id="salon-heading" className="text-[2.1rem] font-bold text-primary lg:text-[2.5rem]">
            サロン一覧（ご自宅から近い順）
          </h1>
          <p className="text-lg leading-relaxed text-primary/80 lg:text-xl">
            徒歩や送り迎えがしやすい拠点を優先表示しています。気になるサロンはカード下部のボタンから相談できます。
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-primary/20 bg-white/80 p-5 text-base text-muted-foreground lg:text-lg">
          <p className="font-semibold text-primary">迷ったときは「電話で予約を相談する」を押してください。</p>
          <p>スタッフが候補を一緒に整理します。</p>
        </div>
      </header>

      <section aria-label="サロンカード一覧" className="flex flex-col gap-8">
        {storeSummaries.map((summary) => (
          <Card
            key={summary.store.id}
            className="rounded-[2.25rem] border border-primary/20 bg-card/95 shadow-soft"
          >
            <CardHeader className="flex flex-col gap-5">
              <div className="space-y-3">
                <CardTitle className="text-2xl text-foreground lg:text-[2.2rem]">
                  {summary.store.name}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground lg:text-xl">
                  {summary.store.address}
                </CardDescription>
              </div>
              <div className="flex flex-col items-start gap-2 text-left">
                <Badge
                  variant={summary.totalUpcoming > 0 ? 'secondary' : 'outline'}
                  className="rounded-full px-4 py-1 text-base lg:text-lg"
                >
                  {summary.totalUpcoming > 0 ? `空き ${summary.totalUpcoming} 枠` : '次回枠を調整中'}
                </Badge>
                {summary.maxCapacity > 0 && (
                  <p className="text-base text-muted-foreground lg:text-lg">
                    最大 {summary.maxCapacity} 名までご利用いただけます
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-foreground lg:text-2xl">直近の空き枠</h2>
                {summary.upcomingSlots.length > 0 ? (
                  <ol className="space-y-4" aria-label={`${summary.store.name} の空き枠`}>
                    {summary.upcomingSlots.slice(0, 4).map((slot) => (
                      <li
                        key={slot.id}
                        className="flex flex-col gap-2 rounded-[1.75rem] border border-border/60 bg-muted/40 px-4 py-4"
                      >
                        <p className="text-lg font-semibold text-foreground lg:text-xl">
                          {slotFormatter.format(slot.startAt)} 開始
                        </p>
                        <p className="text-base text-muted-foreground lg:text-lg">
                          終了予定: {timeFormatter.format(slot.endAt)} / 定員 {slot.capacity} 名
                        </p>
                        {slot.title && (
                          <p className="text-base text-muted-foreground lg:text-lg">内容: {slot.title}</p>
                        )}
                      </li>
                    ))}
                    {summary.upcomingSlots.length > 4 && (
                      <li className="text-base text-muted-foreground lg:text-lg">
                        ほか {summary.upcomingSlots.length - 4} 枠ございます。スタッフが最適な枠をご案内します。
                      </li>
                    )}
                  </ol>
                ) : (
                  <p className="text-base text-muted-foreground lg:text-lg">
                    現在次の枠を準備中です。ご希望の曜日や時間帯を教えていただければ、優先的にご連絡します。
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 rounded-[1.75rem] border border-primary/20 bg-primary/5 p-5">
                <p className="text-base font-semibold text-primary lg:text-lg">
                  ボタンを押すとスタッフが順番に対応します。落ち着いてお待ちください。
                </p>
                <Button type="button" size="lg" className="w-full justify-center">
                  電話で予約を相談する
                </Button>
                <Button type="button" size="lg" variant="outline" className="w-full justify-center">
                  サロンの詳細を聞く
                </Button>
                <p className="text-sm text-muted-foreground lg:text-base">送迎や同席の希望もお伺いします。</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {!hasUpcoming && (
          <div className="rounded-[2rem] border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center text-lg text-muted-foreground lg:text-xl">
            現在は調整中です。お急ぎの方はお電話（{supportPhoneNumber}）でご相談ください。
          </div>
        )}
      </section>
    </div>
  );
}

function FamilySalons({ context }: SalonsViewProps) {
  const { storeSummaries } = context;

  const hasUpcoming = useMemo(
    () => storeSummaries.some((summary) => summary.totalUpcoming > 0),
    [storeSummaries],
  );

  return (
    <div className="flex flex-col gap-8" aria-labelledby="salon-heading">
      <header className="space-y-5 rounded-2xl border border-primary/15 bg-primary/5 p-5 lg:p-6">
        <div className="space-y-3">
          <h1 id="salon-heading" className="text-[1.8rem] font-bold text-primary lg:text-[2.2rem]">
            サロン一覧（ご自宅から近い順）
          </h1>
          <p className="text-base leading-relaxed text-primary/80 lg:text-lg">
            徒歩や送り迎えがしやすい拠点を優先表示しています。各カードから空き枠の確認やスタッフへの相談が可能です。
          </p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-white/85 p-4 text-sm text-muted-foreground lg:text-base">
          <p className="font-semibold text-primary">迷ったときは「電話で予約を相談する」を押してください。</p>
          <p>スタッフが候補を一緒に整理し、ご希望の条件に合わせてご案内します。</p>
        </div>
      </header>

      <section aria-label="サロンカード一覧" className="flex flex-col gap-6">
        {storeSummaries.map((summary) => (
          <Card key={summary.store.id} className="rounded-2xl border border-primary/20 bg-card/95 shadow-soft">
            <CardHeader className="flex flex-col gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl text-foreground lg:text-[1.9rem]">
                  {summary.store.name}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground lg:text-lg">
                  {summary.store.address}
                </CardDescription>
              </div>
              <div className="flex flex-col items-start gap-2 text-left">
                <Badge
                  variant={summary.totalUpcoming > 0 ? 'secondary' : 'outline'}
                  className="rounded-full px-4 py-1 text-xs lg:text-sm"
                >
                  {summary.totalUpcoming > 0 ? `空き ${summary.totalUpcoming} 枠` : '次回枠を調整中'}
                </Badge>
                {summary.maxCapacity > 0 && (
                  <p className="text-sm text-muted-foreground lg:text-base">
                    最大 {summary.maxCapacity} 名まで利用できます
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-5">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground lg:text-xl">直近の空き枠</h2>
                {summary.upcomingSlots.length > 0 ? (
                  <ol className="space-y-3" aria-label={`${summary.store.name} の空き枠`}>
                    {summary.upcomingSlots.slice(0, 4).map((slot) => (
                      <li
                        key={slot.id}
                        className="flex flex-col gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-3"
                      >
                        <p className="text-base font-semibold text-foreground lg:text-lg">
                          {slotFormatter.format(slot.startAt)} 開始
                        </p>
                        <p className="text-sm text-muted-foreground lg:text-base">
                          終了予定: {timeFormatter.format(slot.endAt)} ／ 定員 {slot.capacity} 名
                        </p>
                        {slot.title && (
                          <p className="text-sm text-muted-foreground lg:text-base">内容: {slot.title}</p>
                        )}
                      </li>
                    ))}
                    {summary.upcomingSlots.length > 4 && (
                      <li className="text-sm text-muted-foreground lg:text-base">
                        ほか {summary.upcomingSlots.length - 4} 枠あります。スタッフが優先枠をご案内します。
                      </li>
                    )}
                  </ol>
                ) : (
                  <p className="text-sm text-muted-foreground lg:text-base">
                    現在次の枠を準備中です。希望日時を送っていただければ、決まり次第優先的にご連絡します。
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary lg:text-base">
                  ボタンを押すとスタッフが順番に対応します。落ち着いてお待ちください。
                </p>
                <Button type="button" size="lg" className="w-full justify-center">
                  電話で予約を相談する
                </Button>
                <Button type="button" size="lg" variant="outline" className="w-full justify-center">
                  サロンの詳細を聞く
                </Button>
                <p className="text-xs text-muted-foreground lg:text-sm">送迎や同席の希望もお伺いします。</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {!hasUpcoming && (
          <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 px-5 py-8 text-center text-sm text-muted-foreground lg:text-base">
            現在は調整中です。お急ぎの場合はお電話（{supportPhoneNumber}）でご相談ください。
          </div>
        )}
      </section>
    </div>
  );
}
