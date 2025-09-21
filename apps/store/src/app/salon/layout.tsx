import { useEffect, useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from '../../components/logo';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { reservationStats, salonUpdatedAt } from './data';
import { getSalonRouteMeta, parseSalonLocation, salonRoutes } from './navigation';

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const formatDateTime = (value: number) => dateTimeFormatter.format(value);

export function SalonLayout() {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_STORE as string | undefined) ?? '店舗ダッシュボード';

  const location = useLocation();
  const locationState = useMemo(() => parseSalonLocation(location.pathname), [location.pathname]);
  const activeMeta = useMemo(() => getSalonRouteMeta(locationState.route), [locationState.route]);

  useEffect(() => {
    const pageTitle = `${title} | ${activeMeta.label}`;
    document.title = site ? `${site} | ${pageTitle}` : pageTitle;
  }, [activeMeta.label, site, title]);

  return (
    <main className="relative min-h-screen pb-20">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 md:gap-14 md:px-10">
        <h1 className="sr-only">{title}</h1>
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-2xl text-base font-medium text-muted-foreground md:text-lg">
              当日の準備やスタッフ手配に役立つ指標をひと目で把握し、必要な一覧へ素早く遷移できます。
            </p>
          </div>
          <div className="flex flex-col gap-2 self-start text-sm text-muted-foreground">
            <Badge variant="secondary" className="w-fit">
              予約総数 {reservationStats.total.toLocaleString()} 件
            </Badge>
            <span className="text-xs md:text-sm">データ更新 {formatDateTime(salonUpdatedAt)}</span>
          </div>
        </header>

        <nav aria-label="サロンアプリの主要メニュー" className="grid gap-4">
          <Card className="border-none bg-card/80 shadow-soft">
            <ul className="grid gap-2 md:grid-cols-3">
              {salonRoutes.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={item.key}
                    end
                    className={({ isActive }: { isActive: boolean }) =>
                      cn(
                        'flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm focus-visible:ring-primary'
                          : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted/70 focus-visible:ring-primary',
                      )
                    }
                    aria-current={locationState.route === item.key ? 'page' : undefined}
                  >
                    <span className="text-sm font-semibold md:text-base">{item.label}</span>
                    <span
                      className={cn(
                        'text-xs md:text-sm',
                        locationState.route === item.key
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground/80',
                      )}
                    >
                      {item.description}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </Card>
        </nav>

        <section aria-label={`${activeMeta.label}セクション`} className="grid gap-10">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
