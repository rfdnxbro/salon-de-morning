import { useEffect, useMemo, useState } from 'react';
import { stores, slots } from 'mocks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Logo } from './components/logo';

export function App() {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const filteredStores = stores.filter((s) => s.name.toLowerCase().includes(keyword));
    const storeIds = new Set(filteredStores.map((s) => s.id));
    const nextSlots = slots
      .filter((sl) => storeIds.has(sl.storeId) && sl.status === 'active')
      .sort((a, b) => a.startAt - b.startAt);
    return { filteredStores, nextSlots };
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <Logo />
      </header>
      <TitleFromEnv fallback="サロン検索" />

      <div className="mb-6 space-y-2">
        <Label htmlFor="q">店舗名で検索</Label>
        <Input
          id="q"
          placeholder="例: 銀座 / 表参道"
          value={q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {results.filteredStores.map((s) => {
          const next = results.nextSlots.filter((sl) => sl.storeId === s.id).slice(0, 3);
          return (
            <Card key={s.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{s.name}</CardTitle>
                  <CardDescription>{s.address}</CardDescription>
                </div>
                <Badge variant={next.length ? 'secondary' : 'outline'}>
                  次の枠 {next.length} 件
                </Badge>
              </CardHeader>
              <CardContent>
                {next.length > 0 ? (
                  <ul className="list-disc list-inside text-sm">
                    {next.map((sl) => (
                      <li key={sl.id}>
                        {new Date(sl.startAt).toLocaleString('ja-JP', {
                          timeZone: 'Asia/Tokyo',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {' '}～{' '}
                        {new Date(sl.endAt).toLocaleTimeString('ja-JP', {
                          timeZone: 'Asia/Tokyo',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {' '}（定員{sl.capacity}）
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">近日の空きはありません</div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {results.filteredStores.length === 0 && (
          <Card>
            <CardContent className="p-6 text-muted-foreground text-sm">
              該当する店舗がありません。
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function TitleFromEnv({ fallback }: { fallback: string }) {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_USER as string | undefined) ?? fallback;
  useEffect(() => {
    document.title = site ? `${site} | ${title}` : title;
  }, [site, title]);
  return <h1 className="text-2xl font-bold mb-6">{title}</h1>;
}
