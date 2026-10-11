import * as React from 'react';
import { cn } from '../../lib/utils';

export function StatusDot({ tone = 'neutral', label, className }: { tone?: 'positive' | 'negative' | 'warning' | 'info' | 'neutral'; label?: string; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1.5 text-[12px] leading-5 text-foreground-muted', className)}><span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', tone === 'positive' && 'bg-success', tone === 'negative' && 'bg-destructive', tone === 'warning' && 'bg-warning', tone === 'info' && 'bg-info', tone === 'neutral' && 'bg-foreground-subtle')} />{label}</span>;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <div className="flex min-h-28 flex-col items-center justify-center px-4 py-8 text-center"><p className="text-[14px] font-medium text-foreground">{title}</p>{description && <p className="mt-1 max-w-sm text-[12px] leading-5 text-foreground-muted">{description}</p>}{action && <div className="mt-3">{action}</div>}</div>;
}

export function ErrorState({ title = 'Something went wrong', description, action }: { title?: string; description?: string; action?: React.ReactNode }) {
  return <div role="alert" className="flex min-h-28 flex-col items-center justify-center px-4 py-8 text-center"><p className="text-[14px] font-medium text-destructive">{title}</p>{description && <p className="mt-1 max-w-sm text-[12px] leading-5 text-foreground-muted">{description}</p>}{action && <div className="mt-3">{action}</div>}</div>;
}
