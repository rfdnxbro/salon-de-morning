import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UserLayout } from './app/user/layout';
import { DashboardPage } from './app/user/dashboard/page';
import { ReservationsPage } from './app/user/reservations/page';
import { SalonsPage } from './app/user/salons/page';

export function App() {
  const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<UserLayout audience="senior" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="salons" element={<SalonsPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="family" element={<UserLayout audience="family" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="salons" element={<SalonsPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
