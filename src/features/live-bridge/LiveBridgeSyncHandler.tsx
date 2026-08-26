import React, { useEffect, useRef } from 'react';
import { useLiveBridge } from './LiveBridgeContext';
import { useFishing } from '../../context/FishingContext';
import { FISH_MAP } from '../../data/fishData';

export const LiveBridgeSyncHandler: React.FC = () => {
  const { liveState, isAutoSync, isConnected } = useLiveBridge();
  const { setGameState, setUserProgress } = useFishing();
  const lastTimestampRef = useRef<number>(0);

  useEffect(() => {
    if (!isAutoSync || !isConnected || !liveState.timestamp) return;
    if (liveState.timestamp === lastTimestampRef.current) return;
    lastTimestampRef.current = liveState.timestamp;

    // 1. Sync Game Simulator State (Season, Day, Time, Weather, Fishing Level)
    setGameState(prev => {
      if (
        prev.season === liveState.season &&
        prev.day === liveState.day &&
        prev.weather === liveState.weather &&
        prev.timeOfDay === liveState.timeOfDay &&
        prev.fishingLevel === liveState.fishingLevel
      ) {
        return prev;
      }

      return {
        ...prev,
        season: liveState.season,
        day: liveState.day,
        weather: liveState.weather,
        timeOfDay: liveState.timeOfDay,
        fishingLevel: liveState.fishingLevel > 0 ? liveState.fishingLevel : prev.fishingLevel
      };
    });

    // Helper: Normalize item string to item_XXXXX key
    const normalizeFishId = (rawId: string): string | null => {
      if (!rawId) return null;
      if (FISH_MAP[rawId]) return rawId;
      const formatted = rawId.startsWith('item_') ? rawId : `item_${rawId}`;
      if (FISH_MAP[formatted]) return formatted;
      return null;
    };

    // 2. Sync Collections (Caught, Donated, Offered)
    setUserProgress(prev => {
      let changed = false;
      const newCaught = { ...prev.caught };
      const newDonated = { ...prev.donatedMuseum };
      const newOffered = { ...prev.offeredTemple };

      // Caught fish
      if (liveState.caughtFish) {
        for (const rawId of liveState.caughtFish) {
          const fishId = normalizeFishId(rawId);
          if (fishId && !newCaught[fishId]) {
            newCaught[fishId] = true;
            changed = true;
          }
        }
      }

      // Museum Donated fish
      if (liveState.donatedFish) {
        for (const rawId of liveState.donatedFish) {
          const fishId = normalizeFishId(rawId);
          if (fishId && !newDonated[fishId]) {
            newDonated[fishId] = true;
            changed = true;
          }
        }
      }

      // Lake Temple Offered fish
      if (liveState.offeredFish) {
        for (const rawId of liveState.offeredFish) {
          const fishId = normalizeFishId(rawId);
          if (fishId && !newOffered[fishId]) {
            newOffered[fishId] = true;
            changed = true;
          }
        }
      }

      if (!changed) return prev;
      return {
        ...prev,
        caught: newCaught,
        donatedMuseum: newDonated,
        offeredTemple: newOffered
      };
    });
  }, [liveState, isAutoSync, isConnected, setGameState, setUserProgress]);

  return null;
};

