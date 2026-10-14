import React, { useState } from 'react';
import { VideoEntry, UserProfile, VideoComment } from '../types/contest';
import {
  X,
  Heart,
  Share2,
  MapPin,
  Camera,
  Send,
  Trash2,
  Edit3,
  ShieldCheck,
  Instagram,
  Sparkles,
  ExternalLink,
  Film
} from 'lucide-react';

interface VideoDetailModalProps {
  video: VideoEntry | null;
  isOpen: boolean;
  onClose: () => void;
  hasVoted: boolean;
  onVote: (videoId: string) => void;
  onAddComment: (videoId: string, comment: VideoComment) => void;
  currentUser: UserProfile;
  onShare: (video: VideoEntry) => void;
  onDeleteVideo?: (videoId: string) => void;
  onEditVideo?: (video: VideoEntry) => void;
}

export const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  video,
  isOpen,
  onClose,
  hasVoted,
  onVote,
  onAddComment,
  currentUser,
  onShare,
  onDeleteVideo,
  onEditVideo
}) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !video) return null;

  const isRuler = currentUser.isOwner;
  const isAuthor =
    (video.userId && video.userId === currentUser.id) ||
    video.videographerName === currentUser.name;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: VideoComment = {
      id: `vc-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      instagramHandle: currentUser.instagramHandle,
      text: commentText.trim(),
      timestamp: 'Just now',
      isVerifiedHuman: currentUser.isVerifiedHuman ?? true
    };

    onAddComment(video.id, newComment);
    setCommentText('');
  };

  // Convert youtube shorts / watch URLs into embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('shorts/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1`;
    }
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      const v = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${v}?autoplay=1&mute=0&controls=1`;
    }
    return url;
  };

  const isDirectVideo =
    video.videoUrl.startsWith('blob:') ||
    video.videoUrl.startsWith('data:video/') ||
    video.videoUrl.endsWith('.mp4') ||
    video.videoUrl.endsWith('.webm') ||
    video.videoUrl.endsWith('.mov') ||
    (!video.videoUrl.includes('youtube.com') && !video.videoUrl.includes('youtu.be'));

  const embedUrl = getEmbedUrl(video.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#111320] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Video Player Container */}
        <div className="lg:w-3/5 bg-black flex flex-col items-center justify-center relative min-h-[320px] lg:min-h-[580px] overflow-hidden">
          {isDirectVideo ? (
            <video
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain max-h-[60vh] lg:max-h-[85vh]"
            />
          ) : (
            <div className="w-full h-full aspect-[9/16] lg:aspect-auto max-h-[60vh] lg:max-h-[85vh] flex items-center justify-center">
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full min-h-[340px] lg:min-h-[540px] border-0"
              />
            </div>
          )}

          {/* Location Bar at bottom of video */}
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-xs text-amber-300">
            <span className="flex items-center gap-1.5 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{video.pandalLocation}</span>
            </span>
            {video.duration && (
              <span className="text-[11px] font-mono text-slate-300 shrink-0">
                ⏱ {video.duration}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Details, Videographer & Discussion */}
        <div className="lg:w-2/5 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto max-h-[50vh] lg:max-h-[92vh] bg-gradient-to-b from-[#111320] via-[#141727] to-[#0d0e17]">
          {/* Header & Videographer */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={video.videographerAvatar}
                  alt={video.videographerName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-rose-500/60"
                />
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{video.videographerName}</span>
                    {video.isVerifiedHuman && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </h4>
                  {video.instagramHandle && (
                    <a
                      href={`https://instagram.com/${video.instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono mt-0.5"
                    >
                      <Instagram className="w-3 h-3" />
                      <span>{video.instagramHandle}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Ruler & Author Quick Management Actions */}
              {(isRuler || isAuthor) && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {onEditVideo && (
                    <button
                      onClick={() => onEditVideo(video)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 transition-colors"
                      title="Edit Video Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDeleteVideo && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${video.title}" from Video Arena?`)) {
                          onDeleteVideo(video.id);
                          onClose();
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Title & Caption */}
            <div>
              <h2 className="text-lg font-black text-white leading-snug">
                {video.title}
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">
                {video.caption}
              </p>
            </div>

            {/* Camera Gear & Specs */}
            {video.cameraGear && (
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cinematography Gear:</span>
                </div>
                <div className="text-slate-200 font-medium">
                  {video.cameraGear.cameraOrPhone}
                  {video.cameraGear.lens ? ` · ${video.cameraGear.lens}` : ''}
                </div>
                {(video.cameraGear.shutter || video.cameraGear.aperture || video.cameraGear.iso) && (
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                    {video.cameraGear.shutter && <span>{video.cameraGear.shutter}</span>}
                    {video.cameraGear.aperture && <span>{video.cameraGear.aperture}</span>}
                    {video.cameraGear.iso && <span>ISO {video.cameraGear.iso}</span>}
                  </div>
                )}
              </div>
            )}

            {/* Voting Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => onVote(video.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  hasVoted
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500 hover:to-amber-500 text-rose-300 hover:text-white border border-rose-500/40 active:scale-95'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
                <span>{hasVoted ? 'Your Today Vote' : 'Vote for This Video'}</span>
                <span className="px-2 py-0.5 rounded-full bg-black/30 text-[11px] font-mono">
                  {video.votes} votes
                </span>
              </button>

              <button
                onClick={() => onShare(video)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Share Reel"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-4 pt-4 border-t border-white/10 flex-1 flex flex-col justify-between">
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Festival Feedback ({video.comments?.length || 0})</span>
              <span className="text-[11px] text-amber-400">শুভ শারদীয়া 🪔</span>
            </div>

            {/* Comment List */}
            <div className="space-y-2.5 overflow-y-auto max-h-44 pr-1 mb-3 scrollbar-thin">
              {video.comments && video.comments.length > 0 ? (
                video.comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <img
                          src={c.userAvatar}
                          alt={c.userName}
                          className="w-5 h-5 rounded-full object-cover border border-rose-400/40"
                        />
                        <span>{c.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {c.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs pl-6">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-500 italic">
                  Be the first to praise this Durga Puja reel!
                </div>
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your festive reaction (e.g. Darun Dhunuchi nach!)..."
                className="flex-1 bg-white/[0.05] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-white transition-all cursor-pointer"
                title="Post comment"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
