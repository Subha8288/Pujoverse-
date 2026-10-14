import React, { useState, useRef } from 'react';
import { UserProfile, PhotoEntry } from '../types/contest';
import { StorageService } from '../services/storage';
import { POPULAR_PANDALS_DATA } from '../data/pandals';
import {
  X,
  Award,
  Camera,
  Heart,
  MapPin,
  Sparkles,
  Edit2,
  Check,
  Users,
  Instagram,
  Upload,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  userPhotos: PhotoEntry[];
  allPhotos?: PhotoEntry[];
  onUpdateProfile: (updated: UserProfile) => void;
  onInspectPhoto: (photo: PhotoEntry) => void;
  onOpenSwitchAccount?: () => void;
  onOpenOwnerPortal?: () => void;
  onDeleteProfile?: (userId: string) => void;
  onDeletePhoto?: (photoId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  userPhotos,
  allPhotos = [],
  onUpdateProfile,
  onInspectPhoto,
  onOpenSwitchAccount,
  onOpenOwnerPortal,
  onDeleteProfile,
  onDeletePhoto
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'uploads' | 'votes' | 'badges'>('uploads');
  const [name, setName] = useState(user.name);
  const [instagramHandle, setInstagramHandle] = useState(user.instagramHandle || '@');
  const [bio, setBio] = useState(user.bio);
  const [city, setCity] = useState(user.city);
  const [district, setDistrict] = useState(user.district || 'Kolkata');
  const [cameraGearUsed, setCameraGearUsed] = useState(user.cameraGearUsed || 'Sony A7 IV · 35mm f/1.4 GM');
  const [favoritePandal, setFavoritePandal] = useState(user.favoritePandal);
  const [favoritePandalLocation, setFavoritePandalLocation] = useState(user.favoritePandalLocation || user.city || 'Kolkata');
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

  const dpInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const totalVotesReceived = userPhotos.reduce((sum, p) => sum + p.votes, 0);
  const dailyVotesMap = StorageService.getDailyVotesMap(user.id);
  const daysVotedCount = Object.keys(dailyVotesMap).length;

  const handleDpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        onUpdateProfile({
          ...user,
          avatar: reader.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedInsta = instagramHandle.trim().startsWith('@')
      ? instagramHandle.trim()
      : instagramHandle.trim() ? `@${instagramHandle.trim()}` : undefined;

    const updatedBadges = [...user.badges];
    if (!updatedBadges.includes('Verified Human Creator')) {
      updatedBadges.unshift('Verified Human Creator');
    }

    onUpdateProfile({
      ...user,
      name: name.trim() || user.name,
      instagramHandle: formattedInsta,
      bio,
      city: city.trim() || user.city,
      district: district.trim() || user.district || 'Kolkata',
      cameraGearUsed,
      favoritePandal: favoritePandal.trim() || user.favoritePandal,
      favoritePandalLocation: favoritePandalLocation.trim() || user.favoritePandalLocation || city.trim(),
      isVerifiedHuman: true,
      badges: updatedBadges
    });
    setIsEditing(false);
  };

  const handleVerifyAsRealHuman = () => {
    const updatedBadges = [...user.badges];
    if (!updatedBadges.includes('Verified Human Creator')) {
      updatedBadges.unshift('Verified Human Creator');
    }
    onUpdateProfile({
      ...user,
      isVerifiedHuman: true,
      badges: updatedBadges
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141624] rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-display text-white">
              PujoVerse Real Player Profile
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {onOpenSwitchAccount && (
              <button
                onClick={onOpenSwitchAccount}
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-amber-400 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Switch / Join Player</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Human Verification Banner */}
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-black/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white">
                {user.isVerifiedHuman ? 'Verified Real Human Player' : 'Demo Profile'}
              </span>
              <span className="text-slate-400 text-[11px] block">
                {user.isVerifiedHuman
                  ? 'Authenticated for 1-vote daily tournaments and verified photography.'
                  : 'Upgrade to a Real Human Creator to participate in verified leaderboards.'}
              </span>
            </div>
          </div>
          {!user.isVerifiedHuman && (
            <button
              onClick={handleVerifyAsRealHuman}
              className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shrink-0"
            >
              Verify as Human ✓
            </button>
          )}
        </div>

        {/* Ruler Console Shortcut (Only if active owner) */}
        {user.isOwner && onOpenOwnerPortal && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#181a27] to-[#12141f] border border-amber-500/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  Platform Ruler Console
                  <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase">
                    Active
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] block">
                  You possess master curator controls to edit photo details, schedules, and pandals.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenOwnerPortal();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Open Ruler Console</span>
            </button>
          </div>
        )}

        {/* Profile Info */}
        <div className="mt-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative group shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shadow-amber-500/20"
            />
            <label className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-[10px] font-semibold text-amber-300">
              <Camera className="w-5 h-5 text-amber-400 mb-0.5" />
              <span>Change DP</span>
              <input
                ref={dpInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleDpChange}
              />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            {!isEditing ? (
              <>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-white font-display">{user.name}</h3>
                  {user.isVerifiedHuman && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 border border-emerald-500/30">
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      Verified Human
                    </span>
                  )}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 mt-1">
                  {user.instagramHandle && (
                    <a
                      href={`https://instagram.com/${user.instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 font-semibold"
                    >
                      <Instagram className="w-3 h-3" />
                      <span>{user.instagramHandle}</span>
                    </a>
                  )}
                  <span className="text-slate-600">·</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{user.city}{user.district && user.district !== user.city ? ` (${user.district})` : ''}</span>
                  </div>
                  {user.cameraGearUsed && (
                    <>
                      <span className="text-slate-600">·</span>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
                        <Camera className="w-3 h-3 text-amber-400" />
                        <span>{user.cameraGearUsed}</span>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{user.bio}</p>

                {/* Favorite Pandal & Own Location Showcase */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#181a28] to-[#111320] border border-amber-500/25 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      Favorite Pandal & Location
                    </div>
                    <div className="font-bold text-white text-xs truncate mt-0.5">
                      {user.favoritePandal || 'Bagbazar Sarbojanin Durgotsav'}
                    </div>
                    <div className="text-slate-300 text-[11px] flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{user.favoritePandalLocation || user.city || 'Kolkata, West Bengal'}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSave} className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1b1e2e] border border-white/10 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Instagram Handle</label>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="@your_handle"
                    className="w-full bg-[#1b1e2e] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Camera Gear / Phone</label>
                  <input
                    type="text"
                    value={cameraGearUsed}
                    onChange={(e) => setCameraGearUsed(e.target.value)}
                    placeholder="e.g. Sony A7 IV · 35mm f/1.4 GM or iPhone 16 Pro"
                    className="w-full bg-[#1b1e2e] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Bio</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-[#1b1e2e] border border-white/10 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">District / Region</label>
                    <input
                      type="text"
                      list="profile-districts-list"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Kolkata, Nadia..."
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded px-2.5 py-1.5 text-white"
                    />
                    <datalist id="profile-districts-list">
                      <option value="Kolkata" />
                      <option value="North 24 Parganas" />
                      <option value="South 24 Parganas" />
                      <option value="Howrah" />
                      <option value="Hooghly" />
                      <option value="Nadia" />
                      <option value="Birbhum" />
                      <option value="Paschim Bardhaman" />
                      <option value="Purba Bardhaman" />
                      <option value="Siliguri & North Bengal" />
                      <option value="Paschim Medinipur" />
                      <option value="Purba Medinipur" />
                      <option value="Murshidabad" />
                      <option value="Bankura" />
                      <option value="Malda" />
                    </datalist>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">City / Locality</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Salt Lake, Behala..."
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Favorite Pandal Name</label>
                    <input
                      type="text"
                      list="profile-pandals-list"
                      value={favoritePandal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFavoritePandal(val);
                        const match = POPULAR_PANDALS_DATA.find((p) => p.name.toLowerCase() === val.toLowerCase());
                        if (match && (!favoritePandalLocation || favoritePandalLocation === 'Kolkata')) {
                          setFavoritePandalLocation(`${match.landmark || match.metroStation || match.zone}, ${match.zone}`);
                        }
                      }}
                      placeholder="e.g. Bagbazar Sarbojanin or Para Club"
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded px-2.5 py-1.5 text-white"
                    />
                    <datalist id="profile-pandals-list">
                      {POPULAR_PANDALS_DATA.map((p) => (
                        <option key={p.id} value={p.name} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Pandal Location / Address</label>
                    <input
                      type="text"
                      value={favoritePandalLocation}
                      onChange={(e) => setFavoritePandalLocation(e.target.value)}
                      placeholder="e.g. Shyambazar or VIP Road"
                      className="w-full bg-[#1b1e2e] border border-white/10 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-2.5 py-1 rounded text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-amber-400 text-slate-950 font-bold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
              {totalVotesReceived}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
              Votes Received
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {userPhotos.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
              Remembered Uploads
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
              {daysVotedCount}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
              Daily Battles Voted
            </div>
          </div>
        </div>

        {/* Tabs for Section Breakdown */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('uploads')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'uploads'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Uploads ({userPhotos.length})
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'votes'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily 1-Vote History ({daysVotedCount})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'badges'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Badges ({user.badges.length})
          </button>
        </div>

        {/* TAB 1: User Upload History */}
        {activeTab === 'uploads' && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider mb-3 flex items-center justify-between">
              <span>Remembered Upload History ({userPhotos.length})</span>
              <span className="text-[11px] text-amber-400/80 font-normal">
                Persisted in your PujoVerse account
              </span>
            </h4>

            {userPhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {userPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onInspectPhoto(photo)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-amber-400 transition-all cursor-pointer shadow"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-amber-300 font-bold">
                      Day {photo.dayNumber}
                    </div>

                    {onDeletePhoto && (
                      deletingPhotoId === photo.id ? (
                        <div
                          className="absolute top-2 right-2 flex items-center gap-1 bg-black/95 p-1 rounded-lg border border-rose-500/80 shadow-2xl z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePhoto(photo.id);
                              setDeletingPhotoId(null);
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingPhotoId(null);
                            }}
                            className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingPhotoId(photo.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-all shadow-md z-10"
                          title="Delete this photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )
                    )}

                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <div className="text-xs font-bold truncate">{photo.title}</div>
                      <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                        {photo.votes} votes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
                No photos submitted yet under this profile. Upload your festival click to build your history!
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Daily 1-Vote History */}
        {activeTab === 'votes' && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400 mb-2 font-mono">
              Strict 1-Vote Rule: Here is your vote record for each festival day.
            </div>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((dayNum) => {
              const votedPhotoId = dailyVotesMap[dayNum];
              const votedPhoto = allPhotos.find((p) => p.id === votedPhotoId);

              return (
                <div
                  key={dayNum}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">Day {dayNum}</span>
                    <span className="text-slate-500">·</span>
                    {votedPhoto ? (
                      <div>
                        <span className="font-semibold text-white">{votedPhoto.title}</span>
                        <span className="text-slate-400 text-[11px] block">
                          by {votedPhoto.photographerName} ({votedPhoto.pandalLocation})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">No vote recorded</span>
                    )}
                  </div>
                  <div>
                    {votedPhoto ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        1 Vote Cast
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[10px] font-mono">Open / Missed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: Badges Earned */}
        {activeTab === 'badges' && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider mb-2">
              Festival Accolades & Real Player Badges
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <div
                  key={badge}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Deletion & Management Option */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs font-display">
                <Trash2 className="w-4 h-4" />
                <span>Delete Player Profile</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Permanently remove this profile from this device. Your daily voting records and local history will be reset.
              </p>
            </div>

            {showDeleteConfirm ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteProfile) {
                      onDeleteProfile(user.id);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 rounded-lg border border-rose-500/40 hover:bg-rose-500/15 text-rose-400 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
