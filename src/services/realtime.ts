import { PhotoEntry, ChatMessage } from '../types/contest';

export type RealTimeEvent =
  | { type: 'VOTE_CAST'; payload: { photoId: string; newVotes: number; isDuelWin?: boolean } }
  | { type: 'PHOTO_SUBMITTED'; payload: PhotoEntry }
  | { type: 'PHOTO_DELETED'; payload: { photoId: string } }
  | { type: 'CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CHAT_MESSAGE_DELETED'; payload: { id: string } }
  | { type: 'WINNER_SHOUTOUT'; payload: { dayNumber: number; photo: PhotoEntry } }
  | { type: 'ONLINE_STATUS'; payload: { onlineCount: number } };

type Listener = (event: RealTimeEvent) => void;

class RealTimeService {
  private socket: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private isConnecting = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private onlineCount = 42; // Dynamic simulated active festival photographers

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('sharadshots_live_channel');
        this.broadcastChannel.onmessage = (ev) => {
          if (ev.data) {
            this.notifyListeners(ev.data as RealTimeEvent);
          }
        };
      } catch {
        // BroadcastChannel unavailable
      }
    }
  }

  public connect() {
    if (typeof window === 'undefined') return;
    const wsUrl = import.meta.env.VITE_WS_URL;
    if (!wsUrl) {
      // Direct WebSocket server is not configured; app uses Firebase Cloud Sync & BroadcastChannel
      return;
    }
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        // Connected to server WebSocket
      };

      this.socket.onmessage = (event) => {
        try {
          const data: RealTimeEvent = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch {
          // ignore malformed
        }
      };

      this.socket.onerror = () => {
        // Will fallback to BroadcastChannel
      };

      this.socket.onclose = () => {
        this.socket = null;
        this.scheduleReconnect();
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(event: RealTimeEvent) {
    this.listeners.forEach((fn) => {
      try {
        fn(event);
      } catch (err) {
        console.error('Error in listener', err);
      }
    });
  }

  public broadcast(event: RealTimeEvent) {
    // 1. Notify local subscribers
    this.notifyListeners(event);

    // 2. Notify other tabs via BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(event);
      } catch {
        // ignore
      }
    }

    // 3. Send over WebSocket if connected
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(event));
      } catch {
        // ignore
      }
    }
  }

  public getOnlineParticipantCount(): number {
    return this.onlineCount;
  }
}

export const realtimeService = new RealTimeService();
