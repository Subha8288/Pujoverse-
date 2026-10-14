import { FestivalDay, PhotoEntry, ChatMessage, UserProfile } from '../types/contest';

// 9-Day Grand Durga Puja Calendar
export const INITIAL_FESTIVAL_DAYS: FestivalDay[] = [
  {
    dayNumber: 1,
    dateDisplay: '11 Oct 2026',
    tithi: 'Pratipada',
    goddess: 'Maa Shailputri',
    auspiciousColor: 'Orange',
    colorBadgeHex: '#EA580C',
    title: 'Pratipada: Maa Shailputri (Orange)',
    bengaliTitle: 'প্রতিপদ · মা শৈলপুত্রী',
    subtitle: 'Chokkhudan & Clay Invocation',
    dateStr: '11 Oct 2026 (Pratipada)',
    openingSchedule: 'Concluded · Winner Crowned',
    themePrompt: 'Capture the radiant orange hues of dawn, Kumartuli artisan clay sculpting, and the awakening of Maa Shailputri.',
    photographyTip: {
      category: 'Warm Morning Tones',
      headline: 'Emphasize Warm Orange Dawn Radiance',
      body: 'Utilize early morning sunlight filtering through studio openings. Set warm white balance (5600K) to highlight clay textures.',
      proSettingSuggestion: '50mm / f/2.0 · 1/320s · ISO 200'
    },
    status: 'closed',
    pollEndsInHours: 0,
    winnerId: null,
    runnerUpId: null
  },
  {
    dayNumber: 2,
    dateDisplay: '12 Oct 2026',
    tithi: 'Dwitiya',
    goddess: 'Maa Brahmacharini',
    auspiciousColor: 'White',
    colorBadgeHex: '#F8FAFC',
    title: 'Dwitiya: Maa Brahmacharini (White)',
    bengaliTitle: 'দ্বিতীয়া · মা ব্রহ্মচারিণী',
    subtitle: 'Open from 12 Oct 2 AM · Cutoff 11 PM',
    dateStr: '12 Oct 2026 (Dwitiya)',
    openingSchedule: 'Open from 12 Oct 2:00 AM · Closes 11:00 PM',
    themePrompt: 'White purity, serene devotion, Anandamela street stalls, paper pinwheels, and early pandal excitement under pure white canvas.',
    photographyTip: {
      category: 'High-Key & White Contrast',
      headline: 'Preserve White Highlights without Clipping',
      body: 'When shooting white attire, floral garlands, and alabaster decor, monitor your histogram to preserve intricate textures in highlights.',
      proSettingSuggestion: '35mm / f/2.8 · 1/500s · ISO 250'
    },
    status: 'active',
    pollEndsInHours: 6,
    winnerId: null,
    runnerUpId: null
  },
  {
    dayNumber: 3,
    dateDisplay: '13 Oct 2026',
    tithi: 'Tritiya',
    goddess: 'Maa Chandraghanta',
    auspiciousColor: 'Red',
    colorBadgeHex: '#DC2626',
    title: 'Tritiya: Maa Chandraghanta (Red)',
    bengaliTitle: 'তৃতীয়া · মা চন্দ্রঘণ্টা',
    subtitle: 'Bravery & Fiery Red Radiance',
    dateStr: '13 Oct 2026 (Tritiya)',
    openingSchedule: 'Opens 13 Oct 2:00 AM',
    themePrompt: 'Courage, auspicious red alpona, scarlet drapery, and bold architectural pandal arches glowing with red crimson light.',
    photographyTip: {
      category: 'Vibrant Red Saturation',
      headline: 'Control Red Channel Clipping in Digital Sensors',
      body: 'Digital cameras clip pure reds easily. Lower saturation slightly in-camera and expose for mid-tones to retain fabric folds.',
      proSettingSuggestion: '24-70mm / f/3.5 · 1/160s · ISO 400'
    },
    status: 'upcoming',
    pollEndsInHours: 24,
    winnerId: null
  },
  {
    dayNumber: 4,
    dateDisplay: '14 Oct 2026',
    tithi: 'Chaturthi',
    goddess: 'Maa Kushmanda',
    auspiciousColor: 'Royal Blue',
    colorBadgeHex: '#2563EB',
    title: 'Chaturthi: Maa Kushmanda (Royal Blue)',
    bengaliTitle: 'চতুর্থী · মা কুষ্মাণ্ডা',
    subtitle: 'Cosmic Egg & Royal Blue Night',
    dateStr: '14 Oct 2026 (Chaturthi)',
    openingSchedule: 'Opens 14 Oct 2:00 AM',
    themePrompt: 'Cosmic pandal lighting, blue hour city reflections over water bodies, and royal blue silk and LED panel installations.',
    photographyTip: {
      category: 'Blue Hour & Night Reflections',
      headline: 'Shoot during the 20-minute Twilight Blue Hour',
      body: 'Arrive right as dusk sets. The natural royal blue sky perfectly balances artificial halogen and neon pandal lights.',
      proSettingSuggestion: '20mm / f/4.0 · 1/60s · ISO 640'
    },
    status: 'upcoming',
    pollEndsInHours: 48,
    winnerId: null
  },
  {
    dayNumber: 5,
    dateDisplay: '15 Oct 2026',
    tithi: 'Panchami',
    goddess: 'Maa Skandamata',
    auspiciousColor: 'Yellow',
    colorBadgeHex: '#EAB308',
    title: 'Panchami: Maa Skandamata (Yellow)',
    bengaliTitle: 'পঞ্চমী · মা স্কন্দমাতা',
    subtitle: 'Warm Marigold & Motherly Grace',
    dateStr: '15 Oct 2026 (Panchami)',
    openingSchedule: 'Opens 15 Oct 2:00 AM',
    themePrompt: 'Bright yellow marigold garlands (Genda phool), brass lamps, radiant turmeric alpona, and heartwarming family candids.',
    photographyTip: {
      category: 'Floral Foreground Framing',
      headline: 'Shallow Depth with Yellow Marigold Borders',
      body: 'Hold yellow marigold strings inches from your lens at f/1.8 to frame the deity in dreamy golden bokeh.',
      proSettingSuggestion: '85mm / f/1.8 · 1/320s · ISO 320'
    },
    status: 'upcoming',
    pollEndsInHours: 72,
    winnerId: null
  },
  {
    dayNumber: 6,
    dateDisplay: '16 Oct 2026',
    tithi: 'Shashthi',
    goddess: 'Maa Katyayani',
    auspiciousColor: 'Green',
    colorBadgeHex: '#16A34A',
    title: 'Shashthi: Maa Katyayani (Green)',
    bengaliTitle: 'ষষ্ঠী · মা কাত্যায়নী ও বোধন',
    subtitle: 'Bodhon Rituals & Nature Splendor',
    dateStr: '16 Oct 2026 (Shashthi)',
    openingSchedule: 'Opens 16 Oct 2:00 AM',
    themePrompt: 'Bodhon under the sacred Bel tree, fresh banana leaf decorations, conch shells, and lush eco-friendly pandal motifs.',
    photographyTip: {
      category: 'Natural Environmental Framing',
      headline: 'Isolate Ritual Movements with Fast Shutter',
      body: 'Priests performing Bodhon shlokas move quickly with flowers and bel leaves. Keep shutter speed above 1/250s.',
      proSettingSuggestion: '50mm / f/2.0 · 1/250s · ISO 500'
    },
    status: 'upcoming',
    pollEndsInHours: 96,
    winnerId: null
  },
  {
    dayNumber: 7,
    dateDisplay: '17 Oct 2026',
    tithi: 'Saptami',
    goddess: 'Maa Kalaratri',
    auspiciousColor: 'Grey',
    colorBadgeHex: '#64748B',
    title: 'Saptami: Maa Kalaratri (Grey)',
    bengaliTitle: 'সপ্তমী · মা কালরাত্রি ও নবপত্রিকা',
    subtitle: 'Midnight Mystique & Smoke Haze',
    dateStr: '17 Oct 2026 (Saptami)',
    openingSchedule: 'Opens 17 Oct 2:00 AM',
    themePrompt: 'Kalaratri nocturnal intensity: incense smoke swirls in monochrome grey tones, shadowy corridors, and dramatic chiaroscuro contrasts.',
    photographyTip: {
      category: 'Low-Key Chiaroscuro',
      headline: 'Deep Shadows and Smoke Silhouettes',
      body: 'Embrace high contrast and rich moody greys. Let the incense smoke diffuse directional rim lighting behind the dancers.',
      proSettingSuggestion: '35mm / f/1.8 · 1/160s · ISO 1600'
    },
    status: 'upcoming',
    pollEndsInHours: 120,
    winnerId: null
  },
  {
    dayNumber: 8,
    dateDisplay: '18 Oct 2026',
    tithi: 'Ashtami',
    goddess: 'Maa Mahagauri',
    auspiciousColor: 'Purple',
    colorBadgeHex: '#9333EA',
    title: 'Ashtami: Maa Mahagauri (Purple)',
    bengaliTitle: 'অষ্টমী · মা মহাগৌরী ও সন্ধিপূজা',
    subtitle: 'Royalty, 108 Diyas & Sacred Sandhi',
    dateStr: '18 Oct 2026 (Ashtami)',
    openingSchedule: 'Opens 18 Oct 2:00 AM',
    themePrompt: 'Royal purple silk sarees, 108 glowing brass lamps during Sandhi Puja, Pushpanjali rituals, and divine tranquility.',
    photographyTip: {
      category: 'Candlelight & Flame Warmth',
      headline: 'Handheld Stability during 108 Diya Aarti',
      body: 'Brace elbows against your chest or a pillar. Capture the collective golden reflection of 108 oil flames.',
      proSettingSuggestion: '50mm / f/1.4 · 1/125s · ISO 800'
    },
    status: 'upcoming',
    pollEndsInHours: 144,
    winnerId: null
  },
  {
    dayNumber: 9,
    dateDisplay: '19 Oct 2026',
    tithi: 'Navami',
    goddess: 'Maa Siddhidatri',
    auspiciousColor: 'Peacock Green',
    colorBadgeHex: '#0D9488',
    title: 'Navami: Maa Siddhidatri (Peacock Green)',
    bengaliTitle: 'নবমী · মা সিদ্ধিদাত্রী ও ধুনুচি নাচ',
    subtitle: 'Ecstatic Dhaak & Divine Completion',
    dateStr: '19 Oct 2026 (Navami)',
    openingSchedule: 'Opens 19 Oct 2:00 AM',
    themePrompt: 'Peacock green festive attire, the frenetic beats of 50 feather-adorned dhaaks, and soaring earthen dhunuchi dance spectacles.',
    photographyTip: {
      category: 'Motion Freeze & Shutter Sync',
      headline: 'Catch Flying Embers in Mid-Air',
      body: 'Use 1/800s to freeze sparks trailing from earthen dhunuchis while keeping the background softly defocused.',
      proSettingSuggestion: '85mm / f/1.8 · 1/800s · ISO 1000'
    },
    status: 'upcoming',
    pollEndsInHours: 168,
    winnerId: null
  },
  {
    dayNumber: 10,
    dateDisplay: '20 Oct 2026',
    tithi: 'Vijayadashami Dussehra',
    goddess: 'Vijayadashami Dussehra',
    auspiciousColor: 'Vermilion Red & Gold',
    colorBadgeHex: '#E11D48',
    title: 'Day 10: Vijayadashami Dussehra Climax',
    bengaliTitle: 'বিজয়া দশমী ও সিঁদুর খেলা',
    subtitle: 'Sindoor Khela, River Visarjan & Shubho Bijoya',
    dateStr: '20 Oct 2026 (Vijayadashami)',
    openingSchedule: 'Grand Finale · Opens 20 Oct 2:00 AM',
    themePrompt: 'The supreme farewell: red vermilion dust floating in golden air during Sindoor Khela, immersion processions on the Hooghly River, and heartfelt Bijoya embrace.',
    photographyTip: {
      category: 'Candid Portraiture & Emotion',
      headline: 'Capture Genuine Laughter and Tearful Smiles',
      body: 'Burst shoot candids during Sindoor Khela as friends smear vermilion. Keep shutter at 1/640s to freeze airborne red powder.',
      proSettingSuggestion: '35mm / f/1.8 · 1/640s · ISO 400'
    },
    status: 'upcoming',
    pollEndsInHours: 192,
    winnerId: null
  }
];

// Rich Initial Photo Entries across days with SVG artwork generators for resilience
export const INITIAL_PHOTOS: PhotoEntry[] = [];

// All chat messages are generated in real-time by authenticated logged-in users
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];

export const CURRENT_USER: UserProfile = {
  id: 'usr-demo',
  name: 'Demo Explorer',
  instagramHandle: '@pujoverse_demo',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  bio: 'Exploring Kolkata Durga Puja pandals and participating in PujoVerse daily photo voting.',
  city: 'Kolkata, West Bengal',
  favoritePandal: 'Bagbazar Sarbojanin Durgotsav',
  badges: ['Demo Guest', 'Community Voter', 'PujoVerse Explorer'],
  votedCount: 0,
  submissionsCount: 0,
  uploadedPhotoIds: [],
  createdAt: '2026-10-11'
};

