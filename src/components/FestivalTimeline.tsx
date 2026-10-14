import React from 'react';
import { FestivalDay } from '../types/contest';
import { CheckCircle2, Calendar, Flame, ArrowRight } from 'lucide-react';

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
  const activeDay = days.find((d) => d.status === 'active') || days[0];

  return (
    <section className="bg-[#10121a] border-b border-white/10 py-3.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Prominent LIVE TODAY Banner: Highly Highlighted & Unmissable */}
        {activeDay && (
          <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-500/25 via-rose-500/20 to-emerald-500/20 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.25)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3.5 w-3.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border border-white/80"></span>
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase font-mono tracking-wider animate-pulse shadow-sm">
                    🔴 LIVE TODAY
                  </span>
                  <span className="text-sm sm:text-base font-black text-amber-300 font-display tracking-tight">
                    Day {activeDay.dayNumber}: {activeDay.bengaliTitle} ({activeDay.title.split(':')[1]?.trim() || activeDay.title})
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 mt-0.5 font-medium flex items-center gap-2">
                  <span>📅 {activeDay.dateDisplay}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">1 Vote Per Day</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold font-mono">Voting Closes at 11:00 PM Tonight</span>
                </div>
              </div>
            </div>

            {selectedDayNumber !== activeDay.dayNumber ? (
              <button
                type="button"
                onClick={() => onSelectDay(activeDay.dayNumber)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Jump to Today's Live Battle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1 text-xs text-amber-300 font-bold font-mono px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Viewing Live Arena</span>
              </span>
            )}
          </div>
        )}

        {/* Subheader */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 font-display">
              10-Day Durga Puja Festival Calendar (11 Oct – 20 Oct)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Tap any day to view entries or historical winners
          </span>
        </div>

        {/* Horizontal scroll container with touch snap */}
        <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin focus:outline-none">
          {days.map((day) => {
            const isSelected = day.dayNumber === selectedDayNumber;
            const isLive = day.status === 'active';
            const isClosed = day.status === 'closed';

            let cardStyles = '';
            if (isLive && isSelected) {
              cardStyles =
                'bg-gradient-to-b from-amber-500/30 via-emerald-950/40 to-[#10121d] border-2 border-amber-300 ring-2 ring-emerald-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] text-white scale-[1.02] z-10';
            } else if (isLive && !isSelected) {
              cardStyles =
                'bg-gradient-to-b from-amber-500/20 via-[#1c1a2d] to-[#121320] border-2 border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.45)] text-white ring-1 ring-amber-400/40';
            } else if (isSelected) {
              cardStyles =
                'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 text-white shadow-lg shadow-amber-950/40';
            } else if (isClosed) {
              cardStyles =
                'bg-[#13151f] opacity-75 hover:opacity-100 hover:bg-[#181a26] border-white/10 hover:border-white/20 text-slate-400';
            } else {
              cardStyles =
                'bg-[#161824] hover:bg-[#1c1f2e] border-white/10 hover:border-white/20 text-slate-300';
            }

            return (
              <button
                key={day.dayNumber}
                onClick={() => onSelectDay(day.dayNumber)}
                className={`flex-shrink-0 text-left min-w-[175px] sm:min-w-[195px] p-2.5 rounded-xl border transition-all relative focus:outline-none flex flex-col justify-between cursor-pointer ${cardStyles}`}
              >
                <div>
                  {/* Top Bar on Day Pill: Day Number & Status */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                        isLive
                          ? 'text-amber-300 font-black'
                          : isSelected
                          ? 'text-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      Day {day.dayNumber} · {day.dateDisplay.split(' ')[0]} {day.dateDisplay.split(' ')[1]}
                    </span>

                    {isLive && (
                      <span className="flex items-center gap-1 text-[10px] text-white font-black uppercase tracking-tight bg-gradient-to-r from-rose-500 to-amber-500 px-2 py-0.5 rounded shadow-sm animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        LIVE
                      </span>
                    )}

                    {isClosed && (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded font-mono">
                        <CheckCircle2 className="w-3 h-3 text-amber-500" />
                        {day.dayNumber === 1 ? 'Concluded' : 'Closed'}
                      </span>
                    )}

                    {!isLive && !isClosed && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Upcoming
                      </span>
                    )}
                  </div>

                  {/* Bengali Tithi & Goddess Title */}
                  <div className={`text-xs font-bold truncate font-display ${isLive ? 'text-amber-200' : 'text-slate-100'}`}>
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
                    <span className="text-amber-300 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>Cutoff 11 PM</span>
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
