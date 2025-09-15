/// <reference types="react" />
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Label = ({ className, ...props }: LabelProps) => (
  <label
    className={cx(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
    {...props}
  />
);
