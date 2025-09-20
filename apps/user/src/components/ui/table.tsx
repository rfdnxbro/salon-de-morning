/// <reference types="react" />

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="relative -mx-1 overflow-x-auto px-1">
    <table
      className={cx(
        'min-w-full border-separate border-spacing-y-2 text-base leading-relaxed',
        'text-foreground/90',
        className,
      )}
      {...props}
    />
  </div>
);

export const TableHeader = (
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) => (
  <thead
    {...props}
    className={cx('text-left text-sm font-semibold tracking-wide text-muted-foreground/80 md:text-base', props.className)}
  />
);

export const TableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} className={cx('divide-y divide-transparent', props.className)} />
);

export const TableFooter = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot
    {...props}
    className={cx('bg-muted/40 font-semibold text-muted-foreground first:[&_td]:rounded-bl-xl last:[&_td]:rounded-br-xl', props.className)}
  />
);

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cx(
      'rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-150 ease-out',
      'hover:border-primary/40 hover:shadow-md focus-within:border-primary/50 focus-within:shadow-md',
      'focus-within:outline-none focus-within:ring-4 focus-within:ring-primary/25',
      className,
    )}
    {...props}
  />
);

export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cx(
      'px-4 py-3 text-left text-base font-semibold text-muted-foreground/90 first:rounded-l-2xl last:rounded-r-2xl',
      className,
    )}
    {...props}
  />
);

export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cx('px-4 py-3 align-middle text-base text-foreground/90 first:rounded-l-2xl last:rounded-r-2xl', className)}
    {...props}
  />
);
