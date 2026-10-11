import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, LoaderCircle } from 'lucide-react';
import { useAtom, useSetAtom } from 'jotai';
import type { LlmModel } from '@finagent/core';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { groupModelsByProvider, hydrateLlmAtom, llmModelsAtom, llmStateAtom, refreshLlmModelsAtom, setLlmModelAtom } from '../../atoms';
import { useFinagentClient } from '../../client';

interface ModelSelectorProps { disabled?: boolean; }

/** Registry-driven model picker. Runtime state stays the source of truth. */
export const ModelSelector: React.FC<ModelSelectorProps> = ({ disabled = false }) => {
  const { t } = useTranslation();
  const client = useFinagentClient();
  const [state] = useAtom(llmStateAtom);
  const [models] = useAtom(llmModelsAtom);
  const hydrate = useSetAtom(hydrateLlmAtom);
  const refreshModels = useSetAtom(refreshLlmModelsAtom);
  const setModel = useSetAtom(setLlmModelAtom);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void hydrate(client); void refreshModels(client); }, [client, hydrate, refreshModels]);
  const current = state.model;
  const currentLabel = state.loading ? t('agent.model.loading') : current ? current.name || `${current.provider}/${current.id}` : t('agent.model.select');
  const groups = groupModelsByProvider(models);

  const handleSelect = async (provider: string, modelId: string) => {
    setBusy(true); setError(null);
    const result = await setModel({ client, provider, modelId });
    setBusy(false);
    if (!result.ok) setError(result.error.message);
    else setOpen(false);
  };

  return <div className="folio-model-selector min-w-0">
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button type="button" disabled={disabled || busy} aria-label={t('agent.model.label')} className="flex min-h-8 max-w-[190px] items-center gap-1.5 rounded-[var(--radius-control)] border border-input bg-surface px-2.5 py-1.5 text-[12px] font-medium text-foreground transition-smooth hover:bg-surface-hover hover:border-border-strong disabled:pointer-events-none disabled:opacity-45">
          {busy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin text-accent" /> : null}<span className="min-w-0 truncate">{currentLabel}</span><ChevronDown className="h-3.5 w-3.5 shrink-0 text-foreground-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 w-64 overflow-y-auto">
        {groups.length === 0 && !state.loading ? <div className="px-3 py-4 text-center text-[12px] text-foreground-muted">{t('agent.model.none')}</div> : groups.map((group) => <React.Fragment key={group.provider}>
          <DropdownMenuLabel>{group.provider}</DropdownMenuLabel>
          {group.models.map((model: LlmModel) => {
            const isCurrent = current?.provider === model.provider && current.id === model.id;
            return <DropdownMenuItem key={`${model.provider}/${model.id}`} onSelect={() => void handleSelect(model.provider, model.id)} className={isCurrent ? 'text-foreground' : 'text-foreground-muted'}><span className="min-w-0 flex-1 truncate">{model.name || model.id}</span>{isCurrent && <Check className="h-3.5 w-3.5 text-accent" />}</DropdownMenuItem>;
          })}
        </React.Fragment>)}
      </DropdownMenuContent>
    </DropdownMenu>
    {error && <div className="mt-1 break-words text-[12px] text-destructive">{error}</div>}
    {!error && state.error && <div className="mt-1 break-words text-[12px] text-foreground-muted">{state.error}</div>}
  </div>;
};
