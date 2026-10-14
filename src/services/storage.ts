import { PhotoEntry, FestivalDay, ChatMessage, UserProfile, PandalLandmark, PhotoComment, VideoEntry, VideoComment } from '../types/contest';
import { INITIAL_PHOTOS, INITIAL_FESTIVAL_DAYS, INITIAL_CHAT_MESSAGES } from '../data/seedData';
import { INITIAL_VIDEOS } from '../data/seedVideos';
import { POPULAR_PANDALS_DATA } from '../data/pandals';

const KEYS = {
  PHOTOS: 'pujoverse_photos_v4',
  VIDEOS: 'pujoverse_videos_v1',
  DAYS: 'pujoverse_days_v3',
  CHAT: 'pujoverse_chat_v4',
  CURRENT_USER_ID: 'pujoverse_current_user_id_v3',
  USERS_LIST: 'pujoverse_users_list_v3',
  CUSTOM_PANDALS: 'pujoverse_custom_pandals_v3',
  VOTED_IDS_PREFIX: 'pujoverse_voted_ids_v3_',
  DAILY_VOTES_PREFIX: 'pujoverse_daily_votes_v3_',
  VOTED_VIDEO_IDS_PREFIX: 'pujoverse_voted_video_ids_v1_',
  DAILY_VIDEO_VOTES_PREFIX: 'pujoverse_daily_video_votes_v1_',
  NOTIFS_ENABLED: 'pujoverse_notifs_enabled_v3',
  RULER_EMAIL: 'pujoverse_ruler_email_v3',
  RULER_PASSWORD: 'pujoverse_ruler_password_v3',
  DURGA_PHOTO: 'pujoverse_durga_photo_v2',
  DELETED_PHOTO_IDS: 'pujoverse_deleted_photo_ids_v1',
  DELETED_VIDEO_IDS: 'pujoverse_deleted_video_ids_v1'
};

export const DEFAULT_RULER_EMAIL = 'subhajitmishra8984@gmail.com';
export const DEFAULT_RULER_PASSWORD = 'subho@123';
export const DEFAULT_DURGA_PHOTO = 'mascot';

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr-demo',
    name: 'Joydeep Roy',
    instagramHandle: '@joydeep_kolkata',
    email: 'joydeep@kolkataclicks.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    bio: 'Exploring Kolkata Durga Puja pandals and participating in daily photo voting.',
    city: 'Kolkata',
    district: 'Kolkata District',
    favoritePandal: 'Bagbazar Sarbojanin Durgotsav',
    favoritePandalLocation: 'Bagbazar Ghat Road, North Kolkata',
    cameraGearUsed: 'Fujifilm X-T4 · 23mm f/2',
    isVerifiedHuman: true,
    role: 'creator',
    isOwner: false,
    badges: ['Verified Real Player', 'Community Voter', 'PujoVerse Explorer'],
    votedCount: 0,
    submissionsCount: 0,
    uploadedPhotoIds: [],
    createdAt: '2026-10-11'
  },
  {
    id: 'usr-subhajit',
    name: 'Subhajit Mishra',
    instagramHandle: '@subha_clicks',
    email: 'subhajitmishra8984@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    bio: 'Chief Organizer & Grand Juror of PujoVerse. Real camera Kolkata Durga Puja festival documentation.',
    city: 'Kolkata',
    district: 'North Kolkata',
    favoritePandal: 'Hatibagan Nabin Pally',
    favoritePandalLocation: 'Shyambazar Five-Point, North Kolkata',
    cameraGearUsed: 'Sony A7 IV · 35mm f/1.4 GM',
    isVerifiedHuman: true,
    role: 'owner',
    isOwner: true,
    badges: ['👑 Platform Ruler', 'Chief Juror', 'PujoVerse Founder', 'Verified Human Creator'],
    votedCount: 0,
    submissionsCount: 0,
    uploadedPhotoIds: [],
    createdAt: '2026-10-01'
  },
  {
    id: 'usr-priyanka',
    name: 'Priyanka Sen',
    instagramHandle: '@priyanka_snaps',
    email: 'priyanka@bengalart.in',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    bio: 'Visual artist and cultural researcher specializing in Bengal folk rituals and street life.',
    city: 'South Kolkata',
    district: 'Kolkata District',
    favoritePandal: 'Ekdalia Evergreen Club',
    favoritePandalLocation: 'Gariahat Market Lane, Ballygunge',
    cameraGearUsed: 'Fujifilm X-T5 · 33mm f/1.4',
    isVerifiedHuman: true,
    role: 'creator',
    isOwner: false,
    badges: ['Verified Human Creator', 'Sindoor Khela Laureate', 'Folk Storyteller'],
    votedCount: 0,
    submissionsCount: 0,
    uploadedPhotoIds: [],
    createdAt: '2026-10-02'
  }
];

export const StorageService = {
  getPhotos(): PhotoEntry[] {
    try {
      const stored = localStorage.getItem(KEYS.PHOTOS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PHOTOS;
  },

  savePhotos(photos: PhotoEntry[]) {
    try {
      localStorage.setItem(KEYS.PHOTOS, JSON.stringify(photos));
    } catch {
      // storage full or disabled
    }
  },

  clearAllPhotos(): PhotoEntry[] {
    try {
      const photos = this.getPhotos();
      photos.forEach((p) => this.markPhotoDeleted(p.id));
      localStorage.removeItem(KEYS.PHOTOS);
      localStorage.removeItem('pujoverse_photos_v3');
      localStorage.setItem(KEYS.PHOTOS, JSON.stringify([]));
    } catch {
      // ignore
    }
    return [];
  },

  addPhotoComment(photoId: string, comment: PhotoComment): PhotoEntry[] {
    const photos = this.getPhotos();
    const updated = photos.map((p) => {
      if (p.id === photoId) {
        const existingComments = p.comments || [];
        return {
          ...p,
          comments: [...existingComments, comment]
        };
      }
      return p;
    });
    this.savePhotos(updated);
    return updated;
  },

  getVideos(): VideoEntry[] {
    try {
      const stored = localStorage.getItem(KEYS.VIDEOS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_VIDEOS;
  },

  saveVideos(videos: VideoEntry[]) {
    try {
      localStorage.setItem(KEYS.VIDEOS, JSON.stringify(videos));
    } catch {
      // storage full or disabled
    }
  },

  updateVideo(videoId: string, updates: Partial<VideoEntry>): VideoEntry[] {
    const videos = this.getVideos();
    const updated = videos.map((v) => (v.id === videoId ? { ...v, ...updates } : v));
    this.saveVideos(updated);
    return updated;
  },

  getDeletedVideoIds(): string[] {
    try {
      const data = localStorage.getItem(KEYS.DELETED_VIDEO_IDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markVideoDeleted(videoId: string) {
    try {
      const list = this.getDeletedVideoIds();
      if (!list.includes(videoId)) {
        list.push(videoId);
        localStorage.setItem(KEYS.DELETED_VIDEO_IDS, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  },

  deleteVideo(videoId: string): VideoEntry[] {
    this.markVideoDeleted(videoId);
    const videos = this.getVideos();
    const updated = videos.filter((v) => v.id !== videoId);
    this.saveVideos(updated);

    try {
      const users = this.getUsersList();
      users.forEach((u) => {
        if (u.uploadedVideoIds && u.uploadedVideoIds.includes(videoId)) {
          u.uploadedVideoIds = u.uploadedVideoIds.filter((id) => id !== videoId);
        }
      });
      this.saveUsersList(users);
    } catch {
      // ignore
    }
    return updated;
  },

  addVideoComment(videoId: string, comment: VideoComment): VideoEntry[] {
    const videos = this.getVideos();
    const updated = videos.map((v) => {
      if (v.id === videoId) {
        const existingComments = v.comments || [];
        return {
          ...v,
          comments: [...existingComments, comment]
        };
      }
      return v;
    });
    this.saveVideos(updated);
    return updated;
  },

  deleteVideoComment(videoId: string, commentId: string): VideoEntry[] {
    const videos = this.getVideos();
    const updated = videos.map((v) => {
      if (v.id === videoId && v.comments) {
        return {
          ...v,
          comments: v.comments.filter((c) => c.id !== commentId)
        };
      }
      return v;
    });
    this.saveVideos(updated);
    return updated;
  },

  // REAL CLOCK SYNCHRONIZATION (Following actual calendar date)
  getRealClockDayNumber(): number {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 = Jan, 9 = October
    const date = now.getDate();

    // The 10-day Durga Puja festival runs from 11 Oct 2026 to 20 Oct 2026:
    if (year === 2026 && month === 9) {
      if (date >= 11 && date <= 20) {
        return date - 10; // 11 -> Day 1, 12 -> Day 2, 13 -> Day 3 (Tritiya), ..., 20 -> Day 10
      }
      if (date > 20) return 10;
      if (date < 11) return 1;
    }
    // Fallback default for today (13 Oct 2026) is Day 3
    return 3;
  },

  syncDaysWithClock(days: FestivalDay[]): FestivalDay[] {
    const activeDayNum = this.getRealClockDayNumber();
    const currentHour = new Date().getHours();
    const hoursLeftToday = Math.max(0, 23 - currentHour);

    return days.map((d) => {
      if (d.dayNumber < activeDayNum) {
        return {
          ...d,
          status: 'closed',
          pollEndsInHours: 0,
          openingSchedule: 'Concluded · Winner Crowned'
        };
      }
      if (d.dayNumber === activeDayNum) {
        return {
          ...d,
          status: 'active',
          pollEndsInHours: hoursLeftToday,
          openingSchedule: `Live Today · Cutoff 11:00 PM (${hoursLeftToday}h remaining)`
        };
      }
      // Future festival days
      const daysAhead = d.dayNumber - activeDayNum;
      return {
        ...d,
        status: 'upcoming',
        pollEndsInHours: daysAhead * 24,
        openingSchedule: `Opens ${d.dateDisplay} 2:00 AM`
      };
    });
  },

  getCurrentActiveDayNumber(): number {
    const days = this.getFestivalDays();
    const activeDay = days.find((d) => d.status === 'active');
    return activeDay ? activeDay.dayNumber : this.getRealClockDayNumber();
  },

  getFestivalDays(): FestivalDay[] {
    let days = INITIAL_FESTIVAL_DAYS;
    try {
      const stored = localStorage.getItem(KEYS.DAYS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          days = parsed;
        }
      }
    } catch {
      // Fallback
    }
    return this.syncDaysWithClock(days);
  },

  saveFestivalDays(days: FestivalDay[]) {
    try {
      localStorage.setItem(KEYS.DAYS, JSON.stringify(days));
    } catch {
      // ignore
    }
  },

  getChatMessages(): ChatMessage[] {
    try {
      const stored = localStorage.getItem(KEYS.CHAT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_CHAT_MESSAGES;
  },

  saveChatMessages(msgs: ChatMessage[]) {
    try {
      localStorage.setItem(KEYS.CHAT, JSON.stringify(msgs));
    } catch {
      // ignore
    }
  },

  deleteChatMessage(messageId: string): ChatMessage[] {
    try {
      const msgs = this.getChatMessages().filter((m) => m.id !== messageId);
      this.saveChatMessages(msgs);
      return msgs;
    } catch {
      return [];
    }
  },

  // USERS & AUTH MANAGEMENT FOR REMEMBERING UPLOAD HISTORY
  getUsersList(): UserProfile[] {
    try {
      const stored = localStorage.getItem(KEYS.USERS_LIST);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    // Initialize default seed list on first run
    try {
      localStorage.setItem(KEYS.USERS_LIST, JSON.stringify(DEFAULT_USERS));
    } catch {
      // ignore
    }
    return DEFAULT_USERS;
  },

  saveUsersList(users: UserProfile[]) {
    try {
      localStorage.setItem(KEYS.USERS_LIST, JSON.stringify(users));
    } catch {
      // ignore
    }
  },

  getCurrentUser(): UserProfile {
    try {
      const users = this.getUsersList();
      const currentId = localStorage.getItem(KEYS.CURRENT_USER_ID);
      if (currentId) {
        const found = users.find((u) => u.id === currentId);
        if (found) return found;
      }
      if (users.length > 0) return users[0];
    } catch {
      // fallback
    }
    return DEFAULT_USERS[0];
  },

  setCurrentUser(user: UserProfile) {
    try {
      const users = this.getUsersList();
      const index = users.findIndex((u) => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }
      this.saveUsersList(users);
      localStorage.setItem(KEYS.CURRENT_USER_ID, user.id);
    } catch {
      // ignore
    }
  },

  switchUser(userId: string): UserProfile | null {
    try {
      const users = this.getUsersList();
      const found = users.find((u) => u.id === userId);
      if (found) {
        localStorage.setItem(KEYS.CURRENT_USER_ID, userId);
        return found;
      }
    } catch {
      // ignore
    }
    return null;
  },

  deleteUser(userId: string): { success: boolean; nextUser: UserProfile | null; error?: string } {
    try {
      const users = this.getUsersList();
      const userToDelete = users.find((u) => u.id === userId);

      if (!userToDelete) {
        return { success: false, nextUser: null, error: 'Profile not found.' };
      }

      const remainingUsers = users.filter((u) => u.id !== userId);
      this.saveUsersList(remainingUsers);

      // Clear deleted user's daily vote records
      for (let day = 1; day <= 10; day++) {
        try {
          localStorage.removeItem(`${KEYS.DAILY_VOTES_PREFIX}${userId}_day_${day}`);
        } catch {
          // ignore
        }
      }
      try {
        localStorage.removeItem(`${KEYS.VOTED_IDS_PREFIX}${userId}`);
      } catch {
        // ignore
      }

      // Check current active user
      const currentId = localStorage.getItem(KEYS.CURRENT_USER_ID);
      let nextUser: UserProfile | null = remainingUsers.length > 0 ? remainingUsers[0] : null;

      if (currentId === userId) {
        if (nextUser) {
          localStorage.setItem(KEYS.CURRENT_USER_ID, nextUser.id);
        } else {
          localStorage.removeItem(KEYS.CURRENT_USER_ID);
        }
      } else if (currentId) {
        nextUser = remainingUsers.find((u) => u.id === currentId) || nextUser;
      }

      return { success: true, nextUser };
    } catch {
      return { success: false, nextUser: null, error: 'Failed to delete user profile.' };
    }
  },

  addUploadedPhotoToUser(userId: string, photoId: string) {
    try {
      const users = this.getUsersList();
      const user = users.find((u) => u.id === userId);
      if (user) {
        user.uploadedPhotoIds = user.uploadedPhotoIds || [];
        if (!user.uploadedPhotoIds.includes(photoId)) {
          user.uploadedPhotoIds.unshift(photoId);
          user.submissionsCount = user.uploadedPhotoIds.length;
        }
        this.saveUsersList(users);
      }
    } catch {
      // ignore
    }
  },

  // 1 VOTE PER USER PER DAY LOGIC
  getDailyVote(userId: string, dayNumber: number): string | null {
    try {
      return localStorage.getItem(`${KEYS.DAILY_VOTES_PREFIX}${userId}_day_${dayNumber}`);
    } catch {
      return null;
    }
  },

  setDailyVote(userId: string, dayNumber: number, photoId: string) {
    try {
      localStorage.setItem(`${KEYS.DAILY_VOTES_PREFIX}${userId}_day_${dayNumber}`, photoId);
      // Also add to global voted photo IDs
      this.addVotedPhotoId(userId, photoId);
    } catch {
      // ignore
    }
  },

  getDailyVotesMap(userId: string): Record<number, string> {
    const map: Record<number, string> = {};
    for (let day = 1; day <= 10; day++) {
      const votedPhotoId = this.getDailyVote(userId, day);
      if (votedPhotoId) {
        map[day] = votedPhotoId;
      }
    }
    return map;
  },

  getVotedPhotoIds(userId: string): string[] {
    try {
      const stored = localStorage.getItem(`${KEYS.VOTED_IDS_PREFIX}${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  },

  addVotedPhotoId(userId: string, photoId: string) {
    try {
      const list = this.getVotedPhotoIds(userId);
      if (!list.includes(photoId)) {
        list.push(photoId);
        localStorage.setItem(`${KEYS.VOTED_IDS_PREFIX}${userId}`, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  },

  getVotedVideoIds(userId: string): string[] {
    try {
      const stored = localStorage.getItem(`${KEYS.VOTED_VIDEO_IDS_PREFIX}${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  },

  addVotedVideoId(userId: string, videoId: string) {
    try {
      const list = this.getVotedVideoIds(userId);
      if (!list.includes(videoId)) {
        list.push(videoId);
        localStorage.setItem(`${KEYS.VOTED_VIDEO_IDS_PREFIX}${userId}`, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  },

  getDailyVideoVotesMap(userId: string): Record<number, string> {
    const map: Record<number, string> = {};
    for (let day = 1; day <= 10; day++) {
      try {
        const votedId = localStorage.getItem(`${KEYS.DAILY_VIDEO_VOTES_PREFIX}${userId}_day_${day}`);
        if (votedId) {
          map[day] = votedId;
        }
      } catch {
        // ignore
      }
    }
    return map;
  },

  setDailyVideoVote(userId: string, dayNumber: number, videoId: string) {
    try {
      localStorage.setItem(`${KEYS.DAILY_VIDEO_VOTES_PREFIX}${userId}_day_${dayNumber}`, videoId);
      this.addVotedVideoId(userId, videoId);
    } catch {
      // ignore
    }
  },

  clearDailyVideoVote(userId: string, dayNumber: number) {
    try {
      localStorage.removeItem(`${KEYS.DAILY_VIDEO_VOTES_PREFIX}${userId}_day_${dayNumber}`);
    } catch {
      // ignore
    }
  },

  addUploadedVideoToUser(userId: string, videoId: string) {
    try {
      const users = this.getUsersList();
      const user = users.find((u) => u.id === userId);
      if (user) {
        const existing = user.uploadedVideoIds || [];
        if (!existing.includes(videoId)) {
          user.uploadedVideoIds = [videoId, ...existing];
          this.saveUsersList(users);
        }
      }
    } catch {
      // ignore
    }
  },

  // CUSTOM PANDAL & LANDMARK REPOSITORY
  getCustomPandals(): PandalLandmark[] {
    try {
      const stored = localStorage.getItem(KEYS.CUSTOM_PANDALS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  },

  addCustomPandal(
    input:
      | string
      | {
          name: string;
          zone?: string;
          city?: string;
          district?: string;
          landmark?: string;
          metroStation?: string;
          address?: string;
          theme?: string;
          addedBy?: string;
        },
    zoneFallback?: string
  ): PandalLandmark {
    const list = this.getCustomPandals();
    const data = typeof input === 'string' ? { name: input, zone: zoneFallback } : input;
    const cleanName = data.name.trim();

    const existing = list.find((p) => p.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      // update details if provided
      if (data.landmark) existing.landmark = data.landmark;
      if (data.metroStation) existing.metroStation = data.metroStation;
      if (data.address) existing.address = data.address;
      if (data.theme) existing.theme = data.theme;
      if (data.city) existing.city = data.city;
      if (data.district) existing.district = data.district;
      if (data.zone) existing.zone = data.zone as any;
      this.saveCustomPandals(list);
      return existing;
    }

    const newPandal: PandalLandmark = {
      id: `pandal-custom-${Date.now()}`,
      name: cleanName,
      zone: (data.zone as any) || 'Custom Landmark',
      city: data.city?.trim() || undefined,
      district: data.district?.trim() || undefined,
      landmark: data.landmark?.trim() || undefined,
      metroStation: data.metroStation?.trim() || undefined,
      address: data.address?.trim() || undefined,
      theme: data.theme?.trim() || undefined,
      isCustom: true,
      addedBy: data.addedBy || 'Real Player',
      createdAt: new Date().toISOString().split('T')[0]
    };

    list.unshift(newPandal);
    this.saveCustomPandals(list);
    return newPandal;
  },

  saveCustomPandals(list: PandalLandmark[]) {
    try {
      localStorage.setItem(KEYS.CUSTOM_PANDALS, JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  deleteCustomPandal(id: string): PandalLandmark[] {
    const list = this.getCustomPandals();
    const updated = list.filter((p) => p.id !== id);
    this.saveCustomPandals(updated);
    return updated;
  },

  getAllPandals(): PandalLandmark[] {
    const custom = this.getCustomPandals();
    return [...custom, ...POPULAR_PANDALS_DATA];
  },

  getNotificationsEnabled(): boolean {
    try {
      return localStorage.getItem(KEYS.NOTIFS_ENABLED) === 'true';
    } catch {
      return false;
    }
  },

  setNotificationsEnabled(enabled: boolean) {
    try {
      localStorage.setItem(KEYS.NOTIFS_ENABLED, enabled ? 'true' : 'false');
    } catch {
      // ignore
    }
  },

  // OWNER ACCESS METHODS
  grantOwnerAccess(userId: string): UserProfile {
    const users = this.getUsersList();
    let updatedUser: UserProfile | null = null;
    const nextUsers = users.map((u) => {
      if (u.id === userId) {
        const badges = Array.from(new Set([...u.badges, '👑 Platform Owner', 'Chief Juror', 'PujoVerse Creator']));
        updatedUser = {
          ...u,
          role: 'owner' as const,
          isOwner: true,
          isVerifiedHuman: true,
          badges
        };
        return updatedUser;
      }
      return u;
    });

    if (updatedUser) {
      this.saveUsersList(nextUsers);
      this.setCurrentUser(updatedUser);
      return updatedUser;
    }

    // Fallback: switch to owner profile
    const ownerUser = this.switchUser('usr-owner') || DEFAULT_USERS[0];
    return ownerUser;
  },

  updatePhoto(photoId: string, updates: Partial<PhotoEntry>): PhotoEntry[] {
    const photos = this.getPhotos();
    const updated = photos.map((p) => (p.id === photoId ? { ...p, ...updates } : p));
    this.savePhotos(updated);
    return updated;
  },

  getDeletedPhotoIds(): string[] {
    try {
      const data = localStorage.getItem(KEYS.DELETED_PHOTO_IDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markPhotoDeleted(photoId: string) {
    try {
      const list = this.getDeletedPhotoIds();
      if (!list.includes(photoId)) {
        list.push(photoId);
        localStorage.setItem(KEYS.DELETED_PHOTO_IDS, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
  },

  deletePhoto(photoId: string): PhotoEntry[] {
    this.markPhotoDeleted(photoId);
    const photos = this.getPhotos();
    const updated = photos.filter((p) => p.id !== photoId);
    this.savePhotos(updated);

    // Clean up uploadedPhotoIds in users list
    try {
      const users = this.getUsersList();
      users.forEach((u) => {
        if (u.uploadedPhotoIds && u.uploadedPhotoIds.includes(photoId)) {
          u.uploadedPhotoIds = u.uploadedPhotoIds.filter((id) => id !== photoId);
          u.submissionsCount = u.uploadedPhotoIds.length;
        }
      });
      this.saveUsersList(users);
    } catch {
      // ignore
    }

    // Clean up winner references if matching
    try {
      const days = this.getFestivalDays();
      let changed = false;
      days.forEach((d) => {
        if (d.winnerId === photoId) {
          d.winnerId = null;
          changed = true;
        }
        if (d.runnerUpId === photoId) {
          d.runnerUpId = null;
          changed = true;
        }
      });
      if (changed) {
        this.saveFestivalDays(days);
      }
    } catch {
      // ignore
    }

    return updated;
  },

  getDurgaPhoto(): string {
    try {
      return localStorage.getItem(KEYS.DURGA_PHOTO) || DEFAULT_DURGA_PHOTO;
    } catch {
      return DEFAULT_DURGA_PHOTO;
    }
  },

  setDurgaPhoto(url: string) {
    try {
      localStorage.setItem(KEYS.DURGA_PHOTO, url);
    } catch {
      // ignore
    }
  },

  isLogoCopyrightFree(): boolean {
    try {
      const val = localStorage.getItem('pujoverse_logo_copyright_free');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  },

  setLogoCopyrightFree(val: boolean) {
    try {
      localStorage.setItem('pujoverse_logo_copyright_free', String(val));
    } catch {
      // ignore
    }
  },

  updateFestivalDay(dayNumber: number, updates: Partial<FestivalDay>): FestivalDay[] {
    const days = this.getFestivalDays();
    const updated = days.map((d) => (d.dayNumber === dayNumber ? { ...d, ...updates } : d));
    this.saveFestivalDays(updated);
    return updated;
  },

  // RULER EMAIL & AUTHENTICATION
  getRulerEmail(): string {
    try {
      return localStorage.getItem(KEYS.RULER_EMAIL) || DEFAULT_RULER_EMAIL;
    } catch {
      return DEFAULT_RULER_EMAIL;
    }
  },

  setRulerEmail(email: string) {
    try {
      const clean = email.trim().toLowerCase();
      if (clean) {
        localStorage.setItem(KEYS.RULER_EMAIL, clean);
      }
    } catch {
      // ignore
    }
  },

  getRulerPassword(): string {
    try {
      return localStorage.getItem(KEYS.RULER_PASSWORD) || DEFAULT_RULER_PASSWORD;
    } catch {
      return DEFAULT_RULER_PASSWORD;
    }
  },

  setRulerPassword(pwd: string) {
    try {
      const clean = pwd.trim();
      if (clean) {
        localStorage.setItem(KEYS.RULER_PASSWORD, clean);
      }
    } catch {
      // ignore
    }
  },

  changeRulerPassword(currentPassword: string, newPassword: string): { success: boolean; message: string } {
    const active = this.getRulerPassword();
    if (currentPassword.trim() !== active) {
      return { success: false, message: 'Current password does not match.' };
    }
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'New password must be at least 4 characters long.' };
    }
    this.setRulerPassword(newPassword.trim());
    return { success: true, message: 'Ruler password updated successfully!' };
  },

  isRulerEmail(email: string): boolean {
    if (!email) return false;
    const currentRulerEmail = this.getRulerEmail().toLowerCase();
    const test = email.trim().toLowerCase();
    return (
      test === currentRulerEmail ||
      test === 'subhajitmishra8984@gmail.com' ||
      test === 'subho@gmail.com' ||
      test === 'subho' ||
      test === 'owner@pujoverse.org'
    );
  },

  isRulerCredentials(email: string, password?: string): boolean {
    if (!email) return false;
    if (!this.isRulerEmail(email)) return false;
    const rulerPassword = this.getRulerPassword();
    return password === rulerPassword;
  },

  signInWithEmail(
    email: string,
    password?: string,
    name?: string,
    extra?: { district?: string; city?: string; favoritePandal?: string; favoritePandalLocation?: string }
  ): UserProfile {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsersList();
    const isRuler = this.isRulerEmail(cleanEmail);

    if (isRuler) {
      const requiredPassword = this.getRulerPassword();
      if (!password || password.trim() !== requiredPassword) {
        throw new Error('Incorrect password for Ruler account. Access restricted to Ruler.');
      }

      // Check if usr-subhajit exists
      let rulerUser = users.find((u) => u.email && u.email.toLowerCase() === cleanEmail) ||
                      users.find((u) => u.id === 'usr-subhajit');

      if (rulerUser) {
        rulerUser = {
          ...rulerUser,
          email: cleanEmail,
          name: name?.trim() || rulerUser.name || 'Subhajit Mishra',
          role: 'owner',
          isOwner: true,
          isVerifiedHuman: true,
          district: extra?.district || rulerUser.district || 'North Kolkata',
          city: extra?.city || rulerUser.city || 'Kolkata',
          favoritePandal: extra?.favoritePandal || rulerUser.favoritePandal || 'Hatibagan Nabin Pally',
          favoritePandalLocation: extra?.favoritePandalLocation || rulerUser.favoritePandalLocation || 'Shyambazar Five-Point, North Kolkata',
          badges: Array.from(new Set([...rulerUser.badges, '👑 Platform Ruler', 'Chief Juror', 'Master Curator', 'Verified Human Creator']))
        };
        const idx = users.findIndex((u) => u.id === rulerUser!.id);
        if (idx >= 0) users[idx] = rulerUser;
        else users.push(rulerUser);
      } else {
        rulerUser = {
          id: 'usr-subhajit',
          name: name?.trim() || 'Subhajit Mishra',
          email: cleanEmail,
          instagramHandle: '@subha_clicks',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
          bio: 'Chief Organizer & Grand Juror of PujoVerse. Real camera Kolkata Durga Puja festival documentation.',
          city: extra?.city || 'Kolkata',
          district: extra?.district || 'North Kolkata',
          favoritePandal: extra?.favoritePandal || 'Hatibagan Nabin Pally',
          favoritePandalLocation: extra?.favoritePandalLocation || 'Shyambazar Five-Point, North Kolkata',
          cameraGearUsed: 'Sony A7 IV · 35mm f/1.4 GM',
          isVerifiedHuman: true,
          role: 'owner',
          isOwner: true,
          badges: ['👑 Platform Ruler', 'Chief Juror', 'PujoVerse Founder', 'Verified Human Creator'],
          votedCount: 1,
          submissionsCount: 2,
          uploadedPhotoIds: ['p-2-1', 'p-day1-1'],
          createdAt: '2026-10-01'
        };
        users.push(rulerUser);
      }

      this.saveUsersList(users);
      this.setCurrentUser(rulerUser);
      return rulerUser;
    }

    // Normal participant account - match by email or name/id
    let found = users.find((u) => u.email && u.email.trim().toLowerCase() === cleanEmail) ||
                users.find((u) => u.name && u.name.trim().toLowerCase() === cleanEmail);
    if (found) {
      if (extra) {
        if (extra.city) found.city = extra.city;
        if (extra.district) found.district = extra.district;
        if (extra.favoritePandal) found.favoritePandal = extra.favoritePandal;
        if (extra.favoritePandalLocation) found.favoritePandalLocation = extra.favoritePandalLocation;
        this.saveUsersList(users);
      }
      this.setCurrentUser(found);
      return found;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name?.trim() || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail),
      email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail.toLowerCase().replace(/\s+/g, '')}@pujoverse.local`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      bio: 'Festival photographer participating in PujoVerse Durga Puja contest.',
      city: extra?.city || 'Kolkata',
      district: extra?.district || 'Kolkata District',
      favoritePandal: extra?.favoritePandal || 'Bagbazar Sarbojanin Durgotsav',
      favoritePandalLocation: extra?.favoritePandalLocation || 'Bagbazar Ghat Road, North Kolkata',
      isVerifiedHuman: true,
      role: 'creator',
      isOwner: false,
      badges: ['Verified Real Player', 'Community Member'],
      votedCount: 0,
      submissionsCount: 0,
      uploadedPhotoIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    this.saveUsersList(users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  deleteComment(photoId: string, commentId: string): PhotoEntry[] {
    const photos = this.getPhotos();
    const updated = photos.map((p) => {
      if (p.id === photoId && p.comments) {
        return {
          ...p,
          comments: p.comments.filter((c) => c.id !== commentId)
        };
      }
      return p;
    });
    this.savePhotos(updated);
    return updated;
  },

  clearDailyVote(userId: string, dayNumber: number) {
    try {
      localStorage.removeItem(`${KEYS.DAILY_VOTES_PREFIX}${userId}_day_${dayNumber}`);
    } catch {
      // ignore
    }
  },

  resetContestVotes() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((k) => {
        if (k.startsWith(KEYS.DAILY_VOTES_PREFIX) || k.startsWith(KEYS.VOTED_IDS_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch {
      // ignore
    }
  }
};
