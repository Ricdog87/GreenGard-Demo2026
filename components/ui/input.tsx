import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-none border-b border-mist bg-transparent px-1 py-2 text-sm placeholder:text-ink/40 focus-visible:outline-none focus-visible:border-forest disabled:opacity-50 transition-colors',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
