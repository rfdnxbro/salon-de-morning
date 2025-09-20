import React from 'react';

export function Logo() {
  const name = import.meta.env.VITE_SITE_NAME ?? 'Salon de Morning';
  const sub = import.meta.env.VITE_BRAND_SUBLABEL_USER ?? '一般ユーザー';
  return (
    <div className="inline-flex flex-col gap-1 select-none text-left md:flex-row md:items-end md:gap-3">
      <span className="text-3xl font-extrabold tracking-tight text-primary drop-shadow-sm md:text-4xl">
        {name}
      </span>
      <span className="rounded-full bg-secondary/60 px-3 py-1 text-sm font-semibold text-secondary-foreground md:text-base">
        {sub}
      </span>
    </div>
  );
}
