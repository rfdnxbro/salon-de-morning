import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ClientLayout } from './app/client/layout';
import { DashboardPage } from './app/client/dashboard/page';
import { ReservationsPage } from './app/client/reservations/page';
import { SalonsPage } from './app/client/salons/page';
import { UsersPage } from './app/client/users/page';

export function App() {
  const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="salons" element={<SalonsPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
