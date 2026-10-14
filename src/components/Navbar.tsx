import React from 'react';
import { ViewTab, UserProfile } from '../types/contest';
import { DurgaMascotLogo } from './DurgaMascotLogo';
import { StorageService } from '../services/storage';
import {
  Upload,
  Crown,
  ChevronDown,
  Bell,
  MessageSquare,
  MapPin,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenUpload: () => void;
  onToggleChat: () => void;
  unreadChatCount: number;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onlineParticipants: number;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  onOpenOwnerPortal: () => void;
  onOpenPandalsModal?: () => void;
  onOpenIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenUpload,
  onToggleChat,
  unreadChatCount,
  notificationsEnabled,
  onToggleNotifications,
  onlineParticipants,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenOwnerPortal,
  onOpenPandalsModal,
  onOpenIntro
}) => {
  const durgaPhoto = StorageService.getDurgaPhoto();

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-b border-amber-500/20 px-2.5 sm:px-6 py-2 sm:py-3 transition-colors">
      {/* Decorative Traditional Marigold Toran / Genda Phool Top Garland */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 opacity-80" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Zone 1: Brand Wordmark (Tap Durga Icon for Festival Details & Guide) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onOpenIntro) {
                onOpenIntro();
              } else {
                onTabChange('arena');
              }
            }}
            className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer"
            title="Durga Puja 2026 Festival Details & Guide (Tap to view details)"
          >
            <div className="relative group-hover:scale-110 active:scale-95 transition-transform shrink-0">
              <DurgaMascotLogo
                size={34}
                showHalo={true}
                customImageUrl={durgaPhoto && durgaPhoto !== 'mascot' ? durgaPhoto : undefined}
              />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-white font-display group-hover:text-amber-400 transition-colors whitespace-nowrap flex items-center gap-1">
                <span>PujoVerse</span>
                <span className="text-xs text-amber-400">✨</span>
              </div>
              <div className="text-[9px] text-amber-400 tracking-wider uppercase font-semibold -mt-0.5 hidden xs:block">
                10-Day Durga Puja Arena · Details ℹ️
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('arena')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'arena' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <span>📸 Photo Arena</span>
            {currentTab === 'arena' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('video-arena')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'video-arena' ? 'text-rose-400 font-bold' : ''
            }`}
          >
            <span>🎬 Video Arena</span>
            <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono font-bold uppercase animate-pulse">
              NEW
            </span>
            {currentTab === 'video-arena' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('leaderboard')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'leaderboard' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <span>🏆 Leaderboard</span>
            {currentTab === 'leaderboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-rose-500 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Mobile-Optimized to Guarantee Profile is Always Visible) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Custom Pandals Directory - Hidden on mobile phones to save space */}
          {onOpenPandalsModal && (
            <button
              onClick={onOpenPandalsModal}
              className="hidden sm:flex px-2 sm:px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-amber-400/50 bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white text-xs font-semibold items-center gap-1 transition-colors cursor-pointer shrink-0"
              title="Input or Browse Custom Pandals & Landmarks"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Pandals</span>
            </button>
          )}

          {/* Ruler Console: Only displayed if authenticated as ruler */}
          {currentUser.isOwner && onOpenOwnerPortal && (
            <button
              onClick={onOpenOwnerPortal}
              className="px-2 py-1.5 rounded-lg border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors shadow-sm cursor-pointer shrink-0"
              title="PujoVerse Ruler Console & Content Management"
              aria-label="Ruler Console"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Ruler Console</span>
            </button>
          )}

          {/* Icon 1: Notifications Bell - Visible for Phone & Desktop users (Screenshot 145904) */}
          <button
            onClick={onToggleNotifications}
            title={notificationsEnabled ? 'Push Voting Reminders Enabled' : 'Enable Voting Reminders'}
            className={`flex p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
              notificationsEnabled
                ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                : 'border-white/10 hover:border-white/20 text-slate-300 hover:text-white bg-white/[0.03]'
            }`}
            aria-label="Toggle Voting Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Icon 2: Festive Adda Chat Bubble - Visible for Phone & Desktop users (Screenshot 145904) */}
          <button
            onClick={onToggleChat}
            className="flex relative p-1.5 sm:p-2 rounded-lg border border-white/10 hover:border-white/20 text-slate-300 hover:text-white bg-white/[0.03] transition-colors cursor-pointer shrink-0"
            title="Festive Adda Lounge Chat"
            aria-label="Festive Adda Chat"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Upload Button: Upload sign with "Upload" only (no "Click") */}
          <button
            onClick={onOpenUpload}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
            title="Upload Photo or Video Entry"
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span>Upload</span>
          </button>

          {/* User Profile - ALWAYS 100% VISIBLE & NEVER CUT OFF ON MOBILE */}
          <button
            onClick={() => {
              if (onOpenProfile) {
                onOpenProfile();
              } else {
                onOpenAuth();
              }
            }}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-amber-400/50 hover:border-amber-400 bg-white/[0.06] hover:bg-white/[0.12] transition-all cursor-pointer shrink-0 active:scale-95"
            title="My Profile & Details (Tap to view details)"
            aria-label="My Profile & Account Details"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-amber-400 shadow-sm"
              />
              {currentUser.isOwner ? (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[8px] font-black shadow">
                  👑
                </span>
              ) : (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0c0d12]" />
              )}
            </div>
            <span className="hidden md:inline text-xs font-bold text-slate-200 max-w-[85px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  );
};
