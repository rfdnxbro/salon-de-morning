import React from 'react';

export function Logo() {
  const name = import.meta.env.VITE_SITE_NAME ?? 'Salon de Morning';
  const sub = import.meta.env.VITE_BRAND_SUBLABEL_USER ?? '利用者向けポータル';
  return (
    <div
      className="inline-flex flex-col gap-3 select-none text-left"
      role="img"
      aria-label={`${name} ${sub}`}
    >
      <span className="text-4xl font-black tracking-tight text-primary drop-shadow-sm lg:text-5xl">
        {name}
      </span>
      <div className="flex flex-col gap-2 text-left sm:flex-row sm:items-center sm:gap-3">
        <span className="w-fit rounded-full bg-secondary/70 px-4 py-1 text-sm font-semibold text-secondary-foreground lg:text-base">
          {sub}
        </span>
        <span className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground/90 lg:text-base">
          朝の安心を、地域の力で
        </span>
      </div>
    </div>
  );
}
