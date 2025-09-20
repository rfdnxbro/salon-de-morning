/// <reference types="react" />
type DivProps = React.HTMLAttributes<HTMLDivElement>;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Card = ({ className, ...props }: DivProps) => (
  <div
    className={cx('rounded-xl border border-border/80 bg-card text-card-foreground shadow-soft', className)}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: DivProps) => (
  <div className={cx('flex flex-col gap-2 px-5 py-5 md:px-6 md:py-6', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: DivProps) => (
  <h3 className={cx('text-lg font-semibold leading-tight text-foreground md:text-xl', className)} {...props} />
);

export const CardDescription = ({ className, ...props }: DivProps) => (
  <p className={cx('text-sm leading-relaxed text-muted-foreground md:text-base', className)} {...props} />
);

export const CardContent = ({ className, ...props }: DivProps) => (
  <div className={cx('px-5 pb-5 pt-0 md:px-6', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: DivProps) => (
  <div className={cx('flex items-center gap-3 px-5 pb-5 pt-0 md:px-6', className)} {...props} />
);
