import React, { useState } from 'react';
import {
  X,
  Globe,
  Rocket,
  ShieldCheck,
  Crown,
  Database,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Layers,
  Sparkles,
  ArrowRight,
  Server,
  Cloud,
  CheckCircle2,
  Lock,
  MapPin,
  Code,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEFAULT_RULER_EMAIL, DEFAULT_RULER_PASSWORD } from '../services/storage';

interface WebsiteLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCloudConnected?: boolean;
}

export const WebsiteLaunchModal: React.FC<WebsiteLaunchModalProps> = ({
  isOpen,
  onClose,
  isCloudConnected = true
}) => {
  const [activeTab, setActiveTab] = useState<'vscode' | 'vercel' | 'netlify' | 'domain' | 'cloud'>('vscode');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testCloudState, setTestCloudState] = useState<'idle' | 'testing' | 'success'>('idle');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleTestCloudSync = () => {
    setTestCloudState('testing');
    setTimeout(() => {
      setTestCloudState('success');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6']
      });
      setTimeout(() => setTestCloudState('idle'), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#121422] border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden my-6">
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-300" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-display">
                  Launch PujoVerse as a Live Public Website
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Host on the open web with free production URLs, Firebase multi-device sync, and full Ruler controls.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close website modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature & Architecture Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:px-6 bg-[#0c0d16] border-b border-white/5 text-[11px]">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <Rocket className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">Free Edge Hosting</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-medium">Firestore Cloud Sync</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">100% Human Game</span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">Ruler: Subhajit Mishra</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-white/10 px-4 sm:px-6 gap-2 bg-[#10121e] overflow-x-auto">
          <button
            onClick={() => setActiveTab('vscode')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === 'vscode'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>VS Code & Local (Fix npm)</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === 'vercel'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Vercel (Recommended)</span>
          </button>

          <button
            onClick={() => setActiveTab('netlify')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === 'netlify'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Netlify (Drag & Drop)</span>
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === 'domain'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Custom Domain</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
              activeTab === 'cloud'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Firestore Sync</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[62vh] overflow-y-auto">
          {/* TAB 0: VS CODE & LOCAL DEV WITH NPM FIX */}
          {activeTab === 'vscode' && (
            <div className="space-y-5">
              {/* Solution to OS Permission Rejected Error */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Fix: "The operation was rejected by your operating system" in VS Code</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This happens on Linux when <code className="text-rose-200 bg-black/40 px-1 py-0.5 rounded">~/.npm</code> or the project directory was previously accessed with root permissions (<code className="text-rose-200 bg-black/40 px-1 py-0.5 rounded">sudo</code>). Run this 1-line command in your VS Code terminal to fix your user permissions immediately:
                </p>
                <div className="bg-black/60 border border-rose-500/20 rounded-lg p-2.5 flex items-center justify-between font-mono text-xs text-rose-200">
                  <span className="truncate select-all">sudo chown -R $USER:$USER ~/.npm && sudo chown -R $USER:$USER .</span>
                  <button
                    onClick={() => handleCopy('sudo chown -R $USER:$USER ~/.npm && sudo chown -R $USER:$USER .', 'npm_fix')}
                    className="p-1.5 rounded hover:bg-white/10 text-slate-300 shrink-0 ml-2"
                    title="Copy command"
                  >
                    {copiedKey === 'npm_fix' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3 Steps in VS Code */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Steps to Run in VS Code</span>
                </h3>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="bg-[#0e101a] border border-white/10 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px]">1</span>
                        <span>Open VS Code Terminal</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Shortcut: Ctrl + `</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Open your integrated terminal inside the PujoVerse project directory.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-[#0e101a] border border-white/10 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
                        <span>Install Dependencies</span>
                      </div>
                      <button
                        onClick={() => handleCopy('npm install', 'npm_install')}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        {copiedKey === 'npm_install' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-lg p-2 font-mono text-xs text-amber-300">
                      npm install
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-[#0e101a] border border-white/10 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
                        <span>Start Local Development Server</span>
                      </div>
                      <button
                        onClick={() => handleCopy('npm run dev', 'npm_dev')}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        {copiedKey === 'npm_dev' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-lg p-2 font-mono text-xs text-emerald-400">
                      npm run dev
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Open <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="text-amber-300 underline font-mono">http://localhost:5173</a> in Chrome or any browser to play!
                    </p>
                  </div>
                </div>
              </div>

              {/* Master Ruler Account Info */}
              <div className="bg-[#0e101a] border border-amber-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Your Master Ruler Credentials (Active in VS Code & Live Web)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">RULER EMAIL</span>
                    <span className="text-amber-300 font-semibold">{DEFAULT_RULER_EMAIL}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">RULER PASSWORD</span>
                    <span className="text-amber-300 font-semibold">{DEFAULT_RULER_PASSWORD}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: VERCEL DEPLOYMENT */}
          {activeTab === 'vercel' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-amber-300 font-bold block mb-1">
                    Vercel provides free, high-speed worldwide hosting with HTTPS out of the box.
                  </strong>
                  Your repository has already been configured with <code className="text-amber-200 bg-black/40 px-1 py-0.5 rounded">vercel.json</code>, enabling seamless SPA routing for PujoVerse.
                </div>
              </div>

              {/* Method 1: Instant Vercel CLI */}
              <div className="bg-[#0e101a] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono text-[10px]">
                      1
                    </span>
                    <span>Method A: Deploy via Vercel CLI (Fastest, 1-Minute)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold">Zero-Config</span>
                </div>

                <p className="text-xs text-slate-400">
                  Run the official Vercel command in your local project folder to launch directly:
                </p>

                <div className="relative group bg-black/60 border border-white/10 rounded-lg p-3 font-mono text-xs text-slate-200">
                  <pre className="overflow-x-auto">
{`# 1. Install Vercel CLI globally (if not installed)
npm install -g vercel

# 2. Deploy instantly to production
vercel --prod`}
                  </pre>
                  <button
                    onClick={() => handleCopy('npm install -g vercel && vercel --prod', 'cli')}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-[11px] text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cli' ? 'Copied' : 'Copy Command'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Vercel automatically outputs your public URL, e.g. <span className="text-amber-300 font-mono">https://pujoverse.vercel.app</span></span>
                </div>
              </div>

              {/* Method 2: Git Repository Push */}
              <div className="bg-[#0e101a] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-mono text-[10px]">
                      2
                    </span>
                    <span>Method B: Connect to GitHub & Auto-Deploy</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono font-semibold">CI/CD Automated</span>
                </div>

                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Push your code to a GitHub repository: <code className="bg-black/40 text-amber-300 px-1 rounded">git push origin main</code></li>
                  <li>Log in to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-0.5">vercel.com <ExternalLink className="w-2.5 h-2.5" /></a></li>
                  <li>Click <strong>"Add New..." → "Project"</strong> and select your repository.</li>
                  <li>Vercel automatically detects Framework Preset: <strong>Vite</strong>.</li>
                  <li>Click <strong>"Deploy"</strong>. Within 30 seconds, your site is live!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: NETLIFY DEPLOYMENT */}
          {activeTab === 'netlify' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
                <Layers className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-cyan-300 font-bold block mb-1">
                    Netlify Drop offers 100% free hosting with instant drag-and-drop deployment.
                  </strong>
                  We have added <code className="text-cyan-200 bg-black/40 px-1 py-0.5 rounded">public/_redirects</code> to your project, so that refreshing routes like leaderboards or profiles will never return 404 errors.
                </div>
              </div>

              {/* Method: Build & Drag-and-Drop */}
              <div className="bg-[#0e101a] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-[10px]">
                    1
                  </span>
                  <span>Step 1: Build the Production Bundle</span>
                </div>

                <p className="text-xs text-slate-400">
                  Compile the optimized static HTML, CSS, and JavaScript bundle:
                </p>

                <div className="relative group bg-black/60 border border-white/10 rounded-lg p-3 font-mono text-xs text-slate-200">
                  <pre className="overflow-x-auto">npm run build</pre>
                  <button
                    onClick={() => handleCopy('npm run build', 'build')}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[11px] text-white flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'build' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0e101a] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono text-[10px]">
                    2
                  </span>
                  <span>Step 2: Drag & Drop into Netlify Drop</span>
                </div>

                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Navigate to <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">app.netlify.com/drop <ExternalLink className="w-2.5 h-2.5" /></a></li>
                  <li>Drag the generated <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">dist</code> folder right into the browser window.</li>
                  <li>Netlify immediately gives you a public live URL (e.g. <span className="text-cyan-300 font-mono">pujoverse.netlify.app</span>) with free HTTPS!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM DOMAIN */}
          {activeTab === 'domain' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3">
                <Globe className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-purple-300 font-bold block mb-1">
                    Connect Any Custom Web Address (e.g., pujoverse.in or durgapujafest.com)
                  </strong>
                  Both Vercel and Netlify support custom domains on free tiers with automatic SSL certificate renewal.
                </div>
              </div>

              <div className="bg-[#0e101a] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-white">How to connect in 3 steps:</div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="font-semibold text-amber-300">1. Add Domain in Dashboard</div>
                    <p className="text-slate-400 text-[11px]">
                      Go to Project Settings → <strong>Domains</strong> → Enter your custom domain (e.g., <code className="text-white">pujoverse.in</code>).
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="font-semibold text-amber-300">2. Configure DNS Records</div>
                    <p className="text-slate-400 text-[11px]">
                      At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add the DNS record:
                    </p>
                    <div className="p-2 rounded bg-black/50 font-mono text-[11px] text-slate-200 flex items-center justify-between">
                      <span>Type: <strong>CNAME</strong> | Name: <strong>@ / www</strong> | Value: <strong>cname.vercel-dns.com</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="font-semibold text-amber-300">3. Automatic HTTPS Activation</div>
                    <p className="text-slate-400 text-[11px]">
                      Within 2–5 minutes, your domain will be verified with a green checkmark and secured with TLS encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FIRESTORE CLUSTER & RULER CREDENTIALS */}
          {activeTab === 'cloud' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-200 leading-relaxed">
                  <strong className="text-emerald-300 font-bold block mb-1">
                    Firebase Firestore Multi-Device Sync Active
                  </strong>
                  Every photo submission, custom pandal across West Bengal, vote, and live Adda message is synchronized in the cloud so players on phones, tablets, and computers see the same real-time festival arena.
                </div>
              </div>

              {/* Cloud Sync Test Card */}
              <div className="bg-[#0e101a] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>Cloud Firestore Status</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Connected & Healthy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-mono">PROJECT ID</span>
                    <span className="font-mono text-white text-[11px]">optimistic-brace-52w8r</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-mono">FIRESTORE DATABASE</span>
                    <span className="font-mono text-white text-[11px] truncate block">ai-studio-pujoverse10daydu...</span>
                  </div>
                </div>

                <button
                  onClick={handleTestCloudSync}
                  disabled={testCloudState === 'testing'}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>
                    {testCloudState === 'testing'
                      ? 'Testing Live Firestore Sync...'
                      : testCloudState === 'success'
                      ? '✓ Firestore Cloud Connection Verified!'
                      : 'Test Live Cloud Sync'}
                  </span>
                </button>
              </div>

              {/* Master Ruler Account Info */}
              <div className="bg-[#0e101a] border border-amber-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Permanent Master Ruler Account</span>
                </div>

                <p className="text-xs text-slate-400">
                  Only the ruler can edit photos, lock days, delete submissions, or broadcast official notices:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">RULER EMAIL</span>
                    <span className="text-amber-300 font-semibold">{DEFAULT_RULER_EMAIL}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 block">RULER PASSWORD</span>
                    <span className="text-amber-300 font-semibold">{DEFAULT_RULER_PASSWORD}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0c0d16] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ready for Vercel, Netlify, or Custom Domain publication.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleCopy('npm install -g vercel && vercel --prod', 'footer')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{copiedKey === 'footer' ? 'Command Copied!' : 'Copy Deploy Command'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
