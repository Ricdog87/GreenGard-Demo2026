import * as React from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'bronze' | 'outline' | 'mist' }) {
  const styles = {
    default: 'bg-forest text-linen',
    bronze: 'bg-bronze text-linen',
    outline: 'border border-ink/20 text-ink',
    mist: 'bg-mist text-ink',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex items-center font-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-1',
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
