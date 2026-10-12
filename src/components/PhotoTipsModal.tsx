import React, { useState } from 'react';
import { FestivalDay } from '../types/contest';
import { BookOpen, Camera, Lightbulb, Sparkles, X, Sliders, CheckCircle2 } from 'lucide-react';

interface PhotoTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: FestivalDay[];
  initialDayNumber?: number;
}

export const PhotoTipsModal: React.FC<PhotoTipsModalProps> = ({
  isOpen,
  onClose,
  days,
  initialDayNumber = 9
}) => {
  const [activeDay, setActiveDay] = useState(initialDayNumber);

  if (!isOpen) return null;

  const currentDay = days.find((d) => d.dayNumber === activeDay) || days[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#141624] rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-display text-white">
                Festival Photography Masterclass & Critique
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Level up your photographic and cultural knowledge for every stage of Durga Puja
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar border-b border-white/5">
          {days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDay(day.dayNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all font-mono ${
                activeDay === day.dayNumber
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Day {day.dayNumber}: {day.bengaliTitle}
            </button>
          ))}
        </div>

        {/* Selected Day Content */}
        <div className="mt-5 space-y-5">
          {/* Theme Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-500/20">
            <div className="text-xs font-mono text-amber-400 font-semibold uppercase">
              Day {currentDay.dayNumber} Theme Challenge
            </div>
            <h3 className="text-lg font-bold text-white font-display mt-0.5">
              {currentDay.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {currentDay.themePrompt}
            </p>
          </div>

          {/* Masterclass Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#1a1d2e] border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>{currentDay.photographyTip.category}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-display">
                  {currentDay.photographyTip.headline}
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {currentDay.photographyTip.body}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-xs">
                <span className="text-slate-400 block text-[11px] font-mono">
                  Recommended Pro Settings:
                </span>
                <span className="text-amber-400 font-mono font-bold">
                  {currentDay.photographyTip.proSettingSuggestion}
                </span>
              </div>
            </div>

            {/* General Low-Light & Mobile Pro Secrets */}
            <div className="p-4 rounded-xl bg-[#1a1d2e] border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Pandal & Crowd Field Secrets</span>
              </div>

              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Avoid Bulb Blowout:</strong> Dial exposure compensation to -0.7 EV or -1.0 EV when capturing illuminated gates.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Framing with Marigolds:</strong> Bring floral garlands right up to your camera lens edge to create rich blurred foreground depth.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dhunuchi Smoke Backlighting:</strong> Stand with the pandal floodlights behind the dancer for dramatic golden rim silhouettes.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
          >
            Apply to Today's Photos
          </button>
        </div>
      </div>
    </div>
  );
};
