import type { PropsWithChildren } from 'react';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDateTime } from './lib/date';
import { AdminRouteKey, adminRoutes, getRouteMeta } from './navigation';

interface AdminLayoutProps extends PropsWithChildren {
  route: AdminRouteKey;
  onNavigate: (route: AdminRouteKey) => void;
  lastUpdatedAt: number;
}

export function AdminLayout({ route, onNavigate, lastUpdatedAt, children }: AdminLayoutProps) {
  const activeMeta = getRouteMeta(route);

  return (
    <div className="relative min-h-screen pb-24">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10 md:gap-14 md:px-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-2xl text-base font-medium text-muted-foreground md:text-lg">
              参画拠点・利用者・専門スタッフの状況を俯瞰し、オペレーションを迅速に判断できます。
            </p>
          </div>
          <Badge variant="secondary" className="self-start">
            データ最終更新 {formatDateTime(lastUpdatedAt)}
          </Badge>
        </header>

        <nav aria-label="管理メインメニュー" className="grid gap-4">
          <Card className="border-none bg-card/80 shadow-soft">
            <ul className="grid gap-2 md:grid-cols-3">
              {adminRoutes.map((item) => {
                const isActive = item.key === route;
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.key)}
                      className={cn(
                        'flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm focus-visible:ring-primary'
                          : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted/70 focus-visible:ring-primary',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="text-sm font-semibold md:text-base">{item.label}</span>
                      <span className={cn('text-xs md:text-sm', isActive ? 'text-primary-foreground/80' : 'text-muted-foreground/80')}>
                        {item.description}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        </nav>

        <section aria-label={`${activeMeta.label}セクション`} className="grid gap-10">
          {children}
        </section>
      </div>
    </div>
  );
}

