export type ID = string;

// 監査フィールドは全テーブルに持つ
export interface Audit {
  createdAt: number; // epoch(ms)
  updatedAt: number; // epoch(ms)
}

export interface Store extends Audit {
  id: ID;
  name: string;
  code: string; // unique
  address: string;
}

export interface Client extends Audit {
  id: ID;
  name: string;
  code: string; // unique
  address: string;
}

export interface User extends Audit {
  id: ID;
  name: string; // MVPはnameのみ必須
}

export type ReservationStatus = 'draft' | 'confirmed' | 'cancelled';

export interface Slot extends Audit {
  id: ID;
  storeId: ID; // 必須
  clientId?: ID; // 任意
  startAt: number; // epoch(ms) JST表示
  endAt: number; // epoch(ms)
  capacity: number; // >=1
  status: 'active' | 'cancelled';
  title?: string;
  note?: string;
}

export interface Reservation extends Audit {
  id: ID;
  slotId: ID; // スロット参照（冗長なstoreId/clientIdは持たない）
  userId: ID; // 予約情報はuserId必須
  status: ReservationStatus;
  note?: string;
}

export interface JoinedReservation {
  reservation: Reservation;
  slot: Slot;
  store: Store;
  client?: Client;
  user: User;
}

