import { ShieldCheck, Wifi, X } from 'lucide-react';
import { MemberProfile } from '../types/gym';

interface AccessPassModalProps {
  profile: MemberProfile;
  onClose: () => void;
}

export function AccessPassModal({ profile, onClose }: AccessPassModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-[2px] p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Badge d’accès NFC et QR"
    >
      <div
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-6 space-y-5 shadow-[0_20px_35px_rgba(15,23,42,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F172A]">
              Badge d’accès salle
            </h2>
            <p className="text-xs text-[#64748B]">
              {profile.clubName} · {profile.membershipTier}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le badge d’accès"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean deterministic geometric QR code pattern */}
        <div className="bg-[#F3F6F7] rounded-[16px] p-6 flex flex-col items-center">
          <div className="bg-white p-4 rounded-[14px] shadow-xs">
            <svg
              width="148"
              height="148"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label={`Code QR membre ${profile.memberId}`}
            >
              {/* Finder top-left */}
              <path d="M0 0h7v7H0V0zm1 1v5h5V1H1zm1 1h3v3H2V2z" fill="#00565E" />
              {/* Finder top-right */}
              <path d="M14 0h7v7h-7V0zm1 1v5h5V1h-5zm1 1h3v3h-3V2z" fill="#00565E" />
              {/* Finder bottom-left */}
              <path d="M0 14h7v7H0v-7zm1 1v5h5v-5H1zm1 1h3v3H2v-3z" fill="#00565E" />
              {/* Data modules */}
              <path
                d="M9 1h1v2H9V1zm2 0h2v1h-2V1zm-1 3h2v1h-2V4zM8 6h3v1H8V6zm4 1h1v2h-1V7zM9 8h2v2H9V8zM1 9h2v1H1V9zm3 0h2v2H4V9zm4 2h3v1H8v-1zm4-1h2v2h-2v-2zm3-1h2v1h-2V9zm3 0h2v2h-2V9zm-6 3h1v3h-1v-3zm-4 1h2v2H8v-2zm7 0h3v1h-3v-1zm-5 3h2v1h-2v-1zm3 1h2v2h-2v-2zm3-2h2v2h-2v-2zm3 1h1v3h-1v-3zm-9 2h2v2H9v-2z"
                fill="#0F172A"
              />
            </svg>
          </div>

          <p className="mt-4 font-display text-base font-bold text-[#0F172A]">
            {profile.fullName}
          </p>
          <p className="font-mono text-xs font-semibold text-[#1F6F78] tabular-nums mt-0.5">
            {profile.memberId}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-[12px] bg-[#E8F3F4] text-[#00565E] text-xs font-medium">
          <span className="inline-flex items-center gap-2">
            <Wifi className="w-4 h-4 rotate-90 shrink-0" />
            <span>Approchez votre téléphone du lecteur machine</span>
          </span>
          <ShieldCheck className="w-4 h-4 text-[#2E9E4F] shrink-0" />
        </div>
      </div>
    </div>
  );
}
