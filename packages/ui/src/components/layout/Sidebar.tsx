import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAtom, useSetAtom } from 'jotai';
import {
  Activity,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  CirclePlus,
  Compass,
  FileText,
  FlaskConical,
  GitCompareArrows,
  LayoutDashboard,
  Settings,
  Trash2,
  UserRound,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  sessionsAtom,
  activeSessionIdAtom,
  createSessionAtom,
  deleteSessionAtom,
  navSectionAtom,
  type NavSection,
} from '../../atoms';
import { useFinagentClient } from '../../client';
import { Watchlist } from '../stock/Watchlist';
import { FolioMark } from './FolioMark';

type SidebarItem = { key: NavSection; labelKey: string; icon: LucideIcon };

const SIDEBAR_ITEMS: SidebarItem[] = [
  { key: 'today', labelKey: 'today', icon: LayoutDashboard },
  { key: 'discover', labelKey: 'discover', icon: Compass },
  { key: 'watchlist', labelKey: 'workspace', icon: ChartNoAxesCombined },
  { key: 'portfolio', labelKey: 'portfolio', icon: BriefcaseBusiness },
  { key: 'compare', labelKey: 'compare', icon: GitCompareArrows },
  { key: 'alerts', labelKey: 'alerts', icon: Bell },
  { key: 'research', labelKey: 'research', icon: BookOpen },
  { key: 'thesis', labelKey: 'thesis', icon: FileText },
  { key: 'skills', labelKey: 'skills', icon: Zap },
  { key: 'evaluation', labelKey: 'evaluation', icon: FlaskConical },
  { key: 'events', labelKey: 'events', icon: CalendarDays },
];

const SidebarNavButton: React.FC<{
  item: SidebarItem;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ item, label, active, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`folio-sidebar-nav-item ${active ? 'folio-sidebar-nav-item--active' : ''}`}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2 : 1.7} />
      <span className="folio-sidebar-nav-label">{label}</span>
      {item.key === 'alerts' && <span className="folio-sidebar-alert-dot" aria-hidden="true" />}
      {active && <span className="folio-sidebar-fold" aria-hidden="true" />}
    </button>
  );
};

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const client = useFinagentClient();
  const [sessions] = useAtom(sessionsAtom);
  const [activeSessionId, setActiveSessionId] = useAtom(activeSessionIdAtom);
  const createSession = useSetAtom(createSessionAtom);
  const deleteSession = useSetAtom(deleteSessionAtom);
  const [navSection, setNavSection] = useAtom(navSectionAtom);
  const showWorkspaceContext = navSection === 'sessions' || navSection === 'watchlist';

  return (
    <aside className="folio-sidebar h-full w-full overflow-hidden" data-testid="sidebar">
      <div className="folio-sidebar-content flex h-full min-w-0 flex-col px-3 py-5">
        <div className="folio-sidebar-brand mb-5 flex items-center gap-3 px-2">
          <FolioMark className="folio-brand-mark h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <div className="folio-sidebar-brand-name">Folio</div>
            <div className="folio-sidebar-brand-kicker">{t('navigation.institutionalResearch')}</div>
          </div>
        </div>

        <button
          type="button"
          aria-label={t('navigation.newSession')}
          onClick={() => void createSession(client)}
          className="folio-sidebar-new-analysis mb-5 flex h-9 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] px-3 text-[14px] font-semibold"
        >
          <CirclePlus className="h-4 w-4" />
          <span>{t('navigation.newSession')}</span>
        </button>

        <nav aria-label={t('navigation.globalNavAria')} className="folio-sidebar-nav flex min-h-0 flex-1 flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => (
            <SidebarNavButton
              key={item.key}
              item={item}
              label={t(`navigation.${item.labelKey}`)}
              active={navSection === item.key}
              onClick={() => setNavSection(item.key)}
            />
          ))}
          <SidebarNavButton
            item={{ key: 'profile', labelKey: 'profile', icon: UserRound }}
            label={t('navigation.profile')}
            active={navSection === 'profile'}
            onClick={() => setNavSection('profile')}
          />
        </nav>

        {showWorkspaceContext && (
          <section className="folio-sidebar-context mt-4 min-h-0 border-t border-border pt-3">
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="folio-sidebar-section-label">{t('navigation.sessions')}</span>
              <span className="tnum text-[12px] text-foreground-muted">{sessions.length}</span>
            </div>
            <div className="max-h-28 overflow-y-auto">
              {sessions.map((session) => (
                <div key={session.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => setActiveSessionId(session.id)}
                    className={`folio-sidebar-session flex w-full items-center rounded-[var(--radius-control)] px-2 py-1.5 pr-7 text-left text-[12px] transition-smooth ${session.id === activeSessionId ? 'bg-surface-hover text-foreground' : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground'}`}
                  >
                    <span className="min-w-0 truncate">{session.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => { event.stopPropagation(); void deleteSession(client, session.id); }}
                    aria-label={t('navigation.deleteSession', { title: session.title })}
                    className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[var(--radius-control)] text-foreground-muted opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-smooth"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {sessions.length === 0 && <div className="px-2 py-2 text-[12px] text-foreground-muted">{t('navigation.noSessions')}</div>}
            </div>
            <button type="button" onClick={() => setNavSection('watchlist')} className="folio-sidebar-context-heading mt-3 flex w-full items-center gap-2 px-2 text-left">
              <Activity className="h-3.5 w-3.5" />
              <span>{t('navigation.watchlist')}</span>
            </button>
            <div className="mt-1 max-h-28 overflow-y-auto">
              <Watchlist showHeader={false} />
            </div>
          </section>
        )}

        <div className="folio-sidebar-footer mt-auto border-t border-border pt-3">
          <SidebarNavButton
            item={{ key: 'settings', labelKey: 'settings', icon: Settings }}
            label={t('navigation.settings')}
            active={navSection === 'settings'}
            onClick={() => setNavSection('settings')}
          />
          <div className="folio-sidebar-support flex items-center gap-2 px-3 py-2 text-[12px] text-foreground-muted">
            <CircleHelp className="h-4 w-4" />
            <span>{t('navigation.support')}</span>
          </div>
        </div>
      </div>

    </aside>
  );
};
