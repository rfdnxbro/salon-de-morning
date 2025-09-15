import type { Store, Client, User, Slot, Reservation, JoinedReservation } from './types';
import data from './data.json';

// 'YYYY-MM-DD HH:mm:ss'（JST想定）→ epoch(ms)
const parseJst = (s: string): number => {
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
  if (!m) throw new Error(`Invalid datetime format: ${s}`);
  const [_, y, mo, d, h, mi, se] = m;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  const hour = Number(h);
  const minute = Number(mi);
  const second = Number(se);
  // JSTはUTC+9。UTCに換算するため9時間引く。
  return Date.UTC(year, month - 1, day, hour - 9, minute, second);
};

const toMs = (v: string | number): number => (typeof v === 'number' ? v : parseJst(v));

// 分単位に正規化（秒・ミリ秒のみ切り落とす）
const trimToMinute = (t: number) => {
  const d = new Date(t);
  d.setSeconds(0, 0);
  return d.getTime();
};

// JSON -> 型付きエクスポート（必要に応じて分単位へ正規化）
export const stores: Store[] = data.stores.map((s) => ({
  ...s,
  createdAt: toMs(s.createdAt),
  updatedAt: toMs(s.updatedAt)
}));
export const clients: Client[] = data.clients.map((c) => ({
  ...c,
  createdAt: toMs(c.createdAt),
  updatedAt: toMs(c.updatedAt)
}));
export const users: User[] = data.users.map((u) => ({
  ...u,
  createdAt: toMs(u.createdAt),
  updatedAt: toMs(u.updatedAt)
}));
export const slots: Slot[] = data.slots.map((s): Slot => ({
  id: s.id,
  storeId: s.storeId,
  clientId: s.clientId,
  startAt: trimToMinute(toMs(s.startAt)),
  endAt: trimToMinute(toMs(s.endAt)),
  capacity: s.capacity,
  status: s.status as Slot['status'],
  title: s.title,
  createdAt: toMs(s.createdAt),
  updatedAt: toMs(s.updatedAt)
}));
export const reservations: Reservation[] = data.reservations.map((r): Reservation => ({
  id: r.id,
  slotId: r.slotId,
  userId: r.userId,
  status: r.status as Reservation['status'],
  createdAt: toMs(r.createdAt),
  updatedAt: toMs(r.updatedAt)
}));

export function joinReservation(r: Reservation): JoinedReservation | undefined {
  const slot = slots.find((s) => s.id === r.slotId);
  if (!slot) return undefined;
  const store = stores.find((st) => st.id === slot.storeId)!;
  const client = slot.clientId ? clients.find((c) => c.id === slot.clientId) : undefined;
  const user = users.find((u) => u.id === r.userId)!;
  return { reservation: r, slot, store, client, user };
}
