import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../primitives/Dialog';
import { AboutView } from '../about/AboutView';
import { FolioMark } from './FolioMark';

export const TitleBar: React.FC = () => {
  const { t } = useTranslation();
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="mac-titlebar z-titlebar flex items-center justify-between">
      {/* BrowserWindow owns the native macOS traffic lights. Reserve their area
          instead of drawing a second set inside the renderer. */}
      <div className="h-full w-20 shrink-0" aria-hidden="true" />

      <div
        data-tauri-drag-region
        className="flex flex-1 items-center justify-center self-stretch"
      >
        <div className="flex items-center gap-2">
          <FolioMark className="folio-brand-mark h-5 w-5 text-accent" />
          <span className="text-[14px] font-semibold tracking-tight text-foreground">Folio</span>
        </div>
      </div>

      <div className="flex h-full w-[4.8rem] items-center justify-end pr-3">
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          aria-label={t('navigation.aboutAria')}
          className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-control)] text-foreground-muted transition-smooth hover:bg-surface-hover hover:text-foreground"
        >
          <Info className="h-3.5 w-3.5" strokeWidth={1.7} />
        </button>
      </div>

      <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)} title={t('navigation.aboutTitle')}>
        <AboutView />
      </Dialog>
    </header>
  );
};
