import React, { useEffect } from 'react';
import { PhotoEntry } from '../types/contest';
import { X, Crown, Sparkles, Share2, Award, Heart, MapPin, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WinnerShoutoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerPhoto: PhotoEntry | null;
  dayNumber: number;
  dayTitle: string;
  onShare: (photo: PhotoEntry) => void;
}

export const WinnerShoutoutModal: React.FC<WinnerShoutoutModalProps> = ({
  isOpen,
  onClose,
  winnerPhoto,
  dayNumber,
  dayTitle,
  onShare
}) => {
  useEffect(() => {
    if (isOpen) {
      // Grand celebratory confetti burst
      const end = Date.now() + 1500;
      const colors = ['#F59E0B', '#E11D48', '#FBBF24', '#FFFFFF'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen || !winnerPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#151724] rounded-2xl border-2 border-amber-400/80 shadow-2xl overflow-hidden p-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ceremony Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 font-mono">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Official Festival Winner Shoutout · Day {dayNumber}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
          Crowned Shot of the Day 👑
        </h2>
        <p className="text-xs text-amber-200/90 mt-1 max-w-md mx-auto">
          {dayTitle} — Decided by real-time majority community poll & photographic excellence
        </p>

        {/* Winning Photo Hero */}
        <div className="relative aspect-[16/9] w-full max-w-lg mx-auto rounded-xl overflow-hidden my-4 bg-slate-900 border border-amber-500/30 shadow-2xl">
          <img
            src={winnerPhoto.imageUrl}
            alt={winnerPhoto.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-3 left-3 right-3 text-left text-white">
            <div className="text-base font-bold font-display">{winnerPhoto.title}</div>
            <div className="text-xs text-amber-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{winnerPhoto.pandalLocation}</span>
            </div>
          </div>
        </div>

        {/* Photographer Accolade */}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 max-w-lg mx-auto text-left flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={winnerPhoto.photographerAvatar}
              alt={winnerPhoto.photographerName}
              className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <div className="text-sm font-bold text-white font-display">
                {winnerPhoto.photographerName}
              </div>
              {winnerPhoto.instagramHandle && (
                <div className="text-xs text-rose-400 font-mono">
                  {winnerPhoto.instagramHandle}
                </div>
              )}
              <div className="text-[11px] text-slate-400 font-mono">
                {winnerPhoto.cameraGear.cameraOrPhone}
              </div>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-xl font-black text-amber-400 tabular-nums">
              {winnerPhoto.votes}
            </div>
            <div className="text-[10px] text-slate-400 uppercase">Winning Votes</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => onShare(winnerPhoto)}
            className="px-4 py-2.5 rounded-xl border border-white/20 hover:border-amber-400 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Share Winner Card</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            Celebrate & Continue Voting
          </button>
        </div>
      </div>
    </div>
  );
};
