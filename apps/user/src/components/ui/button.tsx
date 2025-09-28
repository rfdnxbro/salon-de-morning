import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[1.5rem] font-semibold tracking-wide shadow-soft'
    + ' transition-transform transition-shadow duration-200 ease-out focus-visible:outline-none focus-visible:ring-4'
    + ' focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    + ' disabled:pointer-events-none disabled:opacity-60 active:translate-y-[1px]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30',
        secondary:
          'bg-secondary text-secondary-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-secondary/30',
        outline:
          'border-2 border-border bg-transparent text-foreground hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:ring-primary/40',
        ghost: 'bg-transparent text-foreground hover:bg-secondary/40 focus-visible:ring-primary/35',
        link:
          'bg-transparent text-primary underline-offset-4 hover:text-primary/80 hover:underline focus-visible:ring-transparent focus-visible:outline-offset-2',
        destructive:
          'bg-destructive text-destructive-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-destructive/30',
      },
      size: {
        sm: 'min-h-[2.75rem] px-4 text-sm md:text-base',
        md: 'min-h-[3rem] px-6 text-base md:text-lg',
        lg: 'min-h-[3.25rem] px-8 text-lg md:text-xl',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);

Button.displayName = 'Button';
