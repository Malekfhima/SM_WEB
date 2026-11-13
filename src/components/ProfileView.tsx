import { Bell, Building2, Minus, Plus, QrCode, ShieldCheck } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/gymData';
import { EquipmentCategory, MemberProfile } from '../types/gym';

interface ProfileViewProps {
  profile: MemberProfile;
  completedThisWeek: number;
  onUpdateProfile: (patch: Partial<MemberProfile>) => void;
  onOpenAccessPass: () => void;
}

const ZONE_OPTIONS: { id: EquipmentCategory | 'toutes'; label: string }[] = [
  { id: 'toutes', label: 'Toutes les zones' },
  { id: 'cardio', label: CATEGORY_LABELS.cardio },
  { id: 'musculation', label: CATEGORY_LABELS.musculation },
  { id: 'fonctionnel', label: CATEGORY_LABELS.fonctionnel },
];

export function ProfileView({
  profile,
  completedThisWeek,
  onUpdateProfile,
  onOpenAccessPass,
}: ProfileViewProps) {
  const goalProgress = Math.min(100, Math.round((completedThisWeek / profile.weeklyGoal) * 100));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold tracking-[-0.02em] text-[#0F172A]">
          Profil membre
        </h1>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Identifiant club, badge d’accès et préférences de réservation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Member Identity & Access Pass */}
        <section className="lg:col-span-5 bg-white rounded-[16px] p-5 md:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)] space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F3F4] text-[#00565E] font-display text-xl font-bold flex items-center justify-center shrink-0">
              {profile.initials}
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-[20px] leading-[26px] font-semibold text-[#0F172A] truncate">
                {profile.fullName}
              </h2>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                {profile.membershipTier} · {profile.clubName}
              </p>
              <p className="text-xs font-mono font-medium text-[#1F6F78] mt-1 tabular-nums">
                N° {profile.memberId}
              </p>
            </div>
          </div>

          {/* Weekly Progress Bar */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-[#0F172A]">Objectif hebdomadaire</span>
              <span className="font-semibold text-[#1F6F78] tabular-nums">
                {completedThisWeek} / {profile.weeklyGoal} séances
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-[#F3F6F7] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1F6F78] transition-all duration-300"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#64748B]">
              {goalProgress >= 100
                ? 'Objectif hebdomadaire atteint.'
                : `Encore ${Math.max(0, profile.weeklyGoal - completedThisWeek)} séance(s) pour atteindre votre objectif.`}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAccessPass}
            className="w-full h-12 px-4 rounded-[12px] bg-[#1F6F78] text-white text-sm font-semibold hover:bg-[#00565E] active:brightness-90 transition-all inline-flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Afficher le badge d’accès NFC / QR</span>
          </button>
        </section>

        {/* Preferences & Club Information */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-[16px] p-5 md:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)] space-y-5">
            <h2 className="font-display text-[18px] leading-[24px] font-semibold text-[#0F172A]">
              Préférences d’entraînement
            </h2>

            {/* Weekly Goal Stepper */}
            <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Séances cibles par semaine
                </p>
                <p className="text-xs text-[#64748B]">Ajustez votre rythme d’entraînement</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateProfile({ weeklyGoal: Math.max(1, profile.weeklyGoal - 1) })
                  }
                  aria-label="Diminuer l’objectif hebdomadaire"
                  className="w-11 h-11 rounded-[10px] bg-[#F3F6F7] text-[#0F172A] hover:bg-[#E8F3F4] hover:text-[#1F6F78] flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-9 text-center font-display text-base font-bold text-[#0F172A] tabular-nums">
                  {profile.weeklyGoal}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateProfile({ weeklyGoal: Math.min(7, profile.weeklyGoal + 1) })
                  }
                  aria-label="Augmenter l’objectif hebdomadaire"
                  className="w-11 h-11 rounded-[10px] bg-[#F3F6F7] text-[#0F172A] hover:bg-[#E8F3F4] hover:text-[#1F6F78] flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reminder Toggle */}
            <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <Bell className="w-4 h-4 text-[#1F6F78] mt-1 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    Rappel avant créneau
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Notification {profile.reminderMinutes} min avant le début de la séance
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={profile.reminderEnabled}
                onClick={() =>
                  onUpdateProfile({ reminderEnabled: !profile.reminderEnabled })
                }
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                  profile.reminderEnabled ? 'bg-[#1F6F78]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    profile.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Preferred Zone */}
            <div className="space-y-2.5 pt-1">
              <p className="text-sm font-semibold text-[#0F172A]">Zone favorite</p>
              <div className="flex flex-wrap gap-2">
                {ZONE_OPTIONS.map((zone) => {
                  const active = profile.preferredZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => onUpdateProfile({ preferredZone: zone.id })}
                      className={`min-h-[40px] px-3.5 py-2 rounded-[10px] text-xs font-semibold transition-colors whitespace-nowrap ${
                        active
                          ? 'bg-[#1F6F78] text-white'
                          : 'bg-[#F3F6F7] text-[#3F484A] hover:bg-[#E8F3F4] hover:text-[#1F6F78]'
                      }`}
                    >
                      {zone.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Club Details */}
          <section className="bg-white rounded-[16px] p-5 md:p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_1px_2px_rgba(15,23,42,0.03)] space-y-3">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-[#1F6F78]" />
              <h2 className="font-display text-[18px] leading-[24px] font-semibold text-[#0F172A]">
                Salle {profile.clubName}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-1">
              <div className="p-3.5 rounded-[12px] bg-[#F3F6F7]">
                <p className="text-xs text-[#64748B]">Horaires d’ouverture</p>
                <p className="font-semibold text-[#0F172A] mt-0.5 tabular-nums">
                  Lun – Dim · 06:00 - 23:00
                </p>
              </div>
              <div className="p-3.5 rounded-[12px] bg-[#F3F6F7]">
                <p className="text-xs text-[#64748B]">Fréquentation actuelle</p>
                <p className="font-semibold text-[#006E2E] mt-0.5 tabular-nums">
                  Fluide · 38 % de capacité
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748B] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#2E9E4F] shrink-0" />
              <span>
                Les réservations non validées sous 10 min sont libérées automatiquement.
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
