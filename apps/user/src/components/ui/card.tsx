/// <reference types="react" />
type DivProps = React.HTMLAttributes<HTMLDivElement>;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Card = ({ className, ...props }: DivProps) => (
  <div
    className={cx(
      'rounded-2xl border border-border/70 bg-card text-card-foreground shadow-md shadow-primary/10',
      'transition-shadow focus-within:shadow-lg focus-within:shadow-primary/20',
      className,
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: DivProps) => (
  <div className={cx('flex flex-col gap-2 px-6 py-6 md:px-8 md:py-7', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: DivProps) => (
  <h3
    className={cx('text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl', className)}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }: DivProps) => (
  <p
    className={cx('text-base leading-relaxed text-muted-foreground md:text-lg', className)}
    {...props}
  />
);

export const CardContent = ({ className, ...props }: DivProps) => (
  <div className={cx('px-6 pb-6 pt-0 md:px-8', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: DivProps) => (
  <div className={cx('flex items-center gap-3 px-6 pb-6 pt-0 md:px-8', className)} {...props} />
);
