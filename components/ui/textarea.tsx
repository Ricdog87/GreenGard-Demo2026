import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[120px] w-full rounded-none border-b border-mist bg-transparent px-1 py-3 text-sm placeholder:text-ink/40 focus-visible:outline-none focus-visible:border-forest disabled:opacity-50 transition-colors',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
