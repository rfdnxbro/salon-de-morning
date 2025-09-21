import { clients, stores as salonStores, users } from './data';

export interface SalonStylist {
  id: string;
  name: string;
  salonId: string;
  salonName: string;
  role: string;
  status: 'active' | 'inactive' | 'sabbatical';
  certifications: string[];
  createdAt: number;
  updatedAt: number;
}

export interface SalonMenuItem {
  id: string;
  salonId: string;
  salonName: string;
  title: string;
  category: string;
  price: number;
  durationMinutes: number;
  isPublished: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SalonPost {
  id: string;
  title: string;
  audience: '利用者' | '店舗' | '医療機関';
  status: 'draft' | 'scheduled' | 'published';
  summary: string;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
}

const fallbackDate = new Date('2025-09-10T09:00:00+09:00').getTime();
const fallbackSalon = salonStores[0];

export function getSalonName(salonId: string): string {
  const match = salonStores.find((store) => store.id === salonId);
  return match?.name ?? '未登録拠点';
}

export const stylists: SalonStylist[] = [
  {
    id: 'sty_1',
    name: '井上 あかり',
    salonId: fallbackSalon?.id ?? 'st_1',
    salonName: fallbackSalon?.name ?? '銀座サロン',
    role: '正看護師',
    status: 'active',
    certifications: ['正看護師免許', '認知症サポーター研修'],
    createdAt: fallbackDate,
    updatedAt: fallbackDate,
  },
  {
    id: 'sty_2',
    name: '吉田 颯太',
    salonId: salonStores[1]?.id ?? fallbackSalon?.id ?? 'st_1',
    salonName: salonStores[1]?.name ?? fallbackSalon?.name ?? '銀座サロン',
    role: '理学療法士',
    status: 'active',
    certifications: ['理学療法士免許'],
    createdAt: fallbackDate + 24 * 60 * 60 * 1000,
    updatedAt: fallbackDate + 24 * 60 * 60 * 1000,
  },
  {
    id: 'sty_3',
    name: '渡辺 美咲',
    salonId: salonStores[2]?.id ?? fallbackSalon?.id ?? 'st_1',
    salonName: salonStores[2]?.name ?? fallbackSalon?.name ?? '銀座サロン',
    role: '管理栄養士',
    status: 'sabbatical',
    certifications: ['管理栄養士'],
    createdAt: fallbackDate + 2 * 24 * 60 * 60 * 1000,
    updatedAt: fallbackDate + 30 * 24 * 60 * 60 * 1000,
  },
];

export const menus: SalonMenuItem[] = [
  {
    id: 'menu_1',
    salonId: fallbackSalon?.id ?? 'st_1',
    salonName: fallbackSalon?.name ?? '銀座サロン',
    title: '朝の健康チェック',
    category: '健康相談',
    price: 0,
    durationMinutes: 15,
    isPublished: true,
    createdAt: fallbackDate,
    updatedAt: fallbackDate,
  },
  {
    id: 'menu_2',
    salonId: salonStores[1]?.id ?? fallbackSalon?.id ?? 'st_1',
    salonName: salonStores[1]?.name ?? fallbackSalon?.name ?? '銀座サロン',
    title: 'オンライン診療サポート',
    category: '遠隔医療',
    price: 1500,
    durationMinutes: 30,
    isPublished: true,
    createdAt: fallbackDate + 3 * 24 * 60 * 60 * 1000,
    updatedAt: fallbackDate + 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'menu_3',
    salonId: salonStores[2]?.id ?? fallbackSalon?.id ?? 'st_1',
    salonName: salonStores[2]?.name ?? fallbackSalon?.name ?? '銀座サロン',
    title: '見守り訪問プラン',
    category: '生活支援',
    price: 3000,
    durationMinutes: 45,
    isPublished: false,
    createdAt: fallbackDate + 5 * 24 * 60 * 60 * 1000,
    updatedAt: fallbackDate + 10 * 24 * 60 * 60 * 1000,
  },
];

export const posts: SalonPost[] = [
  {
    id: 'post_1',
    title: '9月のサロン開催予定',
    audience: '利用者',
    status: 'published',
    summary: '津島市内3拠点の巡回スケジュールを公開しました。',
    publishedAt: fallbackDate - 5 * 24 * 60 * 60 * 1000,
    createdAt: fallbackDate - 7 * 24 * 60 * 60 * 1000,
    updatedAt: fallbackDate - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'post_2',
    title: 'カフェ事業者向け説明会のご案内',
    audience: '店舗',
    status: 'scheduled',
    summary: '新規参画希望者向けのオンライン説明会を実施します。',
    publishedAt: fallbackDate + 2 * 24 * 60 * 60 * 1000,
    createdAt: fallbackDate,
    updatedAt: fallbackDate,
  },
  {
    id: 'post_3',
    title: '訪問看護連携アンケートのお願い',
    audience: '医療機関',
    status: 'draft',
    summary: '今後の訪問看護連携強化に向けたアンケートご協力のお願いです。',
    createdAt: fallbackDate + 24 * 60 * 60 * 1000,
    updatedAt: fallbackDate + 24 * 60 * 60 * 1000,
  },
];

const timestamps = [
  ...users.map((user) => user.updatedAt),
  ...salonStores.map((salon) => salon.updatedAt),
  ...stylists.map((stylist) => stylist.updatedAt),
  ...menus.map((menu) => menu.updatedAt),
  ...posts.map((post) => post.updatedAt),
];

export const salonDataLastUpdatedAt =
  timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
