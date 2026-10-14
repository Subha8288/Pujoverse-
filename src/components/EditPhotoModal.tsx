import React, { useState, useEffect, useRef } from 'react';
import { PhotoEntry, PandalLandmark } from '../types/contest';
import { StorageService } from '../services/storage';
import {
  X,
  Save,
  Trash2,
  Image,
  Upload,
  Camera,
  MapPin,
  Calendar,
  Award,
  Star,
  CheckCircle2,
  AlertTriangle,
  Heart,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

interface EditPhotoModalProps {
  photo: PhotoEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (updatedPhoto: PhotoEntry) => void;
  onDeletePhoto?: (photoId: string) => void;
  pandalsList?: PandalLandmark[];
}

export const EditPhotoModal: React.FC<EditPhotoModalProps> = ({
  photo,
  isOpen,
  onClose,
  onSavePhoto,
  onDeletePhoto,
  pandalsList = []
}) => {
  const [title, setTitle] = useState('');
  const [photographerName, setPhotographerName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pandalLocation, setPandalLocation] = useState('');
  const [city, setCity] = useState('Kolkata, West Bengal');
  const [dayNumber, setDayNumber] = useState<number>(2);
  const [votes, setVotes] = useState<number>(0);
  const [awardBadge, setAwardBadge] = useState<string>('');
  const [isVerifiedHuman, setIsVerifiedHuman] = useState<boolean>(true);
  const [isCuratorChoice, setIsCuratorChoice] = useState<boolean>(false);
  const [moderationStatus, setModerationStatus] = useState<'approved' | 'flagged' | 'hidden'>('approved');
  
  // Camera gear
  const [cameraOrPhone, setCameraOrPhone] = useState('');
  const [shutter, setShutter] = useState('');
  const [aperture, setAperture] = useState('');
  const [iso, setIso] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (photo) {
      setTitle(photo.title || '');
      setPhotographerName(photo.photographerName || '');
      setInstagramHandle(photo.instagramHandle || '');
      setCaption(photo.caption || '');
      setImageUrl(photo.imageUrl || '');
      setPandalLocation(photo.pandalLocation || '');
      setCity(photo.city || 'Kolkata, West Bengal');
      setDayNumber(photo.dayNumber || 2);
      setVotes(photo.votes || 0);
      setAwardBadge(photo.awardBadge || '');
      setIsVerifiedHuman(photo.isVerifiedHuman ?? true);
      setIsCuratorChoice(photo.isCuratorChoice ?? false);
      setModerationStatus(photo.moderationStatus || 'approved');
      setCameraOrPhone(photo.cameraGear?.cameraOrPhone || '');
      setShutter(photo.cameraGear?.shutter || '');
      setAperture(photo.cameraGear?.aperture || '');
      setIso(photo.cameraGear?.iso || '');
      setConfirmDelete(false);
    }
  }, [photo]);

  if (!isOpen || !photo) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const formattedInsta = instagramHandle.trim()
      ? instagramHandle.trim().startsWith('@')
        ? instagramHandle.trim()
        : `@${instagramHandle.trim()}`
      : undefined;

    const trimmedPandal = pandalLocation.trim() || photo.pandalLocation;
    if (trimmedPandal && !pandalsList.some((p) => p.name.toLowerCase() === trimmedPandal.toLowerCase())) {
      StorageService.addCustomPandal(trimmedPandal);
    }

    const updated: PhotoEntry = {
      ...photo,
      title: title.trim(),
      photographerName: photographerName.trim() || photo.photographerName,
      instagramHandle: formattedInsta,
      caption: caption.trim() || photo.caption,
      imageUrl: imageUrl.trim(),
      pandalLocation: pandalLocation.trim() || photo.pandalLocation,
      city: city.trim() || photo.city || 'Kolkata, West Bengal',
      dayNumber: Number(dayNumber),
      votes: Math.max(0, Number(votes)),
      awardBadge: awardBadge.trim() ? awardBadge.trim() : undefined,
      isVerifiedHuman,
      isCuratorChoice,
      moderationStatus,
      cameraGear: {
        cameraOrPhone: cameraOrPhone.trim() || photo.cameraGear.cameraOrPhone,
        shutter: shutter.trim() || photo.cameraGear.shutter,
        aperture: aperture.trim() || photo.cameraGear.aperture,
        iso: iso.trim() || photo.cameraGear.iso
      }
    };

    onSavePhoto(updated);
    onClose();
  };

  const handleDelete = () => {
    if (onDeletePhoto) {
      onDeletePhoto(photo.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141624] rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-[#181a2b] to-[#141624]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              ✏️
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white font-display flex items-center gap-2">
                Edit Photo Details & Name
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">
                  Ruler Access
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Directly modify photo name, photographer, votes, location, or replace image.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Live Preview & Image Replacement */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-32 h-24 sm:w-40 sm:h-28 rounded-lg overflow-hidden bg-slate-900 border border-white/15 relative shrink-0">
              <img
                src={imageUrl || photo.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = photo.imageUrl;
                }}
              />
              {isCuratorChoice && (
                <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded">
                  ★ Choice
                </span>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <label className="text-xs font-semibold text-slate-300 block">
                Photo Image Source (URL or File Upload)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#10121a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 whitespace-nowrap transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Replace File</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>
              <div className="text-[11px] text-slate-400">
                You can paste any high-res image link or upload directly from your device.
              </div>
            </div>
          </div>

          {/* Section 1: Photo Name & Story */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                Photo Name / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mahishasuramardini Awakening, Bodhon Arati"
                className="w-full bg-[#10121a] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-slate-600 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Photo Caption & Story
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Story behind the capture, atmosphere, lighting context..."
                className="w-full bg-[#10121a] border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Photographer & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Photographer Name
              </label>
              <input
                type="text"
                value={photographerName}
                onChange={(e) => setPhotographerName(e.target.value)}
                placeholder="Photographer full name"
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@username"
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Pandal / Landmark Location
              </label>
              <input
                type="text"
                value={pandalLocation}
                onChange={(e) => setPandalLocation(e.target.value)}
                placeholder="e.g. Hatibagan Nabin Pally, Dada Bhai Sporting, Alamganj..."
                list="pandals-datalist"
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <datalist id="pandals-datalist">
                {pandalsList.map((p) => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                City / District / Town (All Over West Bengal)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kolkata, Siliguri, Durgapur, Chandannagar, Bolpur..."
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Festival Stage / Day Number (1 - 10)
              </label>
              <select
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value={1}>Day 1: Pratipada (11 Oct) - Concluded</option>
                <option value={2}>Day 2: Dwitiya (12 Oct) - Concluded</option>
                <option value={3}>Day 3: Tritiya (13 Oct) - Live Active Today</option>
                <option value={4}>Day 4: Chaturthi (14 Oct)</option>
                <option value={5}>Day 5: Panchami (15 Oct)</option>
                <option value={6}>Day 6: Sashthi (16 Oct)</option>
                <option value={7}>Day 7: Saptami (17 Oct)</option>
                <option value={8}>Day 8: Ashtami (18 Oct)</option>
                <option value={9}>Day 9: Navami (19 Oct)</option>
                <option value={10}>Day 10: Vijayadashami (20 Oct)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Vote Control & Award Badges */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-[#10121a] border border-amber-400/30 space-y-3">
            <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                Vote Count & Competition Overrides
              </span>
              <span className="text-[11px] text-slate-400">Ruler Live Control</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300">Exact Votes:</label>
                <input
                  type="number"
                  min={0}
                  value={votes}
                  onChange={(e) => setVotes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 bg-[#10121a] border border-amber-400/50 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-amber-400 text-center focus:outline-none"
                />
              </div>

              {/* Quick adjustment buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setVotes((v) => v + 10)}
                  className="px-2 py-1 rounded bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => setVotes((v) => v + 50)}
                  className="px-2 py-1 rounded bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
                >
                  +50
                </button>
                <button
                  type="button"
                  onClick={() => setVotes((v) => Math.max(0, v - 10))}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-slate-300"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => setVotes(0)}
                  className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-xs hover:bg-rose-500/30 font-mono"
                >
                  Reset 0
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Award Badge Title
                </label>
                <select
                  value={awardBadge}
                  onChange={(e) => setAwardBadge(e.target.value)}
                  className="w-full bg-[#10121a] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">No Special Badge</option>
                  <option value="Day 1 Winner">Day 1 Winner 👑</option>
                  <option value="Day 2 Winner">Day 2 Winner 👑</option>
                  <option value="Curator's Choice">Curator's Choice ★</option>
                  <option value="Chief Juror Laureate">Chief Juror Laureate</option>
                  <option value="Top 3 Finalist">Top 3 Finalist</option>
                  <option value="Audience Favorite">Audience Favorite</option>
                  <option value="Golden Masterpiece">Golden Masterpiece</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Moderation Status
                </label>
                <select
                  value={moderationStatus}
                  onChange={(e) => setModerationStatus(e.target.value as any)}
                  className="w-full bg-[#10121a] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="approved">Approved & Visible</option>
                  <option value="flagged">Flagged for Review</option>
                  <option value="hidden">Hidden from Public Arena</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 pt-1 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isVerifiedHuman}
                  onChange={(e) => setIsVerifiedHuman(e.target.checked)}
                  className="rounded border-white/20 text-amber-500 focus:ring-amber-400 w-4 h-4 bg-[#10121a]"
                />
                <span className="text-slate-200 font-medium flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Real Human Capture
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isCuratorChoice}
                  onChange={(e) => setIsCuratorChoice(e.target.checked)}
                  className="rounded border-white/20 text-amber-500 focus:ring-amber-400 w-4 h-4 bg-[#10121a]"
                />
                <span className="text-slate-200 font-medium flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Pin as Curator's Choice
                </span>
              </label>
            </div>
          </div>

          {/* Section 4: Camera Gear Settings */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Camera Gear & Technical Settings</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Camera / Phone</span>
                <input
                  type="text"
                  value={cameraOrPhone}
                  onChange={(e) => setCameraOrPhone(e.target.value)}
                  placeholder="e.g. Sony A7 IV"
                  className="w-full bg-[#10121a] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Shutter</span>
                <input
                  type="text"
                  value={shutter}
                  onChange={(e) => setShutter(e.target.value)}
                  placeholder="1/250s"
                  className="w-full bg-[#10121a] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Aperture</span>
                <input
                  type="text"
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  placeholder="f/1.8"
                  className="w-full bg-[#10121a] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">ISO</span>
                <input
                  type="text"
                  value={iso}
                  onChange={(e) => setIso(e.target.value)}
                  placeholder="800"
                  className="w-full bg-[#10121a] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Delete Danger Zone */}
          {onDeletePhoto && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete This Photo from Contest</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Are you sure?
                  </span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 rounded bg-white/10 text-xs text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-[#141624] py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-black text-xs flex items-center gap-2 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
