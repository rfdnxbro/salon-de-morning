/// <reference types="react" />

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
type THProps = React.ThHTMLAttributes<HTMLTableCellElement>;
type TRProps = React.HTMLAttributes<HTMLTableRowElement>;
type TDProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const Table = (props: TableProps) => (
  <table className="w-full caption-bottom text-sm" {...props} />
);
export const TableHeader = (props: DivProps) => (
  <thead className="[&_tr]:border-b" {...props} />
);
export const TableBody = (props: DivProps) => (
  <tbody className="[&_tr:last-child]:border-0" {...props} />
);
export const TableFooter = (props: DivProps) => (
  <tfoot className="bg-muted/50 font-medium" {...props} />
);
export const TableRow = (props: TRProps) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props} />
);
export const TableHead = (props: THProps) => (
  <th
    className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
    {...props}
  />
);
export const TableCell = (props: TDProps) => (
  <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0" {...props} />
);

