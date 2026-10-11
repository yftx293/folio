import React from 'react';
import type { Quote } from '@finagent/core';

interface StockCardProps {
  quote: Quote;
  onClick?: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ quote, onClick }) => {
  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? 'text-[var(--mac-green)]' : 'text-[var(--mac-red)]';
  const bgColor = isPositive ? 'border-positive/25' : 'border-negative/25';

  return (
    <div
      className={`mac-stock-tile cursor-pointer rounded-[var(--radius-panel)] border p-4 transition-smooth hover:bg-surface-hover ${bgColor}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[14px] font-semibold text-foreground-muted">{quote.symbol}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            ${quote.lastPrice.toFixed(2)}
          </div>
        </div>
        <div className={`text-right tabular-nums ${changeColor}`}>
          <div className="font-semibold">
            {isPositive ? '+' : ''}{quote.change.toFixed(2)}
          </div>
          <div className="text-[13px]">
            {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-1 text-[12px] tabular-nums text-foreground-muted">
        <span>Vol: {quote.volume.toLocaleString()}</span>
        <span>H: ${quote.high.toFixed(2)} L: ${quote.low.toFixed(2)}</span>
      </div>
    </div>
  );
};
