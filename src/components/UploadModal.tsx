import React, { useState, useRef, useEffect } from 'react';
import { PhotoEntry, VideoEntry, UserProfile, PandalLandmark } from '../types/contest';
import { StorageService } from '../services/storage';
import { POPULAR_PANDALS_DATA } from '../data/pandals';
import {
  X,
  Upload,
  Camera,
  Film,
  MapPin,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newEntry: Omit<PhotoEntry, 'id' | 'votes' | 'wins' | 'matchups' | 'timestamp'>) => void;
  onSubmitVideo?: (newEntry: Omit<VideoEntry, 'id' | 'votes' | 'wins' | 'matchups' | 'timestamp'>) => void;
  initialType?: 'photo' | 'video';
  currentDayNumber: number;
  currentUser: UserProfile;
  isPast11PM?: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSubmitVideo,
  initialType = 'photo',
  currentDayNumber,
  currentUser,
  isPast11PM
}) => {
  const [entryType, setEntryType] = useState<'photo' | 'video'>(initialType);
  const [dayNumber, setDayNumber] = useState(currentDayNumber);
  const [title, setTitle] = useState('');

  // Media state
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<string>('0:45');
  const [showUrlFallback, setShowUrlFallback] = useState<boolean>(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string>('');

  // Pandal & Location State - start empty so user inputs their own choice
  const [selectedPandalName, setSelectedPandalName] = useState('');
  const [locationDistrictCity, setLocationDistrictCity] = useState('');
  const [locationLandmark, setLocationLandmark] = useState('');

  const [isCertifiedHuman, setIsCertifiedHuman] = useState(true);
  const [allPandals, setAllPandals] = useState<PandalLandmark[]>(() =>
    StorageService.getAllPandals()
  );
  const [error, setError] = useState('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const storedPandals = StorageService.getAllPandals();
      setAllPandals(storedPandals);
      setEntryType(initialType);
      setDayNumber(currentDayNumber);
      setError('');
      // Leave empty so user can freely input their own custom pandal and location
      setSelectedPandalName('');
      setLocationDistrictCity('');
      setLocationLandmark('');
    }
  }, [isOpen, initialType, currentDayNumber]);

  if (!isOpen) return null;

  // Handle Photo selection from device
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image file is too large (max 15MB).');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Video selection from device
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, MOV, WEBM).');
      return;
    }

    setError('');
    setVideoFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);

    // Extract duration & auto-capture first frame thumbnail
    const videoElem = document.createElement('video');
    videoElem.preload = 'metadata';
    videoElem.src = objectUrl;
    videoElem.onloadedmetadata = () => {
      const mins = Math.floor(videoElem.duration / 60);
      const secs = Math.floor(videoElem.duration % 60);
      setVideoDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      videoElem.currentTime = Math.min(1, Math.max(0.1, videoElem.duration / 3));
    };
    videoElem.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(640, videoElem.videoWidth || 640);
        canvas.height = Math.min(360, videoElem.videoHeight || 360);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
          const thumb = canvas.toDataURL('image/jpeg', 0.7);
          setVideoThumbnailUrl(thumb);
        }
      } catch {
        // Fallback thumbnail if CORS or canvas issue
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a title for your festival submission.');
      return;
    }

    const effectivePandalName = selectedPandalName.trim() || 'Bagbazar Sarbojanin Durgotsav';
    const effectiveZone = locationDistrictCity.trim() || 'Kolkata';
    const effectiveCity = locationLandmark.trim()
      ? `${effectiveZone} (${locationLandmark.trim()})`
      : effectiveZone;

    // Check if custom pandal needs adding to persistent database
    const existingPandal = allPandals.find(
      (p) => p.name.toLowerCase() === effectivePandalName.toLowerCase()
    );
    if (!existingPandal) {
      StorageService.addCustomPandal({
        name: effectivePandalName,
        zone: effectiveZone,
        city: effectiveZone,
        landmark: locationLandmark.trim() || undefined,
        addedBy: currentUser.name
      });
    }

    if (entryType === 'photo') {
      if (!photoPreviewUrl) {
        setError('Please select a photo from your device.');
        return;
      }

      onSubmit({
        userId: currentUser.id,
        dayNumber,
        title: title.trim(),
        imageUrl: photoPreviewUrl,
        photographerName: currentUser.name,
        photographerAvatar: currentUser.avatar,
        photographerBio: currentUser.bio,
        instagramHandle: currentUser.instagramHandle,
        isVerifiedHuman: true,
        pandalLocation: effectivePandalName,
        pandalZone: effectiveZone,
        city: effectiveCity,
        cameraGear: {
          cameraOrPhone: 'Participant Phone / Camera'
        },
        caption: title.trim(),
        tags: ['#DurgaPuja', '#Kolkata', '#Festival']
      });
    } else {
      // Video submission
      const effectiveVideoUrl = videoPreviewUrl || customVideoUrl.trim();
      if (!effectiveVideoUrl) {
        setError('Please upload a video from your device or provide a video link.');
        return;
      }

      const effectiveThumbnail =
        videoThumbnailUrl ||
        'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=1200&q=80';

      if (onSubmitVideo) {
        onSubmitVideo({
          userId: currentUser.id,
          dayNumber,
          title: title.trim(),
          videoUrl: effectiveVideoUrl,
          thumbnailUrl: effectiveThumbnail,
          duration: videoDuration || '0:45',
          videographerName: currentUser.name,
          videographerAvatar: currentUser.avatar,
          videographerBio: currentUser.bio,
          instagramHandle: currentUser.instagramHandle,
          isVerifiedHuman: true,
          pandalLocation: effectivePandalName,
          pandalZone: effectiveZone,
          city: effectiveCity,
          cameraGear: {
            cameraOrPhone: 'Participant Phone / Camera'
          },
          caption: title.trim(),
          tags: ['#DurgaPuja', '#Kolkata', '#Reel']
        });
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111320] border border-amber-500/25 rounded-3xl p-5 sm:p-6 overflow-y-auto max-h-[92vh] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clean Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪔</span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Upload Festival Entry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit your authentic Durga Puja moment for Day {dayNumber} Arena
          </p>
        </div>

        {/* Tab Toggle: Photo vs Video */}
        <div className="flex items-center p-1 rounded-2xl bg-white/[0.05] border border-white/10 mb-4">
          <button
            type="button"
            onClick={() => {
              setEntryType('photo');
              setError('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              entryType === 'photo'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📸 Photo Entry</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEntryType('video');
              setError('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              entryType === 'video'
                ? 'bg-rose-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>🎬 Video / Reel Entry</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contest Day Picker */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Festival Day:
              </span>
              <span className="text-[11px] text-amber-400 font-mono">
                {dayNumber === currentDayNumber ? '🔴 LIVE TODAY' : `Day ${dayNumber}`}
              </span>
            </div>
            <select
              value={dayNumber}
              onChange={(e) => setDayNumber(Number(e.target.value))}
              className="bg-[#1b1e2c] border border-amber-400/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                <option key={d} value={d}>
                  Day {d} {d === currentDayNumber ? '★ LIVE TODAY' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Media Upload Zone (Direct from device) */}
          {entryType === 'photo' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Upload Photograph from Device <span className="text-amber-400">*</span>
              </label>
              <div
                onClick={() => photoInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  photoPreviewUrl
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-white/15 hover:border-amber-400/50 bg-white/[0.02]'
                }`}
              >
                {photoPreviewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={photoPreviewUrl}
                      alt="Preview"
                      className="max-h-52 mx-auto rounded-xl object-contain shadow-lg"
                    />
                    <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Photo selected! Click to change.</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-slate-200 font-medium">
                      Click to choose photo from your phone or computer
                    </div>
                    <p className="text-[11px] text-slate-400">
                      JPEG, PNG, WEBP (tap to open gallery/camera)
                    </p>
                  </div>
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Video Media Upload Zone (Direct from device) */}
          {entryType === 'video' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Upload Video from Device <span className="text-rose-400">*</span>
              </label>

              {!showUrlFallback ? (
                <div
                  onClick={() => videoInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors ${
                    videoPreviewUrl
                      ? 'border-rose-500/50 bg-rose-500/5'
                      : 'border-white/15 hover:border-rose-400/50 bg-white/[0.02]'
                  }`}
                >
                  {videoPreviewUrl ? (
                    <div className="space-y-2">
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="max-h-52 mx-auto rounded-xl object-contain bg-black shadow-lg"
                      />
                      <p className="text-xs text-rose-300 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>{videoFileName || 'Video selected!'} Click to choose different video.</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                        <Film className="w-6 h-6" />
                      </div>
                      <div className="text-xs text-slate-200 font-medium">
                        Click to select video from your phone or device
                      </div>
                      <p className="text-[11px] text-slate-400">
                        MP4, MOV, WEBM (puja reels, dhunuchi dance, pandal clips)
                      </p>
                    </div>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*,video/mp4,video/webm,video/quicktime"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    value={customVideoUrl}
                    onChange={(e) => {
                      setCustomVideoUrl(e.target.value);
                      setVideoPreviewUrl('');
                    }}
                    placeholder="Paste YouTube Shorts, YouTube, or direct MP4 link"
                    className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                  />
                </div>
              )}

              {/* Small toggle to paste URL if user specifically wants */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUrlFallback((prev) => !prev)}
                  className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showUrlFallback ? '← Upload video from device file' : 'Or paste video link instead'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                entryType === 'photo'
                  ? 'e.g. Divine Pratima Eyes at Bagbazar Sarbojanin'
                  : 'e.g. High-Energy Dhunuchi Dance at Sreebhumi'
              }
              className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Pandal & Shot Location Details */}
          <div className="space-y-3 p-3.5 sm:p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Pandal & Shot Location Details <span className="text-amber-400">*</span></span>
              </label>
              <span className="text-[10px] text-amber-400/80 font-mono">
                {entryType === 'video' ? 'Video Location' : 'Photo Location'}
              </span>
            </div>

            {/* Pandal or Club Name Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Pandal or Club Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                list="upload-pandals-datalist"
                value={selectedPandalName}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedPandalName(val);
                  const matched = allPandals.find(
                    (p) => p.name.toLowerCase() === val.toLowerCase()
                  );
                  if (matched) {
                    if (matched.city || matched.zone) {
                      setLocationDistrictCity(matched.city || matched.zone);
                    }
                    if (matched.landmark || matched.metroStation) {
                      setLocationLandmark(matched.landmark || matched.metroStation || '');
                    }
                  }
                }}
                placeholder="e.g. Sreebhumi Sporting, Bagbazar Sarbojanin, or your local para club"
                className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <datalist id="upload-pandals-datalist">
                {allPandals.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.zone}
                  </option>
                ))}
              </datalist>
            </div>

            {/* District/City & Specific Landmark/Para Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  District / City / Zone <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  list="upload-zones-datalist"
                  value={locationDistrictCity}
                  onChange={(e) => setLocationDistrictCity(e.target.value)}
                  placeholder="e.g. Kolkata, North 24 Pgs, Howrah..."
                  className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <datalist id="upload-zones-datalist">
                  <option value="North Kolkata" />
                  <option value="South Kolkata" />
                  <option value="Central Kolkata" />
                  <option value="Salt Lake & New Town" />
                  <option value="Howrah" />
                  <option value="North 24 Parganas" />
                  <option value="South 24 Parganas" />
                  <option value="Hooghly & Chandannagar" />
                  <option value="Nadia & Kalyani" />
                  <option value="Siliguri" />
                  <option value="Durgapur" />
                </datalist>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Landmark / Street / Para
                </label>
                <input
                  type="text"
                  value={locationLandmark}
                  onChange={(e) => setLocationLandmark(e.target.value)}
                  placeholder="e.g. VIP Road Lake Town, Shyambazar 5-Point"
                  className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Quick popular pandals chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-slate-400">Quick pick:</span>
              {['Bagbazar Sarbojanin', 'Sreebhumi Sporting', 'Suruchi Sangha', 'Ekdalia Evergreen', 'Tridhara Sammilani', 'Maddox Square'].map((pName) => (
                <button
                  key={pName}
                  type="button"
                  onClick={() => {
                    setSelectedPandalName(pName);
                    const matched = allPandals.find(
                      (p) => p.name.toLowerCase() === pName.toLowerCase()
                    );
                    if (matched) {
                      setLocationDistrictCity(matched.city || matched.zone || 'Kolkata');
                      if (matched.landmark || matched.metroStation) {
                        setLocationLandmark(matched.landmark || matched.metroStation || '');
                      }
                    }
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                    selectedPandalName.toLowerCase().includes(pName.toLowerCase().slice(0, 6))
                      ? 'bg-amber-400/25 text-amber-300 border-amber-400/50'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {pName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 100% Real Human Guarantee */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                required
                checked={isCertifiedHuman}
                onChange={(e) => setIsCertifiedHuman(e.target.checked)}
                className="rounded border-emerald-400/50 text-emerald-500 focus:ring-emerald-400 w-4 h-4 bg-[#10121a] cursor-pointer"
              />
              <span className="font-semibold text-emerald-300">
                100% Real Human Player: Genuine festival media captured by me
              </span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPast11PM || !isCertifiedHuman}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPast11PM || !isCertifiedHuman
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : entryType === 'video'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-white shadow-lg shadow-rose-500/20 active:scale-95'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isPast11PM
                  ? 'Uploads Closed at 11 PM'
                  : entryType === 'video'
                  ? 'Submit Festival Reel'
                  : 'Submit Festival Photo'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
