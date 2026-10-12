import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types/contest';
import { StorageService } from '../services/storage';
import {
  X,
  User,
  Check,
  UserPlus,
  Users,
  Upload,
  Camera,
  Mail,
  Crown,
  KeyRound,
  ShieldCheck,
  Settings
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onCreateUser: (user: UserProfile) => void;
  onSignInWithEmail?: (email: string, password?: string, name?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectUser,
  onCreateUser,
  onSignInWithEmail
}) => {
  const [mode, setMode] = useState<'switch' | 'email' | 'new'>('switch');

  // Form states for New Profile
  const [name, setName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [favoritePandal, setFavoritePandal] = useState('Bagbazar Sarbojanin');
  const [avatar, setAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  );
  const [isCustomDp, setIsCustomDp] = useState(false);

  // Email Sign In state
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputName, setInputName] = useState('');
  const [authError, setAuthError] = useState('');
  const [rulerEmail, setRulerEmailState] = useState(StorageService.getRulerEmail());
  const [isEditingRulerEmail, setIsEditingRulerEmail] = useState(false);
  const [customRulerEmailInput, setCustomRulerEmailInput] = useState(rulerEmail);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRulerEmailState(StorageService.getRulerEmail());
      setCustomRulerEmailInput(StorageService.getRulerEmail());
      setAuthError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setIsCustomDp(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedInsta = instagramHandle.trim().startsWith('@')
      ? instagramHandle.trim()
      : instagramHandle.trim()
      ? `@${instagramHandle.trim()}`
      : undefined;

    const cleanEmail = email.trim().toLowerCase();
    const isRuler = StorageService.isRulerEmail(cleanEmail);

    const badges = ['Verified Real Player', 'PujoVerse Creator', isCustomDp ? 'Custom DP' : 'Community Member'];
    if (isRuler) {
      badges.unshift('👑 Platform Ruler', 'Chief Juror');
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      instagramHandle: formattedInsta,
      email: cleanEmail || undefined,
      avatar,
      bio: bio.trim() || 'Festival photographer capturing the beauty of Durga Puja.',
      city: city.trim() || 'Kolkata',
      favoritePandal: favoritePandal.trim() || 'Bagbazar Sarbojanin Durgotsav',
      isVerifiedHuman: true,
      role: isRuler ? 'owner' : 'creator',
      isOwner: isRuler,
      badges,
      votedCount: 0,
      submissionsCount: 0,
      uploadedPhotoIds: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateUser(newUser);
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = inputEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Please enter an email address.');
      return;
    }

    const isRuler = StorageService.isRulerEmail(cleanEmail);
    if (isRuler) {
      const requiredPassword = StorageService.getRulerPassword();
      if (!inputPassword || inputPassword.trim() !== requiredPassword) {
        setAuthError('Incorrect password for Ruler account. Password is required (subho@123).');
        return;
      }
    }

    try {
      if (onSignInWithEmail) {
        onSignInWithEmail(cleanEmail, inputPassword.trim() || undefined, inputName.trim() || undefined);
      } else {
        const user = StorageService.signInWithEmail(cleanEmail, inputPassword.trim() || undefined, inputName.trim() || undefined);
        onSelectUser(user);
      }
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleAutofillRuler = () => {
    const rEmail = StorageService.getRulerEmail();
    const rPwd = StorageService.getRulerPassword();
    setInputEmail(rEmail);
    setInputPassword(rPwd);
    setInputName('Subhajit Mishra');
    setAuthError('');
  };

  const handleSaveCustomRulerEmail = () => {
    if (!customRulerEmailInput.trim()) return;
    StorageService.setRulerEmail(customRulerEmailInput.trim());
    setRulerEmailState(StorageService.getRulerEmail());
    setIsEditingRulerEmail(false);
  };

  const isCurrentInputRuler = StorageService.isRulerEmail(inputEmail.trim().toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#141624] rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-display text-white">
              PujoVerse Account & Sign In
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Switch vs Sign In with Email vs New */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#0f111a] rounded-xl my-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('switch');
              setAuthError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'switch'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Profiles</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('email');
              setAuthError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'email'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('new');
              setAuthError('');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'new'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Profile</span>
          </button>
        </div>

        {/* TAB 1: SWITCH PROFILE */}
        {mode === 'switch' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">
              Profiles available on this browser:
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {allUsers.map((u) => {
                const isActive = u.id === currentUser.id;

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      if (u.isOwner && !currentUser.isOwner) {
                        // Switch to email tab to require ruler password
                        setInputEmail(u.email || StorageService.getRulerEmail());
                        setMode('email');
                        setAuthError('Please enter password (subho@123) to access the Ruler account.');
                        return;
                      }
                      onSelectUser(u);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-400/80 ring-1 ring-amber-400/40'
                        : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-400/60"
                        />
                        {u.isOwner && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-bold">
                            👑
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white font-display">
                            {u.name}
                          </span>
                          {isActive && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold font-mono">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          {u.email && <span className="font-mono text-[11px] text-slate-400">{u.email}</span>}
                          {u.instagramHandle && (
                            <span className="text-rose-400 font-mono text-[11px]">{u.instagramHandle}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {isActive ? (
                        <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">
                          {u.isOwner ? 'Unlock 👑' : 'Switch'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode('email')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                Sign in with specific email & password →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SIGN IN WITH EMAIL & PASSWORD */}
        {mode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div className="text-xs text-slate-300 leading-relaxed">
              Sign in with your email and password. Logging in with ruler credentials unlocks the Ruler Console and full edit access.
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Your Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="e.g. subhajitmishra8984@gmail.com"
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-200">
                  Password {isCurrentInputRuler ? '(Required for Ruler)' : '(Optional for normal players)'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[10px] text-slate-400 hover:text-amber-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder={isCurrentInputRuler ? 'Enter ruler password (subho@123)' : 'Enter password'}
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="e.g. Subhajit Mishra"
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Live Feedback when matching designated ruler email */}
            {isCurrentInputRuler && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center gap-2.5 text-xs text-amber-300">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">Ruler Account Identified</span>
                  <span className="text-[11px] text-amber-200/90">
                    Signing in with password <strong className="font-mono text-amber-300">subho@123</strong> will grant full Ruler powers (edit photo names, details, landmarks, festival days).
                  </span>
                </div>
              </div>
            )}

            {/* Quick Helper for Subhajit */}
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">Ruler: subhajitmishra8984@gmail.com</span>
              <button
                type="button"
                onClick={handleAutofillRuler}
                className="px-2.5 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-[11px] transition-colors flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span>Autofill Ruler</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMode('switch')}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!inputEmail.trim()}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                {isCurrentInputRuler ? '👑 Sign In as Ruler' : 'Sign In / Continue'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CREATE NEW PROFILE */}
        {mode === 'new' && (
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Avatar Preview & Upload */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatar}
                  alt="DP Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-amber-400 text-slate-950 shadow hover:bg-amber-300 transition-colors"
                  title="Upload Custom DP"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Personal Photo / DP</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real photos help authenticate human photographer profiles.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Subir Karmakar"
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Kolkata"
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Favorite Pandal
                </label>
                <input
                  type="text"
                  value={favoritePandal}
                  onChange={(e) => setFavoritePandal(e.target.value)}
                  placeholder="Bagbazar Sarbojanin"
                  className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Bio / Story</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief intro about your photography style..."
                className="w-full bg-[#10121a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMode('switch')}
                className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                Create Profile & Enter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
