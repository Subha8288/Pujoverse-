import React from 'react';
import { PhotoEntry } from '../types/contest';
import { Trophy, TrendingUp, Heart, MapPin, Camera, Crown, ArrowUp, ArrowDown, Instagram, CheckCircle2 } from 'lucide-react';

interface LeaderboardProps {
  photos: PhotoEntry[];
  selectedDayNumber: number;
  onInspectPhoto: (photo: PhotoEntry) => void;
  onVotePhoto: (photoId: string) => void;
  votedIds: string[];
  isPast11PM?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  photos,
  selectedDayNumber,
  onInspectPhoto,
  onVotePhoto,
  votedIds,
  isPast11PM
}) => {
  // Sort photos by votes descending
  const sortedPhotos = [...photos].sort((a, b) => b.votes - a.votes);
  const totalVotes = photos.reduce((sum, p) => sum + p.votes, 0);

  const podium = sortedPhotos.slice(0, 3);
  const remaining = sortedPhotos.slice(3);

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6">
      {/* Header */}
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
            Day {selectedDayNumber} {isPast11PM ? 'Winner Crowned & Final Standings' : 'Rankings Ladder'}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{isPast11PM ? 'Tracking who won and which participant is in which rank' : 'Strict 1-Vote-Per-User Community Majority Rule'}</span>
        </div>
      </div>

      {/* Podium Top 3 */}
      {podium.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {podium.map((photo, index) => {
            const rank = index + 1;
            const hasVoted = votedIds.includes(photo.id);
            const share = totalVotes > 0 ? Math.round((photo.votes / totalVotes) * 100) : 0;

            return (
              <div
                key={photo.id}
                onClick={() => onInspectPhoto(photo)}
                className={`relative rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-xl ${
                  rank === 1
                    ? 'bg-gradient-to-b from-amber-950/40 via-[#181a26] to-[#12141c] border-amber-400/90 md:-translate-y-2 ring-1 ring-amber-400/50'
                    : rank === 2
                    ? 'bg-[#161824] border-slate-400/50'
                    : 'bg-[#161824] border-amber-700/50'
                }`}
              >
                {/* Crown for #1 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-display">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : 'bg-amber-700 text-white'
                      }`}
                    >
                      #{rank}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {rank === 1 ? 'Tournament Leader 👑' : rank === 2 ? 'Runner-Up 🥈' : '3rd Place 🥉'}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                    {photo.votes} votes ({share}%)
                  </div>
                </div>

                {/* Photo Thumbnail */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-slate-900">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="text-xs font-bold truncate font-display">{photo.title}</div>
                    <div className="text-[11px] text-amber-300/80 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{photo.pandalLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Photographer & Instagram */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <img
                      src={photo.photographerAvatar}
                      alt={photo.photographerName}
                      className="w-6 h-6 rounded-full object-cover border border-amber-400/50"
                    />
                    <div>
                      <span className="font-semibold text-slate-200 truncate max-w-[120px] block leading-tight">
                        {photo.photographerName}
                      </span>
                      {photo.instagramHandle && (
                        <span className="text-rose-400 font-mono text-[10px] block leading-tight">
                          {photo.instagramHandle}
                        </span>
                      )}
                    </div>
                  </div>

                  {hasVoted && (
                    <span className="text-emerald-400 font-mono text-[10px] font-bold">
                      ✓ Your Vote
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="bg-[#151722] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            {isPast11PM ? 'Final Participant Standings (Locked)' : 'All Contestants Ranking Table'}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Total entries: {sortedPhotos.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#11131a] text-slate-400 uppercase tracking-wider border-b border-white/5 font-mono">
                <th className="py-3 px-4 w-14 text-center">Rank</th>
                <th className="py-3 px-4">Photo Entry</th>
                <th className="py-3 px-4 hidden sm:table-cell">Photographer</th>
                <th className="py-3 px-4 hidden md:table-cell">Pandal Location</th>
                <th className="py-3 px-4 text-center">Vote Share</th>
                <th className="py-3 px-4 text-right">Live Votes</th>
                <th className="py-3 px-4 text-center">Vote Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedPhotos.map((photo, index) => {
                const rank = index + 1;
                const hasVoted = votedIds.includes(photo.id);
                const share = totalVotes > 0 ? Math.round((photo.votes / totalVotes) * 100) : 0;

                return (
                  <tr
                    key={photo.id}
                    onClick={() => onInspectPhoto(photo)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center font-bold font-mono text-sm">
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

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-400 font-display">
                            {photo.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono line-clamp-1">
                            {photo.cameraGear.cameraOrPhone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell text-slate-300">
                      <div className="flex items-center gap-2">
                        <img
                          src={photo.photographerAvatar}
                          alt={photo.photographerName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <div>
                          <span className="truncate max-w-[120px] block font-semibold">{photo.photographerName}</span>
                          {photo.instagramHandle && (
                            <span className="text-rose-400 font-mono text-[10px] block">
                              {photo.instagramHandle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-400">
                      <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                        <span className="truncate">{photo.pandalLocation}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-medium text-amber-300">
                      {share}%
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sm text-amber-400 tabular-nums">
                      {photo.votes}
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onVotePhoto(photo.id)}
                        disabled={hasVoted || isPast11PM}
                        className={`p-1.5 rounded-lg transition-colors ${
                          hasVoted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : isPast11PM
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400'
                        }`}
                        title={hasVoted ? 'Your 1 vote cast' : 'Vote for photo'}
                      >
                        <Heart
                          className={`w-4 h-4 ${hasVoted ? 'fill-emerald-400 text-emerald-400' : ''}`}
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
    </div>
  );
};
