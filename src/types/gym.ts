export type NavTab = 'equipements' | 'reservations' | 'historique' | 'profil';

export type EquipmentStatus = 'libre' | 'occupe' | 'reserve' | 'indisponible';

export type EquipmentCategory = 'cardio' | 'musculation' | 'fonctionnel';

export interface EquipmentItem {
  id: string;
  name: string;
  model: string;
  category: EquipmentCategory;
  zone: string;
  level: string;
  specs: string;
  status: EquipmentStatus;
  image: string;
  /** Remaining seconds for current live session if status === 'occupe' */
  remainingSeconds?: number;
  /** Next reservation window today if status === 'reserve' */
  nextSlotLabel?: string;
  /** Maintenance note if status === 'indisponible' */
  maintenanceNote?: string;
  /** Pre-booked start times keyed by dateISO (YYYY-MM-DD) */
  bookedSlotsByDate: Record<string, string[]>;
}

export type ReservationStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: EquipmentCategory;
  equipmentZone: string;
  equipmentImage: string;
  dateISO: string;
  dateLabel: string; // Strict JJ/MM/AAAA
  startTime: string; // 24h HH:MM
  endTime: string; // 24h HH:MM
  durationMinutes: 30 | 60;
  status: ReservationStatus;
  /** Remaining seconds if status === 'active' */
  remainingSeconds?: number;
  caloriesEstimate?: number;
  sessionNote?: string;
}

export interface DateOption {
  dateISO: string;
  dayShort: string;
  dayNumber: string;
  monthShort: string;
  fullLabel: string; // JJ/MM/AAAA
  isToday?: boolean;
}

export interface MemberProfile {
  fullName: string;
  initials: string;
  memberId: string;
  membershipTier: string;
  clubName: string;
  weeklyGoal: number;
  reminderEnabled: boolean;
  reminderMinutes: 15 | 30;
  preferredZone: EquipmentCategory | 'toutes';
}
