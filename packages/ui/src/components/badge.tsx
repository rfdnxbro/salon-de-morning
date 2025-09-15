/// <reference types="react" />

type DivProps = React.HTMLAttributes<HTMLDivElement>;

type Variant = 'default' | 'secondary' | 'destructive' | 'outline';

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

const styles: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'text-foreground border',
};

export interface BadgeProps extends DivProps {
  variant?: Variant;
  children?: React.ReactNode;
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
  <div
    className={cx(
      'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
      'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'ring-offset-background',
      styles[variant],
      className,
    )}
    {...props}
  />
);
