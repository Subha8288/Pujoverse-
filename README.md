# PujoVerse (পুজোভার্স) — 10-Day Durga Puja Photo Contest

> **100% Real Human Photography Contest across West Bengal • Zero AI Manipulation • Multi-Device Cloud Sync • Master Ruler Portal**

---

## ⚡ Quick Fix for npm in VS Code (Linux / Ubuntu / Debian)

If you saw this error in your VS Code terminal:
```
npm error The operation was rejected by your operating system.
npm error It is likely you do not have the permissions to access this file as the current user
```

### Run this one-line fix in your VS Code Terminal (`Ctrl + ~`):

```bash
sudo chown -R $USER:$USER ~/.npm && sudo chown -R $USER:$USER .
```

*Why this happened:* Some files in your npm cache or project were previously written with `sudo` (root), preventing your regular user (`subho`) from writing to the cache. This command restores ownership to your current user.

---

## 🚀 Running in VS Code

### 1. Install dependencies
```bash
npm install
```

### 2. Start the local development server
```bash
npm run dev
```

### 3. Open in your browser
Navigate to:
```
http://localhost:5173
```
(or port `3000` depending on your local config)

---

## 👑 Master Ruler Credentials

You are designated as the sole **Master Ruler & Juror** of PujoVerse:

| Credential | Value |
|---|---|
| **Ruler Email** | `subhajitmishra8984@gmail.com` |
| **Ruler Password** | `subho@123` |
| **Permissions** | Edit photo details, lock/advance festival days, delete entries, register official pandals, broadcast live community announcements |

*Access in the UI:* Click the **Crown / Ruler** button in the top navigation bar to open the Ruler Portal anytime.

---

## 🌐 Launching to a Free Public Website (Vercel or Netlify)

### Option A: Vercel (Recommended — Free SSL & Fast CDN)

1. In VS Code terminal:
   ```bash
   npx vercel
   ```
2. Follow the 3 prompts (hit Enter to accept defaults).
3. For production deployment:
   ```bash
   npx vercel --prod
   ```
4. You get an instant public URL like `https://pujoverse.vercel.app`!

*Note:* `vercel.json` is already included in this repository with SPA rewrites configured.

---

### Option B: Netlify (Free Drag & Drop or CLI)

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
3. Drag & drop the `dist/` folder from this project.
4. Your website is live in seconds with free SSL!

*Note:* `public/_redirects` is already included in this repository to prevent 404s on page refresh.

---

## 🏛️ Custom Pandals & Landmarks Across West Bengal

- Real players can choose from famous pre-populated pandals or register **custom typing/input pandals & landmarks** anywhere across all districts of West Bengal (Kolkata, Howrah, Hooghly, North/South 24 Parganas, Darjeeling, Nadia, etc.).
- Registered custom pandals sync automatically to Firestore cloud and are available to all players.

---

## ☁️ Firebase Firestore Multi-Device Sync

- Firestore database: `ai-studio-pujoverse10daydu-becc763f-38d0-4d17-a665-3f287a7e8a5f`
- Configuration: `firebase-applet-config.json`
- Security rules: `firestore.rules`
- Real-time updates: Submissions, votes, and live Adda chat sync instantly across multiple devices and browsers.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Cloud Database**: Google Cloud Firestore (Firebase)
- **Effects**: Canvas Confetti
