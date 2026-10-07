/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, Sword, Coins, Skull, Zap, Flame, Snowflake, Heart, Target, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  { id: 1, name: 'The Pit', reels: 3, paylines: 1, symbols: ['SWORD', 'SHIELD', 'COIN', 'SKULL', 'MAGIC'] },
  { id: 2, name: 'The Vaults', reels: 4, paylines: 3, symbols: ['SWORD', 'SHIELD', 'COIN', 'SKULL', 'MAGIC', 'FIRE', 'FROST'] },
  { id: 3, name: 'The Sanctum', reels: 5, paylines: 5, symbols: ['SWORD', 'SHIELD', 'COIN', 'SKULL', 'MAGIC', 'FIRE', 'FROST'] },
];

export default function App() {
  const [floor, setFloor] = useState(0);
  const [coins, setCoins] = useState(100);
  const [hp, setHp] = useState(100);
  const [bossHp, setBossHp] = useState(200);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>([]);
  const [dialogue, setDialogue] = useState("Welcome to the Infinite Vault. Pay to play, or pay to bleed.");
  const [mods, setMods] = useState({ NOR7: false, Volatile: false, Siphon: false });

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
          if (mods.NOR7 && sym === 'SKULL') return 'SWORD';
          return sym;
        })
      );
      setReels(newReels);
      setSpinning(false);
      evaluateReels(newReels);
    }, 1500);
  }, [coins, currentFloor, mods]);

  const evaluateReels = (newReels: string[][]) => {
    // Basic evaluation logic (simulated for now)
    let dmg = 20;
    if (mods.Volatile) dmg *= 3;
    
    setBossHp(prev => Math.max(0, prev - dmg));
    setDialogue(`The reels aligned. You dealt ${dmg} damage to the machine.`);
    
    if (mods.Volatile) setHp(prev => Math.max(0, prev - 5));
  };

  const pullBloodLever = () => {
    setHp(prev => Math.max(0, prev - 20));
    setCoins(prev => prev + 50);
    setDialogue("A painful bargain. You traded your health for coins.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <header className="flex justify-between items-center pb-8 border-b border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-white">The Devil’s Payline</h1>
        <div className="text-sm font-medium text-slate-400">Floor: {currentFloor.name}</div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-inner">
            <p className="text-lg italic text-slate-300">"Clover": {dialogue}</p>
          </div>

          <div className="flex justify-center gap-4">
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
                      className="w-20 h-20 bg-slate-800 border border-slate-700 flex items-center justify-center rounded-lg"
                    >
                      <SymbolIcon className={`w-10 h-10 ${color}`} />
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={spin} disabled={spinning} className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">Spin Lever</button>
            <button onClick={pullBloodLever} className="px-8 py-3 bg-red-900 text-red-200 rounded-lg font-semibold hover:bg-red-800 transition">Blood Lever</button>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-semibold mb-4">PCB Modding Panel</h2>
            <div className="space-y-3">
              {Object.entries(mods).map(([key, active]) => (
                <button key={key} onClick={() => setMods(prev => ({...prev, [key]: !active}))} className={`w-full text-left px-4 py-2 rounded-lg text-sm ${active ? 'bg-amber-900 text-amber-100' : 'bg-slate-800'}`}>
                  {key} Gate {active ? 'Active' : 'Inactive'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between mb-2"><span>Coins:</span><span className="font-mono tabular-nums text-amber-400">{coins}</span></div>
            <div className="flex justify-between"><span>HP:</span><span className="font-mono tabular-nums text-red-400">{hp}</span></div>
          </div>
        </aside>
      </main>
    </div>
  );
}
