export type UserRouteKey = 'dashboard' | 'salons' | 'reservations';

import type { LucideIcon } from 'lucide-react';
import { CalendarCheck2, HeartPulse, MapPin } from 'lucide-react';

export interface UserRouteMeta {
  key: UserRouteKey;
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
  accent: 'primary' | 'secondary' | 'neutral';
}

export const userRoutes: readonly UserRouteMeta[] = [
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
] as const;

export function getRouteMeta(key: UserRouteKey): UserRouteMeta {
  const meta = userRoutes.find((route) => route.key === key);
  if (!meta) {
    throw new Error(`Unknown route key: ${key}`);
  }
  return meta;
}

export function resolveRouteKey(pathname: string): UserRouteKey {
  const normalized = pathname.replace(/^\/+|\/+$/g, '');
  if (normalized.startsWith('salons')) return 'salons';
  if (normalized.startsWith('reservations')) return 'reservations';
  return 'dashboard';
}
