import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => <SelectPrimitive.Trigger ref={ref} className={cn('folio-select-trigger flex h-9 w-full items-center justify-between gap-2 rounded-[var(--radius-control)] border border-input bg-surface px-3 text-[14px] text-foreground transition-smooth hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}>{children}<ChevronDown className="h-3.5 w-3.5 text-foreground-muted" /></SelectPrimitive.Trigger>);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => <SelectPrimitive.Portal><SelectPrimitive.Content ref={ref} position={position} className={cn('z-(--z-index-dropdown) min-w-[8rem] overflow-hidden rounded-[var(--radius-panel)] border border-border bg-surface p-1 text-foreground shadow-[var(--shadow-popover)]', className)} {...props}><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => <SelectPrimitive.Item ref={ref} className={cn('folio-select-item relative flex w-full cursor-default select-none items-center rounded-[var(--radius-control)] py-1.5 pl-7 pr-2 text-[14px] outline-none transition-smooth data-[highlighted]:bg-surface-hover data-[highlighted]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-45', className)} {...props}><span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"><SelectPrimitive.ItemIndicator><Check className="h-3.5 w-3.5" /></SelectPrimitive.ItemIndicator></span><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>);
SelectItem.displayName = SelectPrimitive.Item.displayName;
