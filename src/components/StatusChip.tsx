import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { EquipmentStatus } from '../types/gym';

interface StatusChipProps {
  status: EquipmentStatus;
  className?: string;
}

const STATUS_STYLES: Record<
  EquipmentStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  libre: {
    label: 'Libre',
    dotColor: '#2E9E4F',
    bgColor: 'rgba(46, 158, 79, 0.12)',
    textColor: '#006E2E',
  },
  occupe: {
    label: 'Occupé',
    dotColor: '#D9363E',
    bgColor: 'rgba(217, 54, 62, 0.10)',
    textColor: '#D9363E',
  },
  reserve: {
    label: 'Réservé',
    dotColor: '#E08A1E',
    bgColor: 'rgba(224, 138, 30, 0.12)',
    textColor: '#9C5B00',
  },
  indisponible: {
    label: 'Indisponible',
    dotColor: '#90A4AE',
    bgColor: 'rgba(144, 164, 174, 0.15)',
    textColor: '#546E7A',
  },
};

export function StatusChip({ status, className = '' }: StatusChipProps) {
  const cfg = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap shrink-0 ${className}`}
      style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: cfg.dotColor }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  );
}

export function LiveIndicatorBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F3F4] px-3 py-1 text-[12px] font-semibold text-[#1F6F78] whitespace-nowrap shrink-0">
      <span className="w-2 h-2 rounded-full bg-[#2E9E4F] live-dot-pulse shrink-0" aria-hidden="true" />
      En Direct
    </span>
  );
}

interface EquipmentImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function EquipmentImage({ src, alt, className = '' }: EquipmentImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#E8F3F4] to-[#E0E3E4] text-[#1F6F78] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Dumbbell className="w-6 h-6 opacity-75" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
