'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-px w-full grow overflow-hidden bg-ink/20">
      <SliderPrimitive.Range className="absolute h-full bg-forest" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      data-cursor="hover"
      className="block h-4 w-4 rounded-full bg-forest shadow ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 transition-transform hover:scale-125"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = 'Slider';
