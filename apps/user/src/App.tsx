import { useEffect, useMemo, useState } from 'react';
import { stores, slots } from 'mocks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from './components/logo';

const slotFormatter = new Intl.DateTimeFormat('ja-JP', {
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

export function App() {
  const [q, setQ] = useState('');

  const { filteredStores, nextSlots, earliestSlot } = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const filtered = stores.filter((store) => store.name.toLowerCase().includes(keyword));
    const storeIds = new Set(filtered.map((store) => store.id));
    const upcoming = slots
      .filter((slot) => storeIds.has(slot.storeId) && slot.status === 'active')
      .sort((a, b) => a.startAt - b.startAt);
    const first = upcoming.length > 0 ? upcoming[0] : undefined;
    return { filteredStores: filtered, nextSlots: upcoming, earliestSlot: first };
  }, [q]);

  const totalNextSlots = nextSlots.length;

  const heroDescription =
    'ご自宅の近くで朝の健康チェックや相談ができる地域密着のサロンサービスです。';

  return (
    <main className="relative min-h-screen pb-20">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 md:gap-14 md:px-10">
        <TitleFromEnv fallback="サロン検索" />
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-2xl text-base font-medium text-muted-foreground md:text-lg">
              {heroDescription}
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-card/80 px-5 py-4 text-base shadow-soft md:max-w-xs">
            <p className="font-semibold text-foreground">本日のおすすめ</p>
            {earliestSlot ? (
              <p className="text-sm text-muted-foreground md:text-base">
                {slotFormatter.format(earliestSlot.startAt)} から受付可能です。
              </p>
            ) : (
              <p className="text-sm text-muted-foreground md:text-base">現在受付可能な枠はありません。</p>
            )}
          </div>
        </header>

        <section
          aria-labelledby="search-section"
          className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]"
        >
          <Card className="border-none bg-card/90 shadow-soft">
            <CardHeader className="gap-4">
              <CardTitle id="search-section">場所・店舗を探す</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                行き慣れたカフェや集会所で受けられる医療・生活支援サービスを検索します。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="space-y-3">
                <Label htmlFor="q">店舗名で検索</Label>
                <Input
                  id="q"
                  placeholder="例: 銀座 / 表参道"
                  value={q}
                  inputMode="search"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQ(event.target.value)}
                  aria-describedby="search-hint"
                />
                <p id="search-hint" className="text-sm text-muted-foreground md:text-base">
                  ひらがな・カタカナ・漢字すべて検索対象です。部分一致でも探せます。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3" aria-live="polite">
                <Badge variant="secondary">該当店舗 {filteredStores.length} 件</Badge>
                <Badge variant="outline">空き枠 {totalNextSlots} 件</Badge>
              </div>
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-4 rounded-2xl bg-secondary/40 p-6 text-base text-secondary-foreground shadow-soft">
            <h2 className="text-xl font-semibold text-secondary-foreground md:text-2xl">ご利用の流れ</h2>
            <ol className="space-y-3 text-sm text-secondary-foreground/90 md:text-base">
              <li>
                <span className="font-semibold text-primary">1.</span> 行きやすい店舗を検索
              </li>
              <li>
                <span className="font-semibold text-primary">2.</span> 受けたいサポート内容をスタッフにご相談
              </li>
              <li>
                <span className="font-semibold text-primary">3.</span> 当日はゆったり朝食とともにサポートを受診
              </li>
            </ol>
            <p className="text-sm font-medium text-secondary-foreground/80 md:text-base">
              お電話でのご予約は 050-1234-5678（平日 8:00-18:00）でも承ります。
            </p>
          </aside>
        </section>

        <section aria-labelledby="result-section" className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <div className="space-y-1">
              <h2 id="result-section" className="text-2xl font-bold text-foreground md:text-3xl">
                近隣のサロン候補
              </h2>
              <p className="text-base text-muted-foreground">
                ご予約は前日18時まで承ります。空き状況はリアルタイムで更新されています。
              </p>
            </div>
            <Badge className="self-start bg-primary text-primary-foreground shadow-soft" variant="default">
              {filteredStores.length} 拠点が閲覧可能
            </Badge>
          </div>

          <ol className="grid gap-6" aria-live="polite">
            {filteredStores.map((store) => {
              const next = nextSlots.filter((slot) => slot.storeId === store.id).slice(0, 3);
              return (
                <li key={store.id}>
                  <Card className="border-none bg-card/90 shadow-soft transition-transform hover:-translate-y-1">
                    <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-foreground md:text-2xl">{store.name}</CardTitle>
                        <CardDescription className="text-base">{store.address}</CardDescription>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant={next.length ? 'secondary' : 'outline'}>
                          次の空き {next.length} 件
                        </Badge>
                        {next.length > 0 && (
                          <Badge variant="outline">定員 最大 {Math.max(...next.map((slot) => slot.capacity), 0)} 名</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 md:flex-row md:justify-between">
                      <div className="space-y-3">
                        <p className="text-base font-semibold text-foreground">直近の空き時間</p>
                        {next.length > 0 ? (
                          <ul className="space-y-3 text-sm md:text-base">
                            {next.map((slot) => (
                              <li
                                key={slot.id}
                                className="rounded-xl bg-muted/60 px-4 py-3 text-foreground/90"
                              >
                                <span className="font-semibold text-primary">
                                  {slotFormatter.format(slot.startAt)}
                                </span>
                                <span className="mx-2 text-muted-foreground">〜</span>
                                <span className="font-medium text-foreground">
                                  {timeFormatter.format(slot.endAt)}
                                </span>
                                <span className="ml-3 inline-flex items-center rounded-full bg-secondary/40 px-3 py-1 text-sm font-semibold text-secondary-foreground">
                                  定員 {slot.capacity} 名
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-base text-muted-foreground">近日の空きはありません。</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 md:min-w-[220px]">
                        <Button type="button">予約リクエストを送る</Button>
                        <Button type="button" variant="outline">
                          店舗詳細を確認
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          ご予約時に医療スタッフとの事前ヒアリングを実施いたします。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}

            {filteredStores.length === 0 && (
              <li>
                <Card className="border-none bg-card/80 shadow-soft">
                  <CardContent className="space-y-3 py-8 text-center text-base text-muted-foreground">
                    <p>該当する店舗が見つかりませんでした。</p>
                    <p>駅名や地域名など、別のキーワードでもお試しください。</p>
                  </CardContent>
                </Card>
              </li>
            )}
          </ol>
        </section>
      </div>
    </main>
  );
}

function TitleFromEnv({ fallback }: { fallback: string }) {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_USER as string | undefined) ?? fallback;
  useEffect(() => {
    document.title = site ? `${site} | ${title}` : title;
  }, [site, title]);
  return <h1 className="sr-only">{title}</h1>;
}
