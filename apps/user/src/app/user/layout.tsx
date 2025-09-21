import { useEffect, useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { loadUserData, type UserDataBundle } from './data';
import { getRouteMeta, resolveRouteKey, userRoutes, type UserRouteKey } from './navigation';

const updatedAtFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  dateStyle: 'long',
  timeStyle: 'short',
});

export type UserOutletContext = UserDataBundle;

export function UserLayout() {
  const location = useLocation();
  const currentRoute = resolveRouteKey(location.pathname);

  const data = useMemo<UserDataBundle>(() => loadUserData(), []);

  useDocumentTitle(currentRoute);

  const updatedAtLabel = updatedAtFormatter.format(data.lastUpdatedAt);

  return (
    <div className="relative min-h-screen pb-16">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-10 md:gap-16 md:px-12">
        <header className="flex flex-col gap-6" aria-label="サービスのご案内">
          <Logo />
          <p className="text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
            朝の時間に医療・生活支援を受けられる「サロン de モーニング」。ご自宅から無理なく通える拠点を探し、安心して予約まで完結できます。
          </p>
          <div className="flex flex-col gap-3 rounded-3xl bg-card/90 p-6 text-base text-foreground shadow-soft md:flex-row md:items-center md:justify-between md:text-lg">
            <p className="font-semibold text-foreground">最新データ</p>
            <p className="text-muted-foreground">
              {updatedAtLabel} 時点での情報です。操作はゆっくり進めていただけます。
            </p>
          </div>
        </header>

        <nav
          aria-label="主要メニュー"
          className="grid gap-4 md:grid-cols-3"
        >
          {userRoutes.map((route) => (
            <NavLink
              key={route.key}
              to={route.to}
              className={({ isActive }) =>
                cn(
                  'group flex flex-col gap-2 rounded-3xl border-2 px-6 py-5 no-underline transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'min-h-[3.25rem] bg-card/80 shadow-soft hover:-translate-y-0.5 hover:border-primary/70 hover:bg-primary/5',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-border text-foreground',
                )
              }
            >
              <span className="text-xl font-semibold md:text-2xl">{route.label}</span>
              <span className="text-base text-muted-foreground md:text-lg">{route.description}</span>
            </NavLink>
          ))}
        </nav>

        <main className="flex-1">
          <Outlet context={data} />
        </main>
      </div>
    </div>
  );
}

function useDocumentTitle(route: UserRouteKey) {
  useEffect(() => {
    const site = import.meta.env.VITE_SITE_NAME as string | undefined;
    const baseTitle = (import.meta.env.VITE_TITLE_USER as string | undefined) ?? '利用者向けポータル';
    const meta = getRouteMeta(route);
    const pageTitle = `${baseTitle} | ${meta.label}`;
    document.title = site ? `${site} | ${pageTitle}` : pageTitle;
  }, [route]);
}
