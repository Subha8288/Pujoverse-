import React, { useState, useEffect, useMemo } from 'react';
import {
  PhotoEntry,
  FestivalDay,
  ChatMessage,
  UserProfile,
  ViewTab,
  PandalLandmark,
  PhotoComment,
  VideoEntry,
  VideoComment
} from './types/contest';
import { StorageService } from './services/storage';
import { realtimeService, RealTimeEvent } from './services/realtime';
import { Navbar } from './components/Navbar';
import { FestivalTimeline } from './components/FestivalTimeline';
import { PhotoOfTheDayBanner } from './components/PhotoOfTheDayBanner';
import { PhotoCard } from './components/PhotoCard';
import { PhotoBattleArena } from './components/PhotoBattleArena';
import { VideoBattleArena } from './components/VideoBattleArena';
import { Leaderboard } from './components/Leaderboard';
import { UploadModal } from './components/UploadModal';
import { AddaChatDrawer } from './components/AddaChatDrawer';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { VideoDetailModal } from './components/VideoDetailModal';
import { WinnerShoutoutModal } from './components/WinnerShoutoutModal';
import { ShareCardModal } from './components/ShareCardModal';
import { UserProfileModal } from './components/UserProfileModal';
import { OfflineNotice } from './components/OfflineNotice';
import { AuthModal } from './components/AuthModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { EditPhotoModal } from './components/EditPhotoModal';
import { CustomPandalModal } from './components/CustomPandalModal';
import { UpgradedFestiveIntro } from './components/UpgradedFestiveIntro';
import { FirebaseService, getIsCloudConnected } from './services/firebase';
import {
  Flame,
  Clock,
  Swords,
  Trophy,
  Sparkles,
  Crown,
  Bell,
  Heart,
  Camera,
  Film,
  Plus,
  Filter,
  CheckCircle2,
  MapPin,
  UserCheck,
  Lock,
  Unlock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // App & Contest State: Following real clock calendar (Today 13 Oct 2026 is Day 3 Tritiya)
  const [currentTab, setCurrentTab] = useState<ViewTab>('arena');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() =>
    StorageService.getCurrentActiveDayNumber()
  );
  const [photos, setPhotos] = useState<PhotoEntry[]>(() => StorageService.getPhotos());
  const [festivalDays, setFestivalDays] = useState<FestivalDay[]>(() =>
    StorageService.getFestivalDays()
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    StorageService.getChatMessages()
  );

  // User Accounts & Authentication State (Remembering Upload History)
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => StorageService.getUsersList());
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [votedIds, setVotedIds] = useState<string[]>(() =>
    StorageService.getVotedPhotoIds(StorageService.getCurrentUser().id)
  );
  const [dailyVotesMap, setDailyVotesMap] = useState<Record<number, string>>(() =>
    StorageService.getDailyVotesMap(StorageService.getCurrentUser().id)
  );
  const [videos, setVideos] = useState<VideoEntry[]>(() => StorageService.getVideos());
  const [dailyVideoVotesMap, setDailyVideoVotesMap] = useState<Record<number, string>>(() =>
    StorageService.getDailyVideoVotesMap(StorageService.getCurrentUser().id)
  );
  const [votedVideoIds, setVotedVideoIds] = useState<string[]>(() =>
    StorageService.getVotedVideoIds(StorageService.getCurrentUser().id)
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() =>
    StorageService.getNotificationsEnabled()
  );

  // Modals & Drawers
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadModalType, setUploadModalType] = useState<'photo' | 'video'>('photo');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inspectedPhoto, setInspectedPhoto] = useState<PhotoEntry | null>(null);
  const [inspectedVideo, setInspectedVideo] = useState<VideoEntry | null>(null);
  const [sharedPhoto, setSharedPhoto] = useState<PhotoEntry | null>(null);
  const [isShoutoutOpen, setIsShoutoutOpen] = useState(false);
  const [shoutoutWinner, setShoutoutWinner] = useState<PhotoEntry | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoEntry | null>(null);
  const [isCustomPandalModalOpen, setIsCustomPandalModalOpen] = useState(false);

  // Upgraded Festive Welcome Intro (starts with intro on load/refresh by default, remembers logged-in user)
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);
  const [isSimulatedPast11PM, setIsSimulatedPast11PM] = useState(false);
  const currentHour = new Date().getHours();
  const isPast11PM = isSimulatedPast11PM || currentHour >= 23;

  // Live Countdown to 11:00 PM
  const [timeUntil11PM, setTimeUntil11PM] = useState('04 : 12 : 38');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 0, 0, 0); // 11:00 PM
      if (now > target) {
        setTimeUntil11PM('00 : 00 : 00');
        return;
      }
      const diffMs = target.getTime() - now.getTime();
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeUntil11PM(
        `${String(hrs).padStart(2, '0')} : ${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Notification Toast state
  const [notificationToast, setNotificationToast] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Online / Offline State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [onlineCount, setOnlineCount] = useState(54);

  // Filter within current day photos
  const [filterMode, setFilterMode] = useState<'all' | 'top_voted' | 'most_recent' | 'my_uploads'>('all');
  const [selectedPandalFilter, setSelectedPandalFilter] = useState<string>('All Pandals');

  // Load all custom & standard pandals
  const [pandalsList, setPandalsList] = useState<PandalLandmark[]>(() =>
    StorageService.getAllPandals()
  );

  // Sync user voted IDs when currentUser changes
  useEffect(() => {
    setVotedIds(StorageService.getVotedPhotoIds(currentUser.id));
    setDailyVotesMap(StorageService.getDailyVotesMap(currentUser.id));
  }, [currentUser.id]);

  // Real-Time Connection
  useEffect(() => {
    realtimeService.connect();

    const unsubscribe = realtimeService.subscribe((event: RealTimeEvent) => {
      if (event.type === 'VOTE_CAST') {
        const { photoId, newVotes } = event.payload;
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, votes: newVotes } : p))
        );
      } else if (event.type === 'PHOTO_SUBMITTED') {
        const newPhoto = event.payload;
        setPhotos((prev) => {
          if (prev.some((p) => p.id === newPhoto.id)) return prev;
          const updated = [newPhoto, ...prev];
          StorageService.savePhotos(updated);
          return updated;
        });
        showToast('New Entry on PujoVerse!', `"${newPhoto.title}" at ${newPhoto.pandalLocation}`);
      } else if (event.type === 'PHOTO_DELETED') {
        const { photoId } = event.payload;
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      } else if (event.type === 'CHAT_MESSAGE') {
        const msg = event.payload;
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          const updated = [...prev, msg];
          StorageService.saveChatMessages(updated);
          return updated;
        });
      } else if (event.type === 'CHAT_MESSAGE_DELETED') {
        const { id } = event.payload;
        setChatMessages((prev) => {
          const updated = prev.filter((m) => m.id !== id);
          StorageService.saveChatMessages(updated);
          return updated;
        });
      } else if (event.type === 'WINNER_SHOUTOUT') {
        setShoutoutWinner(event.payload.photo);
        setIsShoutoutOpen(true);
      }
    });

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Firebase Firestore Real-Time Multi-Device Cloud Sync
  useEffect(() => {
    // 1. Sync cloud photos across devices (strictly excluding deleted photos)
    const unsubPhotos = FirebaseService.subscribeToPhotos((cloudPhotos) => {
      if (cloudPhotos && cloudPhotos.length > 0) {
        const deletedIds = new Set(StorageService.getDeletedPhotoIds());
        setPhotos((prevLocal) => {
          const map = new Map<string, PhotoEntry>();
          prevLocal.forEach((p) => {
            if (!deletedIds.has(p.id)) {
              map.set(p.id, p);
            }
          });
          cloudPhotos.forEach((p) => {
            if (deletedIds.has(p.id)) return; // DO NOT RESURRECT DELETED PHOTOS
            const existing = map.get(p.id);
            if (existing) {
              // keep higher votes and newest data
              map.set(p.id, {
                ...existing,
                ...p,
                votes: Math.max(existing.votes || 0, p.votes || 0)
              });
            } else {
              map.set(p.id, p);
            }
          });
          const merged = Array.from(map.values());
          StorageService.savePhotos(merged);
          return merged;
        });
      }
    });

    // 2. Sync cloud videos across devices
    const unsubVideos = FirebaseService.subscribeToVideos((cloudVideos) => {
      if (cloudVideos && cloudVideos.length > 0) {
        const deletedIds = new Set(StorageService.getDeletedVideoIds());
        setVideos((prevLocal) => {
          const map = new Map<string, VideoEntry>();
          prevLocal.forEach((v) => {
            if (!deletedIds.has(v.id)) {
              map.set(v.id, v);
            }
          });
          cloudVideos.forEach((v) => {
            if (deletedIds.has(v.id)) return;
            const existing = map.get(v.id);
            if (existing) {
              map.set(v.id, {
                ...existing,
                ...v,
                votes: Math.max(existing.votes || 0, v.votes || 0)
              });
            } else {
              map.set(v.id, v);
            }
          });
          const merged = Array.from(map.values());
          StorageService.saveVideos(merged);
          return merged;
        });
      }
    });

    // 3. Sync custom pandals & landmarks across West Bengal
    const unsubPandals = FirebaseService.subscribeToPandals((cloudPandals) => {
      if (cloudPandals && cloudPandals.length > 0) {
        setPandalsList((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newEntries = cloudPandals.filter((p) => !existingIds.has(p.id));
          if (newEntries.length > 0) {
            newEntries.forEach((p) => StorageService.addCustomPandal(p));
            return StorageService.getAllPandals();
          }
          return prev;
        });
      }
    });

    // 4. Sync community Adda chat messages
    const unsubChat = FirebaseService.subscribeToChat((cloudMessages) => {
      if (cloudMessages && cloudMessages.length > 0) {
        setChatMessages((prev) => {
          const map = new Map<string, ChatMessage>();
          prev.forEach((m) => map.set(m.id, m));
          cloudMessages.forEach((m) => map.set(m.id, m));
          const merged = Array.from(map.values()).sort(
            (a, b) => (a.id > b.id ? 1 : -1)
          );
          StorageService.saveChatMessages(merged);
          return merged;
        });
      }
    });

    return () => {
      unsubPhotos();
      unsubVideos();
      unsubPandals();
      unsubChat();
    };
  }, []);

  // Save changes to storage whenever photos update
  useEffect(() => {
    StorageService.savePhotos(photos);
  }, [photos]);

  const showToast = (title: string, message: string) => {
    setNotificationToast({ title, message });
    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);
  };

  // Current active festival day
  const activeFestivalDay = useMemo(() => {
    return (
      festivalDays.find((d) => d.dayNumber === selectedDayNumber) || festivalDays[0]
    );
  }, [festivalDays, selectedDayNumber]);

  // Automatic Photo of the Day (Top-Voted Entry for the current day)
  const topVotedPhotoOfDay = useMemo(() => {
    const dayList = photos.filter((p) => p.dayNumber === selectedDayNumber);
    if (dayList.length === 0) return null;
    return [...dayList].sort((a, b) => b.votes - a.votes)[0];
  }, [photos, selectedDayNumber]);

  // Photos for current day (with Pandal filtering & User history filtering)
  const currentDayPhotos = useMemo(() => {
    let list = photos.filter((p) => p.dayNumber === selectedDayNumber);

    // Pandal / Landmark / West Bengal Location Filter
    if (selectedPandalFilter !== 'All Pandals' && selectedPandalFilter.trim()) {
      const q = selectedPandalFilter.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.pandalLocation.toLowerCase().includes(q) ||
          (p.pandalZone && p.pandalZone.toLowerCase().includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q))
      );
    }

    // Tab filter mode
    if (filterMode === 'my_uploads') {
      return list.filter(
        (p) =>
          (p.userId && p.userId === currentUser.id) ||
          (currentUser.uploadedPhotoIds && currentUser.uploadedPhotoIds.includes(p.id)) ||
          p.photographerName.toLowerCase() === currentUser.name.toLowerCase()
      );
    }
    if (filterMode === 'top_voted') {
      return [...list].sort((a, b) => b.votes - a.votes);
    }
    if (filterMode === 'most_recent') {
      return [...list].reverse();
    }
    return list;
  }, [photos, selectedDayNumber, filterMode, selectedPandalFilter, currentUser]);

  // Unique pandals present in the current day photos for quick filter chips
  const presentPandals = useMemo(() => {
    const dayPhotos = photos.filter((p) => p.dayNumber === selectedDayNumber);
    const set = new Set<string>();
    dayPhotos.forEach((p) => set.add(p.pandalLocation));
    return Array.from(set);
  }, [photos, selectedDayNumber]);

  // Cast direct vote (Strict: 1 chance per user per day, blocked if past 11:00 PM)
  const handleVote = (photoId: string) => {
    if (isPast11PM) {
      showToast('Daily Battle Closed', 'Uploads and voting ended at 11:00 PM. Results are locked!');
      return;
    }

    const currentDayVotedId = dailyVotesMap[selectedDayNumber];
    if (currentDayVotedId) {
      showToast(
        '1 Vote Already Recorded',
        `You have only 1 chance to vote for Day ${selectedDayNumber}! Each user has 1 vote per day.`
      );
      return;
    }

    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    const newVoteCount = photo.votes + 1;
    StorageService.setDailyVote(currentUser.id, selectedDayNumber, photoId);
    setDailyVotesMap((prev) => ({ ...prev, [selectedDayNumber]: photoId }));
    setVotedIds((prev) => [...prev, photoId]);

    setCurrentUser((prev) => {
      const updated = { ...prev, votedCount: prev.votedCount + 1 };
      StorageService.setCurrentUser(updated);
      return updated;
    });

    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, votes: newVoteCount } : p))
    );

    // Sync to Cloud Firestore for multi-device players
    FirebaseService.updatePhoto(photoId, { votes: newVoteCount });

    // Broadcast to WebSocket and other tabs
    realtimeService.broadcast({
      type: 'VOTE_CAST',
      payload: { photoId, newVotes: newVoteCount }
    });

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#E11D48', '#10B981']
    });

    showToast('Your 1 Daily Vote Counted!', `Successfully voted for "${photo.title}" by ${photo.photographerName}.`);
  };

  // Add Real Human Community Praise/Comment
  const handleAddComment = (photoId: string, text: string) => {
    const newComment: PhotoComment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      instagramHandle: currentUser.instagramHandle,
      text,
      timestamp: 'Just now',
      isVerifiedHuman: currentUser.isVerifiedHuman ?? true
    };
    const updated = StorageService.addPhotoComment(photoId, newComment);
    setPhotos(updated);

    // Also update inspected photo if currently opened
    setInspectedPhoto((prev) => {
      if (prev && prev.id === photoId) {
        return {
          ...prev,
          comments: [...(prev.comments || []), newComment]
        };
      }
      return prev;
    });

    showToast('Praise Recorded ✓', 'Your feedback was shared with the photographer.');
  };

  // Cast Duel Vote (Strict 1 chance per matchup winner, blocked if past 11:00 PM)
  const handleDuelVote = (winnerId: string, loserId: string) => {
    if (isPast11PM) {
      showToast('Battles Closed', 'Daily 1v1 battle closed at 11:00 PM. Final rankings locked!');
      return;
    }

    if (votedIds.includes(winnerId)) {
      showToast('Vote Already Used', 'You have already used your 1 vote for this photo in the arena!');
      return;
    }

    let updatedWinnerVotes = 0;

    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === winnerId) {
          updatedWinnerVotes = p.votes + 1;
          return {
            ...p,
            votes: updatedWinnerVotes,
            wins: p.wins + 1,
            matchups: p.matchups + 1
          };
        }
        if (p.id === loserId) {
          return {
            ...p,
            matchups: p.matchups + 1
          };
        }
        return p;
      })
    );

    StorageService.addVotedPhotoId(currentUser.id, winnerId);
    setVotedIds((prev) => [...prev, winnerId]);

    setCurrentUser((prev) => {
      const updated = { ...prev, votedCount: prev.votedCount + 1 };
      StorageService.setCurrentUser(updated);
      return updated;
    });

    // Sync duel vote to Cloud Firestore
    FirebaseService.updatePhoto(winnerId, { votes: updatedWinnerVotes });

    realtimeService.broadcast({
      type: 'VOTE_CAST',
      payload: { photoId: winnerId, newVotes: updatedWinnerVotes, isDuelWin: true }
    });
  };

  // Handle Photo Upload with User History Attachment (blocked if past 11:00 PM)
  const handlePhotoSubmit = (
    entryData: Omit<PhotoEntry, 'id' | 'votes' | 'wins' | 'matchups' | 'timestamp'>
  ) => {
    if (isPast11PM) {
      showToast('Uploads Closed', 'Daily upload cutoff was 11:00 PM. Battle has closed!');
      return;
    }

    const newId = `p-${Date.now()}`;
    const newPhoto: PhotoEntry = {
      ...entryData,
      id: newId,
      userId: currentUser.id,
      votes: 1,
      wins: 0,
      matchups: 0,
      timestamp: 'Just now',
      awardBadge: 'New Challenger'
    };

    setPhotos((prev) => [newPhoto, ...prev]);

    // Track in current user's remembered upload history
    StorageService.addUploadedPhotoToUser(currentUser.id, newId);
    setCurrentUser((prev) => {
      const existing = prev.uploadedPhotoIds || [];
      const updated = {
        ...prev,
        uploadedPhotoIds: [newId, ...existing],
        submissionsCount: existing.length + 1
      };
      StorageService.setCurrentUser(updated);
      return updated;
    });

    setPandalsList(StorageService.getAllPandals());

    // Save to Cloud Firestore so all real players see this entry
    FirebaseService.savePhoto(newPhoto);

    realtimeService.broadcast({
      type: 'PHOTO_SUBMITTED',
      payload: newPhoto
    });

    if (entryData.dayNumber !== selectedDayNumber) {
      setSelectedDayNumber(entryData.dayNumber);
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FBBF24', '#E11D48']
    });

    showToast('Photo Submitted & Saved to Your Account!', `Track your rank in PujoVerse Live Leaderboard!`);
  };

  // Handle Video / Reel Vote (Strict 1 vote per day rule)
  const handleVoteVideo = (videoId: string) => {
    if (isPast11PM) {
      showToast('Daily Battle Closed', 'Uploads and voting ended at 11:00 PM. Results are locked!');
      return;
    }

    const currentDayVotedId = dailyVideoVotesMap[selectedDayNumber];
    if (currentDayVotedId) {
      showToast(
        '1 Vote Already Recorded',
        `You have only 1 chance to vote for Day ${selectedDayNumber} in Video Arena!`
      );
      return;
    }

    const video = videos.find((v) => v.id === videoId);
    if (!video) return;

    const newVoteCount = video.votes + 1;
    StorageService.setDailyVideoVote(currentUser.id, selectedDayNumber, videoId);
    setDailyVideoVotesMap((prev) => ({ ...prev, [selectedDayNumber]: videoId }));
    setVotedVideoIds((prev) => [...prev, videoId]);

    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, votes: newVoteCount } : v))
    );

    FirebaseService.updateVideo(videoId, { votes: newVoteCount });

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F43F5E', '#FB7185', '#F59E0B']
    });

    showToast('Your 1 Daily Video Vote Counted!', `Successfully voted for "${video.title}" by ${video.videographerName}.`);
  };

  // Handle Video Submit
  const handleVideoSubmit = (
    entryData: Omit<VideoEntry, 'id' | 'votes' | 'wins' | 'matchups' | 'timestamp'>
  ) => {
    if (isPast11PM) {
      showToast('11:00 PM Cutoff Passed', 'Submissions for today are closed.');
      return;
    }

    const newId = `vid-${Date.now()}`;
    const newVideo: VideoEntry = {
      ...entryData,
      id: newId,
      userId: currentUser.id,
      votes: 1,
      wins: 0,
      matchups: 0,
      timestamp: 'Just now',
      awardBadge: 'New Reel'
    };

    setVideos((prev) => [newVideo, ...prev]);

    StorageService.addUploadedVideoToUser(currentUser.id, newId);
    setCurrentUser((prev) => {
      const existing = prev.uploadedVideoIds || [];
      const updated = {
        ...prev,
        uploadedVideoIds: [newId, ...existing]
      };
      StorageService.setCurrentUser(updated);
      return updated;
    });

    FirebaseService.saveVideo(newVideo);

    if (entryData.dayNumber !== selectedDayNumber) {
      setSelectedDayNumber(entryData.dayNumber);
    }

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#FB7185', '#F59E0B']
    });

    showToast('Video Reel Published to Video Arena!', `"${newVideo.title}" is now competing in Day ${newVideo.dayNumber} battle!`);
  };

  const handleDeleteVideo = (videoId: string) => {
    const updated = StorageService.deleteVideo(videoId);
    setVideos(updated);
    FirebaseService.deleteVideo(videoId);
    if (inspectedVideo && inspectedVideo.id === videoId) {
      setInspectedVideo(null);
    }
    showToast('Video Removed', 'Entry was removed from Video Arena.');
  };

  const handleAddVideoComment = (videoId: string, comment: VideoComment) => {
    const updated = StorageService.addVideoComment(videoId, comment);
    setVideos(updated);
    if (inspectedVideo && inspectedVideo.id === videoId) {
      const current = updated.find((v) => v.id === videoId);
      if (current) setInspectedVideo(current);
    }
    FirebaseService.updateVideo(videoId, {
      comments: updated.find((v) => v.id === videoId)?.comments || []
    });
    showToast('Festive Praise Shared!', 'Your comment was posted on the reel.');
  };

  // Handle Chat Message
  const handleSendMessage = (text: string, reactionEmoji?: string) => {
    const newMsg: ChatMessage = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      isOwner: currentUser.isOwner,
      isOfficial: currentUser.isOwner || currentUser.role === 'owner',
      text,
      reactionEmoji,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => {
      const updated = [...prev, newMsg];
      StorageService.saveChatMessages(updated);
      return updated;
    });

    // Sync message to Cloud Firestore
    FirebaseService.sendChatMessage(newMsg);

    realtimeService.broadcast({
      type: 'CHAT_MESSAGE',
      payload: newMsg
    });
  };

  const handleDeleteChatMessage = (messageId: string) => {
    setChatMessages((prev) => {
      const updated = prev.filter((m) => m.id !== messageId);
      StorageService.saveChatMessages(updated);
      return updated;
    });
    realtimeService.broadcast({
      type: 'CHAT_MESSAGE_DELETED',
      payload: { id: messageId }
    });
    showToast('Message Deleted', 'Removed from Festive Adda Lounge.');
  };

  const handleDeleteProfile = (userId: string) => {
    // Delete from Cloud Firestore if present
    FirebaseService.deleteUserProfile(userId);

    const result = StorageService.deleteUser(userId);
    if (!result.success) {
      showToast('Action Restricted', result.error || 'Cannot delete this profile.');
      return;
    }
    const updatedUsers = StorageService.getUsersList();
    setAllUsers(updatedUsers);
    if (result.nextUser) {
      setCurrentUser(result.nextUser);
      setVotedIds(StorageService.getVotedPhotoIds(result.nextUser.id));
      setDailyVotesMap(StorageService.getDailyVotesMap(result.nextUser.id));
      setVotedVideoIds(StorageService.getVotedVideoIds(result.nextUser.id));
      setDailyVideoVotesMap(StorageService.getDailyVideoVotesMap(result.nextUser.id));
    } else {
      const fallback = StorageService.getCurrentUser();
      setCurrentUser(fallback);
      setVotedIds([]);
      setDailyVotesMap({});
      setVotedVideoIds([]);
      setDailyVideoVotesMap({});
    }
    setIsProfileOpen(false);
    if (currentTab === 'profile') {
      setCurrentTab('arena');
    }
    showToast('Profile Deleted', 'The profile and its associated data were removed.');
  };

  // Switch or Create Account
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    setVotedIds(StorageService.getVotedPhotoIds(user.id));
    setDailyVotesMap(StorageService.getDailyVotesMap(user.id));
    setVotedVideoIds(StorageService.getVotedVideoIds(user.id));
    setDailyVideoVotesMap(StorageService.getDailyVideoVotesMap(user.id));
    showToast(`Switched to ${user.name}!`, `Loaded your remembered upload history and stats.`);
  };

  const handleCreateUser = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    StorageService.setCurrentUser(newUser);
    setAllUsers(StorageService.getUsersList());
    setVotedIds(StorageService.getVotedPhotoIds(newUser.id));
    setDailyVotesMap(StorageService.getDailyVotesMap(newUser.id));
    setVotedVideoIds(StorageService.getVotedVideoIds(newUser.id));
    setDailyVideoVotesMap(StorageService.getDailyVideoVotesMap(newUser.id));
    showToast(`Profile Created for ${newUser.name}!`, `Welcome to PujoVerse.`);
  };

  // Trigger Winner Ceremony
  const triggerWinnerCeremony = (dayNum: number) => {
    const dayPool = photos.filter((p) => p.dayNumber === dayNum);
    if (dayPool.length === 0) return;
    const topPhoto = [...dayPool].sort((a, b) => b.votes - a.votes)[0];

    setShoutoutWinner(topPhoto);
    setIsShoutoutOpen(true);

    realtimeService.broadcast({
      type: 'WINNER_SHOUTOUT',
      payload: { dayNumber: dayNum, photo: topPhoto }
    });
  };

  // Toggle Push Notifications
  const handleToggleNotifications = () => {
    const nextState = !notificationsEnabled;
    setNotificationsEnabled(nextState);
    StorageService.setNotificationsEnabled(nextState);

    if (nextState) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
      showToast(
        'PujoVerse 11 PM Voting Reminders Enabled',
        'You will receive push reminders before daily battles close at 11:00 PM!'
      );
    } else {
      showToast('Notifications Muted', 'Daily voting push reminders turned off.');
    }
  };

  // RULER ACCESS & AUTHENTICATION ACTIONS
  const handleSignInWithEmail = (email: string, password?: string, name?: string) => {
    try {
      const user = StorageService.signInWithEmail(email, password, name);
      setCurrentUser(user);
      setAllUsers(StorageService.getUsersList());
      setVotedIds(StorageService.getVotedPhotoIds(user.id));
      setDailyVotesMap(StorageService.getDailyVotesMap(user.id));
      setVotedVideoIds(StorageService.getVotedVideoIds(user.id));
      setDailyVideoVotesMap(StorageService.getDailyVideoVotesMap(user.id));

      if (user.isOwner) {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FBBF24', '#E11D48']
        });
        showToast('👑 Ruler Access Activated', `Authenticated as Ruler (${user.email}). Full console & inline editing unlocked.`);
      } else {
        showToast(`Welcome ${user.name}!`, `Signed in with ${user.email}.`);
      }
    } catch (err: any) {
      showToast('Sign In Error', err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleSaveEditedPhoto = (updatedPhoto: PhotoEntry) => {
    const updated = StorageService.updatePhoto(updatedPhoto.id, updatedPhoto);
    setPhotos(updated);
    if (inspectedPhoto && inspectedPhoto.id === updatedPhoto.id) {
      setInspectedPhoto(updatedPhoto);
    }
    // Sync to Cloud Firestore
    FirebaseService.savePhoto(updatedPhoto);

    realtimeService.broadcast({
      type: 'PHOTO_SUBMITTED',
      payload: updatedPhoto
    });
    showToast('Photo Updated by Ruler', `Saved "${updatedPhoto.title}" modifications.`);
  };

  const handleDeleteComment = (photoId: string, commentId: string) => {
    const updated = StorageService.deleteComment(photoId, commentId);
    setPhotos(updated);
    if (inspectedPhoto && inspectedPhoto.id === photoId) {
      const current = updated.find((p) => p.id === photoId);
      if (current) setInspectedPhoto(current);
    }
    showToast('Comment Removed', 'Community praise deleted by Ruler.');
  };

  const handleClaimOwnerAccess = () => {
    const updated = StorageService.grantOwnerAccess(currentUser.id);
    setCurrentUser(updated);
    setAllUsers(StorageService.getUsersList());
    setIsOwnerPortalOpen(true);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#E11D48', '#10B981']
    });
    showToast('👑 Master Owner Access Granted!', 'You now have full organizer and juror controls.');
  };

  const handleUpdateDay = (dayNum: number, updates: Partial<FestivalDay>) => {
    const updated = StorageService.updateFestivalDay(dayNum, updates);
    setFestivalDays(updated);
    showToast('Schedule Updated', `Day ${dayNum} status adjusted by Owner.`);
  };

  const handleUpdatePhoto = (photoId: string, updates: Partial<PhotoEntry>) => {
    const updated = StorageService.updatePhoto(photoId, updates);
    setPhotos(updated);
    showToast('Submission Curated', 'Entry updated successfully.');
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = StorageService.deletePhoto(photoId);
    setPhotos(updated);
    // Delete from Cloud Firestore
    FirebaseService.deletePhoto(photoId);

    realtimeService.broadcast({
      type: 'PHOTO_DELETED',
      payload: { photoId }
    });

    if (inspectedPhoto && inspectedPhoto.id === photoId) {
      setInspectedPhoto(null);
    }
    if (editingPhoto && editingPhoto.id === photoId) {
      setEditingPhoto(null);
    }
    showToast('Photo Removed', 'Entry was removed from contest.');
  };

  const handleClearAllPhotos = () => {
    StorageService.clearAllPhotos();
    setPhotos([]);
    if (inspectedPhoto) setInspectedPhoto(null);
    if (editingPhoto) setEditingPhoto(null);
    showToast('All Uploaded Photos Wiped', 'Contest arena has been reset to a fresh empty state.');
  };

  const handleClearMyDailyVote = () => {
    StorageService.clearDailyVote(currentUser.id, selectedDayNumber);
    setDailyVotesMap((prev) => {
      const copy = { ...prev };
      delete copy[selectedDayNumber];
      return copy;
    });
    showToast('Vote Lock Cleared', `Your vote lock for Day ${selectedDayNumber} was reset.`);
  };

  const handleResetAllVotes = () => {
    StorageService.resetContestVotes();
    setDailyVotesMap({});
    setVotedIds([]);
    showToast('Contest Votes Reset', 'Local vote history was cleared.');
  };

  const handleBroadcastAnnouncement = (text: string) => {
    const newMsg: ChatMessage = {
      id: `c-owner-${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.name} (Organizer)`,
      userAvatar: currentUser.avatar,
      text,
      reactionEmoji: '👑',
      timestamp: 'Just now',
      isOfficial: true,
      isOwner: true
    };
    setChatMessages((prev) => {
      const updated = [...prev, newMsg];
      StorageService.saveChatMessages(updated);
      return updated;
    });
    // Sync to Cloud Firestore
    FirebaseService.sendChatMessage(newMsg);

    realtimeService.broadcast({
      type: 'CHAT_MESSAGE',
      payload: newMsg
    });
    showToast('Official Broadcast Sent', 'Message posted to Festive Adda.');
  };

  const handleAddPandal = (name: string, zone?: string) => {
    const created = StorageService.addCustomPandal(name, zone);
    // Sync custom pandal to Cloud Firestore
    FirebaseService.savePandal(created);
    setPandalsList(StorageService.getAllPandals());
    showToast('Pandal Registered', `Added "${name}" to official registry.`);
  };

  // User Photos for Profile Modal
  const userRememberedPhotos = useMemo(() => {
    return photos.filter(
      (p) =>
        (p.userId && p.userId === currentUser.id) ||
        (currentUser.uploadedPhotoIds && currentUser.uploadedPhotoIds.includes(p.id)) ||
        p.photographerName.toLowerCase() === currentUser.name.toLowerCase()
    );
  }, [photos, currentUser]);

  const effectiveOffline = isOffline || isSimulatedOffline;

  return (
    <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col font-sans">
      {/* Offline Notice Banner */}
      <OfflineNotice
        isOffline={effectiveOffline}
        isSimulated={isSimulatedOffline}
        onToggleSimulatedOffline={() => setIsSimulatedOffline((prev) => !prev)}
      />

      {/* Top Bar Navigation (PujoVerse) */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
        onToggleChat={() => setIsChatOpen((prev) => !prev)}
        unreadChatCount={0}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleToggleNotifications}
        onlineParticipants={onlineCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => {
          setCurrentTab('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
        onOpenPandalsModal={() => setIsCustomPandalModalOpen(true)}
        onOpenIntro={() => setIsIntroOpen(true)}
      />

      {/* 9-Day Festival Timeline (Day 1 Gone, Day 2 Active) */}
      <FestivalTimeline
        days={festivalDays}
        selectedDayNumber={selectedDayNumber}
        onSelectDay={(dayNum) => {
          setSelectedDayNumber(dayNum);
          setSelectedPandalFilter('All Pandals');
          if (currentTab !== 'arena' && currentTab !== 'leaderboard') {
            setCurrentTab('arena');
          }
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 md:pb-8">
        {/* VIEW 1: TODAY'S ARENA (All-Participant Battle Arena with Photo of the Day Banner & 1 Vote Rule) */}
        {currentTab === 'arena' && (
          <div className="space-y-6">
            {/* Custom Pandal & Landmark Selector Bar */}
            <div className="bg-[#141624] rounded-2xl border border-white/10 p-4 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                    Filter Contestants by Pandal / Landmark:
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <select
                    value={selectedPandalFilter}
                    onChange={(e) => setSelectedPandalFilter(e.target.value)}
                    className="w-full bg-[#1c1f2e] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
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
                      onClick={() => setSelectedPandalFilter('All Pandals')}
                      className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 whitespace-nowrap"
                    >
                      Reset
                    </button>
                  )}

                  <button
                    onClick={() => setIsCustomPandalModalOpen(true)}
                    className="text-xs font-semibold text-amber-300 hover:text-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center gap-1 shrink-0 whitespace-nowrap"
                    title="Add or Input Custom Pandal & Landmark"
                  >
                    <span>+ Landmark</span>
                  </button>
                </div>
              </div>

              {/* Quick Pandal Chips */}
              <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedPandalFilter('All Pandals')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedPandalFilter === 'All Pandals'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({photos.filter((p) => p.dayNumber === selectedDayNumber).length})
                </button>

                {presentPandals.map((pandal) => {
                  const isSelected = selectedPandalFilter === pandal;
                  const shortName = pandal.split('(')[0].trim();
                  return (
                    <button
                      key={pandal}
                      onClick={() => setSelectedPandalFilter(pandal)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All-Participant Battle Arena */}
            <PhotoBattleArena
              photos={currentDayPhotos}
              day={activeFestivalDay}
              votedPhotoId={dailyVotesMap[selectedDayNumber] || null}
              currentUser={currentUser}
              onCastVote={handleVote}
              onInspectPhoto={(p) => setInspectedPhoto(p)}
              onSharePhoto={(p) => setSharedPhoto(p)}
              onOpenUploadModal={() => setIsUploadOpen(true)}
              onOpenProfileModal={() => setCurrentTab('profile')}
              onEditPhoto={(p) => setEditingPhoto(p)}
              onDeletePhoto={handleDeletePhoto}
              isPast11PM={isPast11PM}
              timeUntil11PM={timeUntil11PM}
            />
          </div>
        )}

        {/* VIEW 2: VIDEO ARENA (Durga Puja Reels, Dhunuchi Dance, Arati & Illumination Walkthroughs) */}
        {currentTab === 'video-arena' && (
          <VideoBattleArena
            videos={videos}
            currentDay={activeFestivalDay}
            votedVideoId={dailyVideoVotesMap[selectedDayNumber] || null}
            onVoteVideo={handleVoteVideo}
            onInspectVideo={(v) => setInspectedVideo(v)}
            onShareVideo={(v) => {
              setSharedPhoto({
                id: v.id,
                dayNumber: v.dayNumber,
                title: v.title,
                imageUrl: v.thumbnailUrl,
                photographerName: v.videographerName,
                photographerAvatar: v.videographerAvatar,
                instagramHandle: v.instagramHandle,
                pandalLocation: v.pandalLocation,
                city: v.city,
                cameraGear: v.cameraGear || { cameraOrPhone: 'Video Reel' },
                caption: v.caption,
                votes: v.votes,
                wins: v.wins || 0,
                matchups: v.matchups || 0,
                timestamp: v.timestamp,
                tags: v.tags
              });
            }}
            currentUser={currentUser}
            onOpenUploadVideo={() => {
              setUploadModalType('video');
              setIsUploadOpen(true);
            }}
            selectedPandalFilter={selectedPandalFilter}
            onSelectPandalFilter={setSelectedPandalFilter}
            presentPandals={presentPandals}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
            isPast11PM={isPast11PM}
            timeUntil11PM={timeUntil11PM}
          />
        )}

        {/* VIEW 3: LIVE LEADERBOARD & FINAL 11 PM RANK TRACKING */}
        {currentTab === 'leaderboard' && (
          <Leaderboard
            photos={currentDayPhotos}
            videos={videos}
            selectedDayNumber={selectedDayNumber}
            onInspectPhoto={(p) => setInspectedPhoto(p)}
            onInspectVideo={(v) => setInspectedVideo(v)}
            onVotePhoto={handleVote}
            onVoteVideo={handleVoteVideo}
            votedIds={votedIds}
            votedVideoIds={votedVideoIds}
            isPast11PM={isPast11PM}
          />
        )}



        {/* VIEW 6: USER PROFILE */}
        {currentTab === 'profile' && (
          <div className="max-w-3xl mx-auto py-4">
            <UserProfileModal
              user={currentUser}
              isOpen={true}
              onClose={() => setCurrentTab('arena')}
              userPhotos={userRememberedPhotos}
              allPhotos={photos}
              onUpdateProfile={(updated) => {
                setCurrentUser(updated);
                StorageService.setCurrentUser(updated);
                setAllUsers(StorageService.getUsersList());
                showToast('Profile Updated', 'Your customized location, favorite pandal, and bio were saved.');
              }}
              onInspectPhoto={(p) => setInspectedPhoto(p)}
              onOpenSwitchAccount={() => setIsAuthModalOpen(true)}
              onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
              onDeleteProfile={handleDeleteProfile}
              onDeletePhoto={handleDeletePhoto}
            />
          </div>
        )}
      </main>

      {/* Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161826] border border-amber-400/50 rounded-2xl p-4 shadow-2xl max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-white font-display">
              {notificationToast.title}
            </div>
            <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {notificationToast.message}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Safe Area / Footer */}
      <footer className="mt-12 border-t border-white/5 bg-[#0a0b10] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-400 font-display">
              PujoVerse · 10-Day Durga Puja Daily Photo Arena
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            {currentUser.isOwner ? (
              <button
                onClick={() => setIsOwnerPortalOpen(true)}
                className="text-amber-400/90 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors px-2 py-0.5 rounded text-[11px] border border-amber-500/30 bg-amber-500/10"
                title="Open Ruler Console"
              >
                <Crown className="w-3 h-3" />
                <span>Ruler Console</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-slate-500 hover:text-slate-300 transition-colors text-[11px]"
              >
                Curator / Staff Sign In
              </button>
            )}

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Account ({currentUser.name.split(' ')[0]})
            </button>
            <button
              onClick={() => setIsSimulatedPast11PM((prev) => !prev)}
              className="hover:text-amber-400 transition-colors font-mono"
            >
              {isPast11PM ? 'Reopen Battles (Before 11 PM)' : 'Simulate 11 PM Deadline'}
            </button>
            <button
              onClick={() => setIsSimulatedOffline((prev) => !prev)}
              className="hover:text-amber-400 transition-colors"
            >
              {isSimulatedOffline ? 'Go Online' : 'Test Offline Mode'}
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
            {currentUser.isOwner ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Crown className="w-3 h-3" /> Owner Mode Active
              </span>
            ) : (
              <span>Real Player Mode Active</span>
            )}
            <span>·</span>
            <span>{currentUser.name}</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handlePhotoSubmit}
        onSubmitVideo={handleVideoSubmit}
        initialType={uploadModalType}
        currentDayNumber={selectedDayNumber}
        currentUser={currentUser}
        isPast11PM={isPast11PM}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        onCreateUser={handleCreateUser}
        onSignInWithEmail={handleSignInWithEmail}
        onDeleteUser={handleDeleteProfile}
      />

      <PhotoDetailModal
        photo={inspectedPhoto}
        isOpen={Boolean(inspectedPhoto)}
        onClose={() => setInspectedPhoto(null)}
        hasVoted={inspectedPhoto ? dailyVotesMap[selectedDayNumber] === inspectedPhoto.id : false}
        hasVotedAnyToday={Boolean(dailyVotesMap[selectedDayNumber])}
        isPast11PM={isPast11PM}
        currentUser={currentUser}
        onVote={handleVote}
        onShare={(p) => setSharedPhoto(p)}
        onAddComment={handleAddComment}
        onEditPhoto={(p) => setEditingPhoto(p)}
        onDeleteComment={handleDeleteComment}
        onDeletePhoto={handleDeletePhoto}
      />

      {/* Video Reel Detail & Player Modal */}
      <VideoDetailModal
        video={inspectedVideo}
        isOpen={Boolean(inspectedVideo)}
        onClose={() => setInspectedVideo(null)}
        hasVoted={inspectedVideo ? dailyVideoVotesMap[selectedDayNumber] === inspectedVideo.id : false}
        onVote={handleVoteVideo}
        onAddComment={handleAddVideoComment}
        currentUser={currentUser}
        onShare={(v) => {
          setSharedPhoto({
            id: v.id,
            dayNumber: v.dayNumber,
            title: v.title,
            imageUrl: v.thumbnailUrl,
            photographerName: v.videographerName,
            photographerAvatar: v.videographerAvatar,
            instagramHandle: v.instagramHandle,
            pandalLocation: v.pandalLocation,
            city: v.city,
            cameraGear: v.cameraGear || { cameraOrPhone: 'Video Reel' },
            caption: v.caption,
            votes: v.votes,
            wins: v.wins || 0,
            matchups: v.matchups || 0,
            timestamp: v.timestamp,
            tags: v.tags
          });
        }}
        onDeleteVideo={handleDeleteVideo}
      />

      <AddaChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onDeleteMessage={handleDeleteChatMessage}
        onlineCount={onlineCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <WinnerShoutoutModal
        isOpen={isShoutoutOpen}
        onClose={() => setIsShoutoutOpen(false)}
        winnerPhoto={shoutoutWinner}
        dayNumber={selectedDayNumber}
        dayTitle={activeFestivalDay.title}
        onShare={(p) => setSharedPhoto(p)}
      />

      <ShareCardModal
        photo={sharedPhoto}
        isOpen={Boolean(sharedPhoto)}
        onClose={() => setSharedPhoto(null)}
      />

      {/* Owner Access & Grand Juror Portal Modal */}
      <OwnerDashboard
        isOpen={isOwnerPortalOpen}
        onClose={() => setIsOwnerPortalOpen(false)}
        currentUser={currentUser}
        photos={photos}
        days={festivalDays}
        currentDayNumber={selectedDayNumber}
        isPast11PM={isPast11PM}
        onUpdateDay={handleUpdateDay}
        onUpdatePhoto={handleUpdatePhoto}
        onDeletePhoto={handleDeletePhoto}
        onClearAllPhotos={handleClearAllPhotos}
        onToggle11PMOverride={() => setIsSimulatedPast11PM((prev) => !prev)}
        onClearMyDailyVote={handleClearMyDailyVote}
        onResetAllVotes={handleResetAllVotes}
        onBroadcastAnnouncement={handleBroadcastAnnouncement}
        onAddPandal={handleAddPandal}
        onInspectPhoto={(p) => setInspectedPhoto(p)}
        onSelectDay={(dayNum) => setSelectedDayNumber(dayNum)}
        onOpenEditPhoto={(p) => setEditingPhoto(p)}
        onUpdateCurrentUser={(updated) => {
          setCurrentUser(updated);
          StorageService.setCurrentUser(updated);
          setAllUsers(StorageService.getUsersList());
        }}
      />

      {/* Ruler Instant Photo Editor Modal */}
      <EditPhotoModal
        photo={editingPhoto}
        isOpen={Boolean(editingPhoto)}
        onClose={() => setEditingPhoto(null)}
        onSavePhoto={handleSaveEditedPhoto}
        onDeletePhoto={handleDeletePhoto}
        pandalsList={pandalsList}
      />

      {/* Community Custom Pandal & Landmark Registry Modal */}
      <CustomPandalModal
        isOpen={isCustomPandalModalOpen}
        onClose={() => setIsCustomPandalModalOpen(false)}
        currentUser={currentUser}
        onPandalAdded={(newPandal) => {
          setPandalsList(StorageService.getAllPandals());
          if (newPandal.name) {
            FirebaseService.savePandal(newPandal);
            showToast('Custom Pandal Registered', `"${newPandal.name}" is now available across PujoVerse!`);
          }
        }}
      />

      {/* Upgraded Festive Welcome Intro Experience */}
      <UpgradedFestiveIntro
        isOpen={isIntroOpen}
        onEnter={() => setIsIntroOpen(false)}
      />

      {/* Mobile Sticky Bottom Navigation Bar (Phone-Optimized Quick Access) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f17]/95 backdrop-blur-lg border-t border-white/10 md:hidden flex items-center justify-around px-2 py-2 text-[10px] font-semibold text-slate-400 shadow-2xl">
        <button
          onClick={() => {
            setCurrentTab('arena');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${
            currentTab === 'arena' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Camera className="w-4.5 h-4.5" />
          <span>Photos</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('video-arena');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${
            currentTab === 'video-arena' ? 'text-rose-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Film className="w-4.5 h-4.5" />
          <span>Videos</span>
        </button>

        {/* Central Prominent Upload Button for One-Thumb Mobile Uploads */}
        <button
          onClick={() => {
            setUploadModalType(currentTab === 'video-arena' ? 'video' : 'photo');
            setIsUploadOpen(true);
          }}
          className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
          title="Upload Entry"
          aria-label="Upload Entry"
        >
          <Plus className="w-6 h-6 stroke-[3] text-slate-950" />
        </button>

        <button
          onClick={() => {
            setCurrentTab('leaderboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${
            currentTab === 'leaderboard' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4.5 h-4.5" />
          <span>Ranks</span>
        </button>

        {/* Dedicated Profile Tab - 100% VISIBLE & EASY TO TAP ON PHONE */}
        <button
          onClick={() => {
            setCurrentTab('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${
            currentTab === 'profile' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
          title="My Profile & Customized Location Details"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`w-5 h-5 rounded-full object-cover ${
                currentTab === 'profile' ? 'border-2 border-amber-400 ring-2 ring-amber-400/40' : 'border border-amber-400/70'
              }`}
            />
            {currentUser.isOwner && (
              <span className="absolute -top-1 -right-1 text-[8px]">👑</span>
            )}
          </div>
          <span>Profile</span>
        </button>
      </nav>

      {/* Floating Adda Lounge Button on Mobile (Always accessible above bottom bar) */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="md:hidden fixed bottom-18 right-3.5 z-30 p-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xl shadow-rose-950/60 border border-white/20 active:scale-90 transition-transform flex items-center justify-center cursor-pointer"
        title="Open Festive Adda Chat"
        aria-label="Open Festive Adda Chat"
      >
        <span className="text-base leading-none">💬</span>
      </button>

    </div>
  );
}
