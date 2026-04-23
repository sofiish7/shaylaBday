/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  MapPin, 
  Star, 
  Heart, 
  ArrowRight, 
  PartyPopper, 
  Cake as CakeIcon,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- TYPES ---
type Page = 'intro' | 'earth-exit' | 'countdown' | 'celebrate' | 'game' | 'galaxy' | 'interactive' | 'final';

// --- UTILS ---
const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 mins in ms
const TARGET_TIME = new Date(2026, 4, 15, 0, 0, 0).getTime(); // May 15, 2026 IST Target

const getISTTime = () => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  return utc + IST_OFFSET;
};

// --- COMPONENTS ---

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 400 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random()
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        
        // Twinkle
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 space-bg-gradient z-0">
      <div className="nebula top-1/4 left-1/4" />
      <div className="nebula bottom-1/4 right-1/4" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)' }} />
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

const HUDStats = ({ score }: { score: number }) => (
  <div className="absolute top-8 right-8 z-50">
    <div className="hud-border px-4 py-2 flex items-center gap-2">
      <Star className="w-4 h-4 text-star-gold fill-current" />
      <span className="text-sm font-bold font-mono tracking-widest">{score} / 5 STARS CAUGHT</span>
    </div>
  </div>
);

const CelebrationHUD = () => null;

const ProgressHUD = ({ page }: { page: Page }) => {
  const steps: Record<Page, number> = {
    'intro': 10,
    'earth-exit': 20,
    'countdown': 40,
    'celebrate': 60,
    'game': 70,
    'galaxy': 85,
    'interactive': 95,
    'final': 100
  };

  return (
    <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-50">
      <div className="hud-border p-4 min-w-[200px]">
        <p className="text-[10px] uppercase tracking-tighter text-nebula-indigo mb-1">Adventure Progress</p>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: `${steps[page]}%` }}
            className="h-full bg-nebula-indigo" 
          />
        </div>
      </div>
      <div className="hud-border p-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-[10px] text-slate-300 font-mono tracking-tighter uppercase">HAPPINESS_METER: 99.9999%</span>
      </div>
    </div>
  );
};

const AstronautCharacter = ({ gender, hasSpectacles = false }: { gender: 'girl' | 'boy', hasSpectacles?: boolean }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
    {/* Head */}
    <circle cx="50" cy="45" r="35" fill="#ffdbac" />
    
    {/* Hair for Girl */}
    {gender === 'girl' && (
      <>
        <path d="M15 45 Q15 10 50 10 Q85 10 85 45" fill="#4b2c20" />
        <circle cx="20" cy="40" r="10" fill="#4b2c20" />
        <circle cx="80" cy="40" r="10" fill="#4b2c20" />
      </>
    )}
    {/* Hair for Boy */}
    {gender === 'boy' && (
      <path d="M15 45 Q15 15 50 15 Q85 15 85 45" fill="#4b2c20" />
      <circle cx="20" cy="40" r="10" fill="#4b2c20" />
    )}

    {/* Eyes */}
    <circle cx="35" cy="45" r="4" fill="#000" />
    <circle cx="65" cy="45" r="4" fill="#000" />
    <circle cx="37" cy="43" r="1.5" fill="#fff" />
    <circle cx="67" cy="43" r="1.5" fill="#fff" />
    
    {/* Spectacles for Shohaib */}
    {hasSpectacles && (
      <g stroke="#000" fill="none" strokeWidth="2">
        <circle cx="35" cy="45" r="12" />
        <circle cx="65" cy="45" r="12" />
        <line x1="47" y1="45" x2="53" y2="45" />
      </g>
    )}
    
    {/* Smile */}
    <path d="M40 65 Q50 75 60 65" stroke="#000" fill="none" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Body */}
    <path d="M25 80 Q50 70 75 80 L80 100 L20 100 Z" fill={gender === 'girl' ? '#ff69b4' : '#4169e1'} />
  </svg>
);

const CosmicCapsule = ({ className }: { className?: string }) => (
  <motion.div 
    className={`relative ${className}`}
    animate={{ y: [0, -15, 0], rotate: [-1, 1, -1] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 200 140" className="w-full h-full drop-shadow-[0_20px_50px_rgba(255,100,0,0.3)]">
      {/* Ship Bottom Glow */}
      <defs>
        <radialGradient id="engineGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00008b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00008b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="115" rx="50" ry="15" fill="url(#engineGlow)" />

      {/* Main Saucer Body */}
      <path d="M10 80 Q10 50 100 50 Q190 50 190 80 L170 110 Q100 125 30 110 Z" fill="#ff5722" stroke="#bf360c" strokeWidth="2" />
      
      {/* Saucer Lights */}
      <circle cx="35" cy="85" r="6" fill="#fff" opacity="0.9" />
      <circle cx="65" cy="95" r="7" fill="#fff" opacity="0.9" />
      <circle cx="100" cy="100" r="8" fill="#fff" opacity="0.9" />
      <circle cx="135" cy="95" r="7" fill="#fff" opacity="0.9" />
      <circle cx="165" cy="85" r="6" fill="#fff" opacity="0.9" />

      {/* Glass Dome */}
      <path d="M50 55 Q50 5 100 5 Q150 5 150 55" fill="rgba(135, 206, 250, 0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
      
      {/* Characters inside dome */}
      <foreignObject x="65" y="15" width="35" height="40">
        <AstronautCharacter gender="girl" />
      </foreignObject>
      <foreignObject x="100" y="15" width="35" height="40">
        <AstronautCharacter gender="boy" hasSpectacles={true} />
      </foreignObject>
      
      {/* Ship Highlights */}
      <path d="M110 55 Q130 55 140 70" stroke="rgba(255,255,255,0.4)" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  </motion.div>
);
const ShootingStar = () => {
  const [active, setActive] = useState(false);
  const [style, setStyle] = useState({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActive(true);
      const top = Math.random() * 50;
      const left = Math.random() * 80;
      const duration = Math.random() * 1 + 0.5;
      setStyle({
        top: `${top}%`,
        left: `${left}%`,
        animationDuration: `${duration}s`
      });
      
      setTimeout(() => setActive(false), duration * 1000);
    }, Math.random() * 10000 + 5000);

    return () => clearTimeout(timeout);
  }, [active]);

  if (!active) return null;

  return (
    <div 
      className="absolute w-[2px] h-[50px] bg-gradient-to-t from-white to-transparent rotate-[135deg] pointer-events-none z-10"
      style={style}
    />
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('intro');
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [isBirthday, setIsBirthday] = useState(false);
  const [decorations, setDecorations] = useState<{ id: number; type: string; x: number; y: number; color: string; scale: number }[]>([]);
  const [gameScore, setGameScore] = useState(0);
  const [gameStars, setGameStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const [interactiveStars, setInteractiveStars] = useState<{ x: number; y: number; id: number }[]>([]);
  const [clickCount, setClickCount] = useState(0);

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // --- LOGIC ---

  useEffect(() => {
    if (currentPage === 'countdown') {
      const update = () => {
        const now = getISTTime();
        const diff = TARGET_TIME - now;
        
        if (diff <= 0) {
          setIsBirthday(true);
          setTimeLeft(null);
          if (countdownInterval.current) clearInterval(countdownInterval.current);
          return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ d, h, m, s });
      };

      update();
      countdownInterval.current = setInterval(update, 1000);
      return () => { if (countdownInterval.current) clearInterval(countdownInterval.current); };
    }
  }, [currentPage]);

  const triggerCelebrate = useCallback(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  useEffect(() => {
    if (currentPage === 'earth-exit') {
      const timer = setTimeout(() => {
        setCurrentPage('countdown');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const addDecoration = () => {
    const types = ['balloon', 'heart', 'star', 'flair', 'ribbon'];
    const colors = ['#ff69b4', '#4169e1', '#ffff00', '#00ff00', '#ff4500', '#9370db', '#00ffff'];
    
    const newItems = Array.from({ length: 8 }, () => ({
      id: Math.random(),
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: 0.5 + Math.random() * 1.5
    }));
    
    setDecorations(prev => [...prev, ...newItems]);
  };

  const spawnGameStar = useCallback(() => {
    const id = Date.now();
    setGameStars(prev => [...prev, {
      id,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    }]);
    
    setTimeout(() => {
      setGameStars(prev => prev.filter(s => s.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    if (currentPage === 'game' && gameScore < 5) {
      const timer = setInterval(spawnGameStar, 1200);
      return () => clearInterval(timer);
    }
  }, [currentPage, gameScore, spawnGameStar]);

  const handleGameClick = (id: number) => {
    setGameScore(prev => prev + 1);
    setGameStars(prev => prev.filter(s => s.id !== id));
  };

  const handleInteractiveClick = (e: React.MouseEvent) => {
    if (currentPage === 'interactive') {
      const newStar = { x: e.clientX, y: e.clientY, id: Date.now() };
      setInteractiveStars(prev => [...prev, newStar]);
      setClickCount(prev => prev + 1);
    }
  };

  // --- RENDER HELPERS ---

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden" onClick={handleInteractiveClick}>
      <Background />
      <ShootingStar />

      <ProgressHUD page={currentPage} />
      <CelebrationHUD />
      {currentPage === 'game' && <HUDStats score={gameScore} />}

      {/* DEV BYPASS TOGGLE */}
      <div className="fixed top-4 left-4 z-[9999] opacity-10 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsBirthday(!isBirthday)}
          className="text-[10px] font-mono bg-white/10 border border-white/20 px-2 py-1 rounded text-white/50 hover:bg-nebula-indigo/20 hover:text-white"
        >
          {isBirthday ? "[LOCK_BIRTHDAY_MODE]" : "[BYPASS_TO_BIRTHDAY]"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* PAGE 1: INTRO */}
        {currentPage === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 1 }}
            className="z-10 flex flex-col items-center gap-12 text-center px-4"
          >
            <div className="relative">
              <CosmicCapsule className="w-64 h-64 md:w-80 md:h-80" />
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-slate-900 shadow-xl p-3 rounded-full border border-indigo-400/30"
              >
                <Heart className="text-pink-400 w-6 h-6 animate-pulse" />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-3xl md:text-5xl font-serif italic text-white/90">
                Heyy My Shaylaa 🥰🥰, I have a little surprise for you
              </h1>
              <p className="text-xs uppercase tracking-[0.5em] text-nebula-indigo font-sans">
                Initiating Cosmic Voyage
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('earth-exit')}
              className="btn-immersive group px-12"
            >
              <div className="flex items-center gap-3">
                Show me
                <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4" />
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* PAGE 2: EARTH EXIT ANIMATION */}
        {currentPage === 'earth-exit' && (
          <motion.div
            key="earth-exit"
            className="z-10 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 1, y: 0 }}
              animate={{ scale: 2, y: -200, opacity: 0 }}
              transition={{ duration: 3, ease: "easeIn" }}
            >
              <CosmicCapsule className="w-80 h-80" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, delay: 0.5 }}
              className="mt-12 space-y-4"
            >
              <Rocket className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
              <p className="text-xl font-mono tracking-widest text-indigo-300 uppercase">Warp Drive Active...</p>
            </motion.div>
          </motion.div>
        )}

        {/* PAGE 3: COUNTDOWN / BIRTHDAY REVEAL */}
        {currentPage === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 flex flex-col items-center gap-12 text-center"
          >
            {!isBirthday ? (
              <>
                <h2 className="text-3xl md:text-5xl font-serif italic">Your Special Day Starts In...</h2>
                <div className="flex gap-4 md:gap-8">
                  {timeLeft && Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center gap-2">
                      <div className="glass-card w-20 h-24 md:w-28 md:h-32 flex items-center justify-center text-4xl md:text-5xl font-bold font-mono">
                        {String(value).padStart(2, '0')}
                      </div>
                      <span className="uppercase text-xs tracking-widest text-white/40">{unit === 'd' ? 'Days' : unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-white/40 flex items-center gap-2 animate-pulse">
                  <Star className="w-4 h-4 fill-current" />
                  <span>Indian Standard Time Sync</span>
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="relative">
                   <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                   >
                     <CakeIcon className="w-32 h-32 md:w-48 md:h-48 text-star-gold drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
                   </motion.div>
                   <motion.div
                    animate={{ opacity: [0, 1, 0], y: [-20, -40] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2"
                   >
                     <Sparkles className="w-6 h-6 text-yellow-300" />
                     <Sparkles className="w-6 h-6 text-yellow-300" />
                   </motion.div>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-serif italic text-star-gold drop-shadow-lg">Happiest Birthday Shohaib</h1>
                  <p className="text-xl md:text-2xl text-white/60">May your journey through life be as vast and beautiful as the cosmos.</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                   <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addDecoration}
                    className="mt-8 btn-immersive py-3 px-8 text-xs tracking-[0.2em]"
                  >
                    <div className="flex items-center gap-2">
                       <PartyPopper className="w-4 h-4" />
                       DECORATE_SYSTEM
                    </div>
                  </motion.button>
                  
                  {decorations.length >= 5 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setCurrentPage('game')}
                      className="px-12 py-4 bg-nebula-indigo text-white rounded-full font-bold text-sm uppercase tracking-[0.3em] flex items-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                    >
                      Init Celebration Sequence
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>

                {/* Decoration Canvas Overlay */}
                <div className="fixed inset-0 pointer-events-none z-0">
                  {decorations.map((dec) => (
                    <motion.div
                      key={dec.id}
                      initial={{ y: '110vh', x: `${dec.x}vw`, opacity: 0 }}
                      animate={{ y: '-20vh', opacity: [0, 1, 1, 0] }}
                      transition={{ 
                        duration: 8 + Math.random() * 10, 
                        ease: "linear",
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                      className="absolute"
                      style={{ scale: dec.scale }}
                    >
                      {dec.type === 'balloon' && (
                        <div className="w-16 h-20 rounded-full flex flex-col items-center" style={{ backgroundColor: dec.color, opacity: 0.7 }}>
                          <div className="w-[2px] h-12 bg-white/30 absolute top-20" />
                        </div>
                      )}
                      {dec.type === 'heart' && <Heart className="w-10 h-10" style={{ color: dec.color, fill: dec.color, opacity: 0.6 }} />}
                      {dec.type === 'star' && <Star className="w-8 h-8" style={{ color: dec.color, fill: dec.color, opacity: 0.6 }} />}
                      {dec.type === 'flair' && <Sparkles className="w-12 h-12" style={{ color: dec.color, opacity: 0.5 }} />}
                      {dec.type === 'ribbon' && (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                          className="w-1 h-20" style={{ backgroundColor: dec.color, opacity: 0.4 }} 
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* PAGE 4: STAR CATCHING GAME */}
        {currentPage === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 flex flex-col items-center gap-12 w-full max-w-4xl px-4"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif italic text-white/80">The Universe wants to gift you stars</h2>
              <p className="text-white/40 uppercase tracking-[0.2em]">Catch 5 shooting stars to continue</p>
            </div>

            <div className="w-full h-8 bg-white/5 border border-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                animate={{ width: `${(gameScore / 5) * 100}%` }}
                className="h-full bg-gradient-to-r from-nebula-purple to-pink-500 shadow-[0_0_20px_rgba(192,38,211,0.5)]"
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tracking-widest">{gameScore} / 5</span>
            </div>

            <div className="relative w-full aspect-video glass-card overflow-hidden border border-white/20">
              <AnimatePresence>
                {gameStars.map((star) => (
                  <motion.button
                    key={star.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    onClick={() => handleGameClick(star.id)}
                    style={{ left: `${star.x}%`, top: `${star.y}%` }}
                    className="absolute p-4 text-star-gold hover:text-white transition-colors drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                  >
                    <Star className="w-10 h-10 fill-current" />
                  </motion.button>
                ))}
              </AnimatePresence>
              
              {gameScore >= 5 && (
                 <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="absolute inset-0 bg-space-black/80 flex items-center justify-center flex-col gap-6"
                 >
                    <h3 className="text-4xl font-serif text-star-gold">Star Master!</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage('galaxy')}
                      className="px-10 py-4 bg-white text-space-black rounded-full font-bold text-xl flex items-center gap-3 animate-pulse"
                    >
                      You Win
                      <ArrowRight />
                    </motion.button>
                 </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* PAGE 5: GALAXY OF COMPLIMENTS */}
        {currentPage === 'galaxy' && (
          <motion.div
            key="galaxy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 flex flex-col items-center justify-center w-full min-h-screen px-4"
          >
            
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl md:text-3xl font-light tracking-widest text-center mb-12 max-w-2xl uppercase text-slate-100"
            >
              "You are the most precious in the whole Universe"
            </motion.h2>

            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
              {/* Central Galaxy Star */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="z-20 galaxy-core"
              >
                <span className="text-nebula-indigo text-3xl">❤</span>
              </motion.div>

              {/* Orbiting Items */}
              {[
                { type: 'heart', text: 'Purest Soul ✨' },
                { type: 'star', text: 'Your smile lights up my world' },
                { type: 'heart', text: 'Endless Kindness' },
                { type: 'star', text: 'A True Star' },
                { type: 'heart', text: 'My Whole Universe 🌌' },
                { type: 'star', text: 'Brilliant Mind 🧠' },
              ].map((item, i) => (
                <OrbitItem key={i} index={i} total={6} radius={window.innerWidth < 768 ? 130 : 220} delay={i * 0.5}>
                  <ComplimentBubble type={item.type as 'heart' | 'star'} text={item.text} />
                </OrbitItem>
              ))}

              {/* Orbital Rings */}
              <div className="absolute w-[260px] h-[260px] md:w-[440px] md:h-[440px] border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute w-[360px] h-[360px] md:w-[560px] md:h-[560px] border border-white/5 rounded-full pointer-events-none" />
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              onClick={() => setCurrentPage('interactive')}
              className="mt-20 btn-immersive"
            >
              Continue Adventure
            </motion.button>
          </motion.div>
        )}

        {/* PAGE 6: INTERACTIVE TEXT */}
        {currentPage === 'interactive' && (
          <motion.div
            key="interactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 flex flex-col items-center justify-center text-center px-4"
          >
             <div className="space-y-6">
                <motion.h2 
                  key={clickCount}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-4xl md:text-7xl font-serif italic"
                >
                  {clickCount === 0 && "You make everything"}
                  {clickCount === 1 && "Bright"}
                  {clickCount === 2 && "Just like"}
                  {clickCount >= 3 && "Stars in the universe"}
                </motion.h2>
                
                {clickCount < 3 && (
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center gap-2 text-white/40"
                  >
                    <PartyPopper className="w-8 h-8" />
                    <span className="uppercase tracking-[0.3em] text-xs">Click Anywhere</span>
                  </motion.div>
                )}
             </div>

             {/* Dynamic Stars */}
             {interactiveStars.map(star => (
               <motion.div
                key={star.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                style={{ position: 'fixed', left: star.x, top: star.y }}
                className="pointer-events-none text-star-gold"
               >
                 <Star className="w-8 h-8 fill-current drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
               </motion.div>
             ))}

             {clickCount >= 3 && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setCurrentPage('final')}
                  className="mt-20 px-12 py-4 bg-white text-space-black rounded-full font-bold text-xl flex items-center gap-3 transition-all shadow-xl"
                >
                  One final thing
                  <ArrowRight />
                </motion.button>
             )}
          </motion.div>
        )}

        {/* PAGE 7: FINAL SCROLL MESSAGE */}
        {currentPage === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 w-full max-w-2xl px-6 py-20 min-h-screen flex flex-col items-center"
          >
            <div className="glass-card w-full p-8 md:p-12 space-y-12 mb-20 overflow-y-auto max-h-[80vh] scrollbar-hide">
              <h1 className="text-4xl md:text-5xl font-serif italic text-star-gold border-b border-white/10 pb-6">To Shohaib,</h1>
              
              <div className="space-y-8 text-lg md:text-xl font-sans text-white/80 leading-relaxed">
                <p>
                  As you celebrate another journey around the sun, I wanted to create something as vast and beautiful as the soul I see in you. 
                  The stars above have watched over humanity for eons, but none of them shine quite as brightly as you do in my world.
                </p>
                <div className="flex justify-center py-4">
                  <Heart className="text-pink-500 w-12 h-12 fill-current animate-pulse" />
                </div>
                <p>
                  You are the kind of person who makes the universe feel small because your warmth and presence are so immense. 
                  May this year bring you as much joy as the infinite expanses of the galaxy.
                </p>
                <p className="italic text-white/40">
                  (Scroll down for your adventure continues...)
                </p>
                <p>
                  [Insert your long scroll message here later]
                  <br /><br />
                  Keep shining, keep dreaming, and never forget that you are made of stardust and magic.
                </p>
                <p className="text-right font-serif italic text-white/40">— Yours Always</p>
              </div>

              <div className="flex flex-col items-center gap-4 text-white/20 pt-10">
                <ChevronDown className="animate-bounce" />
                <span className="text-xs uppercase tracking-widest">End of the Universe</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              onClick={() => {
                setCurrentPage('intro');
                setClickCount(0);
                setInteractiveStars([]);
                setGameScore(0);
                setDecorations([]);
              }}
              className="p-4 bg-white/5 rounded-full border border-white/10 hover:bg-white/10"
            >
              <Rocket className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function OrbitItem({ children, index, total, radius, delay }: { children: React.ReactNode, index: number, total: number, radius: number, delay: number }) {
  const angle = (index / total) * Math.PI * 2;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: [Math.cos(angle) * radius, Math.cos(angle + Math.PI * 2) * radius],
        y: [Math.sin(angle) * radius, Math.sin(angle + Math.PI * 2) * radius]
      }}
      transition={{ 
        delay,
        x: { duration: 30, repeat: Infinity, ease: "linear" },
        y: { duration: 30, repeat: Infinity, ease: "linear" },
        opacity: { duration: 1 },
        scale: { duration: 1 }
      }}
      className="absolute z-30 cursor-pointer"
    >
      {children}
    </motion.div>
  );
}

function ComplimentBubble({ type, text }: { type: 'heart' | 'star', text: string }) {
  const [revealed, setRevealed] = useState(false);
  
  return (
    <div className="relative group flex items-center justify-center shadow-xl" onClick={() => setRevealed(!revealed)}>
      <motion.div
        whileHover={{ scale: 1.2 }}
        className={`p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-colors ${revealed ? 'bg-nebula-indigo/30 border-white' : ''}`}
      >
        {type === 'heart' ? <Heart className="w-5 h-5 text-indigo-300" /> : <Star className="w-5 h-5 text-star-gold" />}
      </motion.div>
      
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="compliment-pill absolute z-40 pointer-events-none font-sans"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
