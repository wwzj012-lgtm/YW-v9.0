import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Option } from '../types';

interface WheelProps {
  options: Option[];
  onFinished: (result: Option) => void;
  isSpinning: boolean;
  size?: number;
}

const Wheel: React.FC<WheelProps> = ({ options, onFinished, isSpinning, size = 300 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinSpeed = useRef(0);
  const currentAngle = useRef(0);
  const requestRef = useRef<number | undefined>(undefined);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;
    const sliceAngle = (2 * Math.PI) / options.length;

    ctx.clearRect(0, 0, size, size);

    // 绘制外部金属环
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 4;
    ctx.stroke();

    options.forEach((opt, i) => {
      const startAngle = currentAngle.current + i * sliceAngle;
      
      // 磨砂黑底色
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.fillStyle = i % 2 === 0 ? '#0a0a0a' : '#111111';
      ctx.fill();
      
      // 文字
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)';
      ctx.font = 'bold 12px "Space Grotesk"';
      ctx.fillText(opt.label.split(' ')[0], radius - 20, 5);
      ctx.restore();
    });

    // 中心核心光芒
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
    gradient.addColorStop(0, '#ff004c');
    gradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 指针
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX - 10, 20);
    ctx.lineTo(centerX + 10, 20);
    ctx.closePath();
    ctx.fillStyle = '#ff004c';
    ctx.fill();
  }, [options, size]);

  const animate = useCallback(() => {
    if (spinSpeed.current > 0) {
      currentAngle.current += spinSpeed.current;
      spinSpeed.current *= 0.993;

      if (spinSpeed.current < 0.001) {
        spinSpeed.current = 0;
        const sliceAngle = (2 * Math.PI) / options.length;
        const normalizedAngle = (1.5 * Math.PI - (currentAngle.current % (2 * Math.PI))) % (2 * Math.PI);
        let index = Math.floor((normalizedAngle < 0 ? normalizedAngle + 2 * Math.PI : normalizedAngle) / sliceAngle);
        index = index % options.length;
        onFinished(options[index]);
      }
    }
    draw();
    requestRef.current = requestAnimationFrame(animate);
  }, [draw, onFinished, options]);

  useEffect(() => {
    if (isSpinning && spinSpeed.current === 0) {
      spinSpeed.current = 0.5 + Math.random() * 0.5;
    }
  }, [isSpinning]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <div className="relative inline-block transition-transform hover:scale-105 duration-500">
      <canvas ref={canvasRef} width={size} height={size} />
    </div>
  );
};

export default Wheel;