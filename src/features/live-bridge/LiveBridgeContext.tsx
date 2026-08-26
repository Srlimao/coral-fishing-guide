import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { LiveGameState, INITIAL_LIVE_STATE } from './types';

interface LiveBridgeContextType {
  liveState: LiveGameState;
  isAutoSync: boolean;
  toggleAutoSync: () => void;
  isConnected: boolean;
}

const LiveBridgeContext = createContext<LiveBridgeContextType | undefined>(undefined);

export const LiveBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liveState, setLiveState] = useState<LiveGameState>(INITIAL_LIVE_STATE);
  const [isAutoSync, setIsAutoSync] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('coral_live_auto_sync');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleAutoSync = useCallback(() => {
    setIsAutoSync(prev => {
      const next = !prev;
      try {
        localStorage.setItem('coral_live_auto_sync', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save auto-sync setting', e);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let fallbackInterval: any = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/live-stream');

        eventSource.onmessage = (event) => {
          try {
            const data: LiveGameState = JSON.parse(event.data);
            setLiveState(data);
          } catch {
            // ignore JSON parse error
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          if (!fallbackInterval) {
            fallbackInterval = setInterval(pollFallback, 3000);
          }
        };
      } catch {
        if (!fallbackInterval) {
          fallbackInterval = setInterval(pollFallback, 3000);
        }
      }
    };

    const pollFallback = async () => {
      try {
        const res = await fetch('/api/live-state');
        if (res.ok) {
          const data: LiveGameState = await res.json();
          setLiveState(data);
        }
      } catch {
        setLiveState(prev => prev.connected ? { ...prev, connected: false } : prev);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  return (
    <LiveBridgeContext.Provider
      value={{
        liveState,
        isAutoSync,
        toggleAutoSync,
        isConnected: liveState.connected
      }}
    >
      {children}
    </LiveBridgeContext.Provider>
  );
};

export const useLiveBridge = () => {
  const context = useContext(LiveBridgeContext);
  if (!context) throw new Error('useLiveBridge must be used within a LiveBridgeProvider');
  return context;
};
