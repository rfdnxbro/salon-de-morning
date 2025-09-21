import {
  joinReservation,
  reservations,
  slots,
  stores,
  type JoinedReservation,
  type ReservationStatus,
  type Slot,
  type Store,
} from 'mocks';

export interface StoreSummary {
  store: Store;
  upcomingSlots: Slot[];
  totalUpcoming: number;
  nextSlot?: Slot;
  maxCapacity: number;
}

export type ReservationTone = 'positive' | 'attention' | 'neutral';

export interface ReservationSummary {
  id: string;
  startAt: number;
  endAt: number;
  status: ReservationStatus;
  statusLabel: string;
  tone: ReservationTone;
  storeName: string;
  userName: string;
  clientName?: string;
  slotTitle?: string;
  note?: string;
  isUpcoming: boolean;
}

export interface DashboardStats {
  totalSalons: number;
  activeSalons: number;
  upcomingSlots: number;
  upcomingReservations: number;
  nextSlotStartAt?: number;
  nextSlotStoreName?: string;
}

export interface UserDataBundle {
  storeSummaries: StoreSummary[];
  reservationSummaries: ReservationSummary[];
  stats: DashboardStats;
  lastUpdatedAt: number;
  now: number;
}

const statusLabelMap: Record<ReservationStatus, { label: string; tone: ReservationTone }> = {
  draft: { label: '調整中', tone: 'attention' },
  confirmed: { label: '確定済み', tone: 'positive' },
  cancelled: { label: 'キャンセル', tone: 'neutral' },
};

function isUpcomingSlot(slot: Slot, referenceTime: number): boolean {
  return slot.status === 'active' && slot.endAt >= referenceTime;
}

function buildStoreSummariesInternal(referenceTime: number): StoreSummary[] {
  return stores
    .map((store) => {
      const upcoming = slots
        .filter((slot) => slot.storeId === store.id)
        .filter((slot) => isUpcomingSlot(slot, referenceTime))
        .sort((a, b) => a.startAt - b.startAt);
      const maxCapacity = upcoming.reduce((max, slot) => Math.max(max, slot.capacity), 0);
      return {
        store,
        upcomingSlots: upcoming,
        totalUpcoming: upcoming.length,
        nextSlot: upcoming[0],
        maxCapacity,
      } satisfies StoreSummary;
    })
    .sort((a, b) => {
      if (a.nextSlot && b.nextSlot) return a.nextSlot.startAt - b.nextSlot.startAt;
      if (a.nextSlot) return -1;
      if (b.nextSlot) return 1;
      return a.store.name.localeCompare(b.store.name, 'ja');
    });
}

function buildReservationSummariesInternal(referenceTime: number): ReservationSummary[] {
  return reservations
    .map((reservation) => joinReservation(reservation))
    .filter((joined): joined is JoinedReservation => Boolean(joined))
    .map((joined) => {
      const { reservation, slot, store, client, user } = joined;
      const statusMeta = statusLabelMap[reservation.status];
      const isUpcoming = slot.endAt >= referenceTime && reservation.status !== 'cancelled';
      return {
        id: reservation.id,
        startAt: slot.startAt,
        endAt: slot.endAt,
        status: reservation.status,
        statusLabel: statusMeta.label,
        tone: statusMeta.tone,
        storeName: store.name,
        userName: user.name,
        clientName: client?.name,
        slotTitle: slot.title,
        note: reservation.note,
        isUpcoming,
      } satisfies ReservationSummary;
    })
    .sort((a, b) => a.startAt - b.startAt);
}

function createDashboardStatsInternal(
  storeSummaries: StoreSummary[],
  reservationSummaries: ReservationSummary[],
): DashboardStats {
  const activeSalons = storeSummaries.filter((summary) => summary.totalUpcoming > 0);
  const upcomingSlotPairs = activeSalons.flatMap((summary) =>
    summary.upcomingSlots.map((slot) => ({ slot, storeName: summary.store.name })),
  );
  upcomingSlotPairs.sort((a, b) => a.slot.startAt - b.slot.startAt);
  const nextSlot = upcomingSlotPairs[0];
  const upcomingReservations = reservationSummaries.filter(
    (reservation) => reservation.isUpcoming && reservation.status !== 'cancelled',
  );

  return {
    totalSalons: stores.length,
    activeSalons: activeSalons.length,
    upcomingSlots: upcomingSlotPairs.length,
    upcomingReservations: upcomingReservations.length,
    nextSlotStartAt: nextSlot?.slot.startAt,
    nextSlotStoreName: nextSlot?.storeName,
  } satisfies DashboardStats;
}

function calcLastUpdatedAt(): number {
  const timestamps: number[] = [
    ...stores.map((store) => store.updatedAt),
    ...slots.map((slot) => slot.updatedAt),
    ...reservations.map((reservation) => reservation.updatedAt),
  ];
  return timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
}

export function loadUserData(referenceTime: number = Date.now()): UserDataBundle {
  const storeSummaries = buildStoreSummariesInternal(referenceTime);
  const reservationSummaries = buildReservationSummariesInternal(referenceTime);
  const stats = createDashboardStatsInternal(storeSummaries, reservationSummaries);
  const lastUpdatedAt = calcLastUpdatedAt();
  return {
    storeSummaries,
    reservationSummaries,
    stats,
    lastUpdatedAt,
    now: referenceTime,
  } satisfies UserDataBundle;
}

export type { Store } from 'mocks';
