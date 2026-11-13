import treadmillImg from '../assets/images/treadmill_cardio_1794606836696.jpg';
import rowingImg from '../assets/images/rowing_ergometer_1794606836765.jpg';
import squatRackImg from '../assets/images/squat_rack_1794606836721.jpg';
import spinBikeImg from '../assets/images/spin_bike_1794606838014.jpg';
import cablePulleyImg from '../assets/images/cable_pulley_1794606838178.jpg';
import { DateOption, EquipmentItem, MemberProfile, Reservation } from '../types/gym';

export const DATE_OPTIONS: DateOption[] = [
  {
    dateISO: '2026-11-13',
    dayShort: 'Ven',
    dayNumber: '13',
    monthShort: 'Nov',
    fullLabel: '13/11/2026',
    isToday: true,
  },
  {
    dateISO: '2026-11-14',
    dayShort: 'Sam',
    dayNumber: '14',
    monthShort: 'Nov',
    fullLabel: '14/11/2026',
  },
  {
    dateISO: '2026-11-15',
    dayShort: 'Dim',
    dayNumber: '15',
    monthShort: 'Nov',
    fullLabel: '15/11/2026',
  },
  {
    dateISO: '2026-11-16',
    dayShort: 'Lun',
    dayNumber: '16',
    monthShort: 'Nov',
    fullLabel: '16/11/2026',
  },
  {
    dateISO: '2026-11-17',
    dayShort: 'Mar',
    dayNumber: '17',
    monthShort: 'Nov',
    fullLabel: '17/11/2026',
  },
  {
    dateISO: '2026-11-18',
    dayShort: 'Mer',
    dayNumber: '18',
    monthShort: 'Nov',
    fullLabel: '18/11/2026',
  },
];

export const INITIAL_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'eq-treadmill-01',
    name: 'Tapis de course Aurora S10 #01',
    model: 'Console Tactile 22" · Inclinaison 15%',
    category: 'cardio',
    zone: 'Zone Cardio Nord',
    level: 'Niveau 1',
    specs: 'Vitesse max 22 km/h · Capteur cardiaque BLE',
    status: 'libre',
    image: treadmillImg,
    bookedSlotsByDate: {
      '2026-11-13': ['08:00', '09:00', '10:00', '11:00', '12:00', '17:00', '18:00'],
      '2026-11-14': ['09:00', '10:00', '11:00'],
      '2026-11-15': ['10:00'],
    },
  },
  {
    id: 'eq-rowing-02',
    name: 'Rameur Ergometre Pro #02',
    model: 'Résistance à air · Moniteur PM5',
    category: 'cardio',
    zone: 'Studio Aviron',
    level: 'Niveau 1',
    specs: 'Synchronisation NFC · Suivi puissance Watts',
    status: 'occupe',
    remainingSeconds: 864, // 14:24
    image: rowingImg,
    bookedSlotsByDate: {
      '2026-11-13': ['08:00', '09:00', '13:00', '13:30', '18:00', '19:00'],
      '2026-11-14': ['10:00', '11:00', '14:00'],
    },
  },
  {
    id: 'eq-squat-01',
    name: 'Rack Squat Olympique #01',
    model: 'Plateforme chêne · Disques calibrés',
    category: 'musculation',
    zone: 'Halle Force',
    level: 'Rez-de-chaussée',
    specs: 'Barre 20 kg · Charge max 320 kg',
    status: 'libre',
    image: squatRackImg,
    bookedSlotsByDate: {
      '2026-11-13': ['08:00', '11:00', '12:00', '17:00', '17:30', '18:00'],
      '2026-11-14': ['09:00', '10:00', '16:00'],
    },
  },
  {
    id: 'eq-bike-03',
    name: 'Vélo Connecté Studio #03',
    model: 'Transmission magnétique · Écran HD',
    category: 'cardio',
    zone: 'Zone Cycling',
    level: 'Niveau 1',
    specs: 'Pédales mixtes SPD · Cadence temps réel',
    status: 'reserve',
    nextSlotLabel: '14:00 - 15:00',
    image: spinBikeImg,
    bookedSlotsByDate: {
      '2026-11-13': ['09:00', '14:00', '14:30', '18:00'],
      '2026-11-14': ['10:00', '11:00'],
    },
  },
  {
    id: 'eq-cable-01',
    name: 'Station Poulie Double #01',
    model: 'Colonnes indépendantes 2 x 95 kg',
    category: 'fonctionnel',
    zone: 'Espace Fonctionnel',
    level: 'Rez-de-chaussée',
    specs: 'Ratio 2:1 · Poignées ergonomiques incluses',
    status: 'libre',
    image: cablePulleyImg,
    bookedSlotsByDate: {
      '2026-11-13': ['10:00', '12:00', '16:00', '19:00'],
      '2026-11-14': ['11:00', '15:00'],
    },
  },
  {
    id: 'eq-treadmill-04',
    name: 'Tapis de course Aurora S10 #04',
    model: 'Console Tactile 22" · Amorti pro',
    category: 'cardio',
    zone: 'Zone Cardio Nord',
    level: 'Niveau 1',
    specs: 'Vitesse max 22 km/h · Mode fractionné',
    status: 'occupe',
    remainingSeconds: 1395, // 23:15
    image: treadmillImg,
    bookedSlotsByDate: {
      '2026-11-13': ['13:00', '13:30', '15:00', '18:00'],
    },
  },
  {
    id: 'eq-squat-03',
    name: 'Rack Squat Olympique #03',
    model: 'Sécurité intégrée · Bras leviers',
    category: 'musculation',
    zone: 'Halle Force',
    level: 'Rez-de-chaussée',
    specs: 'Barre 20 kg · Support bandes élastiques',
    status: 'reserve',
    nextSlotLabel: '14:30 - 15:30',
    image: squatRackImg,
    bookedSlotsByDate: {
      '2026-11-13': ['09:00', '14:30', '15:00', '17:00'],
    },
  },
  {
    id: 'eq-cable-02',
    name: 'Station Poulie Double #02',
    model: 'Colonnes indépendantes 2 x 95 kg',
    category: 'fonctionnel',
    zone: 'Espace Fonctionnel',
    level: 'Rez-de-chaussée',
    specs: 'Calibration capteur de tension en cours',
    status: 'indisponible',
    maintenanceNote: 'Révision préventive jusqu’à 17:30',
    image: cablePulleyImg,
    bookedSlotsByDate: {
      '2026-11-13': [
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
      ],
    },
  },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-active-1',
    equipmentId: 'eq-bike-03',
    equipmentName: 'Vélo Connecté Studio #03',
    equipmentCategory: 'cardio',
    equipmentZone: 'Zone Cycling · Niveau 1',
    equipmentImage: spinBikeImg,
    dateISO: '2026-11-13',
    dateLabel: '13/11/2026',
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    status: 'upcoming',
  },
  {
    id: 'res-upcoming-2',
    equipmentId: 'eq-squat-01',
    equipmentName: 'Rack Squat Olympique #01',
    equipmentCategory: 'musculation',
    equipmentZone: 'Halle Force · Rez-de-chaussée',
    equipmentImage: squatRackImg,
    dateISO: '2026-11-13',
    dateLabel: '13/11/2026',
    startTime: '17:00',
    endTime: '18:00',
    durationMinutes: 60,
    status: 'upcoming',
  },
  {
    id: 'res-upcoming-3',
    equipmentId: 'eq-rowing-02',
    equipmentName: 'Rameur Ergometre Pro #02',
    equipmentCategory: 'cardio',
    equipmentZone: 'Studio Aviron · Niveau 1',
    equipmentImage: rowingImg,
    dateISO: '2026-11-14',
    dateLabel: '14/11/2026',
    startTime: '10:00',
    endTime: '11:00',
    durationMinutes: 60,
    status: 'upcoming',
  },
  {
    id: 'res-hist-1',
    equipmentId: 'eq-treadmill-01',
    equipmentName: 'Tapis de course Aurora S10 #01',
    equipmentCategory: 'cardio',
    equipmentZone: 'Zone Cardio Nord · Niveau 1',
    equipmentImage: treadmillImg,
    dateISO: '2026-11-12',
    dateLabel: '12/11/2026',
    startTime: '18:00',
    endTime: '19:00',
    durationMinutes: 60,
    status: 'completed',
    caloriesEstimate: 485,
    sessionNote: '8,4 km · Allure moyenne 5:18/km',
  },
  {
    id: 'res-hist-2',
    equipmentId: 'eq-cable-01',
    equipmentName: 'Station Poulie Double #01',
    equipmentCategory: 'fonctionnel',
    equipmentZone: 'Espace Fonctionnel · Rez-de-chaussée',
    equipmentImage: cablePulleyImg,
    dateISO: '2026-11-10',
    dateLabel: '10/11/2026',
    startTime: '12:00',
    endTime: '12:30',
    durationMinutes: 30,
    status: 'completed',
    caloriesEstimate: 210,
    sessionNote: 'Haut du corps · 16 séries complétées',
  },
  {
    id: 'res-hist-3',
    equipmentId: 'eq-squat-01',
    equipmentName: 'Rack Squat Olympique #01',
    equipmentCategory: 'musculation',
    equipmentZone: 'Halle Force · Rez-de-chaussée',
    equipmentImage: squatRackImg,
    dateISO: '2026-11-08',
    dateLabel: '08/11/2026',
    startTime: '09:00',
    endTime: '10:00',
    durationMinutes: 60,
    status: 'completed',
    caloriesEstimate: 340,
    sessionNote: 'Squat & Soulevé de terre · 5 x 5',
  },
  {
    id: 'res-hist-4',
    equipmentId: 'eq-rowing-02',
    equipmentName: 'Rameur Ergometre Pro #02',
    equipmentCategory: 'cardio',
    equipmentZone: 'Studio Aviron · Niveau 1',
    equipmentImage: rowingImg,
    dateISO: '2026-11-06',
    dateLabel: '06/11/2026',
    startTime: '19:00',
    endTime: '19:30',
    durationMinutes: 30,
    status: 'cancelled',
    sessionNote: 'Annulée par le membre à 16:40',
  },
];

export const INITIAL_PROFILE: MemberProfile = {
  fullName: 'Camille Laurent',
  initials: 'CL',
  memberId: 'SGC-20489',
  membershipTier: 'Abonnement Élite',
  clubName: 'Lyon Confluence',
  weeklyGoal: 4,
  reminderEnabled: true,
  reminderMinutes: 15,
  preferredZone: 'toutes',
};

export const CATEGORY_LABELS: Record<EquipmentItem['category'], string> = {
  cardio: 'Cardio',
  musculation: 'Musculation',
  fonctionnel: 'Fonctionnel',
};

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function generateTimeSlots(durationMinutes: 30 | 60): { start: string; end: string; label: string }[] {
  const slots: { start: string; end: string; label: string }[] = [];
  const step = durationMinutes;
  const startTotal = 8 * 60; // 08:00
  const endTotal = 20 * 60; // 20:00

  for (let m = startTotal; m + step <= endTotal; m += step) {
    const sh = Math.floor(m / 60);
    const sm = m % 60;
    const eh = Math.floor((m + step) / 60);
    const em = (m + step) % 60;
    const start = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
    const end = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
    slots.push({ start, end, label: `${start} - ${end}` });
  }
  return slots;
}
