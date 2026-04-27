import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400; // Fixed canvas size, scales via CSS
const INITIAL_SPEED = 150; // ms

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 1, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setScore(0);
    onScoreUpdate(0);
    setIsGameOver(false);
    setIsPaused(false);
    spawnFood(initialSnake);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOver) {
        resetGame();
        return;
      }
      
      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setNextDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver, isPaused]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y
        };

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Ensure current direction is updated to next so we can't double back quickly
        setDirection(nextDirection);

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const ns = s + 10;
            onScoreUpdate(ns);
            return ns;
          });
          spawnFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(INITIAL_SPEED - Math.floor(score / 50) * 10, 50); // Speed up as score increases
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [nextDirection, isPaused, isGameOver, food, score, onScoreUpdate, spawnFood]);

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid with jarring colors
    ctx.strokeStyle = '#00ffff';
    ctx.globalAlpha = 0.1;
    const cellSize = CANVAS_SIZE / GRID_SIZE;
    for (let i = 0; i <= CANVAS_SIZE; i += cellSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Glitch effect randomly
    if (Math.random() > 0.95 && !isPaused && !isGameOver) {
      ctx.fillStyle = Math.random() > 0.5 ? '#ff00ff' : '#00ffff';
      ctx.globalAlpha = 0.5;
      ctx.fillRect(Math.random() * CANVAS_SIZE, Math.random() * CANVAS_SIZE, 50, 10);
      ctx.globalAlpha = 1.0;
    }

    // Draw snake (Cyan/Magenta alternate or raw blocks text)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : (index % 2 === 0 ? '#00ffff' : '#ff00ff');
      
      // Glitch position slightly on snake
      let drawX = segment.x * cellSize;
      let drawY = segment.y * cellSize;
      
      if (Math.random() > 0.98) {
        drawX += (Math.random() - 0.5) * 5;
      }
      
      ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
    });

    // Draw food (Corrupted data block)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
    
    // Core detail in food
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(food.x * cellSize + 4, food.y * cellSize + 4, cellSize - 8, cellSize - 8);

  }, [snake, food, isPaused, isGameOver]);

  return (
    <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center bg-[#050505] p-1 border border-[#333]">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="w-full h-full bg-[#050505] relative z-10"
      />
      
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.2)__0%,rgba(0,0,0,0)__100%)]"></div>
      </div>
      
      {(isGameOver || isPaused) && (
        <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full h-1 bg-[#ff00ff] mb-6 animate-pulse"></div>
          <h2 className={`text-4xl md:text-5xl font-bold tracking-widest text-[#00ffff] mb-4 ${isGameOver ? 'glitch-text' : ''}`} data-text={isGameOver ? 'FATAL_ERROR' : 'SYS_IDLE'}>
            {isGameOver ? 'FATAL_ERROR' : 'SYS_IDLE'}
          </h2>
          <div className="w-full flex flex-col items-center gap-4 mt-4">
             <button
               onClick={resetGame}
               className="group relative px-6 py-3 bg-black border-2 border-[#ff00ff] text-[#ff00ff] font-bold uppercase tracking-widest text-lg hover:bg-[#ff00ff] hover:text-black transition-colors"
             >
               <span className="relative z-10">{isGameOver ? 'REBOOT_SEQ' : 'INIT_EXEC'}</span>
               <div className="absolute inset-0 bg-[#00ffff] -translate-x-2 -translate-y-2 mix-blend-difference group-hover:translate-x-0 group-hover:translate-y-0 transition-transform pointer-events-none -z-10"></div>
             </button>
          </div>
          <div className="mt-8 text-xs text-[#00ffff] opacity-60 tracking-widest">
            {isGameOver ? 'CONNECTION TERMINATED.' : "AWAITING KEYPRESS 'SPACE'"}
          </div>
          <div className="w-full h-1 bg-[#00ffff] mt-6 animate-pulse" style={{ animationDelay: '0.5s'}}></div>
        </div>
      )}
    </div>
  );
}
