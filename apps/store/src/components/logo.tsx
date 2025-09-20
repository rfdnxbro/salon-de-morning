import React from 'react';

export function Logo() {
  const name = import.meta.env.VITE_SITE_NAME ?? 'Salon de Morning';
  const sub = import.meta.env.VITE_BRAND_SUBLABEL_STORE ?? '店舗スタッフ';
  return (
    <div className="inline-flex flex-col gap-1 select-none text-left md:flex-row md:items-end md:gap-2.5">
      <span className="text-2xl font-bold tracking-tight text-primary md:text-3xl">{name}</span>
      <span className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-semibold text-secondary-foreground md:text-sm">
        {sub}
      </span>
    </div>
  );
}
