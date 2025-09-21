import type { ComponentType } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminLayout } from './app/admin/layout';
import { lastAdminDataUpdatedAt } from './app/admin/data';
import { DashboardPage } from './app/admin/dashboard/page';
import { MenusPage } from './app/admin/menus/page';
import { PostsPage } from './app/admin/posts/page';
import { SalonsPage } from './app/admin/salons/page';
import { StylistsPage } from './app/admin/stylists/page';
import { UsersPage } from './app/admin/users/page';
import {
  AdminNavigationContext,
  AdminRouteKey,
  getRouteHref,
  getRouteMeta,
  parseLocation,
} from './app/admin/navigation';

const routeComponents: Record<AdminRouteKey, ComponentType> = {
  dashboard: DashboardPage,
  users: UsersPage,
  salons: SalonsPage,
  stylists: StylistsPage,
  menus: MenusPage,
  posts: PostsPage,
};

interface LocationState {
  basePath: string;
  route: AdminRouteKey;
}

export function App() {
  const site = import.meta.env.VITE_SITE_NAME as string | undefined;
  const title = (import.meta.env.VITE_TITLE_ADMIN as string | undefined) ?? '管理ダッシュボード';

  const initialLocation = useMemo<LocationState>(() => parseLocation(window.location.pathname), []);
  const [locationState, setLocationState] = useState<LocationState>(initialLocation);

  useEffect(() => {
    const handler = () => {
      setLocationState(parseLocation(window.location.pathname));
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  useEffect(() => {
    if (locationState.route === 'dashboard') {
      const expectedPath = getRouteHref(locationState.basePath, 'dashboard');
      if (window.location.pathname !== expectedPath) {
        window.history.replaceState({ route: 'dashboard' }, '', expectedPath);
      }
    }
  }, [locationState]);

  useEffect(() => {
    const currentMeta = getRouteMeta(locationState.route);
    const pageTitle = `${title} | ${currentMeta.label}`;
    document.title = site ? `${site} | ${pageTitle}` : pageTitle;
  }, [locationState.route, site, title]);

  const handleNavigate = useCallback((nextRoute: AdminRouteKey) => {
    setLocationState((prev) => {
      if (prev.route === nextRoute) return prev;
      const nextPath = getRouteHref(prev.basePath, nextRoute);
      window.history.pushState({ route: nextRoute }, '', nextPath);
      return { ...prev, route: nextRoute };
    });
  }, []);

  const CurrentPage = routeComponents[locationState.route];

  return (
    <AdminNavigationContext.Provider value={handleNavigate}>
      <AdminLayout route={locationState.route} onNavigate={handleNavigate} lastUpdatedAt={lastAdminDataUpdatedAt}>
        <CurrentPage />
      </AdminLayout>
    </AdminNavigationContext.Provider>
  );
}

