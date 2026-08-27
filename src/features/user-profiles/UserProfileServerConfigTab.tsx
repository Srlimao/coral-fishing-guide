import React, { useState } from 'react';
import { useUserProfile } from './UserProfileContext';

interface UserProfileServerConfigTabProps {
  onSaved: () => void;
}

export const UserProfileServerConfigTab: React.FC<UserProfileServerConfigTabProps> = ({ onSaved }) => {
  const { dbConfig, setDbConfig } = useUserProfile();
  const [editBaseUrl, setEditBaseUrl] = useState(dbConfig.baseUrl);
  const [editApiKey, setEditApiKey] = useState(dbConfig.apiKey);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDbConfig({
      baseUrl: editBaseUrl.trim() || 'https://db.dunhas.com/api',
      apiKey: editApiKey.trim(),
      collection: 'coral_fish_users'
    });
    onSaved();
  };

  return (
    <form onSubmit={handleSave} className="space-y-3 p-4 rounded-2xl bg-black/20 border border-white/10">
      <h4 className="font-bold text-white text-xs">GCP Document DB Connection</h4>
      <div>
        <label className="text-[11px] text-neutral-400 block mb-1">API Base URL</label>
        <input
          type="text"
          value={editBaseUrl}
          onChange={(e) => setEditBaseUrl(e.target.value)}
          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
        />
      </div>
      <div>
        <label className="text-[11px] text-neutral-400 block mb-1">API Key Header (x-api-key)</label>
        <input
          type="password"
          value={editApiKey}
          onChange={(e) => setEditApiKey(e.target.value)}
          className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
        />
      </div>
      <button
        type="submit"
        className="cg-pill cg-pill-active py-1.5 px-3 text-xs font-bold mt-2"
      >
        Save Settings
      </button>
    </form>
  );
};
