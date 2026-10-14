import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types/contest';
import { StorageService } from '../services/storage';
import { POPULAR_PANDALS_DATA } from '../data/pandals';
import { DurgaMascotLogo } from './DurgaMascotLogo';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Camera,
  Upload,
  Crown,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Trash2,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onCreateUser: (user: UserProfile) => void;
  onSignInWithEmail?: (email: string, password?: string, name?: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectUser,
  onCreateUser,
  onSignInWithEmail,
  onDeleteUser
}) => {
  // Primary Authentication Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showSavedProfiles, setShowSavedProfiles] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [localProfiles, setLocalProfiles] = useState<UserProfile[]>(allUsers);

  // Sync with prop updates
  useEffect(() => {
    setLocalProfiles(allUsers);
  }, [allUsers]);

  const durgaPhoto = StorageService.getDurgaPhoto();

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPasswordTip, setShowForgotPasswordTip] = useState(false);

  // SIGN UP STATE
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupCity, setSignupCity] = useState('Kolkata');
  const [signupDistrict, setSignupDistrict] = useState('Kolkata');
  const [signupPandal, setSignupPandal] = useState('Bagbazar Sarbojanin Durgotsav');
  const [signupPandalLocation, setSignupPandalLocation] = useState('Bagbazar Ghat Road, North Kolkata');
  const [signupInsta, setSignupInsta] = useState('');
  const [signupAvatar, setSignupAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  );
  const [isCustomDp, setIsCustomDp] = useState(false);
  const [certifyHuman, setCertifyHuman] = useState(true);

  // FEEDBACK STATE
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const rulerEmail = StorageService.getRulerEmail();
  const rulerPassword = StorageService.getRulerPassword();
  const isRulerEmailInput = StorageService.isRulerEmail(loginEmail.trim().toLowerCase());

  useEffect(() => {
    if (isOpen) {
      setAuthError('');
      setAuthSuccess('');
      setShowForgotPasswordTip(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Photo / DP upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSignupAvatar(reader.result);
        setIsCustomDp(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick fill organizer ruler credentials
  const handleQuickFillRuler = () => {
    setAuthMode('login');
    setLoginEmail(rulerEmail);
    setLoginPassword(rulerPassword);
    setAuthError('');
  };

  // Password Strength Calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: '', color: 'bg-slate-700' };
    if (pwd.length < 6) return { score: 1, text: 'Too short (min 6)', color: 'bg-rose-500' };
    if (pwd.length < 8 || !/\d/.test(pwd)) return { score: 2, text: 'Medium', color: 'bg-amber-400' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(signupPassword);

  // SUBMIT: LOGIN
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Please enter your email address.');
      return;
    }

    const isRuler = StorageService.isRulerEmail(cleanEmail);
    if (isRuler) {
      const requiredPassword = StorageService.getRulerPassword();
      if (!loginPassword || loginPassword.trim() !== requiredPassword) {
        setAuthError('Incorrect password for Ruler administrative account. Access restricted to the Ruler.');
        return;
      }
    }

    try {
      if (onSignInWithEmail) {
        onSignInWithEmail(cleanEmail, loginPassword.trim() || undefined);
      } else {
        const user = StorageService.signInWithEmail(cleanEmail, loginPassword.trim() || undefined);
        onSelectUser(user);
      }
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  // SUBMIT: SIGN UP
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!signupName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }

    const cleanEmail = signupEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!certifyHuman) {
      setAuthError('You must agree to the human player integrity certification.');
      return;
    }

    const isRuler = StorageService.isRulerEmail(cleanEmail);
    const formattedInsta = signupInsta.trim().startsWith('@')
      ? signupInsta.trim()
      : signupInsta.trim()
      ? `@${signupInsta.trim()}`
      : undefined;

    const badges = ['Verified Real Player', 'PujoVerse Creator', isCustomDp ? 'Custom DP' : 'Community Member'];
    if (isRuler) {
      badges.unshift('👑 Platform Ruler', 'Chief Juror');
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: signupName.trim(),
      instagramHandle: formattedInsta,
      email: cleanEmail,
      avatar: signupAvatar,
      bio: 'Festival photographer capturing the beauty of Durga Puja.',
      district: signupDistrict.trim() || 'Kolkata',
      city: signupCity.trim() || 'Kolkata',
      favoritePandal: signupPandal.trim() || 'Bagbazar Sarbojanin Durgotsav',
      favoritePandalLocation: signupPandalLocation.trim() || `${signupCity.trim()}, ${signupDistrict.trim()}`,
      isVerifiedHuman: true,
      role: isRuler ? 'owner' : 'creator',
      isOwner: isRuler,
      badges,
      votedCount: 0,
      submissionsCount: 0,
      uploadedPhotoIds: [],
      uploadedVideoIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111322] rounded-3xl border border-amber-500/25 shadow-[0_0_60px_rgba(0,0,0,0.85)] p-5 sm:p-7 text-slate-100 max-h-[94vh] overflow-y-auto">
        {/* Festive Marigold Garland Header Bar */}
        <div className="flex items-center justify-center gap-1.5 mb-3 text-xs select-none">
          <span className="text-amber-400">🌼</span>
          <span className="text-rose-500">🌺</span>
          <span className="text-amber-400">🌼</span>
          <span className="text-rose-500">🌺</span>
          <span className="text-amber-400">🌼</span>
        </div>

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <DurgaMascotLogo
                size={42}
                showHalo={true}
                customImageUrl={durgaPhoto && durgaPhoto !== 'mascot' ? durgaPhoto : undefined}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-display text-white tracking-tight">
                  PujoVerse
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                  Authentication
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                শারদোৎসব লগইন · Kolkata & West Bengal Photography Arena
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Professional Segmented Navigation Tabs: [ Log In ] vs [ Sign Up ] */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0b0c14] rounded-2xl my-4 text-xs font-bold border border-white/5">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setAuthError('');
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setAuthError('');
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{authError}</div>
          </div>
        )}

        {/* ==================== TAB 1: PROFESSIONAL LOGIN ==================== */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Email Address or Username <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="subho@gmail.com or Subho"
                  className="w-full bg-[#0a0b12] border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                Enter your email (e.g. subho@gmail.com) or registered profile name.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Password <span className="text-amber-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordTip((prev) => !prev)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required={isRulerEmailInput}
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder={isRulerEmailInput ? 'Enter ruler password (subho@123)' : 'Enter password'}
                  className="w-full bg-[#0a0b12] border border-white/10 focus:border-amber-400 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white cursor-pointer"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Helper Box */}
              {showForgotPasswordTip && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Password Assistance:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    If you forgot your password, contact the festival administrator or register a new profile on this device. Ruler administrative access requires authorized master credentials.
                  </p>
                </div>
              )}
            </div>

            {/* Remember Me Row */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Ruler Account Recognized Banner */}
            {isRulerEmailInput && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center gap-2.5 text-xs text-amber-300">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">Ruler Administrative Account</span>
                  <span className="text-[11px] text-amber-200/90">
                    Entering the ruler password will unlock the Ruler Console & curation authority.
                  </span>
                </div>
              </div>
            )}

            {/* Primary Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!loginEmail.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isRulerEmailInput ? (
                  <>
                    <Crown className="w-4 h-4 text-slate-950" />
                    <span>👑 Log In as Ruler</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-slate-950" />
                    <span>Log In to PujoVerse</span>
                  </>
                )}
              </button>
            </div>

            {/* Switch to Sign Up */}
            <p className="text-center text-xs text-slate-400 pt-1">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError('');
                }}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Sign Up for PujoVerse
              </button>
            </p>
          </form>
        )}

        {/* ==================== TAB 2: PROFESSIONAL SIGN UP ==================== */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* Avatar / DP Upload Header */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#0b0c14] border border-white/5">
              <div className="relative shrink-0">
                <img
                  src={signupAvatar}
                  alt="DP Preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-400 text-slate-950 shadow hover:bg-amber-300 transition-colors cursor-pointer"
                  title="Upload Custom Photo / DP"
                >
                  <Camera className="w-3 h-3 stroke-[2.5]" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Profile Photo / DP</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Personal photos help authenticate real human Kolkata & Bengal photographers.
                </p>
              </div>
            </div>

            {/* Full Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Subho"
                  className="w-full bg-[#0a0b12] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Email Address <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="subho@gmail.com"
                  className="w-full bg-[#0a0b12] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono transition-colors"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  e.g. subho@gmail.com
                </p>
              </div>
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-200">
                    Password <span className="text-amber-400">*</span>
                  </label>
                  {signupPassword && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pwdStrength.text}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#0a0b12] border border-white/10 focus:border-amber-400 rounded-xl px-3 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((prev) => !prev)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Confirm Password <span className="text-amber-400">*</span>
                </label>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full bg-[#0a0b12] border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono transition-colors ${
                    signupConfirmPassword && signupConfirmPassword !== signupPassword
                      ? 'border-rose-500'
                      : 'border-white/10 focus:border-amber-400'
                  }`}
                />
              </div>
            </div>

            {/* Location note: location is entered when uploading photo/video */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-amber-300">Pandal & Location:</span> You will easily enter your pandal name, district, and location whenever you upload your photos and videos!
              </div>
            </div>

            {/* Instagram Handle (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instagram Handle <span className="text-slate-500">(Optional for photo credit)</span>
              </label>
              <input
                type="text"
                value={signupInsta}
                onChange={(e) => setSignupInsta(e.target.value)}
                placeholder="@subho"
                className="w-full bg-[#0a0b12] border border-white/10 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono transition-colors"
              />
            </div>

            {/* 100% Real Human Player Certification Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={certifyHuman}
                  onChange={(e) => setCertifyHuman(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-white/5 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span className="leading-snug">
                  <span className="font-bold text-amber-300">100% Real Human Player Guarantee:</span>{' '}
                  I certify I will submit genuine photography and abide by community judging rules.
                </span>
              </label>
            </div>

            {/* Primary Signup Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!signupName.trim() || !signupEmail.trim() || signupPassword.length < 6}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Create Account & Join Arena</span>
              </button>
            </div>

            {/* Switch to Login */}
            <p className="text-center text-xs text-slate-400 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          </form>
        )}

        {/* ==================== SAVED PROFILES ON THIS DEVICE ==================== */}
        {localProfiles.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowSavedProfiles((prev) => !prev)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors cursor-pointer select-none"
            >
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Saved Profiles on this Device ({localProfiles.length})</span>
              </span>
              <span className="text-[11px] text-amber-400">
                {showSavedProfiles ? 'Hide Profiles ▲' : 'Show Profiles ▼'}
              </span>
            </button>

            {showSavedProfiles && (
              <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1 animate-in fade-in duration-150">
                {localProfiles.map((u) => {
                  const isActive = u.id === currentUser.id;

                  return (
                    <div
                      key={u.id}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-400/80 ring-1 ring-amber-400/40'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div
                        onClick={() => {
                          if (u.isOwner && !currentUser.isOwner) {
                            setLoginEmail(u.email || rulerEmail);
                            setAuthMode('login');
                            setAuthError('Please enter the Ruler password to unlock this administrator account.');
                            return;
                          }
                          onSelectUser(u);
                          onClose();
                        }}
                        className="flex-1 flex items-center gap-2.5 cursor-pointer min-w-0 pr-2"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-amber-400/60"
                          />
                          {u.isOwner && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[8px] font-black">
                              👑
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white truncate">{u.name}</span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold font-mono">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate font-mono">
                            {u.email || u.instagramHandle}
                          </div>
                          {(u.city || u.favoritePandal) && (
                            <div className="text-[10px] text-amber-300/80 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                              <span className="truncate">{u.city}{u.district ? ` (${u.district})` : ''} · {u.favoritePandal}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {onDeleteUser && (
                          deletingUserId === u.id ? (
                            <div
                              className="flex items-center gap-1 bg-[#1a1c2a] p-1 rounded-lg border border-rose-500/40"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocalProfiles((prev) => prev.filter((item) => item.id !== u.id));
                                  if (onDeleteUser) {
                                    onDeleteUser(u.id);
                                  }
                                  setDeletingUserId(null);
                                }}
                                className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingUserId(null);
                                }}
                                className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingUserId(u.id);
                              }}
                              title={`Delete profile "${u.name}"`}
                              className="p-1 rounded-lg border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (u.isOwner && !currentUser.isOwner) {
                              setLoginEmail(u.email || rulerEmail);
                              setAuthMode('login');
                              setAuthError('Please enter the Ruler password to unlock this administrator account.');
                              return;
                            }
                            onSelectUser(u);
                            onClose();
                          }}
                          className="px-2 py-1 rounded-lg text-xs font-semibold text-amber-400 hover:text-white cursor-pointer"
                        >
                          {isActive ? (
                            <Check className="w-4 h-4 text-amber-400" />
                          ) : (
                            <span>{u.isOwner ? 'Unlock 👑' : 'Switch'}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
