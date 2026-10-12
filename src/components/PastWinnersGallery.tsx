import React from 'react';
import { FestivalDay, PhotoEntry } from '../types/contest';
import { Crown, Trophy, MapPin, Camera, Share2, Award, Calendar, Instagram } from 'lucide-react';

interface PastWinnersGalleryProps {
  days: FestivalDay[];
  allPhotos: PhotoEntry[];
  onInspectPhoto: (photo: PhotoEntry) => void;
  onSharePhoto: (photo: PhotoEntry) => void;
}

export const PastWinnersGallery: React.FC<PastWinnersGalleryProps> = ({
  days,
  allPhotos,
  onInspectPhoto,
  onSharePhoto
}) => {
  // Find winning photos across all festival days
  const winnerCards = days.map((day) => {
    const winnerPhoto = allPhotos.find((p) => p.id === day.winnerId);
    return {
      day,
      winnerPhoto
    };
  });

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-2 font-mono">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>10-Day Festival Hall of Fame</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Crowned Photographs of PujoVerse
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Day 1 is concluded and its champion immortalized. Every day's champion is decided through community majority votes and live battle arena rankings. Cached offline for pandal hoppers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {winnerCards.map(({ day, winnerPhoto }) => {
          if (!winnerPhoto) {
            const isLive = day.status === 'active';
            return (
              <div
                key={day.dayNumber}
                className="bg-[#141624] rounded-2xl border border-white/5 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span>Day {day.dayNumber} · {day.dateDisplay}</span>
                    <span
                      className={`font-bold uppercase ${
                        isLive ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {isLive ? 'Live Arena Open' : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display">{day.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{day.themePrompt}</p>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-amber-300">
                  {isLive
                    ? '👑 Voting active now! Winner will be crowned at 11:00 PM cutoff.'
                    : `Opens on ${day.dateDisplay} at 2:00 AM.`}
                </div>
              </div>
            );
          }

          return (
            <article
              key={day.dayNumber}
              onClick={() => onInspectPhoto(winnerPhoto)}
              className="group bg-[#151724] rounded-2xl border border-amber-500/30 hover:border-amber-400/80 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col shadow-xl"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                <img
                  src={winnerPhoto.imageUrl}
                  alt={winnerPhoto.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Day Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-1 font-mono">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Day {day.dayNumber} Champion</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSharePhoto(winnerPhoto);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
                  title="Share Winner Card"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <div className="text-xs font-bold font-display truncate">
                    {winnerPhoto.title}
                  </div>
                  <div className="text-[11px] text-amber-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{winnerPhoto.pandalLocation}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-amber-400 font-semibold uppercase mb-1">
                    {day.bengaliTitle} · {day.dateDisplay}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {winnerPhoto.caption}
                  </p>

                  <div className="mt-3 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>{winnerPhoto.cameraGear.cameraOrPhone}</span>
                    {winnerPhoto.cameraGear.shutter && (
                      <>
                        <span className="text-slate-600">·</span>
                        <span>{winnerPhoto.cameraGear.shutter}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={winnerPhoto.photographerAvatar}
                      alt={winnerPhoto.photographerName}
                      className="w-6 h-6 rounded-full object-cover border border-amber-400"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block leading-tight">
                        {winnerPhoto.photographerName}
                      </span>
                      {winnerPhoto.instagramHandle && (
                        <span className="text-[10px] text-rose-400 font-mono block leading-tight">
                          {winnerPhoto.instagramHandle}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                    {winnerPhoto.votes} votes
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
