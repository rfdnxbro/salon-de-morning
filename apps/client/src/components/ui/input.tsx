/// <reference types="react" />

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Input = ({ className, type = 'text', ...props }: InputProps) => (
  <input
    type={type}
    className={cx(
      'flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm font-medium',
      'transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
      className,
    )}
    {...props}
  />
);
