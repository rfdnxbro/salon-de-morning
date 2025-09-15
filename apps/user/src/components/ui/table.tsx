/// <reference types="react" />

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="relative w-full overflow-auto">
    <table className={cx('w-full caption-bottom text-sm', className)} {...props} />
  </div>
);

export const TableHeader = (
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) => <thead {...props} className={cx('bg-muted/50', props.className)} />;

export const TableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} className={cx('', props.className)} />
);

export const TableFooter = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot {...props} className={cx('bg-muted/50 font-medium', props.className)} />
);

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cx('border-b transition-colors hover:bg-muted/50', className)} {...props} />
);

export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cx(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground',
      className,
    )}
    {...props}
  />
);

export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cx('p-2 align-middle', className)} {...props} />
);

