import { useMemo, useState } from 'react';
import { CalendarDays, Check, Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORY_LABELS, formatCountdown } from '../data/gymData';
import {
  DateOption,
  EquipmentCategory,
  EquipmentItem,
  Reservation,
} from '../types/gym';
import { BookingPanel } from './BookingPanel';
import { EquipmentImage, LiveIndicatorBadge, StatusChip } from './StatusChip';

interface EquipmentsViewProps {
  equipments: EquipmentItem[];
  selectedEquipmentId: string;
  onSelectEquipment: (id: string) => void;
  dateOptions: DateOption[];
  selectedDate: DateOption;
  onSelectDate: (date: DateOption) => void;
  reservations: Reservation[];
  onConfirmBooking: (params: {
    equipment: EquipmentItem;
    date: DateOption;
    startTime: string;
    endTime: string;
    durationMinutes: 30 | 60;
  }) => void;
  onStartImmediateSession: (equipment: EquipmentItem, durationMinutes: 30 | 60) => void;
  onNavigateToReservations: () => void;
}

const CATEGORY_FILTERS: { id: 'tous' | EquipmentCategory; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'musculation', label: 'Musculation' },
  { id: 'fonctionnel', label: 'Fonctionnel' },
];

export function EquipmentsView({
  equipments,
  selectedEquipmentId,
  onSelectEquipment,
  dateOptions,
  selectedDate,
  onSelectDate,
  reservations,
  onConfirmBooking,
  onStartImmediateSession,
  onNavigateToReservations,
}: EquipmentsViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<'tous' | EquipmentCategory>('tous');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const counts = useMemo(() => {
    return equipments.reduce(
      (acc, eq) => {
        acc[eq.status] += 1;
        return acc;
      },
      { libre: 0, occupe: 0, reserve: 0, indisponible: 0 }
    );
  }, [equipments]);

  const filteredEquipments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return equipments.filter((eq) => {
      if (categoryFilter !== 'tous' && eq.category !== categoryFilter) return false;
      if (onlyAvailable && eq.status !== 'libre') return false;
      if (q) {
        const hay = `${eq.name} ${eq.zone} ${eq.model} ${CATEGORY_LABELS[eq.category]}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [equipments, categoryFilter, onlyAvailable, searchQuery]);

  const selectedEquipment =
    equipments.find((e) => e.id === selectedEquipmentId) || equipments[0];

  const existingUserSlotsForEquipmentDate = useMemo(() => {
    if (!selectedEquipment) return [];
    return reservations
      .filter(
        (r) =>
          r.equipmentId === selectedEquipment.id &&
          r.dateISO === selectedDate.dateISO &&
          (r.status === 'upcoming' || r.status === 'active')
      )
      .map((r) => r.startTime);
  }, [reservations, selectedEquipment, selectedDate.dateISO]);

  const handleCardClick = (eqId: string) => {
    onSelectEquipment(eqId);
    setMobileSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Live Floor Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold tracking-[-0.02em] text-[#0F172A] text-balance">
              Équipements de la salle
            </h1>
            <LiveIndicatorBadge />
          </div>
          <p className="mt-1.5 text-[14px] text-[#64748B] tabular-nums">
            <span className="font-semibold text-[#006E2E]">{counts.libre} libres</span>
            <span aria-hidden="true"> · </span>
            <span>{counts.occupe} occupés</span>
            <span aria-hidden="true"> · </span>
            <span>{counts.reserve} réservés</span>
            {counts.indisponible > 0 && (
              <>
                <span aria-hidden="true"> · </span>
                <span>{counts.indisponible} en maintenance</span>
              </>
            )}
          </p>
        </div>

        {/* Date Summary Pill-Button Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <span className="hidden xl:inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] mr-1 shrink-0">
            <CalendarDays className="w-4 h-4 text-[#1F6F78]" />
            Date :
          </span>
          {dateOptions.map((d) => {
            const active = d.dateISO === selectedDate.dateISO;
            return (
              <button
                key={d.dateISO}
                type="button"
                onClick={() => onSelectDate(d)}
                className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 tabular-nums ${
                  active
                    ? 'bg-[#1F6F78] text-white shadow-xs'
                    : 'bg-white text-[#3F484A] hover:bg-[#E8F3F4] hover:text-[#1F6F78] shadow-[0_1px_2px_rgba(15,23,42,0.04)]'
                }`}
              >
                {d.isToday ? `Auj. ${d.dayNumber}` : `${d.dayShort} ${d.dayNumber}`}
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <div className="inline-flex items-center gap-1 p-1 bg-white rounded-[12px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] shrink-0">
            {CATEGORY_FILTERS.map((cat) => {
              const active = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-[9px] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#E8F3F4] text-[#00565E]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setOnlyAvailable((v) => !v)}
            aria-pressed={onlyAvailable}
            className={`min-h-[44px] px-3.5 py-2 rounded-[12px] text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              onlyAvailable
                ? 'bg-[#006E2E] text-white'
                : 'bg-white text-[#3F484A] hover:bg-[#E8F3F4] shadow-[0_1px_2px_rgba(15,23,42,0.04)]'
            }`}
          >
            {onlyAvailable ? (
              <Check className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0 text-[#64748B]" />
            )}
            <span>Libres uniquement</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une machine, zone..."
            aria-label="Rechercher un équipement"
            className="w-full h-11 pl-10 pr-9 rounded-[12px] bg-white text-[14px] text-[#0F172A] placeholder:text-[#90A4AE] border border-slate-200/80 focus:outline-none focus:border-[#1F6F78] focus:ring-2 focus:ring-[#1F6F78]/15 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Effacer la recherche"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-[#64748B] hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* Main Split Workspace: Equipment Grid + Sticky Booking Drawer (Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 xl:col-span-8">
          {filteredEquipments.length === 0 ? (
            <div className="bg-white rounded-[16px] p-8 text-center shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)]">
              <p className="font-display text-base font-semibold text-[#0F172A]">
                Aucun équipement trouvé
              </p>
              <p className="text-sm text-[#64748B] mt-1">
                Modifiez vos filtres ou réinitialisez la recherche pour voir toutes les machines.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter('tous');
                  setOnlyAvailable(false);
                  setSearchQuery('');
                }}
                className="mt-4 h-11 px-5 rounded-[12px] bg-[#E8F3F4] text-[#1F6F78] text-sm font-semibold hover:bg-[#d8ecee] transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredEquipments.map((eq) => {
                const isSelected = eq.id === selectedEquipment?.id;
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => handleCardClick(eq.id)}
                    className={`text-left rounded-[16px] p-4 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6F78] ${
                      isSelected
                        ? 'bg-[#E8F3F4] outline-[1.5px] outline-[#1F6F78] shadow-[0_10px_15px_-3px_rgba(31,111,120,0.08),0_4px_6px_-4px_rgba(31,111,120,0.04)]'
                        : 'bg-white hover:bg-[#FBFDFF] shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)] hover:shadow-[0_6px_14px_rgba(15,23,42,0.06)]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <EquipmentImage
                        src={eq.image}
                        alt={eq.name}
                        className="w-20 h-20 rounded-[12px] shrink-0 bg-slate-100"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[12px] font-medium text-[#64748B] truncate">
                            {CATEGORY_LABELS[eq.category]} · {eq.level}
                          </span>
                          <StatusChip status={eq.status} />
                        </div>

                        <h2 className="mt-1.5 font-display text-[16px] leading-[22px] font-semibold text-[#0F172A] line-clamp-2">
                          {eq.name}
                        </h2>

                        <p className="mt-1 text-[13px] leading-[18px] text-[#64748B] truncate">
                          {eq.zone}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2 text-[13px]">
                      <span className="text-[#64748B] truncate">{eq.specs}</span>
                      {eq.status === 'occupe' && typeof eq.remainingSeconds === 'number' && (
                        <span className="font-semibold text-[#D9363E] tabular-nums whitespace-nowrap shrink-0">
                          {formatCountdown(eq.remainingSeconds)}
                        </span>
                      )}
                      {eq.status === 'libre' && (
                        <span className="font-semibold text-[#1F6F78] whitespace-nowrap shrink-0">
                          Réserver →
                        </span>
                      )}
                      {eq.status === 'reserve' && eq.nextSlotLabel && (
                        <span className="font-medium text-[#9C5B00] tabular-nums whitespace-nowrap shrink-0">
                          {eq.nextSlotLabel}
                        </span>
                      )}
                      {eq.status === 'indisponible' && (
                        <span className="font-medium text-[#546E7A] whitespace-nowrap shrink-0">
                          Entretien
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop Sticky Booking Panel */}
        {selectedEquipment && (
          <aside className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-white rounded-[16px] p-5 shadow-[0_10px_15px_-3px_rgba(31,111,120,0.08),0_4px_6px_-4px_rgba(31,111,120,0.04)]">
              <BookingPanel
                equipment={selectedEquipment}
                selectedDate={selectedDate}
                dateOptions={dateOptions}
                onSelectDate={onSelectDate}
                existingUserSlotsForEquipmentDate={existingUserSlotsForEquipmentDate}
                onConfirmBooking={onConfirmBooking}
                onStartImmediateSession={onStartImmediateSession}
                onNavigateToReservations={onNavigateToReservations}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile Slide-Up Bottom Sheet for Booking */}
      {mobileSheetOpen && selectedEquipment && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 backdrop-blur-[2px]"
          onClick={() => setMobileSheetOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Réserver ${selectedEquipment.name}`}
        >
          <div
            className="w-full max-h-[88vh] overflow-y-auto bg-white rounded-t-3xl px-4 pb-8 pt-1 shadow-[0_-10px_25px_rgba(15,23,42,0.14)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto my-3" aria-hidden="true" />
            <BookingPanel
              equipment={selectedEquipment}
              selectedDate={selectedDate}
              dateOptions={dateOptions}
              onSelectDate={onSelectDate}
              existingUserSlotsForEquipmentDate={existingUserSlotsForEquipmentDate}
              onConfirmBooking={onConfirmBooking}
              onStartImmediateSession={onStartImmediateSession}
              onNavigateToReservations={() => {
                setMobileSheetOpen(false);
                onNavigateToReservations();
              }}
              onCloseMobile={() => setMobileSheetOpen(false)}
              isMobileSheet
            />
          </div>
        </div>
      )}
    </div>
  );
}
