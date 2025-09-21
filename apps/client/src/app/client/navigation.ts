export type ClientRouteKey = 'dashboard' | 'salons' | 'reservations' | 'users';

export interface ClientRouteMeta {
  key: ClientRouteKey;
  label: string;
  description: string;
}

export const clientRoutes: ClientRouteMeta[] = [
  { key: 'dashboard', label: 'ダッシュボード', description: '主要指標と共有リソース' },
  { key: 'salons', label: '提携サロン', description: '拠点の運営状況と予定' },
  { key: 'reservations', label: '派遣予約', description: '訪問予定と状態の確認' },
  { key: 'users', label: '利用者', description: '従業員の利用状況' },
];

const routeMap = new Map<ClientRouteKey, ClientRouteMeta>(clientRoutes.map((item) => [item.key, item]));

export function getClientRouteMeta(key: ClientRouteKey): ClientRouteMeta {
  const meta = routeMap.get(key);
  if (!meta) throw new Error(`Unknown client route: ${key}`);
  return meta;
}

export function isClientRoute(value: string): value is ClientRouteKey {
  return routeMap.has(value as ClientRouteKey);
}

export function getClientRoutePathSegment(key: ClientRouteKey): string {
  return key;
}

export function getClientRouteHref(basePath: string, key: ClientRouteKey): string {
  const normalizedBase = basePath === '/' ? '' : basePath;
  const segment = getClientRoutePathSegment(key);
  const href = `${normalizedBase}/${segment}`;
  return href.replace(/\/+/g, '/');
}

export interface ClientLocationParseResult {
  basePath: string;
  route: ClientRouteKey;
}

export function parseClientLocation(pathname: string): ClientLocationParseResult {
  const trimmed = pathname.replace(/\/+$/, '');
  const segments = trimmed.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { basePath: '', route: 'dashboard' };
  }

  const last = segments[segments.length - 1];
  if (isClientRoute(last)) {
    const baseSegments = segments.slice(0, -1);
    const basePath = baseSegments.length > 0 ? `/${baseSegments.join('/')}` : '';
    return { basePath, route: last };
  }

  return { basePath: `/${segments.join('/')}`, route: 'dashboard' };
}
