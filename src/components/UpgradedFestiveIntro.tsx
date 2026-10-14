import React, { useEffect } from 'react';
import { DurgaMascotLogo } from './DurgaMascotLogo';
import { StorageService } from '../services/storage';
import {
  X,
  Camera,
  Film,
  MapPin,
  Trophy,
  ArrowRight
} from 'lucide-react';

interface UpgradedFestiveIntroProps {
  isOpen: boolean;
  onEnter: () => void;
}

export const UpgradedFestiveIntro: React.FC<UpgradedFestiveIntroProps> = ({
  isOpen,
  onEnter
}) => {
  const durgaPhoto = StorageService.getDurgaPhoto();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onEnter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 select-none overflow-y-auto">
      {/* Background festive ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-500/20 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-rose-600/20 blur-[110px] animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#171929] via-[#10121f] to-[#0a0b12] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 text-center shadow-[0_0_80px_rgba(245,158,11,0.3)] my-auto max-h-[94vh] overflow-y-auto">
        {/* Top Close Button */}
        <button
          onClick={onEnter}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Close and Enter"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Festive Marigold Garland Header */}
        <div className="flex items-center justify-center gap-1.5 mb-2 text-xs select-none">
          <span className="text-amber-400">🌼</span>
          <span className="text-rose-500">🌺</span>
          <span className="text-amber-400">🌼</span>
          <span className="text-rose-500">🌺</span>
          <span className="text-amber-400">🌼</span>
        </div>

        {/* Divine Maa Durga Artwork in Golden Halo */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 border-dashed animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-1.5 rounded-full border border-rose-500/40 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md animate-pulse" />
          <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-xl bg-[#141220] flex items-center justify-center p-1">
            <DurgaMascotLogo
              size={80}
              showHalo={false}
              customImageUrl={durgaPhoto && durgaPhoto !== 'mascot' ? durgaPhoto : undefined}
            />
          </div>
          {/* Traditional Diyas */}
          <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-xl drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">🪔</span>
          <span className="absolute -right-2 top-1/2 -translate-y-1/2 text-xl drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">🪔</span>
        </div>

        {/* Shubho Sharodiya Greeting */}
        <div className="inline-block px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold font-serif tracking-wider shadow-inner mb-1.5">
          শুভ শারদীয়া · Shubho Sharodiya
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-display tracking-tight leading-tight">
          PUJOVERSE 2026
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
          The 10-Day Durga Puja Festival & Creative Showcase Arena
        </p>

        {/* Highlights Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 text-left">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
              <Camera className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Photo Arena</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Pandal snapshots, genuine human photography & 1-vote daily battle.
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30">
            <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
              <Film className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Video Reels</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Dhunuchi dance clips, lighting reels, Sandhi Puja arati & festival videos.
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Custom Pandals</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Input and discover local para pandals across all districts of Bengal.
            </p>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Daily Crowns</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              11:00 PM nightly cutoff locks winners into the festival Hall of Fame.
            </p>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onEnter}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Enter Live Arena · প্রবেশ করুন</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
