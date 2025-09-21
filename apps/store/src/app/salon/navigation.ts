export type SalonRouteKey = 'dashboard' | 'reservations' | 'stylists' | 'menus' | 'posts';

export interface SalonRouteMeta {
  key: SalonRouteKey;
  label: string;
  description: string;
}

export const salonRoutes: SalonRouteMeta[] = [
  { key: 'dashboard', label: 'ダッシュボード', description: '日次サマリーと通知' },
  { key: 'reservations', label: '予約一覧', description: '予約の検索と状態確認' },
  { key: 'stylists', label: '専門スタッフ', description: '担当者の稼働状況管理' },
  { key: 'menus', label: '提供メニュー', description: 'サービス内容と料金の調整' },
  { key: 'posts', label: 'お知らせ配信', description: '店舗向け・利用者向け情報' },
];

const routeMap = new Map<SalonRouteKey, SalonRouteMeta>(salonRoutes.map((item) => [item.key, item]));

export function getSalonRouteMeta(key: SalonRouteKey): SalonRouteMeta {
  const meta = routeMap.get(key);
  if (!meta) throw new Error(`Unknown salon route: ${key}`);
  return meta;
}

export function isSalonRoute(value: string): value is SalonRouteKey {
  return routeMap.has(value as SalonRouteKey);
}

export function getSalonRoutePathSegment(key: SalonRouteKey): string {
  return key;
}

export function getSalonRouteHref(basePath: string, key: SalonRouteKey): string {
  const normalizedBase = basePath === '/' ? '' : basePath;
  const segment = getSalonRoutePathSegment(key);
  return `${normalizedBase}/${segment}`.replace(/\/+/g, '/');
}

export interface SalonLocationParseResult {
  basePath: string;
  route: SalonRouteKey;
}

export function parseSalonLocation(pathname: string): SalonLocationParseResult {
  const trimmed = pathname.replace(/\/+$/, '');
  const segments = trimmed.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { basePath: '', route: 'dashboard' };
  }

  const last = segments[segments.length - 1];
  if (isSalonRoute(last)) {
    const baseSegments = segments.slice(0, -1);
    const basePath = baseSegments.length > 0 ? `/${baseSegments.join('/')}` : '';
    return { basePath, route: last };
  }

  return { basePath: `/${segments.join('/')}`, route: 'dashboard' };
}
