import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, Settings, Maximize, SkipBack, SkipForward, Captions } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  videoUrl?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ title, isPlaying, onTogglePlay, videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const SEEK_SECONDS = 5;
  const VOLUME_STEP = 0.1;

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - SEEK_SECONDS);
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime = Math.min(video.duration || 0, video.currentTime + SEEK_SECONDS);
          break;
        case 'ArrowUp':
          e.preventDefault();
          const newVolumeUp = Math.min(1, video.volume + VOLUME_STEP);
          video.volume = newVolumeUp;
          setVolume(newVolumeUp);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const newVolumeDown = Math.max(0, video.volume - VOLUME_STEP);
          video.volume = newVolumeDown;
          setVolume(newVolumeDown);
          break;
        case ' ':
          e.preventDefault();
          onTogglePlay();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay]);

  // Reload source when URL changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    setCurrentTime(0);
    setDuration(0);
  }, [videoUrl]);

  // Keep play state in sync.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Track video time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleDurationChange = () => setDuration(video.duration);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleDurationChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('durationchange', handleDurationChange);
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    const progressBar = progressRef.current;
    if (!video || !progressBar || duration === 0) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * duration;
  };

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-2xl border border-gray-800 cursor-pointer"
      onClick={onTogglePlay}
    >
      {/* Video Layer */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>

      {/* Placeholder when no video URL */}
      {!videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white flex flex-col items-center justify-center opacity-90">
            <span className="text-lg font-semibold">No video available for this lesson.</span>
            <span className="text-sm text-purple-200 mt-2">{title}</span>
          </div>
        </div>
      )}

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 hover:bg-black/30 transition-all"
        >
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Play fill="white" className="ml-1 text-white" size={32} />
            </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer hover:h-1.5 transition-all relative group/progress"
          onClick={handleProgressClick}
        >
            <div 
              className="absolute left-0 top-0 bottom-0 bg-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
            >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100"></div>
            </div>
        </div>

        <div className="flex items-center justify-between text-gray-200">
          <div className="flex items-center space-x-4">
            <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className="hover:text-white">
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button className="hover:text-white" onClick={(e) => e.stopPropagation()}><SkipBack size={18} /></button>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">{formatTime(duration)}</span>
            </div>
             <button className="hover:text-white" onClick={(e) => e.stopPropagation()}><Volume2 size={20} /></button>
          </div>

          <div className="flex items-center space-x-4">
             <button className="hover:text-white" title="Captions" onClick={(e) => e.stopPropagation()}><Captions size={20} /></button>
             <button className="hover:text-white" title="Settings" onClick={(e) => e.stopPropagation()}><Settings size={20} /></button>
             <button className="hover:text-white" title="Fullscreen" onClick={(e) => e.stopPropagation()}><Maximize size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
