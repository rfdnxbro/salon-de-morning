import React from 'react';

export function Logo() {
  const name = import.meta.env.VITE_SITE_NAME ?? 'Salon de Morning';
  const sub = import.meta.env.VITE_BRAND_SUBLABEL_CLIENT ?? 'クライアント';
  return (
    <div className="inline-flex items-baseline gap-2 select-none">
      <span className="text-2xl font-extrabold tracking-tight">{name}</span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </div>
  );
}

