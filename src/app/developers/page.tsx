"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code, Sparkles, Zap, Heart, Github, Linkedin, Mail } from "lucide-react";

// FloatingPaths component from Hero
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
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
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

export default function DevelopersPage() {
  const developers = [
    {
      name: "Benj Francis Ligeralde",
      role: "Lead Developer",
      description: "Full-stack developer specializing in React and Next.js",
      image: "/Devs/Benj.jpg",
      skills: ["React", "Next.js", "Node.js", "TypeScript"],
    },
    {
      name: "Kenneth Ibabao",
      role: "Frontend Developer",
      description: "UI/UX enthusiast with expertise in modern web technologies",
      image: "/Devs/Kenneth.jpg",
      skills: ["React", "TailwindCSS", "Figma", "Animation"],
    },
    {
      name: "Jay Em Fabro",
      role: "Backend Developer",
      description: "Database architect and API specialist",
      image: "/Devs/Jayem.jpg",
      skills: ["Node.js", "PostgreSQL", "API Design", "AWS"],
    },
  ];

  return (
    <>
      <Header />
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 pt-32 pb-16 bg-gradient-to-br from-green-600 via-green-700 to-emerald-900">
      {/* Background effects - same as Hero */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
        <div className="absolute top-0 left-0 w-full h-20 bg-white opacity-5 transform -skew-y-3"></div>
        <div className="absolute bottom-0 right-0 w-full h-20 bg-white opacity-5 transform skew-y-3"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.05]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent mb-4 tracking-tight leading-none drop-shadow-2xl">
              Meet the Developers
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full mb-6"></div>
            <p className="text-lg sm:text-xl text-emerald-50/90 max-w-3xl mx-auto leading-relaxed">
              The talented team behind the MinSU IntraTrack system
            </p>
          </motion.div>
        </div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((developer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20">
                {/* Developer Image */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={developer.image}
                      alt={developer.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Developer Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {developer.name}
                  </h3>
                  <p className="text-emerald-300 font-semibold mb-3 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    {developer.role}
                  </p>
                  <p className="text-emerald-50/80 text-sm leading-relaxed mb-4">
                    {developer.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {developer.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/10 border border-emerald-400/30 rounded-full text-xs text-emerald-200 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 justify-center">
                    <a
                      href="#"
                      className="p-2 bg-white/10 rounded-full hover:bg-emerald-400/20 transition-colors duration-300 group/social"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4 text-emerald-200 group-hover/social:text-white transition-colors" />
                    </a>
                    <a
                      href="#"
                      className="p-2 bg-white/10 rounded-full hover:bg-emerald-400/20 transition-colors duration-300 group/social"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-emerald-200 group-hover/social:text-white transition-colors" />
                    </a>
                    <a
                      href="#"
                      className="p-2 bg-white/10 rounded-full hover:bg-emerald-400/20 transition-colors duration-300 group/social"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4 text-emerald-200 group-hover/social:text-white transition-colors" />
                    </a>
                  </div>
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
