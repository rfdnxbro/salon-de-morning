declare module './data.json' {
  export type RawAudit = { createdAt: string; updatedAt: string };
  export type RawStore = RawAudit & {
    id: string;
    name: string;
    code: string;
    address: string;
  };
  export type RawClient = RawAudit & {
    id: string;
    name: string;
    code: string;
    address: string;
  };
  export type RawUser = RawAudit & {
    id: string;
    name: string;
  };
  export type RawSlot = RawAudit & {
    id: string;
    storeId: string;
    clientId?: string;
    startAt: string;
    endAt: string;
    capacity: number;
    status: 'active' | 'cancelled';
    title?: string;
    note?: string;
  };
  export type RawReservation = RawAudit & {
    id: string;
    slotId: string;
    userId: string;
    status: 'draft' | 'confirmed' | 'cancelled';
    note?: string;
  };
  const value: {
    stores: RawStore[];
    clients: RawClient[];
    users: RawUser[];
    slots: RawSlot[];
    reservations: RawReservation[];
  };
  export default value;
}
