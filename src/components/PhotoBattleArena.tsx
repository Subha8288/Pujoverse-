import React, { useState } from 'react';
import { PhotoEntry, FestivalDay, UserProfile } from '../types/contest';
import {
  Crown,
  Heart,
  MapPin,
  Camera,
  Share2,
  ZoomIn,
  Clock,
  Sparkles,
  Trophy,
  CheckCircle2,
  Instagram,
  AlertCircle,
  TrendingUp,
  Flame,
  Award,
  UserCheck,
  ShieldCheck,
  Users,
  Upload,
  MessageCircle,
  Edit3,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotoBattleArenaProps {
  photos: PhotoEntry[];
  day: FestivalDay;
  votedPhotoId: string | null;
  currentUser?: UserProfile;
  onCastVote: (photoId: string) => void;
  onInspectPhoto: (photo: PhotoEntry) => void;
  onSharePhoto: (photo: PhotoEntry) => void;
  onOpenUploadModal?: () => void;
  onOpenProfileModal?: () => void;
  onEditPhoto?: (photo: PhotoEntry) => void;
  onDeletePhoto?: (photoId: string) => void;
  isPast11PM: boolean;
  timeUntil11PM: string;
}

export const PhotoBattleArena: React.FC<PhotoBattleArenaProps> = ({
  photos,
  day,
  votedPhotoId,
  currentUser,
  onCastVote,
  onInspectPhoto,
  onSharePhoto,
  onOpenUploadModal,
  onOpenProfileModal,
  onEditPhoto,
  onDeletePhoto,
  isPast11PM,
  timeUntil11PM
}) => {
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'verified_humans'>('all');
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  // Sort participants by live votes descending to determine tournament rank
  const rankedPhotos = [...photos].sort((a, b) => b.votes - a.votes);
  const totalVotesToday = photos.reduce((acc, p) => acc + p.votes, 0);
  const topPhoto = rankedPhotos[0] || null;
  const votedPhoto = photos.find((p) => p.id === votedPhotoId) || null;

  // Real human photographers list
  const realHumanCreators = Array.from(
    new Map(
      photos.map((p) => [
        p.photographerName,
        {
          name: p.photographerName,
          avatar: p.photographerAvatar,
          instagram: p.instagramHandle,
          gear: p.cameraGear.cameraOrPhone,
          city: p.city,
          photoTitle: p.title,
          photoId: p.id,
          votes: p.votes
        }
      ])
    ).values()
  );

  const displayedPhotos =
    activeTabFilter === 'verified_humans'
      ? rankedPhotos.filter((p) => p.isVerifiedHuman !== false)
      : rankedPhotos;

  const handleVote = (photo: PhotoEntry) => {
    if (votedPhotoId || isPast11PM) return;

    onCastVote(photo.id);

    // Confetti celebration for casting daily vote
    confetti({
      particleCount: 55,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#E11D48', '#10B981', '#3B82F6']
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ARENA HEADER: All-Participant Live Tournament for Real Players */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171a29] via-[#12141f] to-[#1a1324] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5" />
                All-Participant Battle Arena
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Real Human Photographers
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-300 font-semibold">{day.title}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
              Battle for Today's Divine Crown
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
              Built for <strong className="text-emerald-300 font-semibold">real players & photographers</strong>.
              1v1 duels are outdated — here all participants battle simultaneously! Every human gets{' '}
              <strong className="text-amber-300">exactly 1 vote per day</strong>. Review all entries and choose
              your champion before the 11:00 PM cutoff!
            </p>

            {/* Voting Rule Status Banner */}
            <div className="mt-4 p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-start gap-3 text-xs">
              {votedPhoto ? (
                <div className="flex items-start gap-2.5 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Your 1 Daily Vote is Locked In!</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      You voted for <strong className="text-amber-300">"{votedPhoto.title}"</strong> by{' '}
                      <span className="text-white font-medium">{votedPhoto.photographerName}</span>
                      {votedPhoto.instagramHandle && ` (${votedPhoto.instagramHandle})`}.
                      Standings update live with every community vote until 11:00 PM!
                    </p>
                  </div>
                </div>
              ) : isPast11PM ? (
                <div className="flex items-start gap-2.5 text-rose-300">
                  <Clock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Battle Concluded at 11:00 PM</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      Uploads and voting closed at 11:00 PM. Final tournament ranks are locked below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 text-amber-300">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">1 Chance to Vote Today (Anti-Bot Fair Play)</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      Review all participating photos below and tap "Cast My 1 Vote" on your top pick.
                      Once cast, your vote is locked until the 11:00 PM daily cutoff!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 11:00 PM Cutoff & Stats Widget */}
          <div className="lg:min-w-[280px] p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Daily 11:00 PM Cutoff</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isPast11PM
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {isPast11PM ? 'CLOSED' : 'LIVE'}
              </span>
            </div>

            <div className="text-3xl font-extrabold font-mono text-white tracking-wider tabular-nums mb-1">
              {isPast11PM ? '11 : 00 : 00' : timeUntil11PM}
            </div>

            <div className="text-[11px] text-slate-400 leading-snug">
              {isPast11PM
                ? '🔒 Battles closed at 11:00 PM. Leaderboard locked!'
                : 'Last upload time is 11:00 PM. After 11:00 PM battles close and final ranks lock.'}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Live Votes:</span>
                <span className="font-bold text-amber-400 text-sm tabular-nums">
                  {totalVotesToday}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Real Photographers:</span>
                <span className="font-semibold text-emerald-400 tabular-nums">
                  {realHumanCreators.length} verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REAL HUMAN PHOTOGRAPHERS ROSTER & ARENA HUB */}
      {realHumanCreators.length > 0 && (
        <div className="bg-[#141624] rounded-2xl border border-white/10 p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                Real Human Photographers in Today's Arena ({realHumanCreators.length})
              </h3>
            </div>

          <div className="flex items-center gap-2">
            {onOpenUploadModal && !isPast11PM && (
              <button
                onClick={onOpenUploadModal}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-rose-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Enter Arena With My Click</span>
              </button>
            )}
            {onOpenProfileModal && (
              <button
                onClick={onOpenProfileModal}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>My Player Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Real Creators Carousel Chips */}
        <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {realHumanCreators.map((creator) => (
            <div
              key={creator.name}
              className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-400/30 transition-all shrink-0 min-w-[210px]"
            >
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-8 h-8 rounded-full object-cover border border-amber-400/50"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate font-display">
                    {creator.name}
                  </span>
                  <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                </div>
                {creator.instagram && (
                  <a
                    href={`https://instagram.com/${creator.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-0.5 truncate"
                  >
                    <Instagram className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{creator.instagram}</span>
                  </a>
                )}
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {creator.gear}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* PHOTO OF THE DAY HIGHLIGHT BANNER (Features Rank #1) */}
      {topPhoto && (
        <section className="relative rounded-3xl overflow-hidden border-2 border-amber-400/90 bg-gradient-to-br from-amber-950/40 via-[#181a28] to-[#10121c] p-5 sm:p-7 shadow-2xl shadow-amber-950/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Pill: Photo of the Day */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider font-display shadow-md">
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>Photo of the Day · Live Leader</span>
              </div>
              <span className="text-xs text-emerald-300 font-mono flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Human Shot
              </span>
              <span className="text-xs text-amber-300 font-mono hidden sm:inline">
                Rank #1 in All-Participant Battle
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {currentUser?.isOwner && onEditPhoto && (
                <button
                  type="button"
                  onClick={() => onEditPhoto(topPhoto)}
                  className="px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                  title="Edit Photo Details & Name (Ruler Access)"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              )}

              {Boolean(currentUser?.isOwner || (currentUser?.id && currentUser.id === topPhoto.userId)) && onDeletePhoto && (
                deletingCardId === topPhoto.id ? (
                  <div className="flex items-center gap-1.5 bg-black/90 px-3 py-1 rounded-full border border-rose-500/60 shadow-xl backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => {
                        onDeletePhoto(topPhoto.id);
                        setDeletingCardId(null);
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCardId(null)}
                      className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeletingCardId(topPhoto.id)}
                    className="px-3 py-1 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                    title="Delete Leader Photo from Contest (Ruler/Owner)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Photo</span>
                  </button>
                )
              )}

              <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <span>{Math.round((topPhoto.votes / (totalVotesToday || 1)) * 100)}% of today's votes</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400 font-bold tabular-nums">{topPhoto.votes} votes</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Photo */}
            <div
              onClick={() => onInspectPhoto(topPhoto)}
              className="lg:col-span-7 relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group cursor-pointer shadow-xl"
            >
              <img
                src={topPhoto.imageUrl}
                alt={topPhoto.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-400/80 text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Rank #1 Current Leader</span>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSharePhoto(topPhoto);
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

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-xs text-amber-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{topPhoto.pandalLocation}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5 truncate">
                  {topPhoto.title}
                </h3>
              </div>
            </div>

            {/* Details & Action */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
              <div>
                {/* Photographer attribution */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={topPhoto.photographerAvatar}
                      alt={topPhoto.photographerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div className="text-base font-bold text-white font-display">
                          {topPhoto.photographerName}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                          Human Creator ✓
                        </span>
                      </div>
                      {topPhoto.instagramHandle ? (
                        <a
                          href={`https://instagram.com/${topPhoto.instagramHandle.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
                        >
                          <Instagram className="w-3 h-3" />
                          <span>{topPhoto.instagramHandle}</span>
                        </a>
                      ) : (
                        <div className="text-xs text-slate-400">Festival Photographer</div>
                      )}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-3xl font-black text-amber-400 tabular-nums">
                      {topPhoto.votes}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase">Live Votes</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed line-clamp-3">
                  "{topPhoto.caption}"
                </p>

                {/* EXIF */}
                <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>{topPhoto.cameraGear.cameraOrPhone}</span>
                  </div>
                  {topPhoto.cameraGear.shutter && <span>· {topPhoto.cameraGear.shutter}</span>}
                  {topPhoto.cameraGear.aperture && <span>· {topPhoto.cameraGear.aperture}</span>}
                  {topPhoto.cameraGear.iso && <span>· ISO {topPhoto.cameraGear.iso}</span>}
                  {topPhoto.comments && topPhoto.comments.length > 0 && (
                    <span className="text-amber-300 ml-auto flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {topPhoto.comments.length} praises
                    </span>
                  )}
                </div>
              </div>

              {/* Vote CTA */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-xs font-mono">
                  {votedPhotoId === topPhoto.id ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Your 1 vote is counted here!
                    </span>
                  ) : votedPhotoId ? (
                    <span className="text-slate-400">
                      Your 1 vote was cast for another entry
                    </span>
                  ) : (
                    <span className="text-amber-300">You have 1 vote to cast today</span>
                  )}
                </div>

                <button
                  onClick={() => handleVote(topPhoto)}
                  disabled={Boolean(votedPhotoId) || isPast11PM}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg ${
                    votedPhotoId === topPhoto.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : votedPhotoId
                      ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                      : isPast11PM
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 active:scale-95 shadow-amber-500/20'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      votedPhotoId === topPhoto.id ? 'fill-emerald-400 text-emerald-400' : 'fill-slate-950'
                    }`}
                  />
                  <span>
                    {votedPhotoId === topPhoto.id
                      ? 'Voted ✓ (1 Vote Cast)'
                      : votedPhotoId
                      ? '1 Vote Used'
                      : isPast11PM
                      ? 'Battle Closed'
                      : 'Cast My 1 Vote'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL PARTICIPANTS BATTLE GRID */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>All Contestants Ranking Arena ({displayedPhotos.length} Photographers)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live tournament rankings based on community voting. Rank recalibrates instantly on every vote.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="hidden sm:inline">Anti-Bot: 1 Human = 1 Vote</span>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span>
              {isPast11PM
                ? '🔒 11:00 PM Reached: Final Tournament Standings'
                : '⚡ Live Standings: 1 Vote Per User Rule'}
            </span>
          </div>
        </div>

        {displayedPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedPhotos.map((photo, index) => {
              const rank = index + 1;
              const isVotedForThis = votedPhotoId === photo.id;
              const hasVotedAny = Boolean(votedPhotoId);
              const voteShare = totalVotesToday > 0 ? Math.round((photo.votes / totalVotesToday) * 100) : 0;

              return (
                <div
                  key={photo.id}
                  onClick={() => onInspectPhoto(photo)}
                  className={`group relative bg-[#151724] rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-lg hover:shadow-amber-500/10 ${
                    isVotedForThis
                      ? 'border-emerald-400/80 ring-2 ring-emerald-400/40 bg-emerald-950/10'
                      : rank === 1
                      ? 'border-amber-400/60'
                      : 'border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  {/* Photo Visual */}
                  <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold font-mono">
                      {rank === 1 && <span className="text-amber-400 flex items-center gap-1"><Crown className="w-3.5 h-3.5 fill-amber-400" /> Rank #1</span>}
                      {rank === 2 && <span className="text-slate-300">🥈 Rank #2</span>}
                      {rank === 3 && <span className="text-amber-600">🥉 Rank #3</span>}
                      {rank > 3 && <span className="text-slate-400">Rank #{rank}</span>}
                    </div>

                    {/* Top Right Badges & Ruler Moderation Actions */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 flex-wrap justify-end">
                      {isVotedForThis && (
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px] font-mono flex items-center gap-1 shadow-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Your 1 Vote</span>
                        </div>
                      )}

                      {/* Ruler Edit button */}
                      {currentUser?.isOwner && onEditPhoto && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditPhoto(photo);
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-md transition-all hover:scale-105"
                          title="Edit Photo Details & Name (Ruler Access)"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}

                      {/* Ruler / Creator Delete button */}
                      {Boolean(currentUser?.isOwner || (currentUser?.id && currentUser.id === photo.userId)) && onDeletePhoto && (
                        deletingCardId === photo.id ? (
                          <div
                            className="flex items-center gap-1 bg-black/95 p-1 rounded-lg border border-rose-500/80 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeletePhoto(photo.id);
                                setDeletingCardId(null);
                              }}
                              className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black shadow"
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingCardId(null);
                              }}
                              className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingCardId(photo.id);
                            }}
                            className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-md transition-all hover:scale-105"
                            title="Delete Photo from Contest (Ruler/Owner)"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )
                      )}
                    </div>

                    {/* Pandal on Bottom */}
                    <div className="absolute bottom-3 left-3 right-14 z-10 text-white">
                      <div className="flex items-center gap-1 text-xs text-amber-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{photo.pandalLocation}</span>
                      </div>
                    </div>

                    {/* Quick share button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSharePhoto(photo);
                      }}
                      className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white backdrop-blur-md transition-all shadow"
                      title="Share Card"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Photographer Profile & Instagram */}
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <img
                            src={photo.photographerAvatar}
                            alt={photo.photographerName}
                            className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-white block leading-tight">
                                {photo.photographerName}
                              </span>
                              <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                            </div>
                            {photo.instagramHandle && (
                              <a
                                href={`https://instagram.com/${photo.instagramHandle.replace('@', '')}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1"
                              >
                                <Instagram className="w-2.5 h-2.5" />
                                <span>{photo.instagramHandle}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="text-right font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
                          {photo.comments && photo.comments.length > 0 && (
                            <span className="text-[10px] text-amber-300 flex items-center gap-0.5">
                              <MessageCircle className="w-3 h-3 text-amber-400" />
                              <span>{photo.comments.length}</span>
                            </span>
                          )}
                          <span>{photo.timestamp}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white font-display mt-2.5 line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>

                      {/* Camera Gear Pill */}
                      <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 truncate">
                        <Camera className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{photo.cameraGear.cameraOrPhone}</span>
                        {photo.cameraGear.aperture && <span>· {photo.cameraGear.aperture}</span>}
                      </div>

                      {/* Live Vote Share Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                          <span className="text-slate-400">Vote Share:</span>
                          <span className="text-amber-300 font-bold">{voteShare}% ({photo.votes} votes)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              rank === 1
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                : rank === 2
                                ? 'bg-slate-300'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.max(voteShare, 5)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vote CTA for This Participant */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="text-xs font-mono">
                        <span className="text-lg font-bold text-amber-400 tabular-nums">
                          {photo.votes}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">votes</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(photo);
                        }}
                        disabled={hasVotedAny || isPast11PM}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isVotedForThis
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default shadow-sm'
                            : hasVotedAny
                            ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                            : isPast11PM
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:brightness-110 active:scale-95 text-white shadow-md shadow-rose-950/40'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isVotedForThis ? 'fill-emerald-400 text-emerald-400' : 'fill-white'
                          }`}
                        />
                        <span>
                          {isVotedForThis
                            ? '✓ Your Choice'
                            : hasVotedAny
                            ? '1 Vote Used'
                            : isPast11PM
                            ? `Rank #${rank}`
                            : 'Cast My 1 Vote'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#151724] border border-white/10 max-w-lg mx-auto my-6 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              Ready for Day {day.dayNumber} Battle!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
              No photos have been uploaded yet for this day. Be the first creator to enter your Durga Puja capture and lead the arena!
            </p>
            {onOpenUploadModal && !isPast11PM && (
              <button
                type="button"
                onClick={onOpenUploadModal}
                className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 mx-auto shadow-lg shadow-amber-500/20 transition-all"
              >
                <Upload className="w-4 h-4 text-slate-950" />
                <span>Upload First Photo Now</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* LIVE TOURNAMENT RANKINGS TABLE */}
      <div className="bg-[#141624] rounded-2xl border border-white/10 p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              {isPast11PM ? 'Official Concluded Standings (11:00 PM Cutoff)' : 'Live Tournament Leaderboard Standings'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {isPast11PM ? '🔒 Final Ranks Locked' : '⚡ Updating in Real Time'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/5 text-[11px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Participant & Shot</th>
                <th className="py-2.5 px-3">Pandal / Landmark</th>
                <th className="py-2.5 px-3 text-right">Votes</th>
                <th className="py-2.5 px-3 text-right">Vote Share</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rankedPhotos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-mono text-xs">
                    No active tournament submissions yet for Day {day.dayNumber}. Be the first to upload!
                  </td>
                </tr>
              ) : (
                rankedPhotos.map((p, idx) => {
                  const rank = idx + 1;
                  const isUserVote = votedPhotoId === p.id;
                  const share = totalVotesToday > 0 ? Math.round((p.votes / totalVotesToday) * 100) : 0;

                return (
                  <tr
                    key={p.id}
                    onClick={() => onInspectPhoto(p)}
                    className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                      isUserVote ? 'bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-mono font-bold">
                      {rank === 1 && <span className="text-amber-400">👑 #1</span>}
                      {rank === 2 && <span className="text-slate-300">🥈 #2</span>}
                      {rank === 3 && <span className="text-amber-600">🥉 #3</span>}
                      {rank > 3 && <span className="text-slate-400">#{rank}</span>}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-10 h-8 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white font-display truncate max-w-[180px] sm:max-w-xs">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span>{p.photographerName}</span>
                            <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                            {p.instagramHandle && (
                              <span className="text-rose-400 font-mono text-[10px]">
                                {p.instagramHandle}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-300 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{p.pandalLocation}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-400 text-sm tabular-nums">
                      {p.votes}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                      {share}%
                    </td>

                    <td className="py-3 px-3 text-right">
                      {isUserVote ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                          ✓ Your Vote
                        </span>
                      ) : rank === 1 ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                          {isPast11PM ? 'Champion' : 'Leading'}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[10px]">
                          Rank #{rank}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
