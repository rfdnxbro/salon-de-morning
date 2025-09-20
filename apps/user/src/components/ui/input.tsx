/// <reference types="react" />

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Input = ({ className, type = 'text', ...props }: InputProps) => (
  <input
    type={type}
    className={cx(
      'block w-full min-h-[3rem] rounded-xl border-2 border-input/80 bg-background px-4 py-2.5 text-base font-medium',
      'transition-all duration-150 ease-out shadow-sm shadow-primary/5 placeholder:text-muted-foreground/80',
      'ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium',
      'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-60',
      className,
    )}
    {...props}
  />
);
