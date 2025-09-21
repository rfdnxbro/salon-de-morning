import { createContext, useContext } from 'react';

export type AdminRouteKey = 'dashboard' | 'users' | 'salons' | 'stylists' | 'menus' | 'posts';

export interface AdminRouteMeta {
  key: AdminRouteKey;
  label: string;
  description: string;
}

export const adminRoutes: AdminRouteMeta[] = [
  { key: 'dashboard', label: 'ダッシュボード', description: '管理サマリーと重要指標' },
  { key: 'users', label: '利用者一覧', description: '利用者情報の検索・出力' },
  { key: 'salons', label: '拠点一覧', description: '提携拠点の基本情報' },
  { key: 'stylists', label: '専門サポーター', description: '看護師・専門スタッフの管理' },
  { key: 'menus', label: 'メニュー管理', description: '提供メニューと料金の整理' },
  { key: 'posts', label: 'お知らせ配信', description: '通知・お知らせの配信履歴' },
];

const routeMap = new Map<AdminRouteKey, AdminRouteMeta>(adminRoutes.map((item) => [item.key, item]));

export const AdminNavigationContext = createContext<(route: AdminRouteKey) => void>(() => {});

export function useAdminNavigate() {
  return useContext(AdminNavigationContext);
}

export function isAdminRoute(value: string): value is AdminRouteKey {
  return routeMap.has(value as AdminRouteKey);
}

export function getRouteMeta(key: AdminRouteKey) {
  const meta = routeMap.get(key);
  if (!meta) throw new Error(`Unknown admin route: ${key}`);
  return meta;
}

export function getRoutePathSegment(key: AdminRouteKey): string {
  return key;
}

export function getRouteHref(basePath: string, key: AdminRouteKey): string {
  const normalizedBase = basePath === '/' ? '' : basePath;
  const segment = getRoutePathSegment(key);
  return `${normalizedBase}/${segment}`.replace(/\/+/g, '/');
}

export interface LocationParseResult {
  basePath: string;
  route: AdminRouteKey;
}

export function parseLocation(pathname: string): LocationParseResult {
  const trimmed = pathname.replace(/\/+$/, '');
  const segments = trimmed.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { basePath: '', route: 'dashboard' };
  }

  const last = segments[segments.length - 1];
  if (isAdminRoute(last)) {
    const baseSegments = segments.slice(0, -1);
    const basePath = baseSegments.length > 0 ? `/${baseSegments.join('/')}` : '';
    return { basePath, route: last };
  }

  // '/admin' のように末尾がルートキーでない場合はそのまま保持してダッシュボードへ寄せる
  return { basePath: `/${segments.join('/')}`, route: 'dashboard' };
}
