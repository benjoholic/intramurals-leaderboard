"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Calendar, Users, Target, Play, TrendingUp, MapPin, Medal, Award, Info, Sparkles, UserPlus } from "lucide-react";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="url(#path-gradient)"
            strokeWidth={path.width}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function Hero() {
  const [showIcons, setShowIcons] = useState(true);

  const toggleIcons = () => {
    setShowIcons(!showIcons);
  };

  return (
    <div className="relative min-h-[100vh] sm:min-h-[100vh] md:min-h-[100vh] lg:min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 pt-30 transition-all duration-1000 bg-gradient-to-br from-green-600 to-green-800">
      <div className="flex flex-col items-center justify-center min-h-[100vh] sm:min-h-[100vh] md:min-h-[100vh] lg:min-h-full w-full">
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          <div className="absolute inset-0">
            <FloatingPaths position={1} />
            <FloatingPaths position={-1} />
          </div>
          <div className="absolute top-0 left-0 w-full h-20 bg-white opacity-5 transform -skew-y-3"></div>
          <div className="absolute bottom-0 right-0 w-full h-20 bg-white opacity-5 transform skew-y-3"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.05]"></div>
        </div>

        <div className="relative z-10 text-center max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10 relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-lg shadow-green-500/20 mb-3 sm:mb-4">
              <Image
                src="/Logos/Minsu.png"
                alt="Minsu Logo"
                width={160}
                height={160}
                className="relative z-10 cursor-pointer"
                priority
                onClick={toggleIcons}
              />
              <div className={`absolute inset-0 transition-all duration-500 ${showIcons ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                {[
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3c2.5 2.5 2.5 6.5 0 9m0 0c-2.5 2.5-2.5 6.5 0 9m0-18c-2.5 2.5-2.5 6.5 0 9m0 0c2.5 2.5 2.5 6.5 0 9"/><path d="M3 12h18"/></svg>,
                    label: 'Basketball'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3c-1.5 3-1.5 6 0 9s1.5 6 0 9"/><path d="M12 3c1.5 3 1.5 6 0 9s-1.5 6 0 9"/></svg>,
                    label: 'Football'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
                    label: 'Volleyball'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M8 8l8 8M16 8l-8 8"/></svg>,
                    label: 'Tennis'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12c0-4 2-8 8-8s8 4 8 8-2 8-8 8-8-4-8-8z"/><path d="M8 15c2-1 4-1 6 0"/></svg>,
                    label: 'Swimming'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
                    label: 'Track & Field'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="12" rx="9" ry="6"/><path d="M12 6v12"/></svg>,
                    label: 'Rugby'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="10" width="18" height="4" rx="1"/><path d="M12 10V3M12 21v-7"/></svg>,
                    label: 'Table Tennis'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M8.5 13L7 21h10l-1.5-8"/></svg>,
                    label: 'Medal'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16M6 9v13M18 9v13M12 9v13M8 9h8v4a4 4 0 0 1-8 0V9z"/></svg>,
                    label: 'Trophy'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
                    label: 'Baseball'
                  },
                  { 
                    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="4"/></svg>,
                    label: 'Target'
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="absolute z-20"
                    style={{
                      left: `calc(50% + ${[-120, -100, -60, 0, 60, 100, 120, 100, 60, 0, -60, -100][index]}px)`,
                      top: `calc(50% + ${[0, 60, 100, 120, 100, 60, 0, -60, -100, -120, -100, -60][index]}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-green-500 to-green-700 rounded-full p-2 shadow-lg shadow-green-500/20 flex items-center justify-center w-8 h-8">
                        <div className="w-4 h-4 text-white">{item.svg}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-3 bg-green-500/20 rounded-full blur-md"></div>
          </div>

          {/* Main heading with enhanced typography */}
          <div className="relative mb-4 sm:mb-6 mt-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent mb-3 sm:mb-4 tracking-tight leading-none">
              INTRAMURALS
            </h1>
          </div>

          {/* Subtitle with enhanced styling */}
          <div className="relative inline-block mb-6 sm:mb-8">
            {/* Gradient overlay */}
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-green-200/20 to-green-300/20 blur-2xl -z-10 animate-pulse delay-200"></div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-wide">
              LEADERBOARD
            </h2>

            {/* Decorative elements */}
            <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-green-200/30 to-green-300/30 rounded-full animate-pulse delay-100"></div>
          </div>

          {/* Description with improved typography */}
          <div className="relative mb-8 sm:mb-12">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-lg 2xl:text-xl text-gray-300/90 max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto leading-relaxed font-medium">
              Experience the ultimate competitive platform where every game
              matters, every victory counts, and champions are born through
              dedication and teamwork.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
