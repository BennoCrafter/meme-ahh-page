import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from "lucide-react";

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Auto-play with muted for browser compliance
      videoRef.current.play().catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const progress = clickX / rect.width;
      videoRef.current.currentTime = progress * duration;
    }
  };

  const toggleFullscreen = async () => {
    const container = document.querySelector('.video-container') as HTMLElement;
    
    if (!document.fullscreenElement) {
      try {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  }, [isPlaying, controlsTimeout]);

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'KeyM':
        toggleMute();
        break;
      case 'KeyF':
        toggleFullscreen();
        break;
      case 'ArrowLeft':
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
        break;
      case 'ArrowRight':
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
        }
        break;
    }
  }, [duration]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="video-container relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
            <p className="text-white text-lg font-medium">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-center px-6">
            <div className="text-red-500 text-6xl mb-4">⚠</div>
            <h2 className="text-white text-2xl font-semibold mb-2">Video Failed to Load</h2>
            <p className="text-gray-400 text-lg mb-6">Please check your connection and try again</p>
            <button 
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div 
        className="relative w-full h-full group"
        onMouseMove={handleMouseMove}
        onTouchStart={showControlsTemporarily}
      >
        {/* Main Video Element */}
        <video 
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          autoPlay 
          loop 
          muted
          playsInline
          preload="metadata"
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src="/api/video/sample-video.mp4" type="video/mp4" />
          <p className="text-white text-center p-8">Your browser does not support the video tag.</p>
        </video>

        {/* Custom Video Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar Container */}
          <div className="mb-4">
            <div 
              ref={progressBarRef}
              className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer hover:h-3 transition-all duration-200" 
              onClick={handleSeek}
            >
              <div 
                className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Time Display */}
            <div className="flex justify-between items-center mt-2 text-sm text-white/80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause Button */}
              <button 
                onClick={togglePlayPause}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>

              {/* Volume Controls */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMute}
                  className="w-10 h-10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                
                {/* Volume Slider (Hidden on Mobile) */}
                <div className="hidden sm:block">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-2 bg-white/20 rounded-lg appearance-none slider cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Settings Button */}
              <button className="w-10 h-10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200">
                <Settings className="w-5 h-5 text-white" />
              </button>

              {/* Fullscreen Button */}
              <button 
                onClick={toggleFullscreen}
                className="w-10 h-10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-white" />
                ) : (
                  <Maximize className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Click to Play/Pause Overlay */}
        <div 
          className="absolute inset-0 cursor-pointer" 
          onClick={togglePlayPause}
        />

        {/* Center Play Button (when paused) */}
        {!isPlaying && !isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200">
              <Play className="w-8 h-8 text-black ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
