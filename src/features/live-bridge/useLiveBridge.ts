import { useState, useEffect, useCallback, useRef } from 'react';
import { LiveGameState, INITIAL_LIVE_STATE } from './types';

export interface UseLiveBridgeOptions {
  autoSyncGameState?: boolean;
  onStateUpdate?: (state: LiveGameState) => void;
}

export function useLiveBridge(options: UseLiveBridgeOptions = {}) {
  const [liveState, setLiveState] = useState<LiveGameState>(INITIAL_LIVE_STATE);
  const [autoSync, setAutoSync] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('coral_live_auto_sync');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const onUpdateRef = useRef(options.onStateUpdate);
  onUpdateRef.current = options.onStateUpdate;

  const toggleAutoSync = useCallback(() => {
    setAutoSync(prev => {
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
            if (onUpdateRef.current) {
              onUpdateRef.current(data);
            }
          } catch {
            // parse error ignore
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Start fallback polling if SSE connection fails
          if (!fallbackInterval) {
            fallbackInterval = setInterval(pollFallback, 4000);
          }
        };
      } catch {
        if (!fallbackInterval) {
          fallbackInterval = setInterval(pollFallback, 4000);
        }
      }
    };

    let consecutiveErrors = 0;
    const pollFallback = async () => {
      try {
        const res = await fetch('/api/live-state');
        if (res.ok) {
          consecutiveErrors = 0;
          const data: LiveGameState = await res.json();
          setLiveState(data);
          if (onUpdateRef.current) {
            onUpdateRef.current(data);
          }
        } else {
          consecutiveErrors++;
          if (consecutiveErrors >= 3 && fallbackInterval) {
            clearInterval(fallbackInterval);
            fallbackInterval = null;
          }
        }
      } catch {
        consecutiveErrors++;
        setLiveState(prev => prev.connected ? { ...prev, connected: false } : prev);
        if (consecutiveErrors >= 3 && fallbackInterval) {
          clearInterval(fallbackInterval);
          fallbackInterval = null;
        }
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  return {
    liveState,
    autoSync,
    toggleAutoSync
  };
}
