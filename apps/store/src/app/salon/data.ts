import type { JoinedReservation } from 'mocks';
import {
  joinReservation,
  menus as salonMenus,
  posts as salonPosts,
  reservations,
  salonDataLastUpdatedAt,
  stylists as salonStylists,
} from 'mocks';

export interface ReservationStats {
  total: number;
  confirmed: number;
  cancelled: number;
  draft: number;
}

export const joinedReservations: JoinedReservation[] = reservations
  .map(joinReservation)
  .filter((item): item is JoinedReservation => Boolean(item));

export const reservationStats: ReservationStats = joinedReservations.reduce<ReservationStats>(
  (acc, { reservation }) => {
    acc.total += 1;
    switch (reservation.status) {
      case 'confirmed':
        acc.confirmed += 1;
        break;
      case 'cancelled':
        acc.cancelled += 1;
        break;
      default:
        acc.draft += 1;
        break;
    }
    return acc;
  },
  { total: 0, confirmed: 0, cancelled: 0, draft: 0 },
);

export const activeStylistCount = salonStylists.filter((stylist) => stylist.status === 'active').length;

export const publishedMenuCount = salonMenus.filter((menu) => menu.isPublished).length;

export const upcomingPostCount = salonPosts.filter((post) => post.status !== 'published').length;

export const salonTotals = {
  reservations: reservationStats.total,
  stylists: salonStylists.length,
  menus: salonMenus.length,
  posts: salonPosts.length,
};

export const salonUpdatedAt = salonDataLastUpdatedAt;

export function getRecentReservations(limit = 3): JoinedReservation[] {
  return [...joinedReservations]
    .sort((a, b) => b.slot.startAt - a.slot.startAt)
    .slice(0, limit);
}

export function getUpcomingPosts(limit = 3) {
  return [...salonPosts]
    .filter((post) => post.status !== 'published')
    .sort((a, b) => (b.publishedAt ?? b.updatedAt) - (a.publishedAt ?? a.updatedAt))
    .slice(0, limit);
}

export { salonStylists, salonMenus, salonPosts };
