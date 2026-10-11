import React from 'react';
import { FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Small "Sample data" chip. Rendered next to any surface whose content comes
 * from the built-in demo dataset (`src/demo/demoData.ts`) instead of a live
 * market-data provider or LLM runtime, so sample content is never mistaken
 * for real data. The tooltip carries the full explanation.
 */
export const DemoBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation();
  return (
    <span
      data-testid="demo-badge"
      title={t('demo.hint')}
      className={`inline-flex shrink-0 cursor-help items-center gap-1 rounded-full border border-warning/35 bg-warning/10 px-2 py-0.5 text-[12px] font-medium leading-4 text-warning-foreground ${className}`}
    >
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      {t('demo.badge')}
    </span>
  );
};
