/// <reference types="react" />

type DivProps = React.HTMLAttributes<HTMLDivElement>;

type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

const styles: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground shadow-sm shadow-primary/40',
  secondary: 'bg-secondary text-secondary-foreground shadow-sm shadow-secondary/30',
  destructive: 'bg-destructive text-destructive-foreground shadow-sm shadow-destructive/40',
  outline: 'border border-border text-foreground',
};

export interface BadgeProps extends DivProps {
  variant?: Variant;
  children?: React.ReactNode;
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
  <div
    className={cx(
      'inline-flex items-center justify-center gap-1 rounded-full px-3.5 py-1 text-sm font-semibold tracking-tight',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'ring-offset-background min-h-[2.25rem]',
      styles[variant],
      className,
    )}
    {...props}
  />
);
