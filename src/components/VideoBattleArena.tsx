import React, { useMemo } from 'react';
import { VideoEntry, FestivalDay, UserProfile } from '../types/contest';
import { VideoCard } from './VideoCard';
import { VideoOfTheDayBanner } from './VideoOfTheDayBanner';
import {
  Film,
  Plus,
  Flame,
  Clock,
  Sparkles,
  Search,
  Filter,
  MapPin,
  Trophy,
  Info
} from 'lucide-react';

interface VideoBattleArenaProps {
  videos: VideoEntry[];
  currentDay: FestivalDay;
  votedVideoId: string | null;
  onVoteVideo: (videoId: string) => void;
  onInspectVideo: (video: VideoEntry) => void;
  onShareVideo: (video: VideoEntry) => void;
  currentUser: UserProfile;
  onOpenUploadVideo: () => void;
  selectedPandalFilter: string;
  onSelectPandalFilter: (pandal: string) => void;
  presentPandals: string[];
  filterMode: 'all' | 'top_voted' | 'most_recent' | 'my_uploads';
  onFilterModeChange: (mode: 'all' | 'top_voted' | 'most_recent' | 'my_uploads') => void;
  isPast11PM: boolean;
  timeUntil11PM: string;
}

export const VideoBattleArena: React.FC<VideoBattleArenaProps> = ({
  videos,
  currentDay,
  votedVideoId,
  onVoteVideo,
  onInspectVideo,
  onShareVideo,
  currentUser,
  onOpenUploadVideo,
  selectedPandalFilter,
  onSelectPandalFilter,
  presentPandals,
  filterMode,
  onFilterModeChange,
  isPast11PM,
  timeUntil11PM
}) => {
  // Filter videos for the selected day
  const dayVideos = useMemo(() => {
    return videos.filter((v) => v.dayNumber === currentDay.dayNumber);
  }, [videos, currentDay.dayNumber]);

  // Video of the day (top-voted)
  const topVideoOfDay = useMemo(() => {
    if (dayVideos.length === 0) return null;
    return [...dayVideos].sort((a, b) => b.votes - a.votes)[0];
  }, [dayVideos]);

  // Filtered by pandal and mode
  const filteredVideos = useMemo(() => {
    let list = [...dayVideos];

    if (selectedPandalFilter !== 'All Pandals') {
      list = list.filter((v) => v.pandalLocation === selectedPandalFilter);
    }

    if (filterMode === 'top_voted') {
      list.sort((a, b) => b.votes - a.votes);
    } else if (filterMode === 'most_recent') {
      list.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } else if (filterMode === 'my_uploads') {
      list = list.filter(
        (v) =>
          (v.userId && v.userId === currentUser.id) ||
          v.videographerName === currentUser.name ||
          (currentUser.uploadedVideoIds &&
            currentUser.uploadedVideoIds.includes(v.id))
      );
    }

    return list;
  }, [dayVideos, selectedPandalFilter, filterMode, currentUser]);

  const hasVotedToday = Boolean(votedVideoId);

  return (
    <div className="space-y-6">
      {/* 11:00 PM Daily Battle Cutoff Banner */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-[#141628] to-purple-950/40 p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-rose-300 font-mono flex items-center gap-2">
              <span>Durga Puja Video Arena · 10-Day Reels Battle</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/30 text-white text-[10px]">
                1 Vote/Day
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Cast your vote for the best Dhunuchi dance, pandal illumination, and Arati clips!
            </div>
          </div>
        </div>

        {/* Voting Countdown */}
        <div className="flex items-center gap-2 shrink-0 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-slate-400">Battle closes at 11 PM:</span>
          <span className="font-mono text-xs font-bold text-amber-300">
            {timeUntil11PM}
          </span>
        </div>
      </div>

      {/* Video of the Day Banner */}
      {topVideoOfDay && (
        <VideoOfTheDayBanner
          video={topVideoOfDay}
          currentDay={currentDay}
          onInspect={onInspectVideo}
          onVote={onVoteVideo}
          hasVoted={votedVideoId === topVideoOfDay.id}
        />
      )}

      {/* Pandal & Filter Controls */}
      <div className="bg-[#141624] rounded-2xl border border-white/10 p-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Pandal Filter */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <select
              value={selectedPandalFilter}
              onChange={(e) => onSelectPandalFilter(e.target.value)}
              className="w-full bg-[#1c1f2e] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 font-sans"
            >
              <option value="All Pandals">All Pandals & Landmarks</option>
              {presentPandals.map((pName) => (
                <option key={pName} value={pName}>
                  {pName}
                </option>
              ))}
            </select>

            {selectedPandalFilter !== 'All Pandals' && (
              <button
                onClick={() => onSelectPandalFilter('All Pandals')}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>

          {/* Filter Modes */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => onFilterModeChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterMode === 'all'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              All Clips ({dayVideos.length})
            </button>
            <button
              onClick={() => onFilterModeChange('top_voted')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                filterMode === 'top_voted'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Top Voted</span>
            </button>
            <button
              onClick={() => onFilterModeChange('most_recent')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                filterMode === 'most_recent'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Most Recent</span>
            </button>
            <button
              onClick={() => onFilterModeChange('my_uploads')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterMode === 'my_uploads'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              My Uploads
            </button>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              hasVotedToday={hasVotedToday}
              isVotedByMe={votedVideoId === video.id}
              onVote={onVoteVideo}
              onInspect={onInspectVideo}
              onShare={onShareVideo}
              currentUser={currentUser}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center rounded-3xl bg-[#121422] border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            No Video Clips Found in this Category
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Be the first videographer to post a Durga Puja reel, Dhunuchi dance video, or pandal lighting walkthrough for {currentDay.title}!
          </p>
          <button
            onClick={onOpenUploadVideo}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Upload Festival Reel</span>
          </button>
        </div>
      )}
    </div>
  );
};
