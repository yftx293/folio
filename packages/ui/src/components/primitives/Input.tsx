import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground-muted">
            {label}
          </label>
        )}
        <input
          className={cn(
            "folio-input h-9 rounded-[var(--radius-control)] border border-input bg-surface px-3 py-2 text-[14px] text-foreground placeholder:text-foreground-subtle",
            "hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-smooth",
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-sm text-destructive">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
