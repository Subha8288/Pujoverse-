import React, { useState } from 'react';
import { ChatMessage } from '../types/contest';
import { X, Send, MessageSquare, Sparkles, Smile } from 'lucide-react';

interface AddaChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string, reactionEmoji?: string) => void;
  onlineCount: number;
}

const FESTIVAL_EMOJIS = ['🪔', '🥁', '📸', '👑', '❤️', '🌺', '✨'];

export const AddaChatDrawer: React.FC<AddaChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onlineCount
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('🪔');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), selectedEmoji);
    setInputText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#13151f] border-l border-white/10 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0e1017]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Festive Adda Lounge</span>
            </h3>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
              {onlineCount} online
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Discuss pandal queues, lighting tips, and live voting
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl border transition-all text-xs ${
              msg.isOfficial
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-[#1a1c2a] border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <img
                  src={msg.userAvatar}
                  alt={msg.userName}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className={`font-semibold ${msg.isOfficial ? 'text-amber-300' : 'text-slate-200'}`}>
                  {msg.userName}
                </span>
                {msg.isOwner ? (
                  <span className="text-[9px] font-mono uppercase bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black px-1.5 py-0.2 rounded shadow-sm">
                    👑 Owner
                  </span>
                ) : msg.isOfficial ? (
                  <span className="text-[9px] font-mono uppercase bg-amber-400 text-slate-950 font-bold px-1 rounded">
                    Official
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
            </div>

            <p className="text-slate-300 leading-relaxed break-words">{msg.text}</p>

            {msg.reactionEmoji && (
              <div className="mt-2 text-sm inline-block px-1.5 py-0.5 bg-black/40 rounded-md">
                {msg.reactionEmoji}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Reaction Toolbar */}
      <div className="px-4 py-2 bg-[#0e1017] border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-slate-400 uppercase font-mono shrink-0">React:</span>
        {FESTIVAL_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setSelectedEmoji(emoji)}
            className={`text-base px-2 py-1 rounded-lg transition-transform hover:scale-125 ${
              selectedEmoji === emoji ? 'bg-amber-500/20 ring-1 ring-amber-400' : 'bg-white/5'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#0e1017] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share pandal news or photo thoughts..."
          className="flex-1 bg-[#1c1f2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 transition-colors shrink-0 font-bold"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
