import type { SalonMenuItem, SalonPost, SalonStylist } from 'mocks';
import {
  clients,
  getSalonName as resolveSalonName,
  menus,
  posts,
  salonDataLastUpdatedAt,
  stores as salonStores,
  stylists,
  users,
} from 'mocks';
import type { AdminRouteKey } from './navigation';

export type Salon = (typeof salonStores)[number];
export type Client = (typeof clients)[number];
export type AdminUser = (typeof users)[number];
export type Stylist = SalonStylist;
export type MenuItem = SalonMenuItem;
export type AdminPost = SalonPost;

export const salons: Salon[] = salonStores;
export const salonClients: Client[] = clients;
export const adminUsers: AdminUser[] = users;

export const lastAdminDataUpdatedAt = salonDataLastUpdatedAt;

export const summaryCounts = {
  users: adminUsers.length,
  salons: salons.length,
  stylists: stylists.length,
  menus: menus.length,
  posts: posts.length,
} satisfies Record<Exclude<AdminRouteKey, 'dashboard'>, number>;

export const lastUserUpdatedAt = adminUsers.length > 0 ? Math.max(...adminUsers.map((user) => user.updatedAt)) : undefined;
export const lastSalonUpdatedAt = salons.length > 0 ? Math.max(...salons.map((salon) => salon.updatedAt)) : undefined;

export { stylists, menus, posts };

export function getSalonName(salonId: string): string {
  return resolveSalonName(salonId);
}
