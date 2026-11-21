import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAmbientMusicReturn {
  isPlaying: boolean;
  toggle: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export function useAmbientMusic(): UseAmbientMusicReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio('/nordic-ambient.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
      }
    };

    // Initialize on first click anywhere
    document.addEventListener('click', initAudio, { once: true });
    
    return () => {
      document.removeEventListener('click', initAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggle = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/nordic-ambient.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, will need user interaction
      });
      setIsPlaying(true);
    }
  }, [isPlaying, volume]);

  return {
    isPlaying,
    toggle,
    volume,
    setVolume,
  };
}
