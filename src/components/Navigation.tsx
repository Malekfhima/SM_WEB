import { CalendarCheck2, Clock3, Dumbbell, QrCode, User } from 'lucide-react';
import { NavTab } from '../types/gym';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  upcomingCount: number;
  hasActiveSession: boolean;
  onOpenAccessPass: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string; shortLabel: string; icon: typeof Dumbbell }[] = [
  { id: 'equipements', label: 'Équipements', shortLabel: 'Équipements', icon: Dumbbell },
  { id: 'reservations', label: 'Mes réservations', shortLabel: 'Réservations', icon: CalendarCheck2 },
  { id: 'historique', label: 'Historique', shortLabel: 'Historique', icon: Clock3 },
  { id: 'profil', label: 'Profil', shortLabel: 'Profil', icon: User },
];

export function Navigation({
  activeTab,
  onSelectTab,
  upcomingCount,
  hasActiveSession,
  onOpenAccessPass,
}: NavigationProps) {
  return (
    <>
      {/* Desktop / Tablet Top Bar (3-zone contract) */}
      <header className="hidden md:block sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('equipements')}
            className="font-display text-lg font-bold tracking-tight text-[#00565E] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6F78] rounded-md"
          >
            Smart Gym Connect
          </button>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="flex items-center gap-7" aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`relative py-5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#1F6F78] ${
                    isActive
                      ? 'text-[#1F6F78] font-semibold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'reservations' && upcomingCount > 0 && (
                    <span className="ml-1.5 text-xs tabular-nums text-[#1F6F78] font-semibold">
                      ({upcomingCount})
                    </span>
                  )}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F6F78] rounded-t-full"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={
                hasActiveSession ? () => onSelectTab('reservations') : onOpenAccessPass
              }
              className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] bg-[#1F6F78] text-white text-sm font-semibold hover:bg-[#00565E] active:brightness-90 transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6F78]"
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span>{hasActiveSession ? 'Séance en cours' : 'Badge NFC'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar (Non-sticky so fixed sticky height stays <= 15% of viewport) */}
      <div className="md:hidden bg-[#F3F6F7] px-4 pt-4 pb-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelectTab('equipements')}
          className="font-display text-lg font-bold tracking-tight text-[#00565E] whitespace-nowrap shrink-0"
        >
          Smart Gym Connect
        </button>

        <button
          type="button"
          onClick={hasActiveSession ? () => onSelectTab('reservations') : onOpenAccessPass}
          aria-label={hasActiveSession ? 'Voir la séance en cours' : 'Ouvrir le badge NFC'}
          className="min-h-[44px] min-w-[44px] px-3 rounded-[10px] bg-[#E8F3F4] text-[#1F6F78] text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 active:brightness-95 transition-all"
        >
          <QrCode className="w-4 h-4 shrink-0" />
          <span>{hasActiveSession ? 'En séance' : 'Badge'}</span>
        </button>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (64px + safe area) */}
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(15,23,42,0.04)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 h-16 items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className="relative min-h-[44px] h-full flex flex-col items-center justify-center gap-1 px-1 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1F6F78]"
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-[21px] h-[21px] transition-colors ${
                      isActive ? 'text-[#1F6F78]' : 'text-[#64748B]'
                    }`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  {item.id === 'reservations' && upcomingCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#1F6F78] text-white text-[10px] font-semibold leading-4 text-center tabular-nums">
                      {upcomingCount}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[11px] leading-[14px] tracking-[0.02em] truncate max-w-full ${
                    isActive ? 'text-[#1F6F78] font-semibold' : 'text-[#64748B] font-medium'
                  }`}
                >
                  {item.shortLabel}
                </span>

                {/* 4px indicator pill underneath active icon/label */}
                <span
                  className={`h-1 rounded-full transition-all duration-150 ${
                    isActive ? 'w-5 bg-[#1F6F78] opacity-100' : 'w-0 bg-transparent opacity-0'
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
