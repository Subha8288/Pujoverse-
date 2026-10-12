import React from 'react';
import { PhotoEntry } from '../types/contest';
import { Crown, Heart, MapPin, Camera, Share2, ZoomIn, Sparkles, Clock, Instagram } from 'lucide-react';

interface PhotoOfTheDayBannerProps {
  photo: PhotoEntry | null;
  dayNumber: number;
  dayTitle: string;
  hasVoted: boolean;
  hasVotedAnyToday?: boolean;
  onVote: (photoId: string) => void;
  onInspect: (photo: PhotoEntry) => void;
  onShare: (photo: PhotoEntry) => void;
  isPast11PM: boolean;
}

export const PhotoOfTheDayBanner: React.FC<PhotoOfTheDayBannerProps> = ({
  photo,
  dayNumber,
  dayTitle,
  hasVoted,
  hasVotedAnyToday,
  onVote,
  onInspect,
  onShare,
  isPast11PM
}) => {
  if (!photo) return null;

  return (
    <section className="relative rounded-3xl overflow-hidden border-2 border-amber-400/90 bg-gradient-to-br from-amber-950/40 via-[#181a28] to-[#10121c] p-5 sm:p-7 shadow-2xl shadow-amber-950/40 transition-all">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider font-display shadow-md">
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>Photo of the Day · Leader</span>
          </div>
          <span className="text-xs text-amber-300 font-mono hidden sm:inline">
            Day {dayNumber} Frontrunner
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className={isPast11PM ? 'text-rose-400 font-bold' : 'text-slate-300'}>
            {isPast11PM
              ? '🔒 Battle Closed at 11:00 PM · Final Standings Locked'
              : '⏳ Daily Battle Closes at 11:00 PM Tonight'}
          </span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left / Top: High-Impact Visual Photo Display */}
        <div
          onClick={() => onInspect(photo)}
          className="lg:col-span-7 relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group cursor-pointer shadow-xl"
        >
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Quick inspect & share buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(photo);
              }}
              className="p-2 rounded-full bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white backdrop-blur-md transition-all shadow"
              title="Share Photo Card"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <div className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md group-hover:scale-110 transition-transform">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>

          {/* Rank #1 Crown Overlay */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-400/60 text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Rank #1 in Live Arena</span>
          </div>

          {/* Pandal and Title on image bottom */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{photo.pandalLocation}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5 truncate">
              {photo.title}
            </h3>
          </div>
        </div>

        {/* Right / Bottom: Story, Photographer Details & Voting Action */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div>
            {/* Photographer Card */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={photo.photographerAvatar}
                  alt={photo.photographerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <div className="text-base font-bold text-white font-display">
                    {photo.photographerName}
                  </div>
                  {photo.instagramHandle ? (
                    <a
                      href={`https://instagram.com/${photo.instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
                    >
                      <Instagram className="w-3 h-3" />
                      <span>{photo.instagramHandle}</span>
                    </a>
                  ) : (
                    <div className="text-xs text-slate-400">
                      {photo.photographerBio || 'Festival Photographer'}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
                  {photo.votes}
                </span>
                <span className="block text-[10px] text-slate-400 uppercase">Live Votes</span>
              </div>
            </div>

            {/* Story / Caption */}
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed line-clamp-3">
              "{photo.caption}"
            </p>

            {/* EXIF Settings Strip */}
            <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1 text-slate-300">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{photo.cameraGear.cameraOrPhone}</span>
              </div>
              {photo.cameraGear.shutter && <span>· {photo.cameraGear.shutter}</span>}
              {photo.cameraGear.aperture && <span>· {photo.cameraGear.aperture}</span>}
              {photo.cameraGear.iso && <span>· ISO {photo.cameraGear.iso}</span>}
            </div>
          </div>

          {/* Action Footer (Strict One-Vote Enforcement) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400 font-mono">
              {hasVoted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  ✓ Your 1 vote has been counted for this entry
                </span>
              ) : hasVotedAnyToday ? (
                <span className="text-slate-400">
                  Your 1 vote today has been cast for another entry
                </span>
              ) : (
                <span>⚡ You have 1 vote to cast for today's contest</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onInspect(photo)}
                className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 transition-colors"
              >
                Inspect
              </button>

              <button
                onClick={() => !hasVoted && !hasVotedAnyToday && onVote(photo.id)}
                disabled={hasVoted || hasVotedAnyToday || isPast11PM}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  hasVoted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : hasVotedAnyToday
                    ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                    : isPast11PM
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 active:scale-95 shadow-amber-500/20'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasVoted ? 'fill-emerald-400 text-emerald-400' : 'fill-slate-950'
                  }`}
                />
                <span>
                  {hasVoted
                    ? 'Your 1 Vote Cast ✓'
                    : hasVotedAnyToday
                    ? '1 Vote Used'
                    : isPast11PM
                    ? 'Battle Closed'
                    : 'Cast My 1 Vote'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
