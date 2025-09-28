import type { LucideIcon } from 'lucide-react';
import { CalendarCheck2, HeartPulse, MapPin } from 'lucide-react';
import type { Audience } from './audience';

export type UserRouteKey = 'dashboard' | 'salons' | 'reservations';

export interface UserRouteMeta {
  key: UserRouteKey;
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
  accent: 'primary' | 'secondary' | 'neutral';
}

const routeConfig: Record<Audience, readonly UserRouteMeta[]> = {
  senior: [
    {
      key: 'dashboard',
      label: 'ダッシュボード',
      description: '今日の予定やおすすめ情報を確認できます',
      to: 'dashboard',
      icon: HeartPulse,
      accent: 'primary',
    },
    {
      key: 'salons',
      label: 'サロン一覧',
      description: '近くのサロンや空き状況を確認できます',
      to: 'salons',
      icon: MapPin,
      accent: 'secondary',
    },
    {
      key: 'reservations',
      label: '予約一覧',
      description: '過去と今後の予約をまとめて確認できます',
      to: 'reservations',
      icon: CalendarCheck2,
      accent: 'neutral',
    },
  ],
  family: [
    {
      key: 'dashboard',
      label: 'ダッシュボード',
      description: '最新の予約状況とサポートからのお知らせを一覧できます。',
      to: 'dashboard',
      icon: HeartPulse,
      accent: 'primary',
    },
    {
      key: 'salons',
      label: 'サロン一覧',
      description: '移動距離や設備を確認しながら最適な会場を選べます。',
      to: 'salons',
      icon: MapPin,
      accent: 'secondary',
    },
    {
      key: 'reservations',
      label: '予約履歴',
      description: '過去・今後の予約や担当スタッフのメモをまとめて確認できます。',
      to: 'reservations',
      icon: CalendarCheck2,
      accent: 'neutral',
    },
  ],
};

export function getRoutes(audience: Audience): readonly UserRouteMeta[] {
  return routeConfig[audience];
}

export function getRouteMeta(key: UserRouteKey, audience: Audience): UserRouteMeta {
  const meta = routeConfig[audience].find((route) => route.key === key);
  if (!meta) {
    throw new Error(`Unknown route key: ${key}`);
  }
  return meta;
}

export function resolveRouteKey(pathname: string): UserRouteKey {
  const normalized = pathname.replace(/^\/+|\/+$/g, '');
  const withoutAudience = normalized.startsWith('family/') ? normalized.slice('family/'.length) : normalized;
  if (withoutAudience.startsWith('salons')) return 'salons';
  if (withoutAudience.startsWith('reservations')) return 'reservations';
  return 'dashboard';
}
