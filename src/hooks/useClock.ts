import { useState, useEffect } from 'react';

interface ClockState {
  time: string;
  date: string;
  dayName: string;
}

export function useClock(): ClockState {
  const [clock, setClock] = useState<ClockState>({
    time: '',
    date: '',
    dayName: '',
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      const time = now.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const date = now.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const dayName = now.toLocaleDateString('es-CO', {
        weekday: 'long',
      });

      setClock({ time, date, dayName });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return clock;
}
