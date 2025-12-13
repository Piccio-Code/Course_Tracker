import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, Settings, Maximize, SkipBack, SkipForward, Captions, AlertTriangle } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  videoUrl?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ title, videoUrl, isPlaying, onTogglePlay }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Reset playback when the lesson changes
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setProgress(0);
      setDuration(0);
    }
  }, [videoUrl, title]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      if (isPlaying) onTogglePlay();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, onTogglePlay]);

  const handleTogglePlay = async () => {
    if (!videoUrl || !videoRef.current) return;
    const videoEl = videoRef.current;
    try {
      if (isPlaying) {
        videoEl.pause();
      } else {
        await videoEl.play();
      }
      onTogglePlay();
    } catch (err) {
      console.error('Video playback error:', err);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
    const newTime = ratio * duration;
    video.currentTime = newTime;
    setProgress(ratio * 100);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group shadow-2xl border border-gray-800">
      {videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
          controls={false}
          playsInline
          preload="metadata"
        />
      ) : (
        /* Video Placeholder Content */
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
      )}

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div 
            onClick={handleTogglePlay}
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all ${videoUrl ? 'bg-black/40 hover:bg-black/30' : 'bg-black/60'}`}
        >
            {videoUrl ? (
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <Play fill="white" className="ml-1 text-white" size={32} />
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-yellow-800/80 text-yellow-100 px-4 py-2 rounded-full text-sm">
                <AlertTriangle size={18} />
                <span>No video URL provided</span>
              </div>
            )}
        </div>
      )}

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Bar */}
        <div
          className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer hover:h-1.5 transition-all relative group/progress"
          onClick={handleSeek}
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
            <button onClick={handleTogglePlay} className={`hover:text-white ${!videoUrl ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!videoUrl}>
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button className="hover:text-white"><SkipBack size={18} /></button>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-white">00:00</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">02:58</span>
            </div>
             <button className="hover:text-white"><Volume2 size={20} /></button>
          </div>

          <div className="flex items-center space-x-4">
             <button className="hover:text-white" title="Captions"><Captions size={20} /></button>
             <button className="hover:text-white" title="Settings"><Settings size={20} /></button>
             <button className="hover:text-white" title="Fullscreen"><Maximize size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;