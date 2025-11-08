
'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface HackathonCountdownProps {
  endDate: Date;
}

export function HackathonCountdown({ endDate }: HackathonCountdownProps) {
  const calculateTimeLeft = () => {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!(timeLeft as any)[interval] && (timeLeft as any)[interval] !== 0) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className="font-bold text-lg">{(timeLeft as any)[interval].toString().padStart(2, '0')}</span>
        <span className="text-xs uppercase">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary text-secondary-foreground p-2">
      <Timer className="h-5 w-5" />
      <div className="flex items-center gap-2">
        {timerComponents.length ? timerComponents : <span>Hackathon has ended!</span>}
      </div>
    </div>
  );
}
