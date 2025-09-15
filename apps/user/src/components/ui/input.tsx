/// <reference types="react" />

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Input = ({ className, type = 'text', ...props }: InputProps) => (
  <input
    type={type}
    className={cx(
      'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm',
      'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
);

