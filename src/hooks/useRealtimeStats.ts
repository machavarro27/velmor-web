import { useState, useEffect } from 'react';

interface RealtimeStats {
  onlineUsers: number;
  todayVisits: number;
  todaySales: number;
  lastOrder: string | null;
}

export function useRealtimeStats(): RealtimeStats {
  const [onlineUsers, setOnlineUsers] = useState(24);
  const [lastOrder, setLastOrder] = useState<string | null>('Skyr Fresa 500g - Dosquebradas');

  useEffect(() => {
    const updateOnlineUsers = () => {
      setOnlineUsers(18 + Math.floor(Math.random() * 25));
      setLastOrder('Skyr Fresa 500g - Dosquebradas');
    };
    const interval = setInterval(updateOnlineUsers, 8000);
    return () => clearInterval(interval);
  }, []);

  return {
    onlineUsers,
    todayVisits: 1250,
    todaySales: 86,
    lastOrder,
  };
}
