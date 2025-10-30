// frontend/src/components/Timer.tsx
import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  onTimeUpdate?: (seconds: number) => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ onTimeUpdate, className = '' }) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<number | null>(null);

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 计时器逻辑
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        if (onTimeUpdate) {
          onTimeUpdate(newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onTimeUpdate]);

  return (
    <span className={`text-xs text-gray-500 ${className}`}>
      用时: {formatTime(timeSpent)}
    </span>
  );
};
