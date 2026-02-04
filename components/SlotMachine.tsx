import React, { useState, useEffect, useRef } from 'react';
import { Option } from '../types.ts';

interface SlotMachineProps {
  options: Option[];
  isSpinning: boolean;
  onFinished: (result: Option) => void;
  title: string;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ options, isSpinning, onFinished, title }) => {
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState('none');
  const timerRef = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const itemHeight = 100;
  const repeatCount = 60;
  const displayOptions = Array(repeatCount).fill(options).flat();

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isSpinning && !isAnimating) {
      setIsAnimating(true);
      setIsLanding(false);
      setSelectedIndex(null);
      
      const randomIndex = Math.floor(Math.random() * options.length);
      // 增加旋转圈数，增强视觉冲击
      const minRolls = 15 * options.length;
      const targetIndex = minRolls + randomIndex;
      const targetOffset = targetIndex * itemHeight;
      
      const duration = 3000 + Math.random() * 1000;
      
      // 使用带回弹的贝塞尔曲线，在结束时会有轻微的过冲再回弹
      setTransitionStyle(`transform ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 1.15)`);
      setOffset(targetOffset);

      timerRef.current = window.setTimeout(() => {
        setIsLanding(true);
        // 结束动画后重置位回到基础索引，保持视觉连贯
        setTransitionStyle('none');
        const finalBaseOffset = randomIndex * itemHeight;
        setOffset(finalBaseOffset);
        
        setIsAnimating(false);
        setSelectedIndex(randomIndex);
        onFinished(options[randomIndex]);
        
        if ('vibrate' in navigator) {
          // 模拟机械停止的两次震动
          navigator.vibrate([20, 30, 10]);
        }
      }, duration + 50);
    }
  }, [isSpinning, options, onFinished, isAnimating]);

  return (
    <div className="flex flex-col items-center gap-3 w-full group">
      <div className={`text-[10px] font-huge tracking-[0.4em] uppercase font-bold transition-all duration-500 ${isSpinning ? 'text-pink-500 animate-pulse' : 'text-white/30'}`}>
        {title}
      </div>
      <div className={`w-full glass-card rounded-[2.5rem] relative border-2 transition-all duration-500 overflow-hidden bg-black/80 h-[100px] shadow-2xl ${isLanding ? 'border-pink-500/50 shadow-[0_0_30px_rgba(255,45,85,0.2)]' : 'border-white/5'}`}>
        {/* 中心指示线 */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-pink-500/40 z-30 shadow-[0_0_15px_#ff2d55]"></div>
        
        {/* 顶部和底部的遮罩阴影，增强立体感 */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black to-transparent z-20"></div>
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent z-20"></div>
        
        <div 
          className="slot-list"
          style={{ 
            transform: `translateY(-${offset}px)`,
            transition: transitionStyle
          }}
        >
          {displayOptions.map((opt, i) => {
            const isWinner = selectedIndex !== null && (i % options.length) === selectedIndex;
            return (
              <div 
                key={i} 
                className={`flex items-center justify-center font-serif-heavy italic px-4 text-center text-sm font-black tracking-wide transition-all duration-300
                  ${isWinner ? 'scale-125 brightness-150' : ''}
                `} 
                style={{ 
                  color: opt.color, 
                  height: `${itemHeight}px`,
                  // 旋转时产生动态模糊
                  filter: isAnimating ? 'blur(2px) grayscale(0.5)' : 'none',
                  opacity: isAnimating ? 0.4 : 1,
                  textShadow: isWinner ? `0 0 20px ${opt.color}` : 'none'
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;