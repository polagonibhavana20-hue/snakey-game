import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Odyssey',
    artist: 'AI Synthwave Bot',
    url: 'https://actions.google.com/sounds/v1/science_fiction/space_engine_loop.ogg',
    cover: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    title: 'Cyber Grid Running',
    artist: 'Neural Network 09',
    url: 'https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg',
    cover: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    title: 'Digital Horizon',
    artist: 'Deep Dream Audio',
    url: 'https://actions.google.com/sounds/v1/water/water_loop.ogg',
    cover: 'https://images.unsplash.com/photo-1493225457224-bca2358891d4?auto=format&fit=crop&w=400&q=80'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="flex flex-col h-full text-white font-mono uppercase bg-transparent p-2">
      <audio
        ref={audioRef}
        src={track.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        loop={track.url.includes('loop')} // just in case it's a short loop
      />

      {/* Header */}
      <h2 className="text-2xl font-bold tracking-widest text-[#00ffff] mb-6 flex items-center gap-3 border-b-2 border-[#ff00ff] pb-2">
        <span className={`w-3 h-3 block bg-[#ff00ff] ${isPlaying ? 'animate-pulse' : ''}`} />
        AUDIO_LINK
      </h2>

      {/* Album Art & Track Info */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="relative w-56 h-56 mb-8 group perspective-1000">
          {/* Glitch frames behind image */}
          <div className={`absolute inset-0 bg-[#00ffff] -translate-x-2 translate-y-2 opacity-50 ${isPlaying ? 'animate-pulse' : ''}`} />
          <div className={`absolute inset-0 bg-[#ff00ff] translate-x-3 -translate-y-2 opacity-50 ${isPlaying ? 'animate-[pulse_1s_infinite]' : ''}`} />
          <img 
            src={track.cover} 
            alt={track.title}
            className={`relative z-10 w-full h-full object-cover filter grayscale contrast-150 border-4 border-black ${isPlaying ? 'glitch-anim' : ''}`}
            referrerPolicy="no-referrer"
          />
          {/* Scanline overlay over image */}
          <div className="absolute inset-0 z-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
        </div>

        <div className="w-full bg-black p-4 border border-[#333]">
          <h3 className="text-xl font-bold tracking-widest text-[#00ffff] mb-2 truncate">
            {track.title}
          </h3>
          <p className="text-[#ff00ff] text-sm tracking-widest truncate pb-2 border-b border-dashed border-[#ff00ff]">
             SRC: {track.artist}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full mt-auto bg-[#0a0a0a] border border-[#222] p-4">
        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#111] mb-6 relative overflow-hidden border border-[#333]">
          <div 
            className="absolute top-0 left-0 h-full bg-[#00ffff] transition-none"
            style={{ width: `${progress}%` }}
          />
          {/* Ticks */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,#000_90%)] bg-[length:10px_100%] pointer-events-none mix-blend-overlay"></div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Main Playback Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={prevTrack}
              className="w-10 h-10 flex items-center justify-center bg-black border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors"
            >
              <SkipBack className="w-5 h-5" fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center bg-black border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-colors"
            >
              {isPlaying ? (
                 <Pause className="w-6 h-6" fill="currentColor" />
              ) : (
                 <Play className="w-6 h-6 ml-1" fill="currentColor" />
              )}
            </button>

            <button 
              onClick={nextTrack}
              className="w-10 h-10 flex items-center justify-center bg-black border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors"
            >
              <SkipForward className="w-5 h-5" fill="currentColor" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center text-[#ff00ff] border border-transparent hover:border-[#ff00ff]">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="relative flex-1 max-w-[100px] h-4 bg-black border border-[#333] flex items-center">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="h-full bg-[#ff00ff] pointer-events-none"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
              {/* Vol Ticks */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,#000_90%)] bg-[length:20%_100%] pointer-events-none z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
