'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@blms/ui';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    mode?: 'light' | 'dark';
  }
>(({ className, mode = 'dark', ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-5 w-9 md:h-7 md:w-12 shrink-0 cursor-pointer items-center rounded-full border border- border-darkOrange-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-newGray-6 dark:data-[state=checked]:border-black data-[state=checked]:bg-darkOrange-5 dark:data-[state=checked]:bg-primary data-[state=unchecked]:bg-newGray-6 dark:data-[state=unchecked]:bg-black',
      mode === 'dark' && 'dark',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none size-3 block md:size-5 rounded-full bg-darkOrange-5 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 md:data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1 data-[state=checked]:bg-newGray-6 dark:data-[state=checked]:bg-black',
        mode === 'dark' && 'dark',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
