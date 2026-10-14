export interface CameraGear {
  cameraOrPhone: string;
  lens?: string;
  shutter?: string;
  aperture?: string;
  iso?: string;
}

export interface PhotoComment {
  id: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  instagramHandle?: string;
  text: string;
  timestamp: string;
  isVerifiedHuman?: boolean;
}

export interface PhotoEntry {
  id: string;
  userId?: string;
  dayNumber: number;
  title: string;
  imageUrl: string;
  thumbnailSvg?: string;
  photographerName: string;
  photographerAvatar: string;
  photographerBio?: string;
  instagramHandle?: string;
  isVerifiedHuman?: boolean;
  pandalLocation: string;
  pandalZone?: string;
  city: string;
  cameraGear: CameraGear;
  caption: string;
  votes: number;
  wins: number;
  matchups: number;
  timestamp: string;
  tags: string[];
  awardBadge?: string;
  critiqueScore?: number;
  comments?: PhotoComment[];
  isFeatured?: boolean;
  isCuratorChoice?: boolean;
  moderationStatus?: 'approved' | 'flagged' | 'hidden';
}

export interface FestivalDay {
  dayNumber: number;
  dateDisplay: string;
  tithi: string;
  goddess: string;
  auspiciousColor: string;
  colorBadgeHex: string;
  title: string;
  bengaliTitle: string;
  subtitle: string;
  dateStr: string;
  openingSchedule?: string;
  themePrompt: string;
  photographyTip: {
    category: string;
    headline: string;
    body: string;
    proSettingSuggestion: string;
  };
  status: 'active' | 'closed' | 'upcoming';
  pollEndsInHours: number;
  winnerId: string | null;
  runnerUpId?: string | null;
}

export interface ChatMessage {
  id: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  text: string;
  reactionEmoji?: string;
  timestamp: string;
  isOfficial?: boolean;
  isOwner?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  instagramHandle?: string;
  avatar: string;
  bio: string;
  city: string;
  district?: string;
  cameraGearUsed?: string;
  isVerifiedHuman?: boolean;
  role?: 'owner' | 'admin' | 'creator' | 'participant';
  isOwner?: boolean;
  badges: string[];
  votedCount: number;
  submissionsCount: number;
  favoritePandal: string;
  favoritePandalLocation?: string;
  uploadedPhotoIds?: string[];
  uploadedVideoIds?: string[];
  createdAt?: string;
}

export interface PandalLandmark {
  id: string;
  name: string;
  zone: string;
  district?: string;
  city?: string;
  metroStation?: string;
  landmark?: string;
  address?: string;
  theme?: string;
  isCustom?: boolean;
  addedBy?: string;
  createdAt?: string;
}

export interface VideoComment {
  id: string;
  userId?: string;
  userName: string;
  userAvatar: string;
  instagramHandle?: string;
  text: string;
  timestamp: string;
  isVerifiedHuman?: boolean;
}

export interface VideoEntry {
  id: string;
  userId?: string;
  dayNumber: number;
  title: string;
  videoUrl: string; // YouTube Shorts, YouTube Embed URL, or direct video link
  thumbnailUrl: string;
  duration?: string;
  videographerName: string;
  videographerAvatar: string;
  videographerBio?: string;
  instagramHandle?: string;
  isVerifiedHuman?: boolean;
  pandalLocation: string;
  pandalZone?: string;
  city: string;
  cameraGear?: CameraGear;
  caption: string;
  votes: number;
  views?: number;
  wins?: number;
  matchups?: number;
  timestamp: string;
  tags: string[];
  awardBadge?: string;
  comments?: VideoComment[];
  isFeatured?: boolean;
  moderationStatus?: 'approved' | 'flagged' | 'hidden';
}

export type ViewTab = 'arena' | 'video-arena' | 'leaderboard' | 'profile' | 'owner';
