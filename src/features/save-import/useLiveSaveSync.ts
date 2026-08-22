import { useState, useEffect, useRef, useCallback } from 'react';
import { useFishing } from '../../context/FishingContext';
import { parseCoralIslandSaveFile, SaveCompletionsResult } from '../../utils/saveFileParser';

export interface LiveSyncState {
  isSupported: boolean;
  isConnected: boolean;
  fileName: string | null;
  lastSyncTime: Date | null;
  syncCount: number;
  lastParsedResult: SaveCompletionsResult | null;
  error: string | null;
}

export function useLiveSaveSync() {
  const { setUserProgress, setGameState } = useFishing();
  
  const isSupported = typeof window !== 'undefined' && 'showOpenFilePicker' in window;
  const [isConnected, setIsConnected] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncCount, setSyncCount] = useState(0);
  const [lastParsedResult, setLastParsedResult] = useState<SaveCompletionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileHandleRef = useRef<any>(null);
  const lastModifiedRef = useRef<number>(0);
  const intervalRef = useRef<any>(null);

  const applySaveData = useCallback((result: SaveCompletionsResult) => {
    if (!result.success) {
      setError(result.error || 'Failed to parse save file');
      return;
    }

    setLastParsedResult(result);
    setError(null);
    setSyncCount(prev => prev + 1);
    setLastSyncTime(new Date());

    // 1. Update Checklists (Caught, Donated, Offered)
    setUserProgress(prev => ({
      ...prev,
      caught: { ...prev.caught, ...result.caughtFish },
      donatedMuseum: { ...prev.donatedMuseum, ...result.donatedMuseum },
      offeredTemple: { ...prev.offeredTemple, ...result.offeredTemple }
    }));

    // 2. Update Active Game State (Date, Weather, Level)
    setGameState(prev => {
      const next = { ...prev };
      if (result.gameDate) {
        next.season = result.gameDate.season;
        next.day = result.gameDate.day;
        next.year = result.gameDate.year;
      }
      if (result.weather) {
        next.weather = result.weather;
      }
      if (result.profile?.fishingLevel !== undefined) {
        next.fishingLevel = result.profile.fishingLevel;
      }
      return next;
    });
  }, [setUserProgress, setGameState]);

  const readAndProcessFile = useCallback(async (handle: any) => {
    try {
      const file = await handle.getFile();
      if (file.lastModified !== lastModifiedRef.current) {
        lastModifiedRef.current = file.lastModified;
        const arrayBuffer = await file.arrayBuffer();
        const result = parseCoralIslandSaveFile(arrayBuffer);
        applySaveData(result);
      }
    } catch (err: unknown) {
      console.warn('Live save poll read error:', err);
    }
  }, [applySaveData]);

  const connectLiveSave = async () => {
    if (!isSupported) {
      setError('File System Access API is not supported in this browser.');
      return false;
    }

    try {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Coral Island Save File (*.sav)',
            accept: {
              'application/octet-stream': ['.sav', '.json']
            }
          }
        ],
        multiple: false
      });

      if (!handle) return false;

      fileHandleRef.current = handle;
      const file = await handle.getFile();
      setFileName(file.name);
      setIsConnected(true);
      setError(null);
      lastModifiedRef.current = 0;

      // Initial read
      await readAndProcessFile(handle);

      // Start watcher interval (polls every 2.5 seconds)
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (fileHandleRef.current) {
          readAndProcessFile(fileHandleRef.current);
        }
      }, 2500);

      return true;
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Failed to select file');
      }
      return false;
    }
  };

  const disconnectLiveSave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    fileHandleRef.current = null;
    setIsConnected(false);
    setFileName(null);
  };

  const syncNow = async () => {
    if (fileHandleRef.current) {
      lastModifiedRef.current = 0; // force re-read
      await readAndProcessFile(fileHandleRef.current);
    }
  };

  // Re-check when window gains focus (e.g. user switched back from playing the game)
  useEffect(() => {
    const handleFocus = () => {
      if (fileHandleRef.current) {
        readAndProcessFile(fileHandleRef.current);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [readAndProcessFile]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    isSupported,
    isConnected,
    fileName,
    lastSyncTime,
    syncCount,
    lastParsedResult,
    error,
    connectLiveSave,
    disconnectLiveSave,
    syncNow,
    applySaveData
  };
}
