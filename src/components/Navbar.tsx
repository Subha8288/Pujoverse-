import React from 'react';
import { ViewTab, UserProfile } from '../types/contest';
import { Bell, Flame, MessageSquare, User, Upload, ChevronDown, Instagram, Crown, ShieldCheck, MapPin, Globe, Rocket } from 'lucide-react';

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
  onOpenOwnerPortal: () => void;
  onOpenPandalsModal?: () => void;
  onOpenWebsiteGuide?: () => void;
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
  onOpenOwnerPortal,
  onOpenPandalsModal,
  onOpenWebsiteGuide
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 lg:gap-8">
        {/* Zone 1: Brand Wordmark (PujoVerse) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('arena')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white font-display group-hover:text-amber-400 transition-colors whitespace-nowrap">
                PujoVerse
              </div>
              <div className="text-[10px] text-amber-400 tracking-wider uppercase font-semibold -mt-1 hidden sm:block">
                10-Day Durga Puja Arena
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('arena')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative flex items-center gap-1.5 ${
              currentTab === 'arena' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            <span>Battle Arena</span>
            <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
              All Participants
            </span>
            {currentTab === 'arena' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('leaderboard')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              currentTab === 'leaderboard' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            Live Leaderboard
            {currentTab === 'leaderboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('past_winners')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              currentTab === 'past_winners' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            Hall of Fame
            {currentTab === 'past_winners' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('tips')}
            className={`whitespace-nowrap transition-colors hover:text-white py-1 relative ${
              currentTab === 'tips' ? 'text-amber-400 font-bold' : ''
            }`}
          >
            Masterclass
            {currentTab === 'tips' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Custom Pandals & Landmarks Directory */}
          {onOpenPandalsModal && (
            <button
              onClick={onOpenPandalsModal}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-amber-400/50 bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Input or Browse Custom Pandals & Landmarks"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Pandals</span>
            </button>
          )}

          {/* Website Launch & Deployment Guide */}
          {onOpenWebsiteGuide && (
            <button
              onClick={onOpenWebsiteGuide}
              className="px-2.5 py-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Turn PujoVerse into a live public website on Vercel or Netlify"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Launch Website</span>
              <span className="lg:hidden hidden sm:inline">Deploy</span>
            </button>
          )}

          {/* Ruler Console: Only displayed if authenticated as ruler */}
          {currentUser.isOwner && onOpenOwnerPortal && (
            <button
              onClick={onOpenOwnerPortal}
              className="px-2.5 py-1.5 rounded-lg border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="PujoVerse Ruler Console & Content Management"
              aria-label="Ruler Console"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Ruler Console</span>
            </button>
          )}

          {/* Notifications toggle */}
          <button
            onClick={onToggleNotifications}
            title={notificationsEnabled ? 'Push Voting Reminders Enabled' : 'Enable Voting Reminders'}
            className={`p-2 rounded-lg border transition-colors ${
              notificationsEnabled
                ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                : 'border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200'
            }`}
            aria-label="Toggle notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Festive Adda Chat button */}
          <button
            onClick={onToggleChat}
            className="relative p-2 rounded-lg border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            aria-label="Festive Adda Chat"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold hidden sm:inline">Adda</span>
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Profile Switcher & Account Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/10 hover:border-amber-400/60 bg-white/[0.03] hover:bg-white/[0.07] transition-all relative"
            title="Profile & Switch Account"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-amber-400/80"
              />
              {currentUser.isOwner && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[7px] font-bold">
                  👑
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block max-w-[120px]">
              <span className="text-xs font-bold text-slate-200 truncate block leading-tight flex items-center gap-1">
                {currentUser.name}
                {currentUser.isOwner && (
                  <Crown className="w-2.5 h-2.5 text-amber-400 inline" />
                )}
              </span>
              {currentUser.instagramHandle ? (
                <span className="text-[10px] text-rose-400 font-mono truncate block leading-tight">
                  {currentUser.instagramHandle}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono truncate block leading-tight">
                  Profile
                </span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Primary Upload CTA */}
          <button
            onClick={onOpenUpload}
            className="px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Upload className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Upload Click</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>
      </div>
    </header>
  );
};
