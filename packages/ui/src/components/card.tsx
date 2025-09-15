/// <reference types="react" />
type DivProps = React.HTMLAttributes<HTMLDivElement>;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Card = ({ className, ...props }: DivProps) => (
  <div
    className={cx('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: DivProps) => (
  <div className={cx('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: DivProps) => (
  <h3
    className={cx('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }: DivProps) => (
  <p className={cx('text-sm text-muted-foreground', className)} {...props} />
);

export const CardContent = ({ className, ...props }: DivProps) => (
  <div className={cx('p-6 pt-0', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: DivProps) => (
  <div className={cx('flex items-center p-6 pt-0', className)} {...props} />
);
