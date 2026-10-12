import React, { useState, useRef, useEffect } from 'react';
import { PhotoEntry, UserProfile, PandalLandmark } from '../types/contest';
import { StorageService } from '../services/storage';
import { POPULAR_PANDALS_DATA, PANDAL_ZONES } from '../data/pandals';
import { X, Upload, Camera, MapPin, Sparkles, AlertCircle, Plus, Search, Check, Clock, ShieldCheck, UserCheck } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newEntry: Omit<PhotoEntry, 'id' | 'votes' | 'wins' | 'matchups' | 'timestamp'>) => void;
  currentDayNumber: number;
  currentUser: UserProfile;
  isPast11PM?: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentDayNumber,
  currentUser,
  isPast11PM
}) => {
  const [dayNumber, setDayNumber] = useState(currentDayNumber);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');

  // Pandal & Landmark State
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [pandalSearch, setPandalSearch] = useState('');
  const [selectedPandalName, setSelectedPandalName] = useState(POPULAR_PANDALS_DATA[0].name);
  const [isAddingCustomPandal, setIsAddingCustomPandal] = useState(false);
  const [customPandalInput, setCustomPandalInput] = useState('');
  const [customPandalZone, setCustomPandalZone] = useState('South Kolkata');
  const [customLocationCity, setCustomLocationCity] = useState('');
  const [customPandalLandmark, setCustomPandalLandmark] = useState('');
  const [customPandalMetro, setCustomPandalMetro] = useState('');
  const [isCertifiedHuman, setIsCertifiedHuman] = useState(true);
  const [allPandals, setAllPandals] = useState<PandalLandmark[]>(() =>
    StorageService.getAllPandals()
  );

  // Camera settings
  const [cameraOrPhone, setCameraOrPhone] = useState('Sony A7 IV / iPhone 16 Pro');
  const [shutter, setShutter] = useState('1/250s');
  const [aperture, setAperture] = useState('f/1.8');
  const [iso, setIso] = useState('400');
  const [tagsInput, setTagsInput] = useState('DurgaPuja, PujoVerse, Kolkata');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAllPandals(StorageService.getAllPandals());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setError('Image file is too large. Max size is 12MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCustomPandal = () => {
    if (!customPandalInput.trim()) return;
    const effectiveZone = customLocationCity.trim() || customPandalZone;
    const created = StorageService.addCustomPandal({
      name: customPandalInput.trim(),
      zone: effectiveZone,
      city: customLocationCity.trim() || undefined,
      landmark: customPandalLandmark.trim() || undefined,
      metroStation: customPandalMetro.trim() || undefined,
      addedBy: currentUser.name
    });
    setAllPandals(StorageService.getAllPandals());
    setSelectedPandalName(created.name);
    setIsAddingCustomPandal(false);
    setCustomPandalInput('');
    setCustomPandalLandmark('');
    setCustomPandalMetro('');
  };

  const filteredPandals = allPandals.filter((p) => {
    const matchesZone = selectedZone === 'All Zones' || selectedZone === 'All West Bengal' || p.zone === selectedZone;
    const matchesSearch =
      !pandalSearch ||
      p.name.toLowerCase().includes(pandalSearch.toLowerCase()) ||
      (p.landmark && p.landmark.toLowerCase().includes(pandalSearch.toLowerCase())) ||
      (p.city && p.city.toLowerCase().includes(pandalSearch.toLowerCase())) ||
      p.zone.toLowerCase().includes(pandalSearch.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your photograph.');
      return;
    }

    if (!previewUrl) {
      setError('Please upload or snap a photo.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const matchingPandal = allPandals.find((p) => p.name === selectedPandalName);
    const chosenCity = customLocationCity.trim() || matchingPandal?.city || currentUser.city || 'West Bengal';

    onSubmit({
      userId: currentUser.id,
      dayNumber,
      title: title.trim(),
      imageUrl: previewUrl,
      photographerName: currentUser.name,
      photographerAvatar: currentUser.avatar,
      photographerBio: currentUser.bio,
      instagramHandle: currentUser.instagramHandle,
      isVerifiedHuman: true,
      pandalLocation: selectedPandalName,
      pandalZone: matchingPandal?.zone || customLocationCity.trim() || 'West Bengal',
      city: chosenCity,
      cameraGear: {
        cameraOrPhone: cameraOrPhone.trim() || 'Smartphone',
        shutter: shutter.trim() || undefined,
        aperture: aperture.trim() || undefined,
        iso: iso.trim() || undefined
      },
      caption: caption.trim() || 'Captured during the festive celebrations on PujoVerse.',
      tags,
      comments: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141622] rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 my-6 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>Submit to PujoVerse Daily Arena</span>
            </h2>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>Posting as:</span>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="font-semibold text-amber-300">{currentUser.name}</span>
              <span className="text-slate-500">· Saved in your upload history</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPast11PM && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Uploads Closed at 11:00 PM:</strong> The daily battle deadline has passed. Today's battle is locked for winner & rank tracking. Submissions will reopen for the next day's dawn stage!
            </span>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Photo File Picker with Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Photo Upload <span className="text-amber-400">*</span>
            </label>

            {previewUrl ? (
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-amber-400/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02]"
              >
                <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white">Click or tap to upload photo</div>
                <div className="text-xs text-slate-400 mt-1">Supports JPEG, PNG, WEBP up to 12MB</div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Title & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Photo Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Incense Dance over Evening Dhaaks"
                className="w-full bg-[#1c1f2e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Festival Stage
              </label>
              <select
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full bg-[#1c1f2e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                  <option key={d} value={d}>
                    Day {d} {d === 9 ? '(Live Climax)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CUSTOM SELECT PANDAL / LANDMARK SECTION */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-display">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Pandal / Landmark</span>
              </label>

              <button
                type="button"
                onClick={() => setIsAddingCustomPandal((prev) => !prev)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>{isAddingCustomPandal ? 'Back to List' : 'Add Custom Landmark'}</span>
              </button>
            </div>

            {!isAddingCustomPandal ? (
              <div className="space-y-2">
                {/* Zone Filter & Search Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Filter by Zone</label>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full bg-[#161824] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    >
                      {PANDAL_ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Search Landmark</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={pandalSearch}
                        onChange={(e) => setPandalSearch(e.target.value)}
                        placeholder="Search Bagbazar, Ekdalia, Sreebhumi..."
                        className="w-full bg-[#161824] border border-white/10 rounded-lg pl-7 pr-2.5 py-1.5 text-white text-xs"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                    </div>
                  </div>
                </div>

                {/* Main Pandal Dropdown */}
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">
                    Choose Pandal / Landmark ({filteredPandals.length} available)
                  </label>
                  <select
                    value={selectedPandalName}
                    onChange={(e) => setSelectedPandalName(e.target.value)}
                    className="w-full bg-[#1c1f2e] border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {filteredPandals.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.zone}) {p.isCustom ? '★ Custom' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              /* Custom Landmark Creator */
              <div className="p-3.5 rounded-xl bg-[#181a28] border border-amber-500/30 space-y-2.5 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Input Custom Pandal & Landmark</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Register your neighborhood or favorite puja pandal. It will be stored and selectable by all real players!
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 mb-0.5 block font-mono">Pandal / Club Name *</label>
                    <input
                      type="text"
                      value={customPandalInput}
                      onChange={(e) => setCustomPandalInput(e.target.value)}
                      placeholder="e.g. Chetla Agrani, Dada Bhai Sporting, Alamganj..."
                      className="w-full bg-[#121420] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 mb-0.5 block font-mono">West Bengal Region</label>
                    <select
                      value={customPandalZone}
                      onChange={(e) => setCustomPandalZone(e.target.value)}
                      className="w-full bg-[#121420] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 mb-0.5 block font-mono">Type City / District (All WB)</label>
                    <input
                      type="text"
                      value={customLocationCity}
                      onChange={(e) => setCustomLocationCity(e.target.value)}
                      placeholder="e.g. Siliguri, Durgapur, Chandannagar"
                      className="w-full bg-[#121420] border border-amber-400/40 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 mb-0.5 block font-mono">Nearest Metro / Station</label>
                    <input
                      type="text"
                      value={customPandalMetro}
                      onChange={(e) => setCustomPandalMetro(e.target.value)}
                      placeholder="e.g. Kalighat Metro, Howrah Junction"
                      className="w-full bg-[#121420] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 mb-0.5 block font-mono">Landmark / Crossing</label>
                    <input
                      type="text"
                      value={customPandalLandmark}
                      onChange={(e) => setCustomPandalLandmark(e.target.value)}
                      placeholder="e.g. Near Deshapriya Park"
                      className="w-full bg-[#121420] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomPandal(false)}
                    className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomPandal}
                    disabled={!customPandalInput.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save & Select Landmark</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Caption / Story */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Story Behind the Shot
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What feeling or crowd moment did you witness?"
              className="w-full bg-[#1c1f2e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Camera Settings EXIF */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Gear & EXIF Settings</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400">Device/Camera</label>
                <input
                  type="text"
                  value={cameraOrPhone}
                  onChange={(e) => setCameraOrPhone(e.target.value)}
                  placeholder="e.g. Sony A7IV"
                  className="w-full bg-[#161824] border border-white/10 rounded px-2 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Shutter Speed</label>
                <input
                  type="text"
                  value={shutter}
                  onChange={(e) => setShutter(e.target.value)}
                  placeholder="e.g. 1/250s"
                  className="w-full bg-[#161824] border border-white/10 rounded px-2 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Aperture</label>
                <input
                  type="text"
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  placeholder="e.g. f/1.8"
                  className="w-full bg-[#161824] border border-white/10 rounded px-2 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400">ISO</label>
                <input
                  type="text"
                  value={iso}
                  onChange={(e) => setIso(e.target.value)}
                  placeholder="e.g. 400"
                  className="w-full bg-[#161824] border border-white/10 rounded px-2 py-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* 100% Real Human Photography Guarantee */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                required
                checked={isCertifiedHuman}
                onChange={(e) => setIsCertifiedHuman(e.target.checked)}
                className="rounded border-emerald-400/50 text-emerald-500 focus:ring-emerald-400 w-4 h-4 bg-[#10121a] mt-0.5"
              />
              <div>
                <span className="font-bold text-emerald-300 block">
                  ✓ 100% Real Human Photograph Guarantee
                </span>
                <span className="text-slate-300 text-[11px] leading-relaxed block mt-0.5">
                  I certify this photo was taken by a real human player using a camera or smartphone in West Bengal, with strictly ZERO AI generation or manipulation.
                </span>
              </div>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPast11PM || !isCertifiedHuman}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                isPast11PM || !isCertifiedHuman
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPast11PM ? 'Uploads Closed at 11 PM' : 'Submit Real Human Photo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
