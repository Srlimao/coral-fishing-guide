import { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';

interface LiveGameState {
  connected: boolean;
  timestamp: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  day: number;
  year: number;
  hour: number;
  minute: number;
  formattedTime: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'rain' | 'storm' | 'snow' | 'blizzard' | 'windy';
  fishingLevel: number;
  rodTier: string;
  caughtFish: string[];
  donatedFish: string[];
  offeredFish: string[];
}

const DEFAULT_OFFLINE_STATE: LiveGameState = {
  connected: false,
  timestamp: 0,
  season: 'spring',
  day: 1,
  year: 1,
  hour: 6,
  minute: 0,
  formattedTime: '06:00 AM',
  timeOfDay: 'morning',
  weather: 'sunny',
  fishingLevel: 0,
  rodTier: 'makeshift',
  caughtFish: [],
  donatedFish: [],
  offeredFish: []
};

export function liveBridgePlugin(): Plugin {
  return {
    name: 'coral-island-live-bridge',
    configureServer(server: ViteDevServer) {
      const workspaceFilePath = path.resolve(process.cwd(), 'live_game_state.json');
      const gameModFilePath = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Coral Island\\ProjectCoral\\Binaries\\Win64\\Mods\\LiveFishingBridge\\live_game_state.json';

      function readLatestState(): LiveGameState {
        const targetPath = fs.existsSync(workspaceFilePath)
          ? workspaceFilePath
          : (fs.existsSync(gameModFilePath) ? gameModFilePath : null);

        if (!targetPath) return DEFAULT_OFFLINE_STATE;

        try {
          const raw = fs.readFileSync(targetPath, 'utf-8');
          const parsed = JSON.parse(raw) as LiveGameState;
          const now = Math.floor(Date.now() / 1000);
          
          // If the last update was within 10 seconds, game is live
          const isFresh = Boolean(parsed.timestamp && (now - parsed.timestamp < 10));
          return {
            ...parsed,
            connected: isFresh
          };
        } catch {
          return DEFAULT_OFFLINE_STATE;
        }
      }

      // Track active SSE response streams
      const clients: Array<{ id: number; res: any }> = [];
      let clientId = 0;

      function broadcast(state: LiveGameState) {
        const payload = `data: ${JSON.stringify(state)}\n\n`;
        for (const client of clients) {
          try {
            client.res.write(payload);
          } catch {
            // client disconnected
          }
        }
      }

      // Watch for file modifications
      const watchTargets = [workspaceFilePath, gameModFilePath];
      for (const filePath of watchTargets) {
        try {
          const dir = path.dirname(filePath);
          if (fs.existsSync(dir)) {
            fs.watch(dir, (_event: string, filename: string | null) => {
              if (filename === path.basename(filePath) || filename === 'live_game_state.json') {
                const state = readLatestState();
                broadcast(state);
              }
            });
          }
        } catch {
          // ignore watch errors for non-existent directories
        }
      }

      // Heartbeat interval to prune stale connections & check liveness
      setInterval(() => {
        const state = readLatestState();
        broadcast(state);
      }, 3000);

      // Setup HTTP Middlewares
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url || '';

        // 1. GET /api/live-state
        if (url === '/api/live-state') {
          const state = readLatestState();
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(JSON.stringify(state));
          return;
        }

        // 2. GET /api/live-stream (Server-Sent Events)
        if (url === '/api/live-stream') {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.flushHeaders?.();

          const id = ++clientId;
          clients.push({ id, res });

          // Send initial state immediately
          const state = readLatestState();
          res.write(`data: ${JSON.stringify(state)}\n\n`);

          req.on('close', () => {
            const index = clients.findIndex(c => c.id === id);
            if (index !== -1) clients.splice(index, 1);
          });
          return;
        }

        next();
      });
    }
  };
}
