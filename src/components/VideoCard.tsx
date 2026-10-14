import React from 'react';
import { VideoEntry, UserProfile } from '../types/contest';
import { Play, Flame, Heart, MessageSquare, Share2, MapPin, Video, Eye, ShieldCheck, Film } from 'lucide-react';

interface VideoCardProps {
  video: VideoEntry;
  hasVotedToday: boolean;
  isVotedByMe: boolean;
  onVote: (videoId: string) => void;
  onInspect: (video: VideoEntry) => void;
  onShare: (video: VideoEntry) => void;
  currentUser: UserProfile;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  hasVotedToday,
  isVotedByMe,
  onVote,
  onInspect,
  onShare,
  currentUser
}) => {
  const isMine =
    (video.userId && video.userId === currentUser.id) ||
    video.videographerName === currentUser.name;

  return (
    <div
      onClick={() => onInspect(video)}
      className="group relative bg-[#131522] rounded-2xl border border-white/10 hover:border-rose-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-rose-500/10 flex flex-col cursor-pointer"
    >
      {/* Video Poster Container */}
      <div className="relative aspect-[9/12] w-full bg-slate-950 overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
          loading="lazy"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e101c] via-black/25 to-black/40 pointer-events-none" />

        {/* Duration Badge & Format */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-white font-mono text-[10px] font-bold flex items-center gap-1 border border-white/10">
            <Film className="w-3 h-3 text-rose-400" />
            <span>{video.duration || 'Reel'}</span>
          </span>
          {video.awardBadge && (
            <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-[10px] shadow-sm">
              {video.awardBadge}
            </span>
          )}
        </div>

        {/* Views Count */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-mono font-medium flex items-center gap-1 border border-white/10">
            <Eye className="w-3 h-3 text-slate-400" />
            <span>{video.views ? `${(video.views / 1000).toFixed(1)}k` : '3.2k'}</span>
          </span>
        </div>

        {/* Large Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-13 h-13 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl shadow-rose-950/80 group-hover:scale-115 group-hover:bg-rose-500 transition-all duration-300 border border-white/30 backdrop-blur-sm">
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Pandal Location Pill */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-amber-300 text-[11px] font-semibold max-w-full">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{video.pandalLocation}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-[#131522] to-[#0d0e17]">
        {/* Title & Caption */}
        <div>
          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-rose-300 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {video.caption}
          </p>
        </div>

        {/* Videographer Info */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={video.videographerAvatar}
              alt={video.videographerName}
              className="w-7 h-7 rounded-full object-cover border border-rose-500/40 shrink-0"
            />
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
                <span>{video.videographerName}</span>
                {video.isVerifiedHuman && (
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                )}
              </div>
              {video.cameraGear && (
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {video.cameraGear.cameraOrPhone}
                </div>
              )}
            </div>
          </div>

          {/* Comment Count */}
          <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{video.comments ? video.comments.length : 0}</span>
          </div>
        </div>

        {/* Voting & Action Footer */}
        <div className="flex items-center justify-between gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          {/* Vote Button */}
          <button
            onClick={() => onVote(video.id)}
            disabled={hasVotedToday && !isVotedByMe}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isVotedByMe
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : hasVotedToday
                ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed opacity-60'
                : 'bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 active:scale-95'
            }`}
            title={
              isVotedByMe
                ? 'Your today vote is placed on this video!'
                : hasVotedToday
                ? 'You already used your 1 daily vote today'
                : 'Cast your 1 daily vote for this video'
            }
          >
            <Heart className={`w-3.5 h-3.5 ${isVotedByMe ? 'fill-current' : ''}`} />
            <span>{video.votes}</span>
            <span className="hidden xs:inline">{isVotedByMe ? 'Voted' : 'Vote'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(video)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Share Video"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
