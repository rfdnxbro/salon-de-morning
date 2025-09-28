import { useEffect, useMemo } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LifeBuoy, MessageCircle, Phone, ShieldCheck, UsersRound, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { loadUserData, type UserDataBundle } from './data';
import type { Audience } from './audience';
import { getRouteMeta, getRoutes, resolveRouteKey, type UserRouteKey, type UserRouteMeta } from './navigation';

const supportPhoneNumber = import.meta.env.VITE_SUPPORT_PHONE ?? '050-1234-5678';
const supportLineUrl = import.meta.env.VITE_SUPPORT_LINE_URL ?? 'https://line.me/R/ti/p/placeholder';
const supportLineNoteSenior =
  import.meta.env.VITE_SUPPORT_LINE_NOTE ?? 'ご家族と一緒に利用可能／夜間は折り返し連絡となります';
const supportLineNoteFamily =
  import.meta.env.VITE_SUPPORT_LINE_NOTE_FAMILY ?? '時間外は折り返しのご連絡となります。メッセージを残してください。';

const updatedAtFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  dateStyle: 'long',
  timeStyle: 'short',
});

interface UserLayoutProps {
  audience: Audience;
}

export interface UserOutletContext extends UserDataBundle {
  audience: Audience;
}

export function UserLayout({ audience }: UserLayoutProps) {
  const location = useLocation();
  const currentRoute = resolveRouteKey(location.pathname);

  const data = useMemo<UserDataBundle>(() => loadUserData(), []);

  useDocumentTitle(currentRoute, audience);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.audience = audience;
    return () => {
      delete root.dataset.audience;
    };
  }, [audience]);

  if (audience === 'family') {
    return (
      <FamilyLayout
        audience={audience}
        currentRoute={currentRoute}
        data={data}
        supportLineNote={supportLineNoteFamily}
      />
    );
  }

  return (
    <SeniorLayout
      audience={audience}
      currentRoute={currentRoute}
      data={data}
      supportLineNote={supportLineNoteSenior}
    />
  );
}

interface LayoutBaseProps {
  audience: Audience;
  currentRoute: UserRouteKey;
  data: UserDataBundle;
  supportLineNote: string;
}

const seniorAssurancePoints = [
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

function SeniorLayout({ audience, currentRoute, data, supportLineNote }: LayoutBaseProps) {
  const routes = getRoutes(audience);
  const updatedAtLabel = updatedAtFormatter.format(data.lastUpdatedAt);

  return (
    <div className="relative min-h-screen pb-24">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12 lg:gap-16 lg:px-10">
        <header className="flex flex-col gap-10 rounded-[2.5rem] bg-card/95 p-8 shadow-soft lg:p-12" aria-label="サービスのご案内">
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <AudienceBadge audience={audience} />
                <Logo />
              </div>
              <AudienceToggle audience={audience} currentRoute={currentRoute} />
            </div>
            <div className="space-y-5 text-balance">
              <h1 className="text-[2.25rem] font-extrabold leading-snug text-foreground lg:text-[2.75rem]">
                朝のひとときに、医療・生活の相談をまとめて完結。
              </h1>
              <p className="text-lg font-medium leading-relaxed text-muted-foreground lg:text-xl">
                「サロン de モーニング」は、移動が大変な方でも通いやすい近所の拠点で、
                医療相談と生活支援を受けられる地域密着サービスです。
              </p>
              <p className="text-sm text-muted-foreground/80">最新更新日時：{updatedAtLabel}</p>
            </div>
            <section aria-label="安心してご利用いただくための3つの特徴" className="flex flex-col gap-4">
              {seniorAssurancePoints.map(({ icon: Icon, title, description }) => (
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
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/80">最新のお知らせ</p>
            </div>
            <div className="space-y-4 rounded-[1.75rem] border border-primary/20 bg-white/80 p-5 text-sm text-muted-foreground shadow-soft">
              <p className="text-base font-semibold text-primary/90 lg:text-lg">ご不安なときはすぐスタッフにつながります</p>
              <div className="flex flex-col gap-3">
                {getSupportChannels(audience, supportLineNote).map((channel) => (
                  <SupportChannel key={channel.id} {...channel} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground/80">※医療に関する緊急の際は、直接かかりつけ医または救急へご連絡ください。</p>
            </div>
          </section>
        </header>

        <nav aria-label="主要メニュー" className="flex flex-col gap-5">
          {routes.map((route) => (
            <MenuCard key={route.key} route={route} audience={audience} />
          ))}
        </nav>

        <main className="flex-1 rounded-[2.5rem] bg-card/90 p-6 shadow-soft lg:p-10">
          <Outlet context={{ ...data, audience }} />
        </main>
      </div>
    </div>
  );
}

const familyHighlights = [
  {
    icon: UsersRound,
    title: 'ご家族で共有できる見守り状況',
    description: '当日の予約や来店予定が一目でわかり、離れて暮らす家族とも簡単に連携できます。',
  },
  {
    icon: ShieldCheck,
    title: '医療スタッフのフォロー体制',
    description: '看護師が現地での対応状況を記録し、必要に応じて主治医とも連絡できるようにしています。',
  },
  {
    icon: LifeBuoy,
    title: '困ったらすぐ相談できる窓口',
    description: 'LINE と電話の2経路で、生活面・医療面の不安をスタッフへ直接ご相談いただけます。',
  },
] as const;

function FamilyLayout({ audience, currentRoute, data, supportLineNote }: LayoutBaseProps) {
  const routes = getRoutes(audience);
  const updatedAtLabel = updatedAtFormatter.format(data.lastUpdatedAt);

  return (
    <div className="relative min-h-screen bg-background pb-16">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-5 py-10 lg:px-12">
        <header className="flex flex-col gap-8 rounded-3xl bg-card/95 p-6 shadow-soft lg:p-10" aria-label="サービス概要">
          <div className="flex flex-col gap-5 lg:gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <AudienceBadge audience={audience} />
                <Logo />
              </div>
              <AudienceToggle audience={audience} currentRoute={currentRoute} />
            </div>
            <div className="space-y-4 text-balance">
              <h1 className="text-[2.15rem] font-extrabold leading-tight text-foreground lg:text-[2.5rem]">
                ご家族の「今」を把握しやすい、サロン利用のダッシュボード。
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
                「サロン de モーニング」と連携した予約・相談状況を、ご家族がまとめて確認・代理操作できるポータルです。
                生活支援や医療サポートの進捗を、いつでも安心して把握できます。
              </p>
              <p className="text-sm text-muted-foreground/80">最新更新日時：{updatedAtLabel}</p>
            </div>
            <section aria-label="安心して利用できる理由" className="grid gap-4 md:grid-cols-3">
              {familyHighlights.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-5 text-left shadow-soft/70"
                >
                  <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h2 className="text-lg font-semibold text-foreground lg:text-xl">{title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">{description}</p>
                </article>
              ))}
            </section>
          </div>
          <section className="flex flex-col gap-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-primary/5 p-5 lg:p-7" aria-label="サポート窓口">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">Support</p>
              <p className="text-lg font-semibold text-primary/95 lg:text-xl">スタッフがご家族の質問にもすぐ対応します</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {getSupportChannels(audience, supportLineNote).map((channel) => (
                <SupportChannel key={channel.id} {...channel} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground/70">※緊急時は迷わず救急・かかりつけ医へご連絡ください。</p>
          </section>
        </header>

        <nav aria-label="主要メニュー" className="grid gap-4 md:grid-cols-3">
          {routes.map((route) => (
            <MenuCard key={route.key} route={route} audience={audience} />
          ))}
        </nav>

        <main className="flex-1 rounded-3xl bg-card/92 p-5 shadow-soft lg:p-8">
          <Outlet context={{ ...data, audience }} />
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
      <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
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
        <a href={href} target={isExternalLink ? '_blank' : undefined} rel={isExternalLink ? 'noopener noreferrer' : undefined}>
          {actionLabel}
        </a>
      </Button>
      <p id={noteId} className="text-xs text-muted-foreground/80 lg:text-sm">
        {note}
      </p>
    </article>
  );
}

function getSupportChannels(audience: Audience, note: string): readonly SupportChannelConfig[] {
  return [
    {
      id: 'support-phone',
      icon: Phone,
      label: audience === 'family' ? '電話相談' : 'お電話',
      value: supportPhoneNumber,
      note: '平日 8:00～17:00 ／ 通話無料',
      actionLabel: audience === 'family' ? '電話する' : '電話をかける',
      href: toTelHref(supportPhoneNumber),
    },
    {
      id: 'support-line',
      icon: MessageCircle,
      label: 'LINE 相談',
      value: audience === 'family' ? 'スタッフが順番に回答します' : 'スタッフとすぐにつながります',
      note,
      actionLabel: audience === 'family' ? 'LINEで相談' : 'LINEで相談する',
      href: supportLineUrl,
    },
  ] as const;
}

function toTelHref(input: string): string {
  const normalized = input.replace(/[^0-9+]/g, '');
  return normalized ? `tel:${normalized}` : 'tel:';
}

interface MenuCardProps {
  route: UserRouteMeta;
  audience?: Audience;
}

function MenuCard({ route, audience = 'senior' }: MenuCardProps) {
  const { accent, icon: Icon, key, label, description, to } = route;
  const baseClasses =
    audience === 'family'
      ? 'group flex flex-col gap-3 rounded-2xl border px-5 py-5 no-underline transition-all duration-200 min-h-[8rem] bg-card/85 shadow-soft hover:-translate-y-0.5'
      : 'group flex flex-col gap-4 rounded-[2rem] border-2 px-6 py-6 no-underline transition-all duration-200 min-h-[9rem] bg-card/85 shadow-soft hover:-translate-y-1';

  return (
    <NavLink
      to={to}
      aria-describedby={`${key}-description`}
      className={({ isActive }) =>
        cn(
          baseClasses,
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
      <Icon className={audience === 'family' ? 'h-9 w-9 text-primary' : 'h-10 w-10 text-primary'} aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <span className={audience === 'family' ? 'text-xl font-bold lg:text-[1.8rem]' : 'text-2xl font-bold lg:text-[2rem]'}>
          {label}
        </span>
        <span id={`${key}-description`} className={audience === 'family' ? 'text-sm text-muted-foreground lg:text-base' : 'text-base text-muted-foreground lg:text-lg'}>
          {description}
        </span>
      </div>
    </NavLink>
  );
}

function AudienceBadge({ audience }: { audience: Audience }) {
  return (
    <span className="inline-flex w-fit items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {audience === 'family' ? 'ご家族向け表示' : 'かんたん表示'}
    </span>
  );
}

interface AudienceToggleProps {
  audience: Audience;
  currentRoute: UserRouteKey;
}

function AudienceToggle({ audience, currentRoute }: AudienceToggleProps) {
  const tabs: Array<{ key: Audience; label: string; to: string }> = [
    { key: 'senior', label: 'かんたん表示', to: getAudiencePath('senior', currentRoute) },
    { key: 'family', label: 'ご家族向け表示', to: getAudiencePath('family', currentRoute) },
  ];

  return (
    <div
      role="group"
      aria-label="表示切り替え"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 p-1 shadow-soft/30"
    >
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          asChild
          size="sm"
          variant={tab.key === audience ? 'primary' : 'outline'}
          aria-pressed={tab.key === audience}
          className={cn('min-w-[7rem] justify-center text-sm font-semibold', tab.key === audience && 'pointer-events-none')}
        >
          <Link to={tab.to}>{tab.label}</Link>
        </Button>
      ))}
    </div>
  );
}

function getAudiencePath(audience: Audience, route: UserRouteKey): string {
  if (route === 'dashboard') return audience === 'family' ? '/family' : '/';
  return audience === 'family' ? `/family/${route}` : `/${route}`;
}

function useDocumentTitle(route: UserRouteKey, audience: Audience) {
  useEffect(() => {
    const site = import.meta.env.VITE_SITE_NAME as string | undefined;
    const baseTitleSenior = (import.meta.env.VITE_TITLE_USER as string | undefined) ?? '利用者向けポータル';
    const baseTitleFamily = (import.meta.env.VITE_TITLE_USER_FAMILY as string | undefined) ?? 'ご家族向けポータル';
    const baseTitle = audience === 'family' ? baseTitleFamily : baseTitleSenior;
    const meta = getRouteMeta(route, audience);
    const pageTitle = `${baseTitle} | ${meta.label}`;
    document.title = site ? `${site} | ${pageTitle}` : pageTitle;
  }, [route, audience]);
}
