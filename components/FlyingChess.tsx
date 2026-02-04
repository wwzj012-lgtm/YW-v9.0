import React, { useState, useEffect } from 'react';
import { Dice6, Flag, Trophy, Skull, Sparkles, Zap, Heart, X, User } from 'lucide-react';
import { GameSettings, Gender } from '../types';

// 定义组件的 Props 接口
interface FlyingChessProps {
  settings: GameSettings; // 游戏设置
  leader: Gender;         // 当前主导者
  customPunishments?: { discipline: string[]; chance: string[]; fate: string[] }; // 自定义惩罚内容
}

// 飞行棋组件
const FlyingChess: React.FC<FlyingChessProps> = ({ settings, leader, customPunishments }) => {
  // --- State 管理 ---
  const [player1Pos, setPlayer1Pos] = useState(0); // 玩家1（男）的位置
  const [player2Pos, setPlayer2Pos] = useState(0); // 玩家2（女）的位置
  const [currentPlayer, setCurrentPlayer] = useState<Gender>('male'); // 当前行动的玩家
  const [isRolling, setIsRolling] = useState(false); // 是否正在掷骰子
  const [isMoving, setIsMoving] = useState(false);   // 棋子是否正在移动
  const [lastDice, setLastDice] = useState<number | null>(null); // 上一次骰子的点数
  const [modalContent, setModalContent] = useState<{ title: string; desc: string; type: string } | null>(null); // 弹窗内容

  const gridSize = 24; // 棋盘总格子数

  // 从一个数组中随机选择一项的辅助函数
  const pickRandom = (list: string[]) => list[Math.floor(Math.random() * list.length)];

  // 根据格子索引获取格子类型
  const getSquareType = (i: number) => {
    if (i === 0) return 'START';
    if (i === gridSize - 1) return 'END';
    if (i % 6 === 0) return 'FATE';
    if (i % 6 === 3) return 'CHANCE';
    if (i % 2 === 0) return 'PLEASURE';
    return 'DISCIPLINE';
  };

  // 根据格子索引获取格子的显示信息（图标、标签、颜色）
  const getSquareInfo = (i: number) => {
    const type = getSquareType(i);
    switch (type) {
      case 'START': return { icon: <Flag size={14}/>, label: "起点", color: "#ffffff", bgColor: "rgba(255,255,255,0.1)" };
      case 'END': return { icon: <Trophy size={14}/>, label: "终点", color: "#fbbf24", bgColor: "rgba(251,191,36,0.2)" };
      case 'FATE': return { icon: <Skull size={14}/>, label: "契约", color: "#ef4444", bgColor: "rgba(239,68,68,0.2)" };
      case 'CHANCE': return { icon: <Sparkles size={14}/>, label: "密令", color: "#22d3ee", bgColor: "rgba(34,211,238,0.2)" };
      case 'PLEASURE': return { icon: <Zap size={14}/>, label: "极致快感", color: "#facc15", bgColor: "rgba(250,204,21,0.15)" };
      default: return { icon: <Heart size={14}/>, label: "深度调教", color: "#f472b6", bgColor: "rgba(244,114,182,0.15)" };
    }
  };

  // 根据格子类型和玩家角色生成具体的任务内容
  const generateGenderedTask = (type: string, actor: Gender): { title: string; desc: string } => {
    const isDom = actor === leader; // 判断当前行动的玩家是否是主导者

    // '密令' 和 '契约' 类型的卡牌直接从设置或自定义内容中抽取
    if (type === 'CHANCE') {
      const custom = customPunishments?.chance;
      return { title: '密令', desc: custom && custom.length ? pickRandom(custom) : pickRandom(settings.chanceCards) };
    }
    if (type === 'FATE') {
      const custom = customPunishments?.fate;
      return { title: '契约', desc: custom && custom.length ? pickRandom(custom) : pickRandom(settings.fateCards) };
    }

    // 定义不同性别和角色下的任务池
    const pool = {
      PLEASURE: {
        male: isDom 
          ? ["命令她跪在你胯下，用舌头膜拜你的每一寸肌肉。", "让她展示如何用最淫荡的方式含弄你的性器。", "命令她脱掉内裤，用后庭摩擦你的大腿根部。"]
          : ["卑微地跪地请求，让她用脚尖戏弄你的阴囊。", "展示你的屈服，让她在你的身上滴下滚烫的蜡烛。", "在她面前自行扩张，并描述你有多渴望被她填满。"],
        female: isDom
          ? ["命令他像狗一样舔舐你的足尖，直到他满脸口水。", "张开双腿命令他为你服务，直到你感受到潮吹。", "让他为你戴上最强的震动器，并由你掌握开关。"]
          : ["像母狗一样撅起屁股，主动请求他给予你深重的贯穿。", "蒙上眼，在未知的快感中颤栗并大声求饶。", "含住他的手指，表现出你对他精液的渴望。"]
      },
      DISCIPLINE: {
        male: isDom
          ? ["命令她保持M字开腿直到下一轮，期间不准合拢。", "在她身上写下‘肉便器’三个字，宣布她的归属。", "让她讲述自己最羞耻的一次幻想，如果不满意则加重惩罚。"]
          : ["戴上项圈，在接下来的三轮中只能用爬行移动。", "被她用皮鞭抽打屁股十次，每次都要报数并感谢。", "保持高举双手跪立，直到下一次轮到你行动。"],
        female: isDom
          ? ["命令他自扇耳光，直到他承认自己是你的玩物。", "让他用乳头夹夹住自己，并在接下来的一轮保持不动。", "命令他亲吻你的脚底板，并说出对女王的赞美。"]
          : ["穿上极度暴露的衣物，在房间里走一圈并展示你的小穴。", "被他反绑双手，只能用嘴为他完成一件小事。", "忍受他接下来的所有粗暴动作，不准有任何反抗。"]
      }
    };

    const taskType = type === 'PLEASURE' ? 'PLEASURE' : 'DISCIPLINE';
    const customDiscipline = customPunishments?.discipline;
    const tasks = taskType === 'DISCIPLINE' && customDiscipline && customDiscipline.length ? customDiscipline : pool[taskType][actor];
    return {
      title: taskType === 'PLEASURE' ? '极致快感' : '深度调教',
      desc: pickRandom(tasks)
    };
  };

  // 掷骰子函数
  const rollDice = () => {
    if (isRolling || isMoving || modalContent) return;
    setIsRolling(true);
    
    let count = 0;
    const interval = setInterval(() => {
      setLastDice(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 12) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setLastDice(finalValue);
        
        setTimeout(() => {
          setIsRolling(false);
          startMovementSequence(finalValue);
        }, 600);
      }
    }, 60);
  };

  // 棋子逐格移动的序列动画
  const startMovementSequence = async (steps: number) => {
    setIsMoving(true);
    const isMale = currentPlayer === 'male';
    let currentStart = isMale ? player1Pos : player2Pos;
    
    for (let i = 1; i <= steps; i++) {
      const nextPos = Math.min(currentStart + i, gridSize - 1);
      
      if (isMale) setPlayer1Pos(nextPos);
      else setPlayer2Pos(nextPos);
      
      if ('vibrate' in navigator) navigator.vibrate(10);
      
      await new Promise(r => setTimeout(r, 250));
      
      if (nextPos === gridSize - 1) break;
    }

    const finalPos = Math.min(currentStart + steps, gridSize - 1);
    
    if (finalPos > 0 && finalPos < gridSize - 1) { // 终点和起点不触发任务
      const squareType = getSquareType(finalPos);
      const task = generateGenderedTask(squareType, currentPlayer);
      setModalContent({ ...task, type: squareType });
    }

    setIsMoving(false);
    // 只有在没有触发终点的情况下才切换玩家
    if (finalPos < gridSize - 1) {
      setCurrentPlayer(isMale ? 'female' : 'male');
    }
  };

  // --- JSX 渲染 ---
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md pb-20">
      <div className="flex justify-between w-full px-4 items-center">
        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentPlayer === 'male' ? 'opacity-100 scale-125' : 'opacity-20 scale-90'}`}>
          <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse" />
          <span className="text-[10px] font-huge tracking-widest uppercase text-cyan-400/80">MALE</span>
        </div>
        <div className="flex flex-col items-center gap-1">
           <div className="text-[16px] font-huge text-white/5 tracking-[0.3em] uppercase italic">Sensory Board</div>
           {lastDice && <div className={`text-3xl font-huge text-pink-500 transition-all ${isRolling ? 'scale-150 blur-sm' : 'scale-100 animate-bounce'}`}>{lastDice}</div>}
        </div>
        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${currentPlayer === 'female' ? 'opacity-100 scale-125' : 'opacity-20 scale-90'}`}>
          <div className="w-5 h-5 rounded-full bg-pink-500 shadow-[0_0_15px_#ff2d55] animate-pulse" />
          <span className="text-[10px] font-huge tracking-widest uppercase text-pink-400/80">FEMALE</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 w-full aspect-square p-4 glass-card rounded-[3rem] border-white/5 relative">
        {Array.from({ length: gridSize }).map((_, i) => {
          const info = getSquareInfo(i);
          const hasP1 = player1Pos === i;
          const hasP2 = player2Pos === i;

          return (
            <div 
              key={i} 
              className={`relative rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-500 overflow-hidden
                ${info.bgColor} ${hasP1 || hasP2 ? 'border-white/30 scale-[0.98]' : 'border-white/5'}
              `}
            >
              <div className={`transition-all duration-500 ${hasP1 || hasP2 ? 'scale-75 opacity-20' : 'opacity-30'}`}>{info.icon}</div>
              <span className="text-[6px] font-huge tracking-tighter uppercase whitespace-nowrap opacity-40">{info.label}</span>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                {hasP1 && (
                  <div 
                    className={`w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] transition-all duration-300 transform
                      ${isMoving && currentPlayer === 'male' ? 'scale-150 -translate-y-2' : 'scale-100'}
                      ${hasP2 ? '-translate-x-1.5' : ''}
                    `} 
                  />
                )}
                {hasP2 && (
                  <div 
                    className={`w-3.5 h-3.5 rounded-full bg-pink-500 shadow-[0_0_15px_#ff2d55] transition-all duration-300 transform
                      ${isMoving && currentPlayer === 'female' ? 'scale-150 -translate-y-2' : 'scale-100'}
                      ${hasP1 ? 'translate-x-1.5' : ''}
                    `} 
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative group">
        <div className={`absolute -inset-4 bg-pink-500/20 rounded-full blur-2xl transition-all duration-700 ${isRolling || isMoving ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-50'}`}></div>
        <button 
          onClick={rollDice}
          disabled={isRolling || isMoving || !!modalContent}
          className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 tap-active
            ${isRolling ? 'border-pink-500/50 rotate-180 scale-90' : isMoving ? 'border-white/20 opacity-40 scale-95' : 'border-pink-500 bg-pink-500/10 shadow-[0_0_40px_rgba(255,45,85,0.3)]'}
          `}
        >
          <Dice6 size={40} className={isRolling ? 'animate-spin text-pink-300' : 'text-pink-500'} />
        </button>
      </div>

      {modalContent && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/95  animate-in fade-in duration-300">
          <div className="w-full max-w-sm glass-card rounded-[4rem] p-12 flex flex-col items-center text-center gap-6 border-pink-500/40 shadow-[0_0_80px_rgba(255,45,85,0.2)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
             <div className="p-5 bg-white/5 rounded-full mb-2 animate-bounce">
                {getSquareInfo(currentPlayer === 'male' ? player1Pos : player2Pos).icon}
             </div>
             <h2 className="text-2xl font-huge italic tracking-widest text-pink-500 uppercase">{modalContent.title}</h2>
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
             <p className="text-xl font-serif-heavy italic leading-relaxed text-pink-50 drop-shadow-md">
               {modalContent.desc}
             </p>
             <button 
               onClick={() => setModalContent(null)}
               className="mt-6 w-full py-6 bg-white text-black rounded-[2rem] font-huge text-xs tracking-[0.4em] uppercase shadow-2xl hover:bg-pink-50 hover:scale-105 active:scale-95 transition-all"
             >
               奉旨执行
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlyingChess;