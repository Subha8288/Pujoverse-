import React, { useState } from 'react';
import { PandalLandmark, UserProfile } from '../types/contest';
import { StorageService } from '../services/storage';
import {
  X,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Sparkles,
  Compass,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomPandalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onPandalAdded: (pandal: PandalLandmark) => void;
}

export const CustomPandalModal: React.FC<CustomPandalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPandalAdded
}) => {
  const [name, setName] = useState('');
  const [zone, setZone] = useState('South Kolkata');
  const [customLocation, setCustomLocation] = useState('');
  const [landmark, setLandmark] = useState('');
  const [metroStation, setMetroStation] = useState('');
  const [address, setAddress] = useState('');
  const [theme, setTheme] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'browse'>('create');

  const allPandals = StorageService.getAllPandals();
  const customPandals = StorageService.getCustomPandals();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide the pandal or club name.');
      return;
    }

    const effectiveZone = customLocation.trim() || zone;

    const created = StorageService.addCustomPandal({
      name: name.trim(),
      zone: effectiveZone,
      city: customLocation.trim() || undefined,
      landmark: landmark.trim() || undefined,
      metroStation: metroStation.trim() || undefined,
      address: address.trim() || undefined,
      theme: theme.trim() || undefined,
      addedBy: currentUser.name
    });

    onPandalAdded(created);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#10B981', '#E11D48']
    });

    // Reset form
    setName('');
    setLandmark('');
    setMetroStation('');
    setAddress('');
    setTheme('');
    setError('');
    onClose();
  };

  const handleDeleteCustom = (id: string) => {
    StorageService.deleteCustomPandal(id);
    // trigger refresh
    onPandalAdded({
      id: 'dummy',
      name: '',
      zone: 'Custom Landmark'
    });
  };

  const filteredList = allPandals.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.landmark && p.landmark.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (p.metroStation && p.metroStation.toLowerCase().includes(searchFilter.toLowerCase())) ||
      p.zone.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141624] rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Durga Puja Pandals & Landmarks
              </h3>
              <p className="text-[11px] text-slate-400">
                100% Real Human Community Registry · Kolkata & Suburbs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#0f111a] rounded-xl my-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'create'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Input Custom Pandal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'browse'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Browse Directory ({allPandals.length})</span>
          </button>
        </div>

        {/* TAB 1: INPUT CUSTOM PANDAL & LANDMARK */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Pandal / Club Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chetla Agrani Club, Santosh Mitra Square..."
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Location in West Bengal: Custom typing & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Type Custom Location / City / District *
                </label>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g. Siliguri, Durgapur, Chandannagar, Bolpur..."
                  className="w-full bg-[#10121a] border border-amber-400/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Type any location all over West Bengal
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  West Bengal Region / Zone
                </label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nearest Metro / Bus / Station
                </label>
                <input
                  type="text"
                  value={metroStation}
                  onChange={(e) => setMetroStation(e.target.value)}
                  placeholder="e.g. Kalighat Metro, Howrah Stn, Siliguri Junction"
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Landmark / Crossing (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Deshapriya Park / Gariahat Crossing"
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Street Address / Location Note (Optional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 12 Peary Mohan Roy Road, Chetla, Kolkata 700027"
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Puja Theme / Artistic Concept (Optional)
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Traditional Daker Saaj, Terracotta Village Mandir..."
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Quick Community Guidelines */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Once added, this custom pandal & landmark will be instantly selectable by all real players when submitting photos and filtering the live battle arena!
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Custom Pandal</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: BROWSE DIRECTORY */}
        {activeTab === 'browse' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search pandals by name, metro, or zone..."
                className="w-full bg-[#10121a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {customPandals.length > 0 && (
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between">
                <span>{customPandals.length} Custom Community Landmarks Added</span>
              </div>
            )}

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredList.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{p.name}</span>
                      {p.isCustom && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-amber-400/90 font-mono">{p.zone}</span>
                      {p.metroStation && <span>• Metro: {p.metroStation}</span>}
                      {p.landmark && <span>• Near: {p.landmark}</span>}
                    </div>
                    {p.theme && (
                      <div className="text-[10px] text-slate-500 italic">
                        Theme: {p.theme}
                      </div>
                    )}
                  </div>

                  {p.isCustom && (currentUser.isOwner || p.addedBy === currentUser.name) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustom(p.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Custom Pandal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
