'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-forest text-linen hover:bg-ink rounded-full',
        accent:
          'bg-bronze text-linen hover:bg-[#9e6228] rounded-full',
        outline:
          'border border-ink/15 text-ink hover:border-ink/40 bg-transparent rounded-full',
        ghost:
          'text-ink hover:bg-linen rounded-full',
        link:
          'text-ink underline underline-offset-4 decoration-mist hover:decoration-ink p-0 h-auto',
        destructive:
          'bg-red-700 text-white hover:bg-red-800 rounded-full',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-6',
        lg: 'h-12 px-7 text-[15px]',
        xl: 'h-14 px-9 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
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
      <Comp
        data-cursor="hover"
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
