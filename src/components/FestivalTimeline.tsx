import React from 'react';
import { FestivalDay } from '../types/contest';
import { Sparkles, CheckCircle2, Clock, Calendar } from 'lucide-react';

interface FestivalTimelineProps {
  days: FestivalDay[];
  selectedDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
}

export const FestivalTimeline: React.FC<FestivalTimelineProps> = ({
  days,
  selectedDayNumber,
  onSelectDay
}) => {
  return (
    <section className="bg-[#10121a] border-b border-white/10 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 font-display">
              PujoVerse 10-Day Festival Calendar (11 Oct – 20 Oct 2026)
            </span>
            <span className="text-xs text-slate-400 hidden lg:inline">
              · Select any day to view photo entries, daily divine colors & guidelines
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Current Contest:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Day 2 Open from 12 Oct 2:00 AM (Cutoff 11:00 PM)
            </span>
          </div>
        </div>

        {/* Horizontal scroll container with touch snap */}
        <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin focus:outline-none">
          {days.map((day) => {
            const isSelected = day.dayNumber === selectedDayNumber;
            const isLive = day.status === 'active';
            const isClosed = day.status === 'closed';

            return (
              <button
                key={day.dayNumber}
                onClick={() => onSelectDay(day.dayNumber)}
                className={`flex-shrink-0 text-left min-w-[170px] sm:min-w-[190px] p-2.5 rounded-xl border transition-all relative focus:outline-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 text-white shadow-lg shadow-amber-950/40'
                    : 'bg-[#161824] hover:bg-[#1c1f2e] border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar on Day Pill: Day Number & Status */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isSelected ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      Day {day.dayNumber} · {day.dateDisplay.split(' ')[0]} {day.dateDisplay.split(' ')[1]}
                    </span>

                    {isLive && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-tight bg-emerald-500/20 px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                      </span>
                    )}

                    {isClosed && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded font-mono">
                        <CheckCircle2 className="w-3 h-3 text-amber-500" />
                        {day.dayNumber === 1 ? 'Day 1 Gone' : 'Closed'}
                      </span>
                    )}

                    {!isLive && !isClosed && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Upcoming
                      </span>
                    )}
                  </div>

                  {/* Bengali Tithi & Goddess Title */}
                  <div className="text-xs font-bold text-slate-100 truncate font-display">
                    {day.bengaliTitle}
                  </div>

                  {/* Goddess Name */}
                  <div className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                    {day.goddess}
                  </div>
                </div>

                {/* Auspicious Color Code Tag */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0 shadow-sm"
                      style={{ backgroundColor: day.colorBadgeHex }}
                    />
                    <span className="text-slate-300 truncate font-semibold">
                      {day.auspiciousColor}
                    </span>
                  </div>

                  {isLive && (
                    <span className="text-amber-400 font-bold">
                      Cutoff 11 PM
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
