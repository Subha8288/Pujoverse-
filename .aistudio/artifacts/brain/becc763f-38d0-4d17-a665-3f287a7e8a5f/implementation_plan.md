# PujoVerse Web Launch & Multi-Player Cloud Architecture

Transform PujoVerse from a local prototype into a live, publicly accessible website on the open web, featuring automated deployment to Vercel/Netlify, custom domain readiness, and live cloud multi-device data synchronization using Firebase Firestore for 100% human players across West Bengal.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were selected during planning:

- **Confirmed Hosting Platform**: **Vercel / Netlify** with automated CI/CD builds and zero-cost hosting tiers.
- **Confirmed Web Address**: **Free Public Production URL** (e.g., `pujoverse.vercel.app` or `pujoverse.netlify.app`), with instant HTTPS and one-click custom domain support.
- **Confirmed Data Persistence**: **Firebase Firestore Multi-Device Cloud Sync**, upgrading from local browser storage to live real-time cloud data so submissions, community pandals, and votes persist across all devices and players.
- **Game Integrity Guarantee**: **100% Real Human Game** (no bots, no AI voting, no synthetic entries) with strict human verification badges and fair community judging.
- **Master Ruler Authority**: Preserving master administrator credentials for `subhajitmishra8984@gmail.com` (password: `subho@123`) for administrative curation, photo editing, day locking, and community moderation.

---

## 1. Overview & Core Concept

- **What It Does**: PujoVerse is an interactive 10-day Durga Puja photography festival and battle arena. Real players across Kolkata and all districts of West Bengal submit genuine pandal photos, vote daily before the 11 PM cutoff, register custom neighborhood pandals and landmarks, and celebrate Sharad Utsav.
- **Target Audience / Persona**: Photography enthusiasts, puja parikrama visitors across West Bengal (North, South, Central Kolkata, Salt Lake, Howrah, Siliguri, Durgapur, Birbhum, etc.), and festival lovers wanting an authentic community-driven contest without AI-generated content.
- **Key Value**: Provides a reliable, publicly shareable web platform that connects real players in real time, respects local puja culture with flexible location inputs, and gives the ruler full organizational control.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Public Web Entry**: Visitors navigate to the live website URL on desktop or mobile. They see the active festival day (e.g., Day 9 - Navami Dhunuchi Dance), countdown to the 11 PM deadline, and real-time live voting cards.
2. **Real Player Participation**: Players vote on head-to-head battles, view festival leaderboards, and join the live Adda chat room.
3. **Pandal & Landmark Registry**: Any player can input custom pandals, club names, landmarks, and districts anywhere across West Bengal. Entries become instantly available for tag selection in photo submissions.
4. **Photo Upload with Human Guarantee**: Players upload their original photos, tag their location and gear, and confirm the 100% Real Human Player certification.
5. **Ruler Administrative Console**: Logging in with `subhajitmishra8984@gmail.com` and `subho@123` unlocks the gold Ruler badge, photo curation/deletion, festival day overrides, announcement broadcasts, and winner spotlights.

### Visual Identity & Theme
- **Aesthetic Direction**: High-energy Sharodotsav festival aesthetic — nocturnal Kolkata atmosphere, glowing golden marigold accents, deep indigo canvas, and crisp typography.
- **Color Palette & Mood**:
  - Dominant Neutral Canvas (60%): Deep obsidian and night indigo (`#0c0d14`, `#121422`).
  - Structural Surfaces (30%): Hairline borders (`border-white/10`), frosted glass cards (`#181a28`).
  - Accent Budget (10%): Warm Marigold Gold (`#F59E0B`, `#FBBF24`) and Festive Vermilion (`#E11D48`).
- **Typography & Hierarchy**:
  - Hero & Display: Geometric sans with festival warmth (`Plus Jakarta Sans` / `Outfit`).
  - Body & Microcopy: Highly legible neutral sans (`DM Sans`, 14px–15px).
  - Data, Timers, Deadlines: Tabular numerals with monospace clarity (`JetBrains Mono` / `font-mono tabular-nums`).
- **Anti-Slop Discipline**: Zero static pill enclosures on metadata; subtle typographic separators (`·`); genuine interactive buttons with clear active states; no decorative pulsing dots.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Static Single-Page Application (SPA) with Global Edge CDN**
  - *Chosen Approach*: Vite + React static build output deployed to Vercel/Netlify edge networks.
  - *Why*: Instant global page loads (<300ms), 99.99% uptime, zero server maintenance costs, and automatic HTTPS.
  - *Alternative Considered*: Full server-rendered Node container (higher hosting cost, slower edge distribution, unnecessary for client-driven arena).

- **Decision 2: Dual-Layer Persistence (Firebase Firestore + Local Offline Cache)**
  - *Chosen Approach*: Firebase Firestore as the cloud authority for shared submissions and voting, with client-side localStorage fallback for instant zero-latency UI rendering and offline resilience.
  - *Why*: Enables real players across different phones and computers to see the same leaderboard and submitted pandals while retaining offline capability during crowded pandal hopping.
  - *Alternative Considered*: LocalStorage only (limited to single browser session) or full custom backend SQL server (requires ongoing server management).

- **Decision 3: Deployment Configuration with `vercel.json` / `_redirects`**
  - *Chosen Approach*: Include pre-configured routing rewrite rules so client-side navigation handles deep links without 404 errors.
  - *Why*: Prevents page refresh crashes common in React single-page apps hosted on public web servers.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC INTERNET / WEB                           │
│       Vercel Edge Network / Netlify CDN (https://pujoverse.app)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    REACT VITE SINGLE-PAGE APP                          │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Navigation & Header   │  │       Active Festival Day Bar       │  │
│  │  (Ruler Crown / Auth)   │  │   (Day 1–10 Status & 11 PM Clock)   │  │
│  └────────────┬────────────┘  └──────────────────┬──────────────────┘  │
│               │                                  │                     │
│  ┌────────────▼──────────────────────────────────▼──────────────────┐  │
│  │                        App Root Router                           │  │
│  │  ┌───────────────┐  ┌────────────────┐  ┌─────────────────────┐  │  │
│  │  │ Battle Arena  │  │  Leaderboard   │  │ Pandal Directory    │  │  │
│  │  │  (Daily Vote) │  │  (Daily/Grand) │  │ (All West Bengal)   │  │  │
│  │  └───────────────┘  └────────────────┘  └─────────────────────┘  │  │
│  │  ┌───────────────┐  ┌────────────────┐  ┌─────────────────────┐  │  │
│  │  │ Upload Modal  │  │  Ruler Console │  │ Adda Live Chat      │  │  │
│  │  │ (Human Check) │  │ (Full Control) │  │ (Real Community)    │  │  │
│  │  └───────────────┘  └────────────────┘  └─────────────────────┘  │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      STORAGE & DATA SYNC LAYER                         │
│                                                                        │
│  ┌────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │     Client Local Storage Cache     │  │   Firebase Firestore     │  │
│  │   (Offline mode, active session,   │◄─┤   (Cloud database, live  │  │
│  │    fast optimistic UI rendering)   │  │    sync across players)  │  │
│  └────────────────────────────────────┘  └──────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Entities
1. **User Profile (`UserProfile`)**: Player ID, name, email, camera gear bio, ruler privilege flag (`isOwner: true` for `subhajitmishra8984@gmail.com`).
2. **Pandal Landmark (`PandalLandmark`)**: Unique ID, name, district / zone across West Bengal, custom city/station, landmark, creator attribution.
3. **Photo Entry (`PhotoEntry`)**: Title, day number, player attribution, full resolution image data, upvotes count, community comments, 100% human certification flag.
4. **Daily Vote Record (`VoteMap`)**: Maps each player to their daily locked vote per festival day (resets or locks past 11 PM).

### Website Deployment Plan (Step-by-Step for User)

1. **Option A: Deploy to Vercel (Recommended - 2 Minutes)**
   - Push code to GitHub or run `npx vercel` directly in the project terminal.
   - Vercel automatically detects Vite:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Generates a free production URL: `https://pujoverse.vercel.app`

2. **Option B: Deploy to Netlify**
   - Drag and drop the `dist/` folder into Netlify Drop, or connect repository with build command `npm run build` and publish directory `dist`.
   - Generates a free public URL: `https://pujoverse.netlify.app`

3. **Production Build Artifacts Prepared in Codebase**:
   - `vercel.json` and `public/_redirects` to ensure clean client routing.
   - Optimized production Vite build bundle with code splitting.
   - Configured Firebase Firestore integration bridge for live player sync.
