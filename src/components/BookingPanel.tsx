import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Play, Wrench, X } from 'lucide-react';
import {
  CATEGORY_LABELS,
  formatCountdown,
  generateTimeSlots,
} from '../data/gymData';
import { DateOption, EquipmentItem } from '../types/gym';
import { EquipmentImage, StatusChip } from './StatusChip';

interface BookingPanelProps {
  equipment: EquipmentItem;
  selectedDate: DateOption;
  dateOptions: DateOption[];
  onSelectDate: (date: DateOption) => void;
  existingUserSlotsForEquipmentDate: string[];
  onConfirmBooking: (params: {
    equipment: EquipmentItem;
    date: DateOption;
    startTime: string;
    endTime: string;
    durationMinutes: 30 | 60;
  }) => void;
  onStartImmediateSession: (equipment: EquipmentItem, durationMinutes: 30 | 60) => void;
  onNavigateToReservations: () => void;
  onCloseMobile?: () => void;
  isMobileSheet?: boolean;
}

export function BookingPanel({
  equipment,
  selectedDate,
  dateOptions,
  onSelectDate,
  existingUserSlotsForEquipmentDate,
  onConfirmBooking,
  onStartImmediateSession,
  onNavigateToReservations,
  onCloseMobile,
  isMobileSheet = false,
}: BookingPanelProps) {
  const [duration, setDuration] = useState<30 | 60>(60);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [confirmedSlot, setConfirmedSlot] = useState<{
    dateLabel: string;
    range: string;
  } | null>(null);

  const slots = useMemo(() => generateTimeSlots(duration), [duration]);

  const bookedTimes = useMemo(() => {
    const baseBooked = equipment.bookedSlotsByDate[selectedDate.dateISO] || [];
    return new Set([...baseBooked, ...existingUserSlotsForEquipmentDate]);
  }, [equipment, selectedDate.dateISO, existingUserSlotsForEquipmentDate]);

  const isSlotUnavailable = (start: string) => {
    if (bookedTimes.has(start)) return true;
    // If 60 min slot starts at HH:00, check if HH:00 or HH:30 is booked
    if (duration === 60) {
      const hour = start.slice(0, 2);
      if (bookedTimes.has(`${hour}:30`)) return true;
    }
    // On today (13/11/2026 at 13:53), slots earlier than 14:00 are in the past
    if (selectedDate.isToday && start < '14:00') {
      return true;
    }
    return false;
  };

  // Reset selected slot when changing equipment, date, or duration
  useEffect(() => {
    setSelectedStart(null);
    setConfirmedSlot(null);
  }, [equipment.id, selectedDate.dateISO, duration]);

  const selectedSlotObj = slots.find((s) => s.start === selectedStart) || null;

  const handleConfirm = () => {
    if (!selectedSlotObj) return;
    onConfirmBooking({
      equipment,
      date: selectedDate,
      startTime: selectedSlotObj.start,
      endTime: selectedSlotObj.end,
      durationMinutes: duration,
    });
    setConfirmedSlot({
      dateLabel: selectedDate.fullLabel,
      range: selectedSlotObj.label,
    });
    setSelectedStart(null);
  };

  const canStartNow = equipment.status === 'libre' && Boolean(selectedDate.isToday);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
        <EquipmentImage
          src={equipment.image}
          alt={equipment.name}
          className="w-16 h-16 rounded-[12px] shrink-0 bg-slate-100"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-[16px] leading-[22px] font-semibold text-[#0F172A] truncate">
              {equipment.name}
            </h3>
            {isMobileSheet && onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Fermer le panneau de réservation"
                className="min-w-[44px] min-h-[44px] -mt-2 -mr-2 flex items-center justify-center rounded-full text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A] transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-[13px] text-[#64748B] mt-0.5 truncate">
            {CATEGORY_LABELS[equipment.category]} · {equipment.zone} · {equipment.level}
          </p>
          <div className="mt-2 flex items-center flex-wrap gap-2">
            <StatusChip status={equipment.status} />
            {equipment.status === 'occupe' && typeof equipment.remainingSeconds === 'number' && (
              <span className="text-xs font-medium text-[#D9363E] tabular-nums">
                Libre dans {formatCountdown(equipment.remainingSeconds)}
              </span>
            )}
            {equipment.status === 'reserve' && equipment.nextSlotLabel && (
              <span className="text-xs font-medium text-[#9C5B00] tabular-nums">
                Créneau actif {equipment.nextSlotLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance Warning */}
      {equipment.status === 'indisponible' && (
        <div className="mt-4 p-3.5 rounded-[12px] bg-[#F1F5F9] text-[#546E7A] flex items-start gap-2.5 text-sm">
          <Wrench className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-[#0F172A]">Maintenance en cours</p>
            <p className="text-[13px] mt-0.5">
              {equipment.maintenanceNote || 'Équipement temporairement hors service.'}
            </p>
          </div>
        </div>
      )}

      {/* Confirmation State */}
      {confirmedSlot ? (
        <div className="mt-5 p-5 rounded-[14px] bg-[#E8F3F4] text-[#00565E] space-y-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#2E9E4F] shrink-0" />
            <h4 className="font-display text-base font-semibold">Réservation confirmée</h4>
          </div>
          <p className="text-sm text-[#0F172A] leading-relaxed">
            Votre créneau sur <span className="font-semibold">{equipment.name}</span> est enregistré
            pour le <span className="font-semibold tabular-nums">{confirmedSlot.dateLabel}</span> de{' '}
            <span className="font-semibold tabular-nums">{confirmedSlot.range}</span>.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={onNavigateToReservations}
              className="flex-1 h-12 px-4 rounded-[12px] bg-[#1F6F78] text-white text-sm font-semibold hover:bg-[#00565E] active:brightness-90 transition-all whitespace-nowrap"
            >
              Voir mes réservations
            </button>
            <button
              type="button"
              onClick={() => setConfirmedSlot(null)}
              className="h-12 px-4 rounded-[12px] bg-white text-[#1F6F78] text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Autre créneau
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Date Selector inside panel */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1F6F78]" />
                Date de séance
              </span>
              <span className="text-xs font-medium text-[#64748B] tabular-nums">
                {selectedDate.fullLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {dateOptions.map((d) => {
                const active = d.dateISO === selectedDate.dateISO;
                return (
                  <button
                    key={d.dateISO}
                    type="button"
                    onClick={() => onSelectDate(d)}
                    className={`min-h-[44px] px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                      active
                        ? 'bg-[#1F6F78] text-white'
                        : 'bg-[#F3F6F7] text-[#3F484A] hover:bg-[#E8F3F4] hover:text-[#1F6F78]'
                    }`}
                  >
                    {d.dayShort} {d.dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Toggle */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold text-[#0F172A] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#1F6F78]" />
              Durée du créneau
            </span>
            <div className="inline-flex p-1 rounded-[10px] bg-[#F3F6F7]">
              {([30, 60] as const).map((mins) => {
                const active = duration === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-white text-[#1F6F78] shadow-xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {mins === 30 ? '30 min' : '1 heure'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time-Slot Grid (08:00 to 20:00) */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-semibold text-[#0F172A]">
                Créneaux horaires (08:00 – 20:00)
              </span>
              <span className="text-[12px] text-[#64748B]">
                {selectedSlotObj ? selectedSlotObj.label : 'Sélectionnez une heure'}
              </span>
            </div>

            <div
              className={`grid gap-2 ${
                duration === 30 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'
              } max-h-[250px] overflow-y-auto pr-0.5`}
            >
              {slots.map((slot) => {
                const unavailable = isSlotUnavailable(slot.start);
                const isSelected = selectedStart === slot.start;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    disabled={unavailable}
                    onClick={() => setSelectedStart(slot.start)}
                    aria-label={`Créneau ${slot.label}${unavailable ? ' indisponible' : ''}`}
                    className={`min-h-[44px] px-2 py-2 rounded-[10px] text-[13px] font-medium tabular-nums transition-all border whitespace-nowrap flex items-center justify-center ${
                      unavailable
                        ? 'slot-unavailable-pattern border-slate-200/70 text-[#CBD5E1] line-through cursor-not-allowed'
                        : isSelected
                          ? 'bg-[#1F6F78] border-[#1F6F78] text-white font-semibold shadow-xs'
                          : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#1F6F78] hover:bg-[#E8F3F4]/50'
                    }`}
                  >
                    {duration === 30 ? slot.start : slot.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
            <button
              type="button"
              disabled={!selectedSlotObj}
              onClick={handleConfirm}
              className={`w-full h-12 rounded-[12px] text-[14px] font-semibold transition-all flex items-center justify-center ${
                selectedSlotObj
                  ? 'bg-[#1F6F78] text-white hover:bg-[#00565E] active:brightness-90'
                  : 'bg-[#F1F5F9] text-[#90A4AE] cursor-not-allowed'
              }`}
            >
              {selectedSlotObj
                ? `Confirmer · ${selectedSlotObj.label}`
                : 'Sélectionnez un créneau'}
            </button>

            {canStartNow && (
              <button
                type="button"
                onClick={() => onStartImmediateSession(equipment, duration)}
                className="w-full h-12 rounded-[12px] bg-[#E8F3F4] text-[#1F6F78] text-[14px] font-semibold hover:bg-[#d9ecef] active:brightness-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Démarrer maintenant ({duration} min)</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
