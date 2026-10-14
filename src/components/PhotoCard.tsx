import React, { useState } from 'react';
import { PhotoEntry } from '../types/contest';
import { Heart, Camera, MapPin, Share2, Instagram, UserCheck, MessageCircle, Edit3, Trash2 } from 'lucide-react';

interface PhotoCardProps {
  photo: PhotoEntry;
  hasVoted: boolean;
  hasVotedAnyToday?: boolean;
  onVote: (photoId: string) => void;
  onInspect: (photo: PhotoEntry) => void;
  onShare: (photo: PhotoEntry) => void;
  rankBadge?: number;
  isPast11PM?: boolean;
  isOwner?: boolean;
  onEditPhoto?: (photo: PhotoEntry) => void;
  onDeletePhoto?: (photoId: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  hasVoted,
  hasVotedAnyToday,
  onVote,
  onInspect,
  onShare,
  rankBadge,
  isPast11PM,
  isOwner,
  onEditPhoto,
  onDeletePhoto
}) => {
  const [imageError, setImageError] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showGear, setShowGear] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVoted || isPast11PM) return;
    setIsVoting(true);
    onVote(photo.id);
    setTimeout(() => setIsVoting(false), 400);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(photo);
  };

  return (
    <article
      onClick={() => onInspect(photo)}
      className="group relative bg-[#151722] rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer shadow-lg hover:shadow-amber-500/5"
    >
      {/* Image Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
        {!imageError ? (
          <img
            src={photo.imageUrl}
            alt={photo.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-950/60 via-slate-900 to-rose-950/60 flex flex-col items-center justify-center p-4 text-center">
            <Camera className="w-10 h-10 text-amber-400/60 mb-2" />
            <span className="text-xs font-semibold text-amber-200/90">{photo.title}</span>
            <span className="text-[11px] text-slate-400 mt-1">{photo.pandalLocation}</span>
          </div>
        )}

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Rank Overlay (if top 3) */}
        {rankBadge && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-xs font-bold font-mono">
            {rankBadge === 1 && <span className="text-amber-400">👑 #1</span>}
            {rankBadge === 2 && <span className="text-slate-300">🥈 #2</span>}
            {rankBadge === 3 && <span className="text-amber-600">🥉 #3</span>}
            {rankBadge > 3 && <span className="text-slate-400">#{rankBadge}</span>}
          </div>
        )}

        {/* Award Badge Pill if present */}
        {photo.awardBadge && (
          <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold text-[10px] tracking-wide uppercase shadow">
            {photo.awardBadge}
          </div>
        )}

        {/* Quick action buttons on image */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
          {isOwner && onEditPhoto && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPhoto(photo);
              }}
              className="px-2 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-md transition-all hover:scale-105"
              title="Edit Photo Details & Name (Ruler Access)"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}

          {onDeletePhoto && (
            showConfirmDelete ? (
              <div
                className="flex items-center gap-1 bg-black/90 p-1 rounded-full border border-rose-500/60 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePhoto(photo.id);
                    setShowConfirmDelete(false);
                  }}
                  className="px-2 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmDelete(false);
                  }}
                  className="px-1.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 text-[10px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(true);
                }}
                className="px-2 py-1 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-md transition-all hover:scale-105"
                title="Delete Photo from Contest"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )
          )}
          <button
            onClick={handleShareClick}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-colors"
            title="Share Photo Card"
            aria-label="Share Photo"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pandal & City on image bottom */}
        <div className="absolute bottom-3 left-3 right-16 z-10 text-white">
          <div className="flex items-center gap-1 text-[11px] text-amber-300/90 font-medium">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{photo.pandalLocation}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Photographer header */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-2">
              <img
                src={photo.photographerAvatar}
                alt={photo.photographerName}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-200">{photo.photographerName}</span>
                {photo.isVerifiedHuman && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-0.5">
                    <UserCheck className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Real Human</span>
                  </span>
                )}
                {photo.instagramHandle && (
                  <a
                    href={`https://instagram.com/${photo.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-0.5"
                  >
                    <Instagram className="w-2.5 h-2.5" />
                    <span>{photo.instagramHandle}</span>
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {photo.comments && photo.comments.length > 0 && (
                <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-mono">
                  <MessageCircle className="w-3 h-3 text-slate-500" />
                  <span>{photo.comments.length}</span>
                </span>
              )}
              <span className="text-[11px] font-mono text-slate-500">{photo.timestamp}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white font-display tracking-tight leading-snug line-clamp-1 group-hover:text-amber-300 transition-colors">
            {photo.title}
          </h3>

          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {photo.caption}
          </p>

          {/* Clean Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="mt-2.5 flex items-center flex-wrap gap-1 text-[11px] text-slate-400 font-mono">
            <span>{photo.cameraGear.cameraOrPhone}</span>
            {photo.cameraGear.shutter && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{photo.cameraGear.shutter}</span>
              </>
            )}
            {photo.cameraGear.aperture && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{photo.cameraGear.aperture}</span>
              </>
            )}
            {photo.cameraGear.iso && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>ISO {photo.cameraGear.iso}</span>
              </>
            )}
          </div>
        </div>

        {/* Voting & Score Footer */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-lg font-bold text-amber-400 tabular-nums">
              {photo.votes}
            </span>
            <span className="text-xs text-slate-400">votes</span>
            {photo.matchups > 0 && (
              <span className="text-[11px] text-slate-500 ml-1">
                ({Math.round((photo.wins / photo.matchups) * 100)}% win rate)
              </span>
            )}
          </div>

          <button
            onClick={handleVoteClick}
            disabled={hasVoted || hasVotedAnyToday || isPast11PM}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[38px] ${
              hasVoted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default shadow-sm'
                : hasVotedAnyToday
                ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                : isPast11PM
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 text-white hover:brightness-110 active:scale-95 shadow-md shadow-rose-950/40'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                hasVoted ? 'fill-emerald-400 text-emerald-400' : hasVotedAnyToday ? 'text-slate-600' : 'fill-white'
              } ${isVoting ? 'scale-125 transition-transform' : ''}`}
            />
            <span>
              {hasVoted
                ? 'Your 1 Vote ✓'
                : hasVotedAnyToday
                ? '1 Vote Used'
                : isPast11PM
                ? 'Closed'
                : 'Cast 1 Vote'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
