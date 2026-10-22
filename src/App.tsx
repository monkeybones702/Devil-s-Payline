/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Shield, Sword, Coins, Skull, Zap, Flame, Snowflake, Target } from 'lucide-react';
import { motion } from 'motion/react';
import ThreeScene from './components/ThreeScene';

// Importing generated assets
import vaultBg from '../src/assets/images/vault_background_1792350616569.jpg';
import cloverIntercom from '../src/assets/images/clover_intercom_portrait_1792350617351.jpg';
import reelFrame from '../src/assets/images/slot_machine_reels_frame_1792350616997.jpg';

const SYMBOLS = {
  SWORD: { id: 'SWORD', icon: Sword, color: 'text-rose-500' },
  SHIELD: { id: 'SHIELD', icon: Shield, color: 'text-sky-500' },
  COIN: { id: 'COIN', icon: Coins, color: 'text-amber-500' },
  SKULL: { id: 'SKULL', icon: Skull, color: 'text-slate-500' },
  MAGIC: { id: 'MAGIC', icon: Zap, color: 'text-violet-500' },
  FIRE: { id: 'FIRE', icon: Flame, color: 'text-orange-500' },
  FROST: { id: 'FROST', icon: Snowflake, color: 'text-cyan-500' },
};

const FLOORS = [
  { id: 1, name: 'The Pit', reels: 3, symbols: ['SWORD', 'SHIELD', 'COIN', 'SKULL', 'MAGIC'] },
  { id: 2, name: 'The Vaults', reels: 4, symbols: ['SWORD', 'SHIELD', 'COIN', 'SKULL', 'MAGIC', 'FIRE', 'FROST'] },
];

export default function App() {
  const [floor, setFloor] = useState(0);
  const [coins, setCoins] = useState(100);
  const [hp, setHp] = useState(100);
  const [bossHp, setBossHp] = useState(200);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>([]);
  const [dialogue, setDialogue] = useState("Welcome to the Infinite Vault. Pay to play, or pay to bleed.");
  const [mods, setMods] = useState({ NOR7: false, Volatile: false });
  const [bonusMode, setBonusMode] = useState(false);

  const currentFloor = FLOORS[floor];

  const spin = useCallback(() => {
    if (coins < 10) {
      setDialogue("Insufficient funds. Pull the Blood Lever to trade your soul for credit.");
      return;
    }
    setCoins(prev => prev - 10);
    setSpinning(true);
    setDialogue("The machines groan. Your fate is turning...");

    setTimeout(() => {
      const newReels = Array.from({ length: currentFloor.reels }, () =>
        Array.from({ length: 3 }, () => {
          const sym = currentFloor.symbols[Math.floor(Math.random() * currentFloor.symbols.length)];
          // NOR-7 Mod: Convert SKULL to SWORD
          return (mods.NOR7 && sym === 'SKULL') ? 'SWORD' : sym;
        })
      );
      setReels(newReels);
      setSpinning(false);
      
      // Damage calculation
      let baseDamage = 0;
      newReels.forEach(reel => {
          if (reel[0] === reel[1] && reel[1] === reel[2]) {
              if (reel[0] === 'SWORD') baseDamage += 50;
              if (reel[0] === 'MAGIC') baseDamage += 30;
          }
      });
      
      let finalDamage = baseDamage;
      if (mods.Volatile) {
          finalDamage *= 3;
          setHp(prev => Math.max(0, prev - Math.floor(hp * 0.05)));
      }
      
      setBossHp(prev => Math.max(0, prev - finalDamage));
      setDialogue(finalDamage > 0 ? `Direct hit! You dealt ${finalDamage} damage to the machine.` : "No significant impact.");
    }, 1500);
  }, [coins, currentFloor, mods, hp]);

  return (
    <div className="relative min-h-screen p-8 text-slate-200 font-mono" style={{ backgroundImage: `url(${vaultBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))', backgroundSize: '100% 4px, 3px 100%' }} />
      
      {bonusMode && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-emerald-500 rounded-lg">
                  <ThreeScene />
              </div>
              <button onClick={() => setBonusMode(false)} className="absolute top-4 right-4 bg-red-800 text-white p-2">EXIT</button>
          </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="flex justify-between items-center pb-8 border-b border-slate-700/50">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">SYSTEM: THE_DEVILS_PAYLINE</h1>
          <div className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm font-medium text-amber-400">STATUS: FLOOR_{currentFloor.name.toUpperCase().replace(/\s/g, '_')}</div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="flex gap-4 items-center bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4">
              <img src={cloverIntercom} alt="Clover Intercom" className="w-20 h-20 rounded-lg border-2 border-slate-700" />
              <p className="text-lg italic text-slate-200">"CLOVER": {dialogue}</p>
            </div>

            {/* Boss HP Bar */}
            <div className="bg-slate-900/80 border border-red-900/50 rounded-2xl p-4 space-y-2 cursor-pointer" onClick={() => setBonusMode(true)}>
                <div className="flex justify-between text-sm text-red-300">
                    <span>BOSS_TARGET (CLICK_FOR_BONUS)</span>
                    <span>{bossHp}/200 HP</span>
                </div>
                <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-red-900/50">
                    <motion.div className="h-full bg-red-700" initial={{width: '100%'}} animate={{width: `${(bossHp/200)*100}%`}} />
                </div>
            </div>

            <div className="relative flex justify-center gap-2 p-6 rounded-2xl border border-slate-700/50 shadow-2xl" style={{ backgroundImage: `url(${reelFrame})`, backgroundSize: 'cover' }}>
              {reels.map((reel, i) => (
                <div key={i} className="flex flex-col gap-2">
                  {reel.map((symId, j) => {
                    const SymbolIcon = SYMBOLS[symId as keyof typeof SYMBOLS].icon;
                    const color = SYMBOLS[symId as keyof typeof SYMBOLS].color;
                    return (
                      <motion.div 
                        key={j} 
                        animate={spinning ? { y: [0, 20, -20, 0] } : {}}
                        transition={{ duration: 0.1, repeat: spinning ? Infinity : 0 }}
                        className="w-20 h-20 bg-slate-950/60 border border-slate-700 flex items-center justify-center rounded-lg"
                      >
                        <SymbolIcon className={`w-10 h-10 ${color}`} />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 justify-center">
              <button onClick={spin} disabled={spinning} className="px-10 py-4 bg-emerald-900 border border-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition shadow-lg">INITIATE_SPIN</button>
            </div>
          </div>
          
          {/* PCB Modding Sidebar */}
          <aside className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700/50 space-y-6">
            <h2 className="text-xl font-bold text-slate-100">PCB_MOD_CONTROLS</h2>
            <div className="space-y-4">
              <button 
                  onClick={() => setMods(prev => ({...prev, NOR7: !prev.NOR7}))}
                  className={`w-full p-4 rounded-lg text-left transition ${mods.NOR7 ? 'bg-amber-900 text-amber-100 border border-amber-600' : 'bg-slate-800 text-slate-400'}`}
              >
                  <div className="font-bold">NOR-7_LOGIC_GATE</div>
                  <div className="text-xs">CONVERTS_SKULL_TO_SWORD</div>
              </button>
              <button 
                  onClick={() => setMods(prev => ({...prev, Volatile: !prev.Volatile}))}
                  className={`w-full p-4 rounded-lg text-left transition ${mods.Volatile ? 'bg-red-900 text-red-100 border border-red-600' : 'bg-slate-800 text-slate-400'}`}
              >
                  <div className="font-bold">VOLATILE_TRANSISTOR</div>
                  <div className="text-xs">3X_DAMAGE_/_5%_SELF_RECOIL</div>
              </button>
            </div>
            <div className="pt-6 border-t border-slate-700/50 space-y-2 text-sm">
                <div className="flex justify-between"><span>PLAYER_HP:</span><span className="text-red-400">{hp}</span></div>
                <div className="flex justify-between"><span>CREDITS:</span><span className="text-amber-400">{coins}</span></div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
