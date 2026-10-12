import React, { useState } from 'react';
import {
  UserProfile,
  PhotoEntry,
  FestivalDay,
  PandalLandmark
} from '../types/contest';
import { StorageService } from '../services/storage';
import {
  Crown,
  ShieldCheck,
  Calendar,
  Image,
  Award,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  Star,
  Clock,
  Megaphone,
  Plus,
  RefreshCw,
  X,
  ExternalLink,
  Flame,
  UserCheck,
  AlertTriangle,
  Send,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OwnerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  photos: PhotoEntry[];
  days: FestivalDay[];
  currentDayNumber: number;
  isPast11PM: boolean;
  onUpdateDay: (dayNumber: number, updates: Partial<FestivalDay>) => void;
  onUpdatePhoto: (photoId: string, updates: Partial<PhotoEntry>) => void;
  onDeletePhoto: (photoId: string) => void;
  onToggle11PMOverride: () => void;
  onClearMyDailyVote: () => void;
  onResetAllVotes: () => void;
  onBroadcastAnnouncement: (text: string) => void;
  onAddPandal: (name: string, zone?: string) => void;
  onInspectPhoto: (photo: PhotoEntry) => void;
  onSelectDay: (dayNumber: number) => void;
  onUpdateCurrentUser: (updated: UserProfile) => void;
  onOpenEditPhoto?: (photo: PhotoEntry) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  isOpen,
  onClose,
  currentUser,
  photos,
  days,
  currentDayNumber,
  isPast11PM,
  onUpdateDay,
  onUpdatePhoto,
  onDeletePhoto,
  onToggle11PMOverride,
  onClearMyDailyVote,
  onResetAllVotes,
  onBroadcastAnnouncement,
  onAddPandal,
  onInspectPhoto,
  onSelectDay,
  onUpdateCurrentUser,
  onOpenEditPhoto
}) => {
  const [activeTab, setActiveTab] = useState<'days' | 'photos' | 'voting' | 'broadcast' | 'pandals'>('days');
  const [filterDayNumber, setFilterDayNumber] = useState<number>(currentDayNumber);
  const [announcementText, setAnnouncementText] = useState('');
  const [newPandalName, setNewPandalName] = useState('');
  const [newPandalZone, setNewPandalZone] = useState('North Kolkata');
  const [newPandalMetro, setNewPandalMetro] = useState('');
  const [newPandalLandmark, setNewPandalLandmark] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Profile edit inside Owner portal
  const [isEditingOwnerBio, setIsEditingOwnerBio] = useState(false);
  const [ownerDisplayName, setOwnerDisplayName] = useState(currentUser.name);
  const [ownerInsta, setOwnerInsta] = useState(currentUser.instagramHandle || '@pujoverse_admin');

  if (!isOpen) return null;

  const currentFilterPhotos = photos.filter((p) => p.dayNumber === filterDayNumber);

  const handleSaveOwnerBio = () => {
    const updated: UserProfile = {
      ...currentUser,
      name: ownerDisplayName.trim() || currentUser.name,
      instagramHandle: ownerInsta.trim().startsWith('@') ? ownerInsta.trim() : `@${ownerInsta.trim()}`
    };
    onUpdateCurrentUser(updated);
    setIsEditingOwnerBio(false);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    onBroadcastAnnouncement(announcementText.trim());
    setAnnouncementText('');
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCreatePandal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPandalName.trim()) return;
    const effectiveZone = newPandalLandmark.trim() || newPandalZone;
    StorageService.addCustomPandal({
      name: newPandalName.trim(),
      zone: effectiveZone,
      city: newPandalLandmark.trim() || undefined,
      metroStation: newPandalMetro.trim() || undefined,
      addedBy: currentUser.name
    });
    onAddPandal(newPandalName.trim(), effectiveZone);
    setNewPandalName('');
    setNewPandalLandmark('');
    setNewPandalMetro('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#11131c] rounded-2xl border border-amber-500/40 shadow-2xl shadow-amber-500/10 text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-950/80 via-[#181a27] to-[#12141f] border-b border-amber-500/30 px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-display text-white tracking-tight">
                  PujoVerse Owner Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Master Access
                </span>
              </div>
              <p className="text-xs text-amber-300/80 font-sans">
                Full administrator controls for 10-day Durga Puja challenges, voting lock, and photo curation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Owner Info & Quick Status Strip */}
        <div className="bg-[#151724] border-b border-white/10 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-400/80"
            />
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono">
                  {currentUser.instagramHandle || '@owner'}
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Owner
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Logged in as Chief Organizer • Active Day: Day {currentDayNumber}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingOwnerBio((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-semibold"
            >
              {isEditingOwnerBio ? 'Cancel Editing' : 'Edit Owner Handle'}
            </button>
            <button
              onClick={onToggle11PMOverride}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                isPast11PM
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              }`}
            >
              {isPast11PM ? (
                <>
                  <Lock className="w-3.5 h-3.5" /> Arena Closed (Past 11 PM)
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5" /> Arena Live (Voting Open)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Owner Profile Editing Drawer */}
        {isEditingOwnerBio && (
          <div className="bg-[#181b2a] border-b border-amber-500/30 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Owner Display Name</label>
              <input
                type="text"
                value={ownerDisplayName}
                onChange={(e) => setOwnerDisplayName(e.target.value)}
                className="mt-1 w-full bg-[#11131c] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">Instagram Handle</label>
              <input
                type="text"
                value={ownerInsta}
                onChange={(e) => setOwnerInsta(e.target.value)}
                className="mt-1 w-full bg-[#11131c] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSaveOwnerBio}
                className="w-full py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
              >
                Save Owner Details
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-white/10 bg-[#0d0f17] overflow-x-auto">
          <button
            onClick={() => setActiveTab('days')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'days'
                ? 'bg-[#151724] text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            10-Day Festival Schedule
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'photos'
                ? 'bg-[#151724] text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Submissions & Curation ({photos.length})
          </button>

          <button
            onClick={() => setActiveTab('voting')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'voting'
                ? 'bg-[#151724] text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Arena & Vote Control
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'broadcast'
                ? 'bg-[#151724] text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            Official Adda Broadcast
          </button>

          <button
            onClick={() => setActiveTab('pandals')}
            className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pandals'
                ? 'bg-[#151724] text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Pandal Registry
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: 10-DAY FESTIVAL SCHEDULE */}
          {activeTab === 'days' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Full 10-Day Durga Puja Schedule & Status
                  </h3>
                  <p className="text-xs text-slate-400">
                    Day 1 (11 Oct) is concluded; Day 2 (12 Oct) is live. As owner, you can open, close, or test any day.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {days.map((day) => {
                  const dayPhotosCount = photos.filter((p) => p.dayNumber === day.dayNumber).length;
                  const winnerPhoto = photos.find((p) => p.id === day.winnerId);

                  return (
                    <div
                      key={day.dayNumber}
                      className={`p-4 rounded-xl border transition-all ${
                        day.dayNumber === currentDayNumber
                          ? 'bg-amber-500/10 border-amber-400/60 shadow-md'
                          : 'bg-[#151724] border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: day.colorBadgeHex }}
                          />
                          <span className="text-xs font-black font-mono text-amber-400">
                            Day {day.dayNumber}: {day.dateDisplay}
                          </span>
                        </div>

                        {/* Status badge & quick toggle */}
                        <div className="flex items-center gap-1">
                          <select
                            value={day.status}
                            onChange={(e) => {
                              onUpdateDay(day.dayNumber, { status: e.target.value as any });
                            }}
                            className={`text-[11px] font-bold rounded px-2 py-0.5 border focus:outline-none ${
                              day.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : day.status === 'closed'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-slate-800 text-slate-400 border-white/10'
                            }`}
                          >
                            <option value="active">Active (Voting Open)</option>
                            <option value="closed">Closed (Hall of Fame)</option>
                            <option value="upcoming">Upcoming (Preview)</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-sm font-bold text-white font-display">
                        {day.bengaliTitle} • {day.goddess}
                      </div>
                      <div className="text-xs text-amber-300/90 font-mono mt-0.5">
                        Auspicious Color: {day.auspiciousColor}
                      </div>
                      {day.openingSchedule && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Schedule: {day.openingSchedule}
                        </div>
                      )}

                      {/* Winner status */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                        <div className="text-slate-400">
                          {dayPhotosCount} Submissions
                          {winnerPhoto && (
                            <span className="text-amber-400 font-semibold ml-2">
                              🏆 Winner: {winnerPhoto.photographerName}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            onSelectDay(day.dayNumber);
                            onClose();
                          }}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          View Arena →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SUBMISSIONS & CURATION */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Curate Contestant Photos
                  </h3>
                  <p className="text-xs text-slate-400">
                    Verify human creators, boost quality clicks, or mark as Curator's Choice.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Day:</span>
                  <select
                    value={filterDayNumber}
                    onChange={(e) => setFilterDayNumber(Number(e.target.value))}
                    className="bg-[#1c1f2e] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    {days.map((d) => (
                      <option key={d.dayNumber} value={d.dayNumber}>
                        Day {d.dayNumber} ({d.dateDisplay})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentFilterPhotos.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-[#151724] rounded-xl border border-white/5">
                  No submissions yet for Day {filterDayNumber}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentFilterPhotos.map((photo) => {
                    const isWinner = days.find((d) => d.dayNumber === filterDayNumber)?.winnerId === photo.id;

                    return (
                      <div
                        key={photo.id}
                        className="bg-[#151724] rounded-xl border border-white/10 p-3.5 flex gap-3.5 hover:border-amber-500/40 transition-all"
                      >
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-slate-900">
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          {photo.isCuratorChoice && (
                            <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 p-1 rounded font-bold text-[9px] flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs sm:text-sm font-bold text-white truncate font-display">
                                {photo.title}
                              </h4>
                              <button
                                onClick={() => onInspectPhoto(photo)}
                                className="text-slate-400 hover:text-white p-1"
                                title="Inspect Full Photo"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-[11px] text-amber-300/90 truncate flex items-center gap-1.5 mt-0.5">
                              <span>by {photo.photographerName}</span>
                              {photo.instagramHandle && (
                                <span className="text-rose-400 font-mono text-[10px]">
                                  {photo.instagramHandle}
                                </span>
                              )}
                              {photo.isVerifiedHuman && (
                                <span className="text-emerald-400" title="Verified Human">
                                  ✓
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              📍 {photo.pandalLocation}
                            </div>

                            <div className="flex items-center gap-2 mt-1.5 text-xs">
                              <span className="font-mono font-bold text-amber-400">
                                {photo.votes} Votes
                              </span>
                              <span className="text-[10px] text-slate-500">
                                ({photo.wins}W / {photo.matchups}M)
                              </span>
                            </div>
                          </div>

                          {/* Owner Actions */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5 mt-2">
                            {/* Edit Details & Name */}
                            {onOpenEditPhoto && (
                              <button
                                onClick={() => onOpenEditPhoto(photo)}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-sm flex items-center gap-1"
                                title="Edit photo name, story, votes, and category"
                              >
                                <span>✏️ Edit Name & Details</span>
                              </button>
                            )}

                            {/* Verify Human */}
                            <button
                              onClick={() => {
                                onUpdatePhoto(photo.id, {
                                  isVerifiedHuman: !photo.isVerifiedHuman
                                });
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                photo.isVerifiedHuman
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                              }`}
                              title="Toggle Verified Human Creator Badge"
                            >
                              <UserCheck className="w-2.5 h-2.5 inline mr-1" />
                              {photo.isVerifiedHuman ? 'Verified Human' : 'Verify'}
                            </button>

                            {/* Curator's Choice */}
                            <button
                              onClick={() => {
                                onUpdatePhoto(photo.id, {
                                  isCuratorChoice: !photo.isCuratorChoice
                                });
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                photo.isCuratorChoice
                                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                              }`}
                            >
                              <Star className="w-2.5 h-2.5 inline mr-1" />
                              {photo.isCuratorChoice ? "Curator's Choice ✓" : "Pin Choice"}
                            </button>

                            {/* Award Day Winner */}
                            <button
                              onClick={() => {
                                onUpdateDay(filterDayNumber, {
                                  winnerId: isWinner ? null : photo.id
                                });
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                isWinner
                                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                              }`}
                            >
                              <Award className="w-2.5 h-2.5 inline mr-1" />
                              {isWinner ? 'Day Winner 🏆' : 'Make Winner'}
                            </button>

                            {/* Boost Votes */}
                            <button
                              onClick={() => {
                                onUpdatePhoto(photo.id, {
                                  votes: photo.votes + 5
                                });
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20"
                              title="Add 5 votes to this entry"
                            >
                              +5 Votes
                            </button>

                            {/* Moderate/Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete submission "${photo.title}"?`)) {
                                  onDeletePhoto(photo.id);
                                }
                              }}
                              className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ml-auto"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VOTING & ARENA LOCK CONTROL */}
          {activeTab === 'voting' && (
            <div className="space-y-4 max-w-2xl">
              <div className="pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Live Voting & Cutoff Controls
                </h3>
                <p className="text-xs text-slate-400">
                  Manage the daily 11:00 PM cutoff, reset testing votes, or enforce 1-vote limits.
                </p>
              </div>

              <div className="space-y-3">
                {/* 11:00 PM cutoff switch */}
                <div className="p-4 rounded-xl bg-[#151724] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      11:00 PM Daily Battle Cutoff
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Status:{' '}
                      <span className={isPast11PM ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {isPast11PM ? 'CLOSED (After 11:00 PM)' : 'OPEN (Before 11:00 PM)'}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={onToggle11PMOverride}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isPast11PM
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        : 'bg-rose-500 text-white hover:bg-rose-600'
                    }`}
                  >
                    {isPast11PM ? 'Force Reopen Voting' : 'Force Close at 11 PM'}
                  </button>
                </div>

                {/* Clear Daily Vote for Owner */}
                <div className="p-4 rounded-xl bg-[#151724] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-amber-400" />
                      Clear My Daily Vote Lock
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Clears your personal 1-vote lock for Day {currentDayNumber} so you can test voting again.
                    </p>
                  </div>
                  <button
                    onClick={onClearMyDailyVote}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30"
                  >
                    Clear My Vote
                  </button>
                </div>

                {/* Reset All Contest Votes (Danger Zone) */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Reset All Contest Votes & History
                    </div>
                    <p className="text-xs text-rose-200/70 mt-0.5">
                      Clears local vote records across all users for testing.
                    </p>
                  </div>
                  <div>
                    {showConfirmReset ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onResetAllVotes();
                            setShowConfirmReset(false);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                        >
                          Confirm Reset
                        </button>
                        <button
                          onClick={() => setShowConfirmReset(false)}
                          className="px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowConfirmReset(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30"
                      >
                        Reset Votes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL ADDA BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="space-y-4 max-w-2xl">
              <div className="pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Broadcast Official Organizer Announcement
                </h3>
                <p className="text-xs text-slate-400">
                  Sends a highlighted message to the Festive Adda Chat labeled with the Official Organizer badge.
                </p>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <textarea
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. 📢 Attention Photographers! Day 2 voting will lock promptly at 11:00 PM tonight. Cast your 1 vote now!"
                  rows={4}
                  className="w-full bg-[#151724] border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />

                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Sent as: <strong className="text-white">{currentUser.name} (Official Owner)</strong>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Broadcast to Community
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: PANDAL REGISTRY */}
          {activeTab === 'pandals' && (
            <div className="space-y-4 max-w-2xl">
              <div className="pb-2 border-b border-white/5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Add Official Durga Puja Pandal / Landmark
                </h3>
                <p className="text-xs text-slate-400">
                  Register new pandals or puja locations so contestants can select them when submitting photos.
                </p>
              </div>

              <form onSubmit={handleCreatePandal} className="bg-[#151724] p-4 rounded-xl border border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                      Pandal / Club Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPandalName}
                      onChange={(e) => setNewPandalName(e.target.value)}
                      placeholder="e.g. Dada Bhai Sporting, Maddox Square..."
                      className="mt-1 w-full bg-[#1c1f2e] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                      West Bengal Region
                    </label>
                    <select
                      value={newPandalZone}
                      onChange={(e) => setNewPandalZone(e.target.value)}
                      className="mt-1 w-full bg-[#1c1f2e] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                    >
                      <option value="North Kolkata">North Kolkata</option>
                      <option value="South Kolkata">South Kolkata</option>
                      <option value="Central Kolkata">Central Kolkata</option>
                      <option value="Salt Lake & East Kolkata">Salt Lake & East Kolkata</option>
                      <option value="Howrah & Hooghly">Howrah & Hooghly</option>
                      <option value="North & South 24 Parganas">North & South 24 Parganas</option>
                      <option value="Siliguri & North Bengal">Siliguri & North Bengal</option>
                      <option value="Durgapur & Bardhaman">Durgapur & Bardhaman</option>
                      <option value="Medinipur & South Bengal">Medinipur & South Bengal</option>
                      <option value="Birbhum & Bolpur">Birbhum & Bolpur</option>
                      <option value="Custom West Bengal Location">Custom West Bengal Location</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                      Type City / District (All Over West Bengal)
                    </label>
                    <input
                      type="text"
                      value={newPandalLandmark}
                      onChange={(e) => setNewPandalLandmark(e.target.value)}
                      placeholder="e.g. Siliguri, Durgapur, Chandannagar, Midnapore"
                      className="mt-1 w-full bg-[#1c1f2e] border border-amber-400/30 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono font-bold">
                      Nearest Metro / Station / Landmark
                    </label>
                    <input
                      type="text"
                      value={newPandalMetro}
                      onChange={(e) => setNewPandalMetro(e.target.value)}
                      placeholder="e.g. Kalighat Metro, Shyambazar, Junction"
                      className="mt-1 w-full bg-[#1c1f2e] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Pandal Across West Bengal</span>
                </button>
              </form>

              {/* List of Custom Registered Pandals */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Custom Community Pandals in Registry</span>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {StorageService.getCustomPandals().length} Custom Pandals
                  </span>
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {StorageService.getCustomPandals().map((cp) => (
                    <div
                      key={cp.id}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{cp.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {cp.zone} {cp.city ? `• ${cp.city}` : ''} {cp.landmark ? `• Near ${cp.landmark}` : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          StorageService.deleteCustomPandal(cp.id);
                          onAddPandal('', '');
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete from registry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {StorageService.getCustomPandals().length === 0 && (
                    <div className="text-xs text-slate-500 italic p-2">
                      No custom pandals registered yet. Use the form above to add any pandal across West Bengal!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#0f111a] border-t border-white/10 px-5 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PujoVerse Owner Mode Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
