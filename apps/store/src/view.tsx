import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './app/salon/dashboard/page';
import { MenusPage } from './app/salon/menus/page';
import { PostsPage } from './app/salon/posts/page';
import { ReservationsPage } from './app/salon/reservations/page';
import { SalonLayout } from './app/salon/layout';
import { StylistsPage } from './app/salon/stylists/page';

export function App() {
  const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/salon/dashboard" replace />} />
        <Route path="/salon" element={<SalonLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="stylists" element={<StylistsPage />} />
          <Route path="menus" element={<MenusPage />} />
          <Route path="posts" element={<PostsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/salon/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

