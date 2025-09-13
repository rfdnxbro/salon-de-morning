import type { Store, Client, User, Slot, Reservation, JoinedReservation } from './types';

const now = Date.now();
const jst = (h: number) => new Date(now + h * 60 * 60 * 1000).getTime();

export const stores: Store[] = [
  { id: 'st_1', name: '銀座サロン', code: 'GINZA', address: '東京都中央区', createdAt: now, updatedAt: now },
  { id: 'st_2', name: '渋谷サロン', code: 'SHIBUYA', address: '東京都渋谷区', createdAt: now, updatedAt: now }
];

export const clients: Client[] = [
  { id: 'cl_1', name: 'ABC派遣', code: 'ABC', address: '東京都千代田区', createdAt: now, updatedAt: now }
];

export const users: User[] = [
  { id: 'u_1', name: '山田太郎', createdAt: now, updatedAt: now },
  { id: 'u_2', name: '佐藤花子', createdAt: now, updatedAt: now }
];

export const slots: Slot[] = [
  {
    id: 'sl_1',
    storeId: 'st_1',
    clientId: 'cl_1',
    startAt: jst(24),
    endAt: jst(25),
    capacity: 2,
    status: 'active',
    title: 'カット/カラー',
    note: 'スタイリスト指名可',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sl_2',
    storeId: 'st_2',
    startAt: jst(48),
    endAt: jst(49),
    capacity: 1,
    status: 'active',
    title: 'シャンプーのみ',
    createdAt: now,
    updatedAt: now
  }
];

export const reservations: Reservation[] = [
  { id: 'r_1', slotId: 'sl_1', userId: 'u_1', status: 'confirmed', createdAt: now, updatedAt: now },
  { id: 'r_2', slotId: 'sl_2', userId: 'u_2', status: 'draft', createdAt: now, updatedAt: now }
];

export function joinReservation(r: Reservation): JoinedReservation | undefined {
  const slot = slots.find((s) => s.id === r.slotId);
  if (!slot) return undefined;
  const store = stores.find((st) => st.id === slot.storeId)!;
  const client = slot.clientId ? clients.find((c) => c.id === slot.clientId) : undefined;
  const user = users.find((u) => u.id === r.userId)!;
  return { reservation: r, slot, store, client, user };
}

