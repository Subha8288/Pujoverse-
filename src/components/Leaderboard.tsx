import React, { useState } from 'react';
import { PhotoEntry, VideoEntry } from '../types/contest';
import {
  Trophy,
  TrendingUp,
  Heart,
  MapPin,
  Camera,
  Film,
  Crown,
  ArrowUp,
  ArrowDown,
  Instagram,
  CheckCircle2,
  Play
} from 'lucide-react';

interface LeaderboardProps {
  photos: PhotoEntry[];
  videos?: VideoEntry[];
  selectedDayNumber: number;
  onInspectPhoto: (photo: PhotoEntry) => void;
  onInspectVideo?: (video: VideoEntry) => void;
  onVotePhoto: (photoId: string) => void;
  onVoteVideo?: (videoId: string) => void;
  votedIds: string[];
  votedVideoIds?: string[];
  isPast11PM?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  photos,
  videos = [],
  selectedDayNumber,
  onInspectPhoto,
  onInspectVideo,
  onVotePhoto,
  onVoteVideo,
  votedIds,
  votedVideoIds = [],
  isPast11PM
}) => {
  const [boardType, setBoardType] = useState<'photos' | 'videos'>('photos');

  // Filter for selected day
  const dayPhotos = photos.filter((p) => p.dayNumber === selectedDayNumber);
  const dayVideos = videos.filter((v) => v.dayNumber === selectedDayNumber);

  // Sort by votes
  const sortedPhotos = [...dayPhotos].sort((a, b) => b.votes - a.votes);
  const totalPhotoVotes = dayPhotos.reduce((sum, p) => sum + p.votes, 0);

  const sortedVideos = [...dayVideos].sort((a, b) => b.votes - a.votes);
  const totalVideoVotes = dayVideos.reduce((sum, v) => sum + v.votes, 0);

  const activeItems = boardType === 'photos' ? sortedPhotos : sortedVideos;
  const totalVotes = boardType === 'photos' ? totalPhotoVotes : totalVideoVotes;
  const podium = activeItems.slice(0, 3);
  const remaining = activeItems.slice(3);

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 font-mono">
              {isPast11PM ? 'Official Results & Final Ranks' : 'Live Tournament Leaderboard'}
            </span>
            {isPast11PM ? (
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-bold font-mono">
                🔒 Standings Locked at 11:00 PM Cutoff
              </span>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Real-Time Sync</span>
              </>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display mt-0.5">
            Day {selectedDayNumber}{' '}
            {boardType === 'photos' ? 'Photo Standings' : 'Video Reel Standings'}
          </h2>
        </div>

        {/* Board Switcher: Photo Leaderboard vs Video Leaderboard */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.05] border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setBoardType('photos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              boardType === 'photos'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>📸 Photos ({dayPhotos.length})</span>
          </button>

          <button
            onClick={() => setBoardType('videos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              boardType === 'videos'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>🎬 Videos ({dayVideos.length})</span>
            <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase font-mono">
              NEW
            </span>
          </button>
        </div>
      </div>

      {activeItems.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-[#151724] border border-white/10 max-w-md mx-auto my-6 shadow-xl">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-display">
            No Standings for Day {selectedDayNumber} ({boardType}) Yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            As soon as participants submit their festival captures or reels, real-time rankings and vote percentages will populate here.
          </p>
        </div>
      ) : (
        <>
          {/* Podium Top 3 */}
          {podium.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {podium.map((item, index) => {
                const rank = index + 1;
                const isPhoto = 'imageUrl' in item;
                const photo = isPhoto ? (item as PhotoEntry) : null;
                const video = !isPhoto ? (item as VideoEntry) : null;

                const hasVoted = isPhoto
                  ? votedIds.includes(item.id)
                  : votedVideoIds.includes(item.id);
                const share =
                  totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (photo) onInspectPhoto(photo);
                      else if (video && onInspectVideo) onInspectVideo(video);
                    }}
                    className={`relative rounded-2xl p-4 transition-all duration-300 border cursor-pointer group flex flex-col justify-between ${
                      rank === 1
                        ? 'bg-gradient-to-b from-amber-500/15 via-[#181a29] to-[#121320] border-amber-400/40 shadow-xl shadow-amber-500/10 order-1 md:order-2 md:-translate-y-2'
                        : rank === 2
                        ? 'bg-gradient-to-b from-slate-400/10 via-[#181a29] to-[#121320] border-slate-400/30 shadow-lg order-2 md:order-1'
                        : 'bg-gradient-to-b from-amber-700/10 via-[#181a29] to-[#121320] border-amber-700/30 shadow-lg order-3'
                    }`}
                  >
                    {/* Crown / Rank Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-black font-mono flex items-center gap-1 ${
                          rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : 'bg-amber-700 text-white'
                        }`}
                      >
                        {rank === 1 && <Crown className="w-3.5 h-3.5" />}
                        <span>#{rank}</span>
                      </span>

                      <span className="text-xs font-mono font-bold text-amber-300">
                        {item.votes} votes ({share}%)
                      </span>
                    </div>

                    {/* Image / Video Thumbnail */}
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-950 border border-white/10">
                      <img
                        src={photo ? photo.imageUrl : video?.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!isPhoto && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-9 h-9 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-amber-300 font-semibold truncate max-w-[85%]">
                        {item.pandalLocation}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {photo
                          ? photo.photographerName
                          : video?.videographerName}
                        {photo?.instagramHandle
                          ? ` (${photo.instagramHandle})`
                          : video?.instagramHandle
                          ? ` (${video.instagramHandle})`
                          : ''}
                      </p>
                    </div>

                    {/* Vote button */}
                    <div
                      className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[11px] text-slate-400 font-mono">
                        {photo
                          ? photo.cameraGear.cameraOrPhone
                          : video?.cameraGear?.cameraOrPhone || 'Video Reel'}
                      </span>
                      <button
                        onClick={() => {
                          if (isPhoto) onVotePhoto(item.id);
                          else if (onVoteVideo) onVoteVideo(item.id);
                        }}
                        disabled={hasVoted || isPast11PM}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                          hasVoted
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-rose-300'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            hasVoted ? 'fill-current' : ''
                          }`}
                        />
                        <span>{hasVoted ? 'Voted' : 'Vote'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Standings Ladder Table */}
          <div className="rounded-2xl border border-white/10 bg-[#131522] overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                {boardType === 'photos'
                  ? 'All Photo Contestants Ladder'
                  : 'All Video Contestants Ladder'}
              </span>
              <span className="text-xs text-amber-400 font-mono">
                Total Votes: {totalVotes}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-4 text-center">Rank</th>
                    <th className="py-2.5 px-4">Entry</th>
                    <th className="py-2.5 px-4 hidden sm:table-cell">Creator</th>
                    <th className="py-2.5 px-4 hidden md:table-cell">Pandal</th>
                    <th className="py-2.5 px-4 text-center">Share</th>
                    <th className="py-2.5 px-4 text-right">Votes</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeItems.map((item, index) => {
                    const rank = index + 1;
                    const isPhoto = 'imageUrl' in item;
                    const photo = isPhoto ? (item as PhotoEntry) : null;
                    const video = !isPhoto ? (item as VideoEntry) : null;

                    const hasVoted = isPhoto
                      ? votedIds.includes(item.id)
                      : votedVideoIds.includes(item.id);
                    const share =
                      totalVotes > 0
                        ? Math.round((item.votes / totalVotes) * 100)
                        : 0;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          if (photo) onInspectPhoto(photo);
                          else if (video && onInspectVideo) onInspectVideo(video);
                        }}
                        className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4 text-center font-bold font-mono">
                          {rank === 1 ? (
                            <span className="text-amber-400">👑 #1</span>
                          ) : rank === 2 ? (
                            <span className="text-slate-300">🥈 #2</span>
                          ) : rank === 3 ? (
                            <span className="text-amber-600">🥉 #3</span>
                          ) : (
                            <span className="text-slate-500">#{rank}</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={photo ? photo.imageUrl : video?.thumbnailUrl}
                              alt={item.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0 border border-white/10"
                            />
                            <div>
                              <div className="font-bold text-white text-xs line-clamp-1 group-hover:text-amber-400">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {photo
                                  ? photo.cameraGear.cameraOrPhone
                                  : video?.duration || 'Reel'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 hidden sm:table-cell text-slate-300">
                          <span className="font-medium">
                            {photo
                              ? photo.photographerName
                              : video?.videographerName}
                          </span>
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell text-slate-400">
                          <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{item.pandalLocation}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center font-mono font-medium text-amber-300">
                          {share}%
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-400 tabular-nums">
                          {item.votes}
                        </td>

                        <td
                          className="py-3 px-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              if (isPhoto) onVotePhoto(item.id);
                              else if (onVoteVideo) onVoteVideo(item.id);
                            }}
                            disabled={hasVoted || isPast11PM}
                            className={`p-1.5 rounded-lg transition-colors ${
                              hasVoted
                                ? 'bg-rose-500 text-white'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                hasVoted ? 'fill-current' : ''
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
