const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function normalize(value: number | Date): number {
  return typeof value === 'number' ? value : value.getTime();
}

export function formatDateTime(value: number | Date): string {
  return dateTimeFormatter.format(normalize(value));
}

export function formatDate(value: number | Date): string {
  return dateFormatter.format(normalize(value));
}

