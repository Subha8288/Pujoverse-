import React from 'react';

interface DurgaMascotLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showHalo?: boolean;
  customImageUrl?: string;
  onClick?: () => void;
}

export const DurgaMascotLogo: React.FC<DurgaMascotLogoProps> = ({
  size = 'md',
  className = '',
  showHalo = true,
  customImageUrl,
  onClick
}) => {
  // Dimension mapper
  const getDimension = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'xs':
        return 28;
      case 'sm':
        return 36;
      case 'md':
        return 48;
      case 'lg':
        return 64;
      case 'xl':
        return 96;
      default:
        return 48;
    }
  };

  const dim = getDimension();

  // If a custom photo URL is passed and valid, render the user image with circular decorative border
  if (customImageUrl) {
    return (
      <div
        onClick={onClick}
        style={{ width: dim, height: dim }}
        className={`relative rounded-full overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/20 shrink-0 ${className}`}
      >
        <img
          src={customImageUrl}
          alt="Maa Durga Logo"
          className="w-full h-full object-cover"
        />
        {showHalo && (
          <div className="absolute inset-0 rounded-full border border-amber-300/40 pointer-events-none" />
        )}
      </div>
    );
  }

  // Authentic, High-Fidelity SVG of the Cute Cartoon Chibi Maa Durga (Copyright-Free Vector Mascot)
  return (
    <div
      onClick={onClick}
      style={{ width: dim, height: dim }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      title="PujoVerse Maa Durga Mascot Logo (Copyright-Free)"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
      >
        <defs>
          {/* Glowing Divine Sun Halo Gradient */}
          <radialGradient id="sunHalo" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
          </radialGradient>

          {/* Golden Ornaments Gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Traditional Pink Sari Gradient */}
          <linearGradient id="sariGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="60%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>

          {/* Skin Tone Gradient */}
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF1EB" />
            <stop offset="100%" stopColor="#FED7AA" />
          </linearGradient>

          {/* Dark Silky Hair Gradient */}
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#1E0E06" />
          </linearGradient>
        </defs>

        {/* 1. Divine Sun Halo */}
        {showHalo && (
          <circle cx="100" cy="78" r="62" fill="url(#sunHalo)" />
        )}

        {/* 2. Flowing Dark Hair (Back) */}
        <path
          d="M58 85C50 115 54 150 72 165C78 152 76 130 80 115C68 110 62 98 58 85Z"
          fill="url(#hairGradient)"
        />
        <path
          d="M142 85C150 115 146 150 128 165C122 152 124 130 120 115C132 110 138 98 142 85Z"
          fill="url(#hairGradient)"
        />

        {/* 3. Outer Sacred Weapons (Multiple Arms) */}
        {/* Trishul (Left High Arm) */}
        <path d="M42 42L68 115" stroke="url(#goldGradient)" strokeWidth="3.5" strokeLinecap="round" />
        {/* Trishul Head */}
        <path
          d="M38 40C38 34 42 22 42 22C42 22 46 34 46 40M34 32C30 38 34 46 42 46C50 46 54 38 50 32"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sword / Kharga (Left Mid Arm) */}
        <path
          d="M48 64C48 50 62 44 68 42C64 54 58 72 62 85"
          fill="#F1F5F9"
          stroke="url(#goldGradient)"
          strokeWidth="2"
        />

        {/* Mace / Gada (Left Lower Arm) */}
        <circle cx="45" cy="125" r="9" fill="url(#goldGradient)" />
        <line x1="45" y1="134" x2="65" y2="152" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" />

        {/* Golden Cymbals / Kartal (Right Upper Arm) */}
        <ellipse cx="148" cy="72" rx="9" ry="3.5" fill="url(#goldGradient)" />
        <circle cx="148" cy="70" r="2.5" fill="#FEF08A" />

        {/* Sacred Conch / Hook (Right Mid Arm) */}
        <path
          d="M152 98C156 94 162 96 160 106C158 114 148 116 146 122"
          stroke="url(#goldGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Multiple Arms (Skin) */}
        <path d="M72 102C55 96 50 82 56 74" stroke="url(#skinGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="M72 108C56 108 48 100 48 94" stroke="url(#skinGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="M72 118C58 126 50 134 52 140" stroke="url(#skinGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="M128 102C145 96 150 82 144 74" stroke="url(#skinGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="M128 108C144 108 152 100 152 94" stroke="url(#skinGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="M128 118C142 126 150 134 148 140" stroke="url(#skinGradient)" strokeWidth="6" strokeLinecap="round" />

        {/* Golden Bangles on Arms */}
        <circle cx="56" cy="76" r="4" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
        <circle cx="48" cy="95" r="4" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
        <circle cx="144" cy="76" r="4" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />
        <circle cx="152" cy="95" r="4" stroke="url(#goldGradient)" strokeWidth="2" fill="none" />

        {/* 4. Body & Traditional Pink Sari */}
        {/* Blouse (Teal / Emerald) */}
        <path d="M84 106C84 98 116 98 116 106L118 122L82 122Z" fill="#0D9488" />

        {/* Sari Pleats & Skirt */}
        <path
          d="M82 122C80 145 78 172 82 186C90 188 110 188 118 186C122 172 120 145 118 122Z"
          fill="url(#sariGradient)"
        />
        {/* Golden Sari Border (Zari) */}
        <path
          d="M82 182C90 184 110 184 118 182L118 186C110 188 90 188 82 186Z"
          fill="url(#goldGradient)"
        />
        <path
          d="M82 174C90 176 110 176 118 174"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          strokeDasharray="3 2"
        />

        {/* Sari Pallu Draped Across Chest */}
        <path
          d="M82 110C92 120 114 135 124 165L132 160C122 130 102 112 90 106Z"
          fill="url(#sariGradient)"
        />
        <path
          d="M88 108C98 118 116 134 126 162"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
        />

        {/* Golden Kamarbandh (Waistband) */}
        <rect x="84" y="132" width="32" height="5" rx="2.5" fill="url(#goldGradient)" />
        <circle cx="100" cy="134.5" r="3" fill="#EC4899" />

        {/* Floral Mala (White & Pink Garland) */}
        <path
          d="M86 108C86 136 94 164 100 164C106 164 114 136 114 108"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />
        <path
          d="M86 108C86 136 94 164 100 164C106 164 114 136 114 108"
          stroke="#F472B6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="2 5"
        />

        {/* Central Hands in Namaste / Abhaya Gesture */}
        <path d="M96 112L100 104L104 112Z" fill="url(#skinGradient)" stroke="#F59E0B" strokeWidth="1" />
        <ellipse cx="100" cy="116" rx="6" ry="7" fill="url(#skinGradient)" />
        <line x1="97" y1="120" x2="103" y2="120" stroke="url(#goldGradient)" strokeWidth="2" />

        {/* 5. Head, Hair and Face */}
        {/* Hair Shape (Front & Crown) */}
        <path
          d="M68 76C68 45 132 45 132 76C132 86 128 92 124 94C114 74 86 74 76 94C72 92 68 86 68 76Z"
          fill="url(#hairGradient)"
        />

        {/* Soft Chibi Face */}
        <path
          d="M74 76C74 98 84 108 100 108C116 108 126 98 126 76C126 62 116 54 100 54C84 54 74 62 74 76Z"
          fill="url(#skinGradient)"
        />

        {/* Large Anime/Chibi Divine Eyes */}
        {/* Left Eye */}
        <ellipse cx="88" cy="80" rx="7.5" ry="9" fill="#1E0E06" />
        <circle cx="86" cy="77" r="3.2" fill="#FFFFFF" />
        <circle cx="90.5" cy="83.5" r="1.5" fill="#FFFFFF" />
        <path d="M80 72C84 69 93 69 96 72" stroke="#1E0E06" strokeWidth="2" strokeLinecap="round" />

        {/* Right Eye */}
        <ellipse cx="112" cy="80" rx="7.5" ry="9" fill="#1E0E06" />
        <circle cx="110" cy="77" r="3.2" fill="#FFFFFF" />
        <circle cx="114.5" cy="83.5" r="1.5" fill="#FFFFFF" />
        <path d="M104 72C107 69 116 69 120 72" stroke="#1E0E06" strokeWidth="2" strokeLinecap="round" />

        {/* Sacred Third Eye (ত্রিনয়ন - Trinetra) & Red Chandan Bindi */}
        <path
          d="M100 66C98.5 69 98.5 71 100 73C101.5 71 101.5 69 100 66Z"
          fill="#DC2626"
        />
        <circle cx="100" cy="74.5" r="1.6" fill="#DC2626" />
        {/* White Chandan dots on forehead */}
        <circle cx="96" cy="70" r="0.8" fill="#FFFFFF" />
        <circle cx="104" cy="70" r="0.8" fill="#FFFFFF" />

        {/* Sweet Smiling Mouth & Soft Cheeks */}
        <path d="M96 92C98 94.5 102 94.5 104 92" stroke="#BE185D" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="81" cy="87" rx="3.5" ry="2" fill="#F472B6" opacity="0.6" />
        <ellipse cx="119" cy="87" rx="3.5" ry="2" fill="#F472B6" opacity="0.6" />

        {/* Golden Mukut (Crown) */}
        <path
          d="M84 56C84 46 92 32 100 24C108 32 116 46 116 56Z"
          fill="url(#goldGradient)"
          stroke="#B45309"
          strokeWidth="1.2"
        />
        <circle cx="100" cy="38" r="3.5" fill="#DC2626" />
        <path
          d="M80 54C88 52 112 52 120 54C114 58 86 58 80 54Z"
          fill="url(#goldGradient)"
        />
        {/* Little Side Lotus in Hair */}
        <circle cx="74" cy="62" r="4.5" fill="#F472B6" />
        <circle cx="126" cy="62" r="4.5" fill="#F472B6" />

        {/* Golden Jhumka Earrings */}
        <path d="M73 84L70 92L76 92Z" fill="url(#goldGradient)" />
        <path d="M127 84L124 92L130 92Z" fill="url(#goldGradient)" />

        {/* Bare Feet Standing on Lotus Petals */}
        <ellipse cx="94" cy="191" rx="4.5" ry="2.5" fill="url(#skinGradient)" />
        <ellipse cx="106" cy="191" rx="4.5" ry="2.5" fill="url(#skinGradient)" />
        {/* Lotus Petals at feet */}
        <path d="M82 195C86 191 94 191 98 195Z" fill="#F472B6" />
        <path d="M102 195C106 191 114 191 118 195Z" fill="#F472B6" />
      </svg>
    </div>
  );
};
