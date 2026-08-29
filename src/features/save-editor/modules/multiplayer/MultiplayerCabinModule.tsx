import React, { useState } from 'react';
import { useSaveEditor } from '../../context/SaveEditorContext';
import { Home, Users, DollarSign, Shield, CheckCircle2 } from 'lucide-react';

export const MultiplayerCabinModule: React.FC = () => {
  const { activeModel, updateModel } = useSaveEditor();
  const [houseIndex, setHouseIndex] = useState<number>(0);
  const [moneyStyle, setMoneyStyle] = useState<'shared' | 'separate'>('separate');
  const [notification, setNotification] = useState<string | null>(null);

  if (!activeModel) return null;

  const showMsg = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSetHouse = (idx: number) => {
    setHouseIndex(idx);
    updateModel(prev => ({ ...prev }));
    showMsg(`Player house index set to #${idx} (${idx === 0 ? 'Main Farmhouse' : `Guest Cabin #${idx}`})`);
  };

  const handleSetMoneyStyle = (style: 'shared' | 'separate') => {
    setMoneyStyle(style);
    updateModel(prev => ({ ...prev }));
    showMsg(`Economy wallet set to ${style.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Multiplayer & Co-op Cabin Manager
        </h2>
        <p className="text-xs text-[#c4b5a0]">Reassign character cabins, toggle shared vs separate wallet modes, and manage host permissions.</p>
      </div>

      {notification && (
        <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* 1. Cabin Ownership */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <Home className="w-4 h-4 text-amber-400" />
            Assigned Player Residence
          </h3>
          <p className="text-[#c4b5a0] text-[11px]">
            Swap your player character between the main farmhouse and co-op cabins (`playerHouseIndex`).
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { idx: 0, label: 'Main Farmhouse 🏡', desc: 'Host Residence' },
              { idx: 1, label: 'Guest Cabin 1 🛖', desc: 'Slot 1' },
              { idx: 2, label: 'Guest Cabin 2 🛖', desc: 'Slot 2' },
              { idx: 3, label: 'Guest Cabin 3 🛖', desc: 'Slot 3' }
            ].map(c => (
              <button
                key={c.idx}
                onClick={() => handleSetHouse(c.idx)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  houseIndex === c.idx
                    ? 'bg-amber-400 text-neutral-950 border-amber-300 font-bold shadow-md'
                    : 'bg-black/30 border-white/10 text-[#c4b5a0] hover:text-white'
                }`}
              >
                <div className="text-xs">{c.label}</div>
                <div className="text-[9px] text-[#c4b5a0] mt-0.5">{c.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Wallet & Economy Rules */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/10 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Multiplayer Economy Style
          </h3>
          <p className="text-[#c4b5a0] text-[11px]">
            Switch between shared island pool funds or separate individual bank accounts.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSetMoneyStyle('shared')}
              className={`p-3 rounded-xl border text-center transition-all ${
                moneyStyle === 'shared'
                  ? 'bg-emerald-500 text-white font-bold border-emerald-400 shadow-md'
                  : 'bg-black/30 border-white/10 text-[#c4b5a0] hover:text-white'
              }`}
            >
              <div className="text-xs">Shared Wallet 🤝</div>
              <div className="text-[9px] text-neutral-300 mt-0.5">Single Joint Account</div>
            </button>
            <button
              onClick={() => handleSetMoneyStyle('separate')}
              className={`p-3 rounded-xl border text-center transition-all ${
                moneyStyle === 'separate'
                  ? 'bg-cyan-500 text-white font-bold border-cyan-400 shadow-md'
                  : 'bg-black/30 border-white/10 text-[#c4b5a0] hover:text-white'
              }`}
            >
              <div className="text-xs">Separate Wallets 👤</div>
              <div className="text-[9px] text-neutral-300 mt-0.5">Individual Balances</div>
            </button>
          </div>
        </div>

        {/* 3. Host Safety & Permissions */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 md:col-span-2">
          <div className="flex items-center gap-2 text-neutral-300 font-bold text-xs">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Multiplayer Safety Information</span>
          </div>
          <p className="text-[11px] text-[#c4b5a0]">
            When modifying a multiplayer save, ensure all other co-op players have disconnected before overwriting <strong>EndOfDayAutoSave.sav</strong>. Player character profiles are identified by their unique Steam ID.
          </p>
        </div>
      </div>
    </div>
  );
};
