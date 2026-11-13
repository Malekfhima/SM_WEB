import { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Plus,
  QrCode,
  Square,
  Trash2,
} from 'lucide-react';
import { CATEGORY_LABELS, formatCountdown } from '../data/gymData';
import { Reservation } from '../types/gym';
import { EquipmentImage, LiveIndicatorBadge } from './StatusChip';

interface ReservationsViewProps {
  reservations: Reservation[];
  onCheckIn: (reservationId: string) => void;
  onExtendActiveSession: (reservationId: string) => void;
  onFinishActiveSession: (reservationId: string) => void;
  onCancelReservation: (reservationId: string) => void;
  onBrowseEquipments: () => void;
}

export function ReservationsView({
  reservations,
  onCheckIn,
  onExtendActiveSession,
  onFinishActiveSession,
  onCancelReservation,
  onBrowseEquipments,
}: ReservationsViewProps) {
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [checkInSheetRes, setCheckInSheetRes] = useState<Reservation | null>(null);

  const activeSession = reservations.find((r) => r.status === 'active') || null;
  const upcomingList = reservations.filter((r) => r.status === 'upcoming');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold tracking-[-0.02em] text-[#0F172A]">
            Mes réservations
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B] tabular-nums">
            {activeSession ? '1 séance en cours · ' : ''}
            {upcomingList.length}{' '}
            {upcomingList.length > 1 ? 'créneaux à venir' : 'créneau à venir'}
          </p>
        </div>

        <button
          type="button"
          onClick={onBrowseEquipments}
          className="h-11 px-4 rounded-[12px] bg-[#E8F3F4] text-[#1F6F78] text-sm font-semibold hover:bg-[#d8ecee] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau créneau</span>
        </button>
      </div>

      {/* Active Session Live Card */}
      {activeSession && (
        <section
          aria-label="Séance en cours"
          className="bg-white rounded-[16px] p-5 md:p-6 outline-[1.5px] outline-[#1F6F78] shadow-[0_10px_15px_-3px_rgba(31,111,120,0.08),0_4px_6px_-4px_rgba(31,111,120,0.04)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <LiveIndicatorBadge />
              <span className="text-sm font-semibold text-[#00565E]">
                Séance active sur machine
              </span>
            </div>
            <span className="text-xs font-medium text-[#64748B] tabular-nums">
              {activeSession.dateLabel} · {activeSession.startTime} - {activeSession.endTime}
            </span>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              <EquipmentImage
                src={activeSession.equipmentImage}
                alt={activeSession.equipmentName}
                className="w-20 h-20 rounded-[12px] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#64748B]">
                  {CATEGORY_LABELS[activeSession.equipmentCategory]} · {activeSession.equipmentZone}
                </p>
                <h2 className="font-display text-[18px] leading-[24px] font-semibold text-[#0F172A] mt-0.5 truncate">
                  {activeSession.equipmentName}
                </h2>
                <p className="text-sm text-[#006E2E] font-medium mt-1">
                  Machine déverrouillée via badge membre
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="bg-[#E8F3F4] rounded-[12px] px-4 py-3 text-center sm:text-right">
                <p className="text-[11px] font-semibold text-[#1F6F78] tracking-[0.03em]">
                  Temps restant
                </p>
                <p className="font-mono text-2xl font-semibold text-[#00565E] tabular-nums mt-0.5">
                  {formatCountdown(activeSession.remainingSeconds ?? 0)}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onExtendActiveSession(activeSession.id)}
                  className="h-12 px-4 rounded-[12px] bg-[#E8F3F4] text-[#1F6F78] text-sm font-semibold hover:bg-[#d8ecee] transition-colors whitespace-nowrap"
                >
                  +15 min
                </button>
                <button
                  type="button"
                  onClick={() => onFinishActiveSession(activeSession.id)}
                  className="h-12 px-4 rounded-[12px] bg-[#1F6F78] text-white text-sm font-semibold hover:bg-[#00565E] active:brightness-90 transition-all inline-flex items-center gap-2 whitespace-nowrap"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Terminer</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Reservations List */}
      <section className="space-y-4">
        <h2 className="font-display text-[18px] leading-[24px] font-semibold text-[#0F172A]">
          Créneaux programmés
        </h2>

        {upcomingList.length === 0 ? (
          <div className="bg-white rounded-[16px] p-8 text-center shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="w-12 h-12 rounded-full bg-[#E8F3F4] text-[#1F6F78] flex items-center justify-center mx-auto">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="mt-3 font-display text-base font-semibold text-[#0F172A]">
              Aucune réservation à venir
            </h3>
            <p className="mt-1 text-sm text-[#64748B] max-w-md mx-auto">
              Consultez l’état des machines en direct pour réserver votre prochain créneau
              d’entraînement.
            </p>
            <button
              type="button"
              onClick={onBrowseEquipments}
              className="mt-5 h-12 px-6 rounded-[12px] bg-[#1F6F78] text-white text-sm font-semibold hover:bg-[#00565E] transition-colors"
            >
              Explorer les équipements
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcomingList.map((res) => {
              const isCancelling = confirmCancelId === res.id;
              return (
                <article
                  key={res.id}
                  className="bg-white rounded-[16px] p-4 md:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)] flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <EquipmentImage
                      src={res.equipmentImage}
                      alt={res.equipmentName}
                      className="w-20 h-20 rounded-[12px] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-[#64748B]">
                          {CATEGORY_LABELS[res.equipmentCategory]}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[#E08A1E]/12 text-[#9C5B00] whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E08A1E]" aria-hidden="true" />
                          Confirmé
                        </span>
                      </div>

                      <h3 className="mt-1 font-display text-[16px] leading-[22px] font-semibold text-[#0F172A] truncate">
                        {res.equipmentName}
                      </h3>
                      <p className="text-[13px] text-[#64748B] mt-0.5 truncate">
                        {res.equipmentZone}
                      </p>

                      <div className="mt-2.5 flex items-center gap-3 text-[13px] font-semibold text-[#0F172A] tabular-nums">
                        <span>{res.dateLabel}</span>
                        <span className="text-[#CBD5E1]" aria-hidden="true">
                          |
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#1F6F78]">
                          <Clock className="w-3.5 h-3.5" />
                          {res.startTime} - {res.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isCancelling ? (
                    <div className="p-3 rounded-[12px] bg-[#D9363E]/6 border border-[#D9363E]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <p className="text-xs font-medium text-[#0F172A]">
                        Annuler ce créneau de {res.startTime} - {res.endTime} ?
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(null)}
                          className="h-9 px-3 rounded-[8px] bg-white text-xs font-semibold text-[#64748B] hover:text-[#0F172A]"
                        >
                          Garder
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onCancelReservation(res.id);
                            setConfirmCancelId(null);
                          }}
                          className="h-9 px-3 rounded-[8px] bg-[#D9363E] text-white text-xs font-semibold hover:brightness-95"
                        >
                          Confirmer l’annulation
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setCheckInSheetRes(res)}
                        disabled={Boolean(activeSession)}
                        className={`flex-1 h-11 px-4 rounded-[12px] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                          activeSession
                            ? 'bg-[#F1F5F9] text-[#90A4AE] cursor-not-allowed'
                            : 'bg-[#1F6F78] text-white hover:bg-[#00565E] active:brightness-90'
                        }`}
                      >
                        <QrCode className="w-4 h-4 shrink-0" />
                        <span>
                          {activeSession ? 'Séance déjà active' : 'Valider la présence'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmCancelId(res.id)}
                        aria-label={`Annuler la réservation sur ${res.equipmentName}`}
                        className="h-11 w-11 rounded-[12px] bg-[#F3F6F7] text-[#64748B] hover:bg-[#D9363E]/10 hover:text-[#D9363E] transition-colors flex items-center justify-center shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Check-In Confirmation Modal / Sheet */}
      {checkInSheetRes && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/45 backdrop-blur-[2px] p-0 sm:p-4"
          onClick={() => setCheckInSheetRes(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Validation de présence sur équipement"
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 space-y-4 shadow-[0_20px_35px_rgba(15,23,42,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2 mb-2" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[12px] bg-[#E8F3F4] text-[#1F6F78] flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                  Démarrer le créneau
                </h3>
                <p className="text-xs text-[#64748B] tabular-nums">
                  {checkInSheetRes.dateLabel} · {checkInSheetRes.startTime} -{' '}
                  {checkInSheetRes.endTime}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[14px] bg-[#F3F6F7] space-y-1">
              <p className="font-display text-sm font-semibold text-[#0F172A]">
                {checkInSheetRes.equipmentName}
              </p>
              <p className="text-xs text-[#64748B]">{checkInSheetRes.equipmentZone}</p>
            </div>

            <p className="text-sm text-[#3F484A] leading-relaxed">
              En validant votre présence, l’équipement passe en état <strong className="text-[#0F172A]">Occupé</strong> et votre minuterie de séance démarre immédiatement.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  onCheckIn(checkInSheetRes.id);
                  setCheckInSheetRes(null);
                }}
                className="flex-1 h-12 px-4 rounded-[12px] bg-[#1F6F78] text-white text-sm font-semibold hover:bg-[#00565E] inline-flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer et déverrouiller</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckInSheetRes(null)}
                className="h-12 px-4 rounded-[12px] bg-[#F3F6F7] text-[#3F484A] text-sm font-semibold hover:bg-slate-200/70"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
