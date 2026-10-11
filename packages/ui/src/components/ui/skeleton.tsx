import * as React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('folio-skeleton animate-pulse rounded-[var(--radius-control)] bg-foreground/8', className)} {...props} />;
}
