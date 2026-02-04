
import React from 'react';
import { Heart, Crown } from 'lucide-react';
import { Gender } from '../types.ts';

interface AvatarProps {
  gender: Gender;
  isLeader: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ gender, isLeader }) => {
  const isMale = gender === 'male';
  
  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-700 ${isLeader ? 'scale-100' : 'opacity-20 scale-90'}`}>
      <div className={`relative w-16 h-16 rounded-[1.2rem] border-2 overflow-hidden bg-black/60 transition-all ${
        isLeader 
          ? (isMale ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]') 
          : 'border-white/5'
      }`}>
        <div className={`absolute inset-0 opacity-20 ${isMale ? 'bg-cyan-900' : 'bg-pink-900'}`}></div>
        
        <div className="absolute top-1 right-1">
           {isMale ? <Crown className="w-3 h-3 text-cyan-400" /> : <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <svg viewBox="0 0 100 100" className={`w-full h-full fill-current ${isMale ? 'text-cyan-400' : 'text-pink-400'}`}>
            {isMale ? (
              <g><circle cx="50" cy="35" r="14" /><path d="M25 65 Q50 60 75 65 L82 95 L18 95 Z" /></g>
            ) : (
              <g><circle cx="50" cy="38" r="12" /><path d="M30 70 Q50 65 70 70 L75 95 L25 95 Z" /></g>
            )}
          </svg>
        </div>
      </div>
      <span className={`text-[7px] font-huge tracking-[0.2em] ${isLeader ? (isMale ? 'text-cyan-500' : 'text-pink-500') : 'text-white/20'}`}>
        {isMale ? 'DOMINANT' : 'SUBMISSIVE'}
      </span>
    </div>
  );
};

export default Avatar;
