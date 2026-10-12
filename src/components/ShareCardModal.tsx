import React, { useState } from 'react';
import { PhotoEntry } from '../types/contest';
import { X, Share2, Copy, Check, Download, MapPin, Camera, Flame } from 'lucide-react';

interface ShareCardModalProps {
  photo: PhotoEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ photo, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !photo) return null;

  const shareText = `Check out "${photo.title}" by ${photo.photographerName} at ${photo.pandalLocation} on PujoVerse Durga Puja Photo Arena!`;
  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\nVote here: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`${shareText}\n#PujoVerse #DurgaPuja #Kolkata`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#161826] rounded-2xl border border-white/10 shadow-2xl p-5 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold font-display text-white">Festival Share Card</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branded Share Card Preview */}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-[#1b1e2e] to-[#12131c] border-2 border-amber-500/40 relative shadow-xl">
          {/* Top Card Branding */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/20">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black font-display text-amber-300 uppercase tracking-wider">
                PujoVerse · Puja 2026
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Day {photo.dayNumber} Entry</span>
          </div>

          {/* Photo */}
          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-900 border border-white/10">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <div className="text-xs font-bold font-display truncate">{photo.title}</div>
              <div className="text-[10px] text-amber-300 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />
                <span className="truncate">{photo.pandalLocation}</span>
              </div>
            </div>
          </div>

          {/* Bottom Card Credits */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <img
                src={photo.photographerAvatar}
                alt={photo.photographerName}
                className="w-6 h-6 rounded-full object-cover border border-amber-400"
              />
              <div>
                <span className="font-semibold text-slate-200 block leading-tight">{photo.photographerName}</span>
                {photo.instagramHandle && (
                  <span className="text-[10px] text-rose-400 font-mono block leading-tight">
                    {photo.instagramHandle}
                  </span>
                )}
              </div>
            </div>

            <div className="font-mono text-amber-400 font-bold tabular-nums">
              {photo.votes} Votes
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsApp}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleTwitter}
              className="w-full py-2 px-3 rounded-xl bg-sky-600/20 border border-sky-500/40 hover:bg-sky-600/30 text-sky-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Twitter / X</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copy Shareable Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
