import { PhotoEntry, FestivalDay, ChatMessage, UserProfile, PandalLandmark, PhotoComment } from '../types/contest';
import { INITIAL_PHOTOS, INITIAL_FESTIVAL_DAYS, INITIAL_CHAT_MESSAGES } from '../data/seedData';
import { POPULAR_PANDALS_DATA } from '../data/pandals';

const KEYS = {
  PHOTOS: 'pujoverse_photos_v3',
  DAYS: 'pujoverse_days_v3',
  CHAT: 'pujoverse_chat_v3',
  CURRENT_USER_ID: 'pujoverse_current_user_id_v3',
  USERS_LIST: 'pujoverse_users_list_v3',
  CUSTOM_PANDALS: 'pujoverse_custom_pandals_v3',
  VOTED_IDS_PREFIX: 'pujoverse_voted_ids_v3_',
  DAILY_VOTES_PREFIX: 'pujoverse_daily_votes_v3_',
  NOTIFS_ENABLED: 'pujoverse_notifs_enabled_v3',
  RULER_EMAIL: 'pujoverse_ruler_email_v3',
  RULER_PASSWORD: 'pujoverse_ruler_password_v3'
};

export const DEFAULT_RULER_EMAIL = 'subhajitmishra8984@gmail.com';
export const DEFAULT_RULER_PASSWORD = 'subho@123';

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr-demo',
    name: 'Joydeep Roy',
    instagramHandle: '@joydeep_kolkata',
    email: 'joydeep@kolkataclicks.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    bio: 'Exploring Kolkata Durga Puja pandals and participating in daily photo voting.',
    city: 'Kolkata, West Bengal',
    favoritePandal: 'Bagbazar Sarbojanin Durgotsav',
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
    city: 'Kolkata, West Bengal',
    favoritePandal: 'Hatibagan Nabin Pally',
    cameraGearUsed: 'Sony A7 IV · 35mm f/1.4 GM',
    isVerifiedHuman: true,
    role: 'owner',
    isOwner: true,
    badges: ['👑 Platform Ruler', 'Chief Juror', 'PujoVerse Founder', 'Verified Human Creator'],
    votedCount: 1,
    submissionsCount: 2,
    uploadedPhotoIds: ['p-2-1', 'p-day1-1'],
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
    favoritePandal: 'Ekdalia Evergreen Club',
    cameraGearUsed: 'Fujifilm X-T5 · 33mm f/1.4',
    isVerifiedHuman: true,
    role: 'creator',
    isOwner: false,
    badges: ['Verified Human Creator', 'Sindoor Khela Laureate', 'Folk Storyteller'],
    votedCount: 1,
    submissionsCount: 1,
    uploadedPhotoIds: ['p-2-2'],
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

  getFestivalDays(): FestivalDay[] {
    try {
      const stored = localStorage.getItem(KEYS.DAYS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_FESTIVAL_DAYS;
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

  // USERS & AUTH MANAGEMENT FOR REMEMBERING UPLOAD HISTORY
  getUsersList(): UserProfile[] {
    try {
      const stored = localStorage.getItem(KEYS.USERS_LIST);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
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
      return users[0] || DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
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

  deletePhoto(photoId: string): PhotoEntry[] {
    const photos = this.getPhotos();
    const updated = photos.filter((p) => p.id !== photoId);
    this.savePhotos(updated);
    return updated;
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

  isRulerEmail(email: string): boolean {
    if (!email) return false;
    const currentRulerEmail = this.getRulerEmail().toLowerCase();
    const test = email.trim().toLowerCase();
    return test === currentRulerEmail || test === 'subhajitmishra8984@gmail.com' || test === 'owner@pujoverse.org';
  },

  isRulerCredentials(email: string, password?: string): boolean {
    if (!email) return false;
    if (!this.isRulerEmail(email)) return false;
    const rulerPassword = this.getRulerPassword();
    return password === rulerPassword;
  },

  signInWithEmail(email: string, password?: string, name?: string): UserProfile {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsersList();
    const isRuler = this.isRulerEmail(cleanEmail);

    if (isRuler) {
      const requiredPassword = this.getRulerPassword();
      if (!password || password.trim() !== requiredPassword) {
        throw new Error('Incorrect password for Ruler account. Please enter subho@123.');
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
          city: 'Kolkata, West Bengal',
          favoritePandal: 'Hatibagan Nabin Pally',
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

    // Normal participant account
    let found = users.find((u) => u.email && u.email.trim().toLowerCase() === cleanEmail);
    if (found) {
      this.setCurrentUser(found);
      return found;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      bio: 'Festival photographer participating in PujoVerse Durga Puja contest.',
      city: 'Kolkata, West Bengal',
      favoritePandal: 'Bagbazar Sarbojanin Durgotsav',
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
