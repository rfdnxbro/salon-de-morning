/// <reference types="react" />

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="relative -mx-1 overflow-x-auto px-1">
    <table className={cx('min-w-full border-collapse text-sm text-foreground/90', className)} {...props} />
  </div>
);

export const TableHeader = (
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) => <thead {...props} className={cx('bg-muted/60 text-xs font-semibold uppercase text-muted-foreground', props.className)} />;

export const TableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} className={cx('divide-y divide-border/70', props.className)} />
);

export const TableFooter = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot {...props} className={cx('bg-muted/50 text-sm font-medium text-muted-foreground', props.className)} />
);

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cx('transition-colors hover:bg-muted/50', className)} {...props} />
);

export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cx('h-11 px-3 text-left align-middle', className)} {...props} />
);

export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cx('px-3 py-2 align-middle text-sm', className)} {...props} />
);
