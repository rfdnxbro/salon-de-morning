import { clients, joinReservation, reservations, stores, users } from 'mocks';
import type { Client, Store, User } from 'mocks';

export type JoinedReservation = NonNullable<ReturnType<typeof joinReservation>>;
export type ClientJoinedReservation = JoinedReservation & { client: NonNullable<JoinedReservation['client']> };

function isClientJoinedReservation(value: JoinedReservation | undefined): value is ClientJoinedReservation {
  return Boolean(value?.client);
}

export function getJoinedClientReservations(): ClientJoinedReservation[] {
  return reservations
    .map(joinReservation)
    .filter((item): item is ClientJoinedReservation => isClientJoinedReservation(item));
}

export interface ReservationStats {
  total: number;
  confirmed: number;
  upcoming: number;
  uniqueClients: number;
}

export function calculateReservationStats(
  data: ClientJoinedReservation[],
  referenceTime: number = Date.now(),
): ReservationStats {
  const total = data.length;
  const confirmed = data.filter(({ reservation }) => reservation.status === 'confirmed');
  const upcoming = confirmed.filter(({ slot }) => slot.startAt > referenceTime).length;
  const uniqueClients = new Set(data.map(({ client }) => client.id)).size;

  return {
    total,
    confirmed: confirmed.length,
    upcoming,
    uniqueClients,
  };
}

export interface UserSummary {
  id: User['id'];
  name: User['name'];
  totalReservations: number;
  latestReservationAt?: number;
}

export function buildUserSummaries(data: ClientJoinedReservation[]): UserSummary[] {
  const map = new Map<User['id'], UserSummary>();

  for (const item of data) {
    const current = map.get(item.user.id) ?? {
      id: item.user.id,
      name: item.user.name,
      totalReservations: 0,
      latestReservationAt: undefined,
    };

    current.totalReservations += 1;
    const latest = current.latestReservationAt ?? 0;
    current.latestReservationAt = Math.max(latest, item.slot.startAt);
    map.set(item.user.id, current);
  }

  return Array.from(map.values()).sort((a, b) => {
    const latestA = a.latestReservationAt ?? 0;
    const latestB = b.latestReservationAt ?? 0;
    if (latestA !== latestB) return latestB - latestA;
    return a.name.localeCompare(b.name);
  });
}

export interface SalonSummary {
  id: Store['id'];
  name: Store['name'];
  address: Store['address'];
  reservationCount: number;
  nextReservationAt?: number;
  lastReservationAt?: number;
}

export function buildSalonSummaries(
  data: ClientJoinedReservation[],
  referenceTime: number = Date.now(),
): SalonSummary[] {
  interface MutableSummary extends SalonSummary {}

  const map = new Map<Store['id'], MutableSummary>();

  for (const item of data) {
    const existing = map.get(item.store.id) ?? {
      id: item.store.id,
      name: item.store.name,
      address: item.store.address,
      reservationCount: 0,
      nextReservationAt: undefined,
      lastReservationAt: undefined,
    };

    existing.reservationCount += 1;

    if (item.slot.startAt >= referenceTime) {
      existing.nextReservationAt = existing.nextReservationAt
        ? Math.min(existing.nextReservationAt, item.slot.startAt)
        : item.slot.startAt;
    }

    if (item.slot.startAt < referenceTime) {
      existing.lastReservationAt = existing.lastReservationAt
        ? Math.max(existing.lastReservationAt, item.slot.startAt)
        : item.slot.startAt;
    }

    map.set(item.store.id, existing);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.reservationCount !== b.reservationCount) {
      return b.reservationCount - a.reservationCount;
    }
    return a.name.localeCompare(b.name);
  });
}

export const clientDirectory: Client[] = clients;
export const storeDirectory: Store[] = stores;
export const userDirectory: User[] = users;
