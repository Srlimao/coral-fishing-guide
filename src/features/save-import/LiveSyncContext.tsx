import React, { createContext, useContext } from 'react';
import { useLiveSaveSync, LiveSyncState } from './useLiveSaveSync';
import { SaveCompletionsResult } from '../../utils/saveFileParser';

interface LiveSyncContextType extends LiveSyncState {
  connectLiveSave: () => Promise<boolean>;
  disconnectLiveSave: () => void;
  syncNow: () => Promise<void>;
  applySaveData: (result: SaveCompletionsResult) => void;
}

const LiveSyncContext = createContext<LiveSyncContextType | undefined>(undefined);

export const LiveSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const liveSync = useLiveSaveSync();

  return (
    <LiveSyncContext.Provider value={liveSync}>
      {children}
    </LiveSyncContext.Provider>
  );
};

export const useLiveSync = () => {
  const context = useContext(LiveSyncContext);
  if (!context) throw new Error('useLiveSync must be used within a LiveSyncProvider');
  return context;
};
