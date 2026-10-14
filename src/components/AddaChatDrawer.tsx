import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserProfile } from '../types/contest';
import {
  X,
  Send,
  MessageSquare,
  Sparkles,
  Smile,
  Trash2,
  Crown,
  ShieldCheck,
  Radio,
  User,
  LogIn
} from 'lucide-react';

interface AddaChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, reactionEmoji?: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onlineCount: number;
  currentUser: UserProfile;
  onOpenAuth?: () => void;
}

const FESTIVAL_EMOJIS = ['🪔', '🥁', '📸', '👑', '❤️', '🌺', '✨', '🙏'];

export const AddaChatDrawer: React.FC<AddaChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onDeleteMessage,
  onlineCount,
  currentUser,
  onOpenAuth
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('🪔');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), selectedEmoji);
    setInputText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#10121c] border-l border-white/10 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0b0c14] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Festive Adda Lounge</span>
            </h3>
            <span className="text-[10px] font-mono bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
              <Radio className="w-2.5 h-2.5 animate-spin" />
              {onlineCount} Online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-amber-400 font-semibold">100% Real Logged-in Players</span>
            <span>· Live multi-device chat</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Real Login User Banner */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border-b border-white/5 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-5 h-5 rounded-full object-cover border border-amber-400/60 shrink-0"
          />
          <div className="truncate">
            <span className="text-slate-300">Chatting as </span>
            <span className="font-bold text-white">{currentUser.name}</span>
            {currentUser.isOwner && (
              <span className="ml-1 text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">
                👑 RULER
              </span>
            )}
          </div>
        </div>
        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="text-[11px] text-amber-400 hover:text-amber-300 underline font-semibold shrink-0 ml-2"
          >
            Switch Profile
          </button>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl shadow-inner">
              🪔
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display mb-1">
                The Festive Adda Lounge is Open
              </h4>
              <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed mx-auto">
                All messages here are from real authenticated players. Send a greeting, share pandal lighting tips, or cheer for today's clicks!
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onSendMessage('শুভ শারদীয়া! Wishing everyone radiant Durga Puja festival clicks! 🪔✨', '🪔')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-semibold transition-colors"
              >
                Say "শুভ শারদীয়া!" 🪔
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = currentUser.id === msg.userId;
            const canDelete = isMyMessage || currentUser.isOwner;

            return (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl border transition-all text-xs group relative ${
                  msg.isOwner
                    ? 'bg-amber-500/10 border-amber-400/40'
                    : msg.isOfficial
                    ? 'bg-rose-500/10 border-rose-400/30'
                    : isMyMessage
                    ? 'bg-[#1b1e2e] border-amber-400/30'
                    : 'bg-[#151724] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={msg.userAvatar}
                      alt={msg.userName}
                      className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`font-semibold truncate ${
                        msg.isOwner ? 'text-amber-300' : 'text-slate-200'
                      }`}>
                        {msg.userName}
                      </span>
                      {msg.isOwner ? (
                        <span className="text-[9px] font-mono uppercase bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black px-1.5 py-0.2 rounded shadow-sm shrink-0">
                          👑 Ruler
                        </span>
                      ) : msg.isOfficial ? (
                        <span className="text-[9px] font-mono uppercase bg-rose-400 text-slate-950 font-bold px-1 rounded shrink-0">
                          Official
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded shrink-0">
                          Real User
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    {canDelete && onDeleteMessage && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        title="Delete this message"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        aria-label="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-slate-200 leading-relaxed break-words pl-8 font-normal">{msg.text}</p>

                {msg.reactionEmoji && (
                  <div className="mt-2 pl-8">
                    <span className="text-xs inline-flex items-center gap-1 px-2 py-0.5 bg-black/40 rounded-full border border-white/5">
                      <span>{msg.reactionEmoji}</span>
                      <span className="text-[10px] text-slate-400 font-mono">reacted</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reaction Toolbar */}
      <div className="px-4 py-2 bg-[#0b0c14] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] text-slate-400 uppercase font-mono shrink-0 mr-1">React:</span>
        {FESTIVAL_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setSelectedEmoji(emoji)}
            className={`text-sm px-2 py-1 rounded-lg transition-transform hover:scale-125 ${
              selectedEmoji === emoji ? 'bg-amber-500/25 ring-1 ring-amber-400' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#0b0c14] border-t border-white/10 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Chat as ${currentUser.name}...`}
          className="flex-1 bg-[#1a1c2a] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-md shadow-amber-500/20"
          aria-label="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
