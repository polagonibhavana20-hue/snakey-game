import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Header */}
      <div className="z-10 text-center mb-12 mt-8 relative">
        <h1 
          className="text-6xl md:text-8xl font-black uppercase tracking-widest glitch-text"
          data-text="SYSTEM.FAILURE"
        >
          SYSTEM.FAILURE
        </h1>
        <p className="text-[#ff00ff] text-2xl mt-4 tracking-[0.5em] font-bold">
          [ DATA_STREAM_ERR: {score.toString().padStart(6, '0')} ]
        </p>
      </div>

      {/* Main Game Container */}
      <div className="z-10 flex flex-col xl:flex-row gap-12 items-center xl:items-stretch w-full max-w-6xl">
        <div className="flex-1 flex justify-center xl:justify-end w-full relative">
           {/* Glitch Borders */}
           <div className="absolute -inset-2 bg-[#ff00ff] opacity-20 blur-[2px] z-0 animate-pulse"></div>
           <div className="w-full max-w-[420px] p-1 border-l-[6px] border-l-[#00ffff] border-r-[6px] border-r-[#ff00ff] bg-black shadow-[0_0_20px_rgba(0,255,255,0.4),inset_0_0_30px_rgba(255,0,255,0.2)] z-10 relative">
             <div className="bg-[#050505] p-2 h-full flex flex-col items-center justify-center relative overflow-hidden">
                <SnakeGame onScoreUpdate={setScore} />
             </div>
           </div>
        </div>

        {/* Music Player Side */}
        <div className="flex-1 flex justify-center xl:justify-start w-full relative">
           <div className="w-full max-w-[420px] p-6 border-2 border-[#00ffff] bg-black shadow-[8px_8px_0px_#ff00ff] relative z-10 transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#ff00ff]">
             <div className="absolute top-0 right-0 w-12 h-12 bg-[#ff00ff] [clip-path:polygon(100%_0,0_0,100%_100%)]"></div>
             <div className="absolute top-2 left-2 w-2 h-2 bg-[#00ffff] animate-ping"></div>
             <div className="h-full flex flex-col relative z-20 mt-4">
                <MusicPlayer />
             </div>
           </div>
        </div>
      </div>

      {/* Visual noise/text overlay */}
      <div className="fixed bottom-4 left-4 text-[#ff00ff] opacity-50 text-xs font-mono select-none pointer-events-none">
        <p>INITIALIZING PROTOCOL... OK</p>
        <p>BREACH DETECTED IN SECTOR 7G</p>
        <p>AWAITING USER INPUT...</p>
      </div>
      <div className="fixed bottom-4 right-4 text-[#00ffff] opacity-50 text-xs font-mono select-none pointer-events-none text-right whitespace-pre">
        {`   ___ \n  / _ \\ \n | | | |\n | |_| |\n  \\___/ `}
      </div>
    </div>
  );
}
