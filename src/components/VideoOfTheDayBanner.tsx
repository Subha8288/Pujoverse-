import React from 'react';
import { VideoEntry, FestivalDay } from '../types/contest';
import { Play, Trophy, Sparkles, MapPin, Eye, Heart, Film } from 'lucide-react';

interface VideoOfTheDayBannerProps {
  video: VideoEntry | null;
  currentDay: FestivalDay;
  onInspect: (video: VideoEntry) => void;
  onVote: (videoId: string) => void;
  hasVoted: boolean;
}

export const VideoOfTheDayBanner: React.FC<VideoOfTheDayBannerProps> = ({
  video,
  currentDay,
  onInspect,
  onVote,
  hasVoted
}) => {
  if (!video) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-rose-500/35 bg-gradient-to-r from-rose-950/40 via-[#161426] to-amber-950/40 p-4 sm:p-6 shadow-2xl">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left: Video Preview & Thumbnail with Play button */}
        <div
          onClick={() => onInspect(video)}
          className="relative w-full md:w-64 aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden border-2 border-rose-400/60 shadow-xl group cursor-pointer shrink-0"
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

          {/* Central Play Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-rose-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all border border-white/40">
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
            <Film className="w-3 h-3 text-rose-400" />
            <span>{video.duration || '0:58'}</span>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400 fill-current" />
            <span>{video.votes}</span>
          </div>
        </div>

        {/* Center: Crown, Day info, and Title */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold font-mono">
            <Trophy className="w-3.5 h-3.5 text-rose-400" />
            <span>Video of the Day · আজকের সেরা রিল</span>
            <span className="text-amber-400">★ #1 Ranked</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight leading-snug">
            {video.title}
          </h2>

          <p className="text-xs text-slate-300 max-w-xl line-clamp-2">
            {video.caption}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{video.pandalLocation}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1 font-semibold text-slate-200">
              <img
                src={video.videographerAvatar}
                alt={video.videographerName}
                className="w-4 h-4 rounded-full object-cover border border-rose-400"
              />
              <span>{video.videographerName}</span>
            </span>
            {video.cameraGear && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {video.cameraGear.cameraOrPhone}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Watch & Vote Action */}
        <div className="flex flex-row md:flex-col items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={() => onInspect(video)}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Watch Reel</span>
          </button>

          <button
            onClick={() => onVote(video.id)}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              hasVoted
                ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-rose-300 border-rose-500/30'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
            <span>{hasVoted ? 'Voted' : 'Cast Vote'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
