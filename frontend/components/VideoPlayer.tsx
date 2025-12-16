import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, Settings, Maximize, SkipBack, SkipForward, Captions } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  duration?: string; // "MM:SS" format
}

const parseDuration = (dur: string): number => {
    if (!dur) return 0;
    const parts = dur.split(':');
    if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
};

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ title, isPlaying, onTogglePlay, duration = "03:00" }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1); // To restore volume after unmute
  
  const totalDuration = useMemo(() => parseDuration(duration), [duration]);

  // Reset current time when title/video changes
  useEffect(() => {
    setCurrentTime(0);
  }, [title]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          e.preventDefault();
          setCurrentTime(t => Math.min(t + 5, totalDuration));
          break;
        case 'ArrowLeft':
        case 'j':
        case 'J':
          e.preventDefault();
          setCurrentTime(t => Math.max(t - 5, 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(v => Math.min(parseFloat((v + 0.1).toFixed(1)), 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(v => Math.max(parseFloat((v - 0.1).toFixed(1)), 0));
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setVolume(prev => {
              if (prev > 0) {
                  setLastVolume(prev);
                  return 0;
              } else {
                  return lastVolume || 1;
              }
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, totalDuration, lastVolume]);

  // Playback Simulation
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(t => {
          if (t >= totalDuration) {
            onTogglePlay(); // Pause at end
            return t; 
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, onTogglePlay]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    setCurrentTime(Math.floor(percent * totalDuration));
  };

  const toggleMute = () => {
      if (volume > 0) {
          setLastVolume(volume);
          setVolume(0);
      } else {
          setVolume(lastVolume || 1);
      }
  };

  const getVolumeIcon = () => {
      if (volume === 0) return <VolumeX size={20} />;
      if (volume < 0.5) return <Volume1 size={20} />;
      return <Volume2 size={20} />;
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-2xl border border-gray-800 select-none">
      {/* Video Placeholder Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white flex flex-col items-center justify-center opacity-90">
             {/* Abstract GO Logo Visualization */}
            <div className="relative w-48 h-24 mb-4">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl font-black tracking-tighter italic text-white" style={{ fontFamily: 'sans-serif' }}>GO</span>
                 </div>
                 <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-16 h-2 bg-white rounded-full -skew-x-12"></div>
                 <div className="absolute left-[-35px] top-[40%] -translate-y-1/2 w-12 h-2 bg-white rounded-full -skew-x-12"></div>
                 <div className="absolute left-[-35px] top-[60%] -translate-y-1/2 w-12 h-2 bg-white rounded-full -skew-x-12"></div>

                 {/* Particles */}
                 <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full blur-[1px] animate-pulse"></div>
                 <div className="absolute bottom-10 left-10 w-1.5 h-1.5 bg-yellow-600 rounded-full blur-[1px]"></div>
                 <div className="absolute top-5 left-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
            </div>
        </div>
        
        {/* Subtle particle effects layer */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div 
            onClick={onTogglePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 hover:bg-black/30 transition-all z-10"
        >
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Play fill="white" className="ml-1 text-white" size={32} />
            </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        {/* Progress Bar */}
        <div 
            className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer hover:h-1.5 transition-all relative group/progress"
            onClick={handleSeek}
        >
            <div 
                className="absolute left-0 top-0 bottom-0 bg-purple-500 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100"></div>
            </div>
        </div>

        <div className="flex items-center justify-between text-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={onTogglePlay} className="hover:text-white transition-colors" title={isPlaying ? "Pause (k)" : "Play (k)"}>
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            
            <button 
                onClick={() => setCurrentTime(t => Math.max(t - 10, 0))} 
                className="hover:text-white transition-colors"
                title="Rewind 10s (j)"
            >
                <SkipBack size={18} />
            </button>
            <button 
                onClick={() => setCurrentTime(t => Math.min(t + 10, totalDuration))} 
                className="hover:text-white transition-colors"
                title="Skip 10s (l)"
            >
                <SkipForward size={18} />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">{formatTime(totalDuration)}</span>
            </div>
            
            <div className="flex items-center group/volume">
                 <button onClick={toggleMute} className="hover:text-white transition-colors w-8" title="Mute (m)">
                     {getVolumeIcon()}
                 </button>
                 <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 ml-1">
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 h-1 accent-purple-500 cursor-pointer"
                    />
                 </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <button className="hover:text-white transition-colors" title="Captions (c)"><Captions size={20} /></button>
             <button className="hover:text-white transition-colors" title="Settings"><Settings size={20} /></button>
             <button className="hover:text-white transition-colors" title="Fullscreen (f)"><Maximize size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;