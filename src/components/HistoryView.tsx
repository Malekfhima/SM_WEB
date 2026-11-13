import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/gymData';
import { EquipmentCategory, Reservation } from '../types/gym';
import { EquipmentImage } from './StatusChip';

interface HistoryViewProps {
  reservations: Reservation[];
  onRebookEquipment: (equipmentId: string) => void;
}

type HistoryFilter = 'toutes' | EquipmentCategory | 'annulees';

const FILTERS: { id: HistoryFilter; label: string }[] = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'musculation', label: 'Musculation' },
  { id: 'fonctionnel', label: 'Fonctionnel' },
  { id: 'annulees', label: 'Annulées' },
];

export function HistoryView({ reservations, onRebookEquipment }: HistoryViewProps) {
  const [filter, setFilter] = useState<HistoryFilter>('toutes');

  const historyItems = useMemo(
    () => reservations.filter((r) => r.status === 'completed' || r.status === 'cancelled'),
    [reservations]
  );

  const completedItems = useMemo(
    () => historyItems.filter((r) => r.status === 'completed'),
    [historyItems]
  );

  const stats = useMemo(() => {
    const totalMinutes = completedItems.reduce((sum, r) => sum + r.durationMinutes, 0);
    const totalCalories = completedItems.reduce(
      (sum, r) => sum + (r.caloriesEstimate || 240),
      0
    );
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const durationText = hours > 0 ? `${hours}h ${String(mins).padStart(2, '0')}` : `${mins} min`;

    const completionRate =
      historyItems.length > 0
        ? Math.round((completedItems.length / historyItems.length) * 100)
        : 100;

    return {
      sessionCount: completedItems.length,
      durationText,
      totalCalories,
      completionRate,
    };
  }, [completedItems, historyItems.length]);

  const filteredList = useMemo(() => {
    return historyItems.filter((item) => {
      if (filter === 'toutes') return true;
      if (filter === 'annulees') return item.status === 'cancelled';
      return item.equipmentCategory === filter && item.status === 'completed';
    });
  }, [historyItems, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold tracking-[-0.02em] text-[#0F172A]">
          Historique des séances
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Suivi de vos entraînements passés et réservations annulées
        </p>
      </div>

      {/* Summary KPI Grid (single-level clean white cards, tabular-nums) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        <div className="bg-white rounded-[16px] p-4 md:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)]">
          <p className="text-[13px] font-medium text-[#64748B]">Séances terminées</p>
          <p className="mt-1.5 font-display text-2xl md:text-[28px] font-bold text-[#0F172A] tabular-nums">
            {stats.sessionCount}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">Novembre 2026</p>
        </div>

        <div className="bg-white rounded-[16px] p-4 md:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)]">
          <p className="text-[13px] font-medium text-[#64748B]">Temps cumulé</p>
          <p className="mt-1.5 font-display text-2xl md:text-[28px] font-bold text-[#1F6F78] tabular-nums">
            {stats.durationText}
          </p>
          <p className="mt-1 text-xs text-[#64748B]">Sur machines connectées</p>
        </div>

        <div className="bg-white rounded-[16px] p-4 md:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)]">
          <p className="text-[13px] font-medium text-[#64748B]">Dépense estimée</p>
          <p className="mt-1.5 font-display text-2xl md:text-[28px] font-bold text-[#0F172A] tabular-nums">
            {stats.totalCalories} kcal
          </p>
          <p className="mt-1 text-xs text-[#64748B]">Capteurs équipements</p>
        </div>

        <div className="bg-white rounded-[16px] p-4 md:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)]">
          <p className="text-[13px] font-medium text-[#64748B]">Assiduité</p>
          <p className="mt-1.5 font-display text-2xl md:text-[28px] font-bold text-[#006E2E] tabular-nums">
            {stats.completionRate} %
          </p>
          <p className="mt-1 text-xs text-[#64748B]">Créneaux honorés</p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <div className="inline-flex items-center gap-1 p-1 bg-white rounded-[12px] shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-[9px] text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#E8F3F4] text-[#00565E]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* History List */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-[16px] p-8 text-center shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)]">
          <p className="font-display text-base font-semibold text-[#0F172A]">
            Aucune séance dans cette catégorie
          </p>
          <p className="text-sm text-[#64748B] mt-1">
            Sélectionnez un autre filtre pour afficher l’ensemble de votre historique.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[16px] shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)] divide-y divide-slate-100">
          {filteredList.map((item) => {
            const isCancelled = item.status === 'cancelled';
            return (
              <div
                key={item.id}
                className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <EquipmentImage
                    src={item.equipmentImage}
                    alt={item.equipmentName}
                    className={`w-16 h-16 rounded-[12px] shrink-0 ${
                      isCancelled ? 'opacity-60 grayscale' : ''
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#64748B] tabular-nums">
                      <span className="font-semibold text-[#0F172A]">{item.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {item.startTime} - {item.endTime}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{CATEGORY_LABELS[item.equipmentCategory]}</span>
                    </div>

                    <h2 className="font-display text-[16px] leading-[22px] font-semibold text-[#0F172A] mt-1 truncate">
                      {item.equipmentName}
                    </h2>

                    <p className="text-[13px] text-[#64748B] mt-0.5 truncate">
                      {item.sessionNote || item.equipmentZone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  {isCancelled ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#90A4AE]/15 text-[#546E7A] whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#90A4AE]" aria-hidden="true" />
                      Annulée
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[#2E9E4F]/12 text-[#006E2E] whitespace-nowrap tabular-nums">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E4F]" aria-hidden="true" />
                      Terminée · {item.durationMinutes} min
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onRebookEquipment(item.equipmentId)}
                    className="h-10 px-3.5 rounded-[10px] bg-[#E8F3F4] text-[#1F6F78] text-xs font-semibold hover:bg-[#d8ecee] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réserver</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
