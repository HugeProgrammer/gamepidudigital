
import React from 'react';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 5;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-lg font-bold ${isLow ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
          Thời gian: {timeLeft}s
        </span>
      </div>
      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${isLow ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
