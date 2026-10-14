import React, { useState } from 'react';
import { PhotoEntry, UserProfile } from '../types/contest';
import {
  X,
  Heart,
  MapPin,
  Camera,
  Share2,
  Instagram,
  UserCheck,
  MessageCircle,
  Send,
  Sparkles,
  ShieldCheck,
  Edit3,
  Trash2
} from 'lucide-react';

interface PhotoDetailModalProps {
  photo: PhotoEntry | null;
  isOpen: boolean;
  onClose: () => void;
  hasVoted: boolean;
  hasVotedAnyToday?: boolean;
  isPast11PM?: boolean;
  currentUser?: UserProfile;
  onVote: (photoId: string) => void;
  onShare: (photo: PhotoEntry) => void;
  onAddComment?: (photoId: string, text: string) => void;
  onEditPhoto?: (photo: PhotoEntry) => void;
  onDeleteComment?: (photoId: string, commentId: string) => void;
  onDeletePhoto?: (photoId: string) => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  isOpen,
  onClose,
  hasVoted,
  hasVotedAnyToday,
  isPast11PM,
  currentUser,
  onVote,
  onShare,
  onAddComment,
  onEditPhoto,
  onDeleteComment,
  onDeletePhoto
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !photo) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !onAddComment) return;
    setIsSubmittingComment(true);
    onAddComment(photo.id, commentInput.trim());
    setCommentInput('');
    setIsSubmittingComment(false);
  };

  const comments = photo.comments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#141622] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Top Actions: Ruler Edit & Close */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {currentUser?.isOwner && onEditPhoto && (
            <button
              onClick={() => onEditPhoto(photo)}
              className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
              title="Edit Photo Details & Name (Ruler Access)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          )}

          {Boolean(currentUser?.isOwner || (currentUser?.id && currentUser.id === photo.userId)) && onDeletePhoto && (
            confirmDelete ? (
              <div className="flex items-center gap-1.5 bg-black/85 px-2.5 py-1 rounded-full border border-rose-500/60 shadow-xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => {
                    onDeletePhoto(photo.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Confirm</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded-full text-slate-300 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                title="Delete Photo from Contest"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Side (Left) */}
        <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px]">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-full object-contain max-h-[60vh] md:max-h-[85vh]"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-amber-300 font-semibold border border-white/10">
              Day {photo.dayNumber} Stage
            </span>
            {photo.isVerifiedHuman && (
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold font-mono border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Human Capture
              </span>
            )}
            {photo.awardBadge && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[11px] font-bold font-mono uppercase">
                {photo.awardBadge}
              </span>
            )}
          </div>
        </div>

        {/* Details Side (Right) */}
        <div className="md:w-2/5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto bg-[#141622]">
          <div className="space-y-4">
            {/* Photographer Details */}
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <img
                src={photo.photographerAvatar}
                alt={photo.photographerName}
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-bold text-white font-display truncate">
                    {photo.photographerName}
                  </h4>
                  {photo.isVerifiedHuman && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium flex items-center gap-0.5">
                      <UserCheck className="w-2.5 h-2.5 text-emerald-400" />
                      Human
                    </span>
                  )}
                </div>
                {photo.instagramHandle && (
                  <a
                    href={`https://instagram.com/${photo.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 transition-colors mt-0.5"
                  >
                    <Instagram className="w-3 h-3" />
                    <span>{photo.instagramHandle}</span>
                  </a>
                )}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{photo.pandalLocation}</span>
                </div>
              </div>
            </div>

            {/* Title & Caption */}
            <div>
              <h3 className="text-lg font-bold font-display text-white leading-snug">
                {photo.title}
              </h3>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                {photo.caption}
              </p>
            </div>

            {/* EXIF Data Panel */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>EXIF Capture Information</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Device</span>
                  <span className="font-medium text-slate-200 truncate block">
                    {photo.cameraGear.cameraOrPhone}
                  </span>
                </div>
                {photo.cameraGear.shutter && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Shutter</span>
                    <span className="font-medium text-slate-200">{photo.cameraGear.shutter}</span>
                  </div>
                )}
                {photo.cameraGear.aperture && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Aperture</span>
                    <span className="font-medium text-slate-200">{photo.cameraGear.aperture}</span>
                  </div>
                )}
                {photo.cameraGear.iso && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">ISO</span>
                    <span className="font-medium text-slate-200">{photo.cameraGear.iso}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Real Human Community Praises & Comments */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5 font-mono">
                  <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Real Human Praises ({comments.length})</span>
                </span>
                <span className="text-[10px] text-slate-500">Community Feedback</span>
              </div>

              {/* Comments List */}
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c.id} className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={c.userAvatar}
                            alt={c.userName}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-200 text-[11px]">{c.userName}</span>
                          {c.instagramHandle && (
                            <span className="text-[10px] text-rose-400/80 font-mono">
                              {c.instagramHandle}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-mono">{c.timestamp}</span>
                          {currentUser?.isOwner && onDeleteComment && (
                            <button
                              type="button"
                              onClick={() => onDeleteComment(photo.id, c.id)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                              title="Delete comment (Ruler Moderation)"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center rounded-lg bg-white/[0.02] text-slate-500 text-[11px]">
                    Be the first real human photographer to leave a praise for this capture!
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              {onAddComment && (
                <form onSubmit={handleCommentSubmit} className="mt-2.5 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={
                      currentUser
                        ? `Praise as ${currentUser.name}...`
                        : 'Write a real human praise...'
                    }
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim() || isSubmittingComment}
                    className="p-1.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 disabled:opacity-40 transition-colors"
                    title="Send Praise"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Modal Action Bar */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                {photo.votes}
              </div>
              <div className="text-[10px] text-slate-400">Verified community votes</div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {Boolean(currentUser?.isOwner || (currentUser?.id && currentUser.id === photo.userId)) && onDeletePhoto && (
                confirmDelete ? (
                  <div className="flex items-center gap-1.5 bg-rose-950/90 p-1 rounded-xl border border-rose-500/70 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        onDeletePhoto(photo.id);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Delete</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="p-2.5 rounded-xl border border-rose-500/30 hover:border-rose-500/60 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5 text-xs font-bold"
                    title="Delete Photo from Contest (Ruler/Owner)"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete Photo</span>
                  </button>
                )
              )}

              <button
                onClick={() => onShare(photo)}
                className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors"
                title="Create Festival Share Card"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onVote(photo.id)}
                disabled={hasVoted || hasVotedAnyToday || isPast11PM}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  hasVoted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : hasVotedAnyToday
                    ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                    : isPast11PM
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 text-white hover:brightness-110 active:scale-95 shadow-md shadow-rose-950/40'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    hasVoted ? 'fill-emerald-400 text-emerald-400' : 'fill-white'
                  }`}
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
        </div>
      </div>
    </div>
  );
};
