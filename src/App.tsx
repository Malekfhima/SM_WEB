import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AccessPassModal } from './components/AccessPassModal';
import { EquipmentsView } from './components/EquipmentsView';
import { HistoryView } from './components/HistoryView';
import { Navigation } from './components/Navigation';
import { ProfileView } from './components/ProfileView';
import { ReservationsView } from './components/ReservationsView';
import {
  DATE_OPTIONS,
  INITIAL_EQUIPMENT,
  INITIAL_PROFILE,
  INITIAL_RESERVATIONS,
} from './data/gymData';
import {
  DateOption,
  EquipmentItem,
  MemberProfile,
  NavTab,
  Reservation,
} from './types/gym';

const STORAGE_KEY = 'smart_gym_connect_v1';

interface PersistedState {
  reservations: Reservation[];
  profile: MemberProfile;
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (Array.isArray(parsed.reservations) && parsed.profile) {
        return {
          reservations: parsed.reservations,
          profile: { ...INITIAL_PROFILE, ...parsed.profile },
        };
      }
    }
  } catch {
    // Fallback to seed data
  }
  return {
    reservations: INITIAL_RESERVATIONS,
    profile: INITIAL_PROFILE,
  };
}

export default function App() {
  const [initial] = useState<PersistedState>(() => loadInitialState());

  const [activeTab, setActiveTab] = useState<NavTab>('equipements');
  const [equipments, setEquipments] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [reservations, setReservations] = useState<Reservation[]>(initial.reservations);
  const [profile, setProfile] = useState<MemberProfile>(initial.profile);

  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(
    INITIAL_EQUIPMENT[0].id
  );
  const [selectedDate, setSelectedDate] = useState<DateOption>(DATE_OPTIONS[0]);
  const [accessPassOpen, setAccessPassOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist reservations & profile preferences
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ reservations, profile })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [reservations, profile]);

  // Real-time 1-second ticker for occupied machines & active user session
  useEffect(() => {
    const timer = window.setInterval(() => {
      setEquipments((prev) =>
        prev.map((eq) => {
          if (eq.status === 'occupe' && typeof eq.remainingSeconds === 'number') {
            if (eq.remainingSeconds <= 1) {
              return { ...eq, status: 'libre', remainingSeconds: undefined };
            }
            return { ...eq, remainingSeconds: eq.remainingSeconds - 1 };
          }
          return eq;
        })
      );

      setReservations((prev) =>
        prev.map((res) => {
          if (res.status === 'active' && typeof res.remainingSeconds === 'number') {
            if (res.remainingSeconds <= 1) {
              return {
                ...res,
                status: 'completed',
                remainingSeconds: 0,
                caloriesEstimate: Math.round(res.durationMinutes * 7.2),
                sessionNote: 'Séance complétée sur machine connectée',
              };
            }
            return { ...res, remainingSeconds: res.remainingSeconds - 1 };
          }
          return res;
        })
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // Auto-hide toast notifications
  useEffect(() => {
    if (!toastMessage) return;
    const id = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(id);
  }, [toastMessage]);

  const activeSession = useMemo(
    () => reservations.find((r) => r.status === 'active') || null,
    [reservations]
  );

  const upcomingCount = useMemo(
    () => reservations.filter((r) => r.status === 'upcoming').length,
    [reservations]
  );

  const completedThisWeek = useMemo(
    () => reservations.filter((r) => r.status === 'completed').length,
    [reservations]
  );

  const handleConfirmBooking = (params: {
    equipment: EquipmentItem;
    date: DateOption;
    startTime: string;
    endTime: string;
    durationMinutes: 30 | 60;
  }) => {
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      equipmentId: params.equipment.id,
      equipmentName: params.equipment.name,
      equipmentCategory: params.equipment.category,
      equipmentZone: `${params.equipment.zone} · ${params.equipment.level}`,
      equipmentImage: params.equipment.image,
      dateISO: params.date.dateISO,
      dateLabel: params.date.fullLabel,
      startTime: params.startTime,
      endTime: params.endTime,
      durationMinutes: params.durationMinutes,
      status: 'upcoming',
    };

    setReservations((prev) => [newReservation, ...prev]);

    if (params.date.isToday && params.equipment.status === 'libre') {
      setEquipments((prev) =>
        prev.map((eq) =>
          eq.id === params.equipment.id
            ? {
                ...eq,
                status: 'reserve',
                nextSlotLabel: `${params.startTime} - ${params.endTime}`,
              }
            : eq
        )
      );
    }

    setToastMessage(
      `Créneau réservé : ${params.equipment.name} (${params.startTime} - ${params.endTime})`
    );
  };

  const handleStartImmediateSession = (
    equipment: EquipmentItem,
    durationMinutes: 30 | 60
  ) => {
    if (activeSession) {
      setToastMessage('Terminez d’abord votre séance en cours dans Mes réservations.');
      setActiveTab('reservations');
      return;
    }

    const now = new Date();
    const startH = String(now.getHours()).padStart(2, '0');
    const startM = String(now.getMinutes()).padStart(2, '0');
    const endDt = new Date(now.getTime() + durationMinutes * 60_000);
    const endH = String(endDt.getHours()).padStart(2, '0');
    const endM = String(endDt.getMinutes()).padStart(2, '0');

    const totalSec = durationMinutes * 60;
    const immediateRes: Reservation = {
      id: `res-live-${Date.now()}`,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      equipmentCategory: equipment.category,
      equipmentZone: `${equipment.zone} · ${equipment.level}`,
      equipmentImage: equipment.image,
      dateISO: DATE_OPTIONS[0].dateISO,
      dateLabel: DATE_OPTIONS[0].fullLabel,
      startTime: `${startH}:${startM}`,
      endTime: `${endH}:${endM}`,
      durationMinutes,
      status: 'active',
      remainingSeconds: totalSec,
    };

    setReservations((prev) => [immediateRes, ...prev]);
    setEquipments((prev) =>
      prev.map((eq) =>
        eq.id === equipment.id
          ? { ...eq, status: 'occupe', remainingSeconds: totalSec }
          : eq
      )
    );
    setActiveTab('reservations');
    setToastMessage(`Séance démarrée sur ${equipment.name}`);
  };

  const handleCheckIn = (reservationId: string) => {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return;

    const totalSec = target.durationMinutes * 60;
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? { ...r, status: 'active', remainingSeconds: totalSec }
          : r
      )
    );

    setEquipments((prev) =>
      prev.map((eq) =>
        eq.id === target.equipmentId
          ? { ...eq, status: 'occupe', remainingSeconds: totalSec }
          : eq
      )
    );

    setToastMessage(`Machine déverrouillée : ${target.equipmentName}`);
  };

  const handleExtendActiveSession = (reservationId: string) => {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return;

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? { ...r, remainingSeconds: (r.remainingSeconds ?? 0) + 15 * 60 }
          : r
      )
    );
    setEquipments((prev) =>
      prev.map((eq) =>
        eq.id === target.equipmentId && eq.status === 'occupe'
          ? { ...eq, remainingSeconds: (eq.remainingSeconds ?? 0) + 15 * 60 }
          : eq
      )
    );
    setToastMessage('Séance prolongée de 15 minutes');
  };

  const handleFinishActiveSession = (reservationId: string) => {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return;

    const elapsedMinutes = Math.max(
      5,
      target.durationMinutes - Math.floor((target.remainingSeconds ?? 0) / 60)
    );

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status: 'completed',
              remainingSeconds: 0,
              caloriesEstimate: Math.round(elapsedMinutes * 7.5),
              sessionNote: `Séance validée · ${elapsedMinutes} min effectives`,
            }
          : r
      )
    );

    setEquipments((prev) =>
      prev.map((eq) =>
        eq.id === target.equipmentId
          ? { ...eq, status: 'libre', remainingSeconds: undefined }
          : eq
      )
    );

    setToastMessage('Séance terminée et enregistrée dans l’historique');
  };

  const handleCancelReservation = (reservationId: string) => {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return;

    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status: 'cancelled',
              sessionNote: 'Annulée par le membre',
            }
          : r
      )
    );

    setEquipments((prev) =>
      prev.map((eq) =>
        eq.id === target.equipmentId && eq.status === 'reserve'
          ? { ...eq, status: 'libre', nextSlotLabel: undefined }
          : eq
      )
    );

    setToastMessage(`Réservation annulée (${target.equipmentName})`);
  };

  const handleRebookEquipment = (equipmentId: string) => {
    setSelectedEquipmentId(equipmentId);
    setSelectedDate(DATE_OPTIONS[0]);
    setActiveTab('equipements');
  };

  const handleUpdateProfile = (patch: Partial<MemberProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="min-h-screen bg-[#F3F6F7] text-[#0F172A]">
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        upcomingCount={upcomingCount}
        hasActiveSession={Boolean(activeSession)}
        onOpenAccessPass={() => setAccessPassOpen(true)}
      />

      {/* Main Content Canvas (padding bottom accounts for 64px mobile bottom nav + safe area) */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-3 md:pt-7 pb-24 md:pb-12">
        {activeTab === 'equipements' && (
          <EquipmentsView
            equipments={equipments}
            selectedEquipmentId={selectedEquipmentId}
            onSelectEquipment={setSelectedEquipmentId}
            dateOptions={DATE_OPTIONS}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            reservations={reservations}
            onConfirmBooking={handleConfirmBooking}
            onStartImmediateSession={handleStartImmediateSession}
            onNavigateToReservations={() => setActiveTab('reservations')}
          />
        )}

        {activeTab === 'reservations' && (
          <ReservationsView
            reservations={reservations}
            onCheckIn={handleCheckIn}
            onExtendActiveSession={handleExtendActiveSession}
            onFinishActiveSession={handleFinishActiveSession}
            onCancelReservation={handleCancelReservation}
            onBrowseEquipments={() => setActiveTab('equipements')}
          />
        )}

        {activeTab === 'historique' && (
          <HistoryView
            reservations={reservations}
            onRebookEquipment={handleRebookEquipment}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileView
            profile={profile}
            completedThisWeek={completedThisWeek}
            onUpdateProfile={handleUpdateProfile}
            onOpenAccessPass={() => setAccessPassOpen(true)}
          />
        )}
      </main>

      {/* Non-intrusive Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-40 bg-[#0F172A] text-white rounded-[12px] px-4 py-3 shadow-lg flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-[#8CFA9F] shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Fermer la notification"
            className="p-1 rounded-md text-slate-400 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Member QR / NFC Access Pass Modal */}
      {accessPassOpen && (
        <AccessPassModal
          profile={profile}
          onClose={() => setAccessPassOpen(false)}
        />
      )}
    </div>
  );
}
