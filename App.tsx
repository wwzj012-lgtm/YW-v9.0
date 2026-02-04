
import React, { useState, useEffect } from 'react';
import { History, X, LayoutGrid, Gamepad2, Loader2, Settings, Sparkles, UserCircle, Zap, Terminal, Heart, ArrowRightLeft } from 'lucide-react';
import SlotMachine from './components/SlotMachine.tsx';
import Avatar from './components/Avatar.tsx';
import FlyingChess from './components/FlyingChess.tsx';
import { ChallengeResult, Option, Gender } from './types.ts';
import { POSITIONS, TARGETS, PROPS, INTENSITIES, RULES, MALE_LEAD_TASKS, FEMALE_LEAD_TASKS, COMMON_TASKS, CHANCE_CARDS, FATE_CARDS } from './constants.tsx';
import { generateMidnightDecree } from './services/gemini.ts';

const App: React.FC = () => {
  const [mode, setMode] = useState<'lottery' | 'chess'>('lottery');
  const [leader, setLeader] = useState<Gender>('male');
  const [isSpinning, setIsSpinning] = useState(false);
  const [useAi, setUseAi] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [results, setResults] = useState<Partial<ChallengeResult>>({});
  const [midnightDecree, setMidnightDecree] = useState<string>('');
  const [history, setHistory] = useState<ChallengeResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 被动方（目标方）的性别
  const targetGender: Gender = leader === 'male' ? 'female' : 'male';

  useEffect(() => {
    setIsSpinning(false);
    setIsAiGenerating(false);
    setResults({});
    setMidnightDecree('');
  }, [mode, leader]);

  const startSpin = () => {
    if (isSpinning || isAiGenerating) return;
    setResults({});
    setMidnightDecree('');
    setIsSpinning(true);
    if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
  };

  const generateManualDecree = (res: ChallengeResult, lead: Gender) => {
    const isMale = lead === 'male';
    const sub = isMale ? "女孩" : "公狗";
    const dom = isMale ? "主人" : "女王";
    return `作为你的${dom}，我现在命令你：立刻摆出【${res.position}】，我要狠狠折磨你的【${res.target}】。用【${res.prop}】让你感受【${res.intensity}】。记住：【${res.rule}】。`;
  };

  const handleFinish = async (category: keyof ChallengeResult, option: Option) => {
    setResults(prev => {
      const newRes = { ...prev, [category]: option.label };
      const categories: (keyof ChallengeResult)[] = ['position', 'target', 'prop', 'intensity', 'rule'];
      const isComplete = categories.every(cat => !!newRes[cat]);
      
      if (isComplete && isSpinning) {
        setIsSpinning(false);
        if (useAi) {
          triggerAiGeneration(newRes as ChallengeResult);
        } else {
          setMidnightDecree(generateManualDecree(newRes as ChallengeResult, leader));
        }
        setHistory(prevH => [newRes as ChallengeResult, ...prevH].slice(0, 20));
      }
      return newRes;
    });
  };

  const triggerAiGeneration = async (res: ChallengeResult) => {
    setIsAiGenerating(true);
    const decree = await generateMidnightDecree(res, leader);
    setMidnightDecree(decree);
    setIsAiGenerating(false);
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 text-white overflow-hidden relative selection:bg-pink-500/30">
      <header className="sticky top-0 w-full px-6 py-4 flex justify-between items-center z-50 bg-[#050208]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex flex-col">
          <h1 className="text-xl font-huge tracking-tighter italic bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            欲望<span className="text-white">中枢</span>
          </h1>
          <span className="text-[7px] font-huge tracking-[0.4em] text-white/30 uppercase">EROTIC CORE v9.5</span>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={() => setShowSettings(true)} className="p-2 text-white/40 tap-active hover:text-white"><Settings size={20}/></button>
           <button 
              onClick={() => setLeader(leader === 'male' ? 'female' : 'male')}
              className={`tap-active flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${leader === 'male' ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-pink-500/30 bg-pink-500/5'}`}
            >
              <ArrowRightLeft size={14} className={leader === 'male' ? 'text-cyan-400' : 'text-pink-400'} />
              <span className="text-[8px] font-huge tracking-widest font-bold">
                {leader === 'male' ? 'MALE LEAD' : 'FEMALE LEAD'}
              </span>
            </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-6 z-10 flex flex-col overflow-y-auto hide-scrollbar">
        {mode === 'lottery' ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center">
            <div className="flex justify-between items-center mb-10 w-full px-12 relative">
               <div className={leader === 'male' ? 'ring-2 ring-cyan-500 ring-offset-4 ring-offset-black rounded-3xl p-2' : 'p-2'}>
                 <Avatar gender="male" isLeader={leader === 'male'} />
               </div>
               <div className="flex flex-col items-center gap-1">
                 <Heart className={`${leader === 'male' ? 'text-cyan-400' : 'text-pink-400'} animate-pulse`} fill="currentColor" size={20} />
                 <span className="text-[6px] font-huge text-white/20 uppercase tracking-widest">Targeting {targetGender}</span>
               </div>
               <div className={leader === 'female' ? 'ring-2 ring-pink-500 ring-offset-4 ring-offset-black rounded-3xl p-2' : 'p-2'}>
                 <Avatar gender="female" isLeader={leader === 'female'} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <SlotMachine title="姿势" options={POSITIONS[targetGender]} isSpinning={isSpinning} onFinished={(o) => handleFinish('position', o)} />
              <SlotMachine title="进攻部位" options={TARGETS[targetGender]} isSpinning={isSpinning} onFinished={(o) => handleFinish('target', o)} />
              <SlotMachine title="工具/手段" options={PROPS[targetGender]} isSpinning={isSpinning} onFinished={(o) => handleFinish('prop', o)} />
              <SlotMachine title="蹂躏强度" options={INTENSITIES} isSpinning={isSpinning} onFinished={(o) => handleFinish('intensity', o)} />
              <div className="col-span-2 mt-2">
                <SlotMachine title="绝对禁令" options={RULES} isSpinning={isSpinning} onFinished={(o) => handleFinish('rule', o)} />
              </div>
            </div>

            <button 
              onClick={startSpin}
              disabled={isSpinning || isAiGenerating}
              className={`tap-active mt-10 w-full py-7 rounded-[2.5rem] font-huge text-lg tracking-[0.5em] transition-all border-2 flex items-center justify-center gap-4
                ${isSpinning || isAiGenerating ? 'opacity-20 scale-95' : 'bg-gradient-to-br from-pink-600 to-red-600 text-white border-transparent shadow-[0_10px_40px_rgba(255,45,85,0.4)]'}
              `}
            >
              {isSpinning ? <Loader2 className="animate-spin" size={24} /> : <span>降下旨意</span>}
            </button>

            {(isAiGenerating || midnightDecree) && (
              <div className="mt-10 p-10 glass-card rounded-[3rem] border-pink-500/20 shadow-xl animate-in zoom-in-95 duration-500 w-full mb-10">
                {isAiGenerating ? (
                  <div className="flex flex-col items-center py-4 gap-4">
                    <Terminal className="animate-pulse text-pink-400" size={24} />
                    <span className="text-[9px] font-huge tracking-widest text-pink-400/60 uppercase">编织深渊指令...</span>
                  </div>
                ) : (
                  <p className="text-lg font-serif-heavy italic leading-relaxed text-pink-50 text-center drop-shadow-lg">
                    {midnightDecree}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <FlyingChess settings={{ maleLeadTasks: MALE_LEAD_TASKS, femaleLeadTasks: FEMALE_LEAD_TASKS, commonTasks: COMMON_TASKS, chanceCards: CHANCE_CARDS, fateCards: FATE_CARDS }} leader={leader} />
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 h-20 glass-card border-t border-white/5 flex justify-around items-center px-6 z-[100] bg-black/80">
        <NavBtn icon={<LayoutGrid/>} label="挑战" active={mode==='lottery'} onClick={()=>setMode('lottery')}/>
        <NavBtn icon={<Gamepad2/>} label="棋盘" active={mode==='chess'} onClick={()=>setMode('chess')}/>
        <NavBtn icon={<History/>} label="存档" active={showHistory} onClick={()=>setShowHistory(true)}/>
      </nav>

      {showSettings && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm glass-card rounded-[3rem] p-10 flex flex-col gap-6 border-white/10">
            <div className="flex justify-between items-center">
               <h3 className="font-huge text-xs uppercase tracking-widest text-white/40">核心设置</h3>
               <button onClick={()=>setShowSettings(false)} className="p-2"><X size={20}/></button>
            </div>
            <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl">
               <span className="text-sm font-bold">AI 智能话术</span>
               <button onClick={() => setUseAi(!useAi)} className={`w-14 h-7 rounded-full transition-all relative ${useAi ? 'bg-pink-600' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${useAi ? 'left-8' : 'left-1'}`}></div>
               </button>
            </div>
            <button onClick={()=>setShowSettings(false)} className="w-full py-5 bg-white text-black rounded-3xl font-huge text-xs tracking-widest uppercase shadow-xl">确认更改</button>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex flex-col animate-in slide-in-from-right duration-500">
           <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-huge text-sm italic tracking-widest uppercase text-pink-500">欲望存档</h2>
              <button onClick={()=>setShowHistory(false)} className="p-2"><X size={24}/></button>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/20 font-huge text-[10px] uppercase">暂无互动记录</div>
              ) : history.map((h, i) => (
                <div key={i} className="p-6 glass-card rounded-3xl border-l-2 border-pink-500">
                  <div className="text-sm font-bold mb-2">{h.position} · {h.target}</div>
                  <div className="text-[9px] font-huge text-white/30 uppercase flex flex-wrap gap-2">
                    <span className="bg-white/5 px-2 py-1 rounded-lg">{h.prop}</span>
                    <span className="bg-white/5 px-2 py-1 rounded-lg">{h.intensity}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

const NavBtn = ({icon, label, active, onClick}: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-pink-500 scale-110' : 'text-white/20'}`}>
    {React.cloneElement(icon as React.ReactElement, { size: 24 } as any)}
    <span className="text-[9px] font-huge uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
