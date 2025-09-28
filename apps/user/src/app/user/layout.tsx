import { useEffect, useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LifeBuoy, MessageCircle, Phone, ShieldCheck, UsersRound, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { loadUserData, type UserDataBundle } from './data';
import {
  getRouteMeta,
  resolveRouteKey,
  userRoutes,
  type UserRouteKey,
  type UserRouteMeta,
} from './navigation';

const assurancePoints = [
  {
    icon: ShieldCheck,
    title: '医師とつながる安心体制',
    description: '現役医師と看護スタッフが待機し、当日の体調確認もその場で共有できます。',
  },
  {
    icon: UsersRound,
    title: 'ご家族と一緒に使える',
    description: '予約内容はご家族にも共有可能。代理操作や付き添いの相談もオンラインで完了。',
  },
  {
    icon: LifeBuoy,
    title: '困ったらすぐ相談',
    description: 'スタッフが電話やLINEで状況を伺い、必要な手続きを一緒に進めます。',
  },
] as const;

const supportPhoneNumber = import.meta.env.VITE_SUPPORT_PHONE ?? '050-1234-5678';
const supportLineUrl = import.meta.env.VITE_SUPPORT_LINE_URL ?? 'https://line.me/R/ti/p/placeholder';
const supportLineNote =
  import.meta.env.VITE_SUPPORT_LINE_NOTE ?? 'ご家族と一緒に利用可能／夜間は折り返し連絡となります';

const supportChannels = [
  {
    id: 'support-phone',
    icon: Phone,
    label: 'お電話',
    value: supportPhoneNumber,
    note: '平日 8:00～17:00／通話無料',
    actionLabel: '電話をかける',
    href: toTelHref(supportPhoneNumber),
  },
  {
    id: 'support-line',
    icon: MessageCircle,
    label: 'LINE 相談',
    value: 'スタッフとすぐにつながります',
    note: supportLineNote,
    actionLabel: 'LINEで相談する',
    href: supportLineUrl,
  },
] as const;

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
    <div className="relative min-h-screen pb-24">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12 lg:gap-16 lg:px-10">
        <header className="flex flex-col gap-10 rounded-[2.5rem] bg-card/95 p-8 shadow-soft lg:p-12" aria-label="サービスのご案内">
          <div className="flex flex-col gap-8">
            <Logo />
            <div className="space-y-5 text-balance">
              <h1 className="text-[2.25rem] font-extrabold leading-snug text-foreground lg:text-[2.75rem]">
                朝のひとときに、医療・生活の相談をまとめて完結。
              </h1>
              <p className="text-lg font-medium leading-relaxed text-muted-foreground lg:text-xl">
                「サロン de モーニング」は、移動が大変な方でも通いやすい近所の拠点で、
                医療相談と生活支援を受けられる地域密着サービスです。
              </p>
            </div>
            <section aria-label="安心してご利用いただくための3つの特徴" className="flex flex-col gap-4">
              {assurancePoints.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="flex flex-col gap-3 rounded-[2rem] border-2 border-primary/15 bg-primary/5 px-5 py-6 text-left shadow-soft/60"
                >
                  <Icon className="h-10 w-10 text-primary" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-foreground lg:text-2xl">{title}</h2>
                  <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">{description}</p>
                </article>
              ))}
            </section>
          </div>
          <section className="flex flex-col gap-6 rounded-[2rem] bg-gradient-to-br from-primary/12 via-card to-primary/5 p-6 lg:p-8" aria-label="サポートと最新情報">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/80">
                最新のお知らせ
              </p>
            </div>
            <div className="space-y-4 rounded-[1.75rem] border border-primary/20 bg-white/80 p-5 text-sm text-muted-foreground shadow-soft">
              <p className="text-base font-semibold text-primary/90 lg:text-lg">
                ご不安なときはすぐスタッフにつながります
              </p>
              <div className="flex flex-col gap-3">
                {supportChannels.map((channel) => (
                  <SupportChannel key={channel.id} {...channel} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground/80">
                ※医療に関する緊急の際は、直接かかりつけ医または救急へご連絡ください。
              </p>
            </div>
          </section>
        </header>

        <nav aria-label="主要メニュー" className="flex flex-col gap-5">
          {userRoutes.map((route) => (
            <MenuCard key={route.key} route={route} />
          ))}
        </nav>

        <main className="flex-1 rounded-[2.5rem] bg-card/90 p-6 shadow-soft lg:p-10">
          <Outlet context={data} />
        </main>
      </div>
    </div>
  );
}

interface SupportChannelConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
  actionLabel: string;
  href: string;
}

interface SupportChannelProps extends SupportChannelConfig {}

function SupportChannel({ id, icon: Icon, label, value, note, actionLabel, href }: SupportChannelProps) {
  const noteId = `${id}-note`;
  const labelId = `${id}-label`;
  const isExternalLink = href.startsWith('http');

  return (
    <article
      className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/40 px-4 py-4"
      aria-labelledby={labelId}
      aria-describedby={noteId}
    >
      <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
      <div className="space-y-1">
        <p id={labelId} className="text-sm font-semibold text-foreground lg:text-base">
          {label}
        </p>
        <p className="text-lg font-bold text-foreground lg:text-xl">{value}</p>
      </div>
      <Button
        asChild
        size="lg"
        className="w-full justify-center"
        variant="primary"
        aria-describedby={noteId}
      >
        <a
          href={href}
          target={isExternalLink ? '_blank' : undefined}
          rel={isExternalLink ? 'noopener noreferrer' : undefined}
        >
          {actionLabel}
        </a>
      </Button>
      <p id={noteId} className="text-xs text-muted-foreground/80 lg:text-sm">
        {note}
      </p>
    </article>
  );
}

function toTelHref(input: string): string {
  const normalized = input.replace(/[^0-9+]/g, '');
  return normalized ? `tel:${normalized}` : 'tel:';
}

interface MenuCardProps {
  route: UserRouteMeta;
}

function MenuCard({ route }: MenuCardProps) {
  const { accent, icon: Icon, key, label, description, to } = route;

  return (
    <NavLink
      to={to}
      aria-describedby={`${key}-description`}
      className={({ isActive }) =>
        cn(
          'group flex flex-col gap-4 rounded-[2rem] border-2 px-6 py-6 no-underline transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'min-h-[9rem] bg-card/85 shadow-soft hover:-translate-y-1',
          accent === 'primary' && 'hover:border-primary/70 hover:bg-primary/8',
          accent === 'secondary' && 'hover:border-secondary/80 hover:bg-secondary/12',
          accent === 'neutral' && 'hover:border-muted-foreground/40 hover:bg-muted/30',
          isActive
            ? accent === 'primary'
              ? 'border-primary bg-primary/10 text-primary'
              : accent === 'secondary'
                ? 'border-secondary bg-secondary/20 text-primary'
                : 'border-border bg-muted/30 text-primary'
            : 'border-border text-foreground',
        )
      }
    >
      <Icon className="h-10 w-10 text-primary" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold lg:text-[2rem]">{label}</span>
        <span id={`${key}-description`} className="text-base text-muted-foreground lg:text-lg">
          {description}
        </span>
      </div>
    </NavLink>
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
