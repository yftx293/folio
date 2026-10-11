import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root ref={ref} className={cn('folio-switch peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-input bg-input transition-smooth data-[state=checked]:border-primary data-[state=checked]:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}>
    <SwitchPrimitive.Thumb className="folio-switch-thumb pointer-events-none block h-4 w-4 translate-x-px rounded-full border border-[var(--switch-thumb)] bg-[var(--switch-thumb)] shadow-sm transition-transform duration-(--motion-base) data-[state=checked]:translate-x-[17px] data-[state=checked]:border-primary-foreground data-[state=checked]:bg-primary-foreground" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
