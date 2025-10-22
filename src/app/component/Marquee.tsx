'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Database, 
  Github, 
  Terminal, 
  Cpu, 
  Network, 
  CpuIcon, 
  DatabaseIcon, 
  GitBranch, 
  Server, 
  Code2,
  Cctv,
  CpuIcon as Cpu2,
  Cpu as Cpu3
} from 'lucide-react';

const icons = [
  { icon: <Code className="w-12 h-12 text-blue-500" />, label: 'Code' },
  { icon: <Database className="w-12 h-12 text-green-600" />, label: 'Database' },
  { icon: <Terminal className="w-12 h-12 text-yellow-400" />, label: 'Terminal' },
  { icon: <Cpu className="w-12 h-12 text-red-600" />, label: 'CPU' },
  { icon: <Network className="w-12 h-12 text-orange-500" />, label: 'Network' },
  { icon: <Github className="w-12 h-12 text-gray-800" />, label: 'GitHub' },
  { icon: <CpuIcon className="w-12 h-12 text-blue-600" />, label: 'Processor' },
  { icon: <DatabaseIcon className="w-12 h-12 text-purple-600" />, label: 'DB' },
  { icon: <GitBranch className="w-12 h-12 text-green-700" />, label: 'Git' },
  { icon: <Code2 className="w-12 h-12 text-cyan-600" />, label: 'Code 2' },
  { icon: <Server className="w-12 h-12 text-blue-700" />, label: 'Server' },
  { icon: <Cctv className="w-12 h-12 text-indigo-600" />, label: 'CCTV' },
  { icon: <Cpu2 className="w-12 h-12 text-pink-600" />, label: 'CPU 2' },
];

const Marquee = () => {
  const MarqueeRow = ({ reverse = false, offset = 0 }) => (
    <motion.div
      className="flex whitespace-nowrap py-8"
      initial={{ x: reverse ? '0%' : '-50%' }}
      animate={{ x: reverse ? '-50%' : '0%' }}
      transition={{
        repeat: Infinity,
        repeatType: 'loop' as const,
        duration: 40,
        ease: 'linear',
      }}
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center">
          {icons.map((item, iconIndex) => (
            <div 
              key={`${reverse ? 'bottom' : 'top'}-${i}-${iconIndex}`} 
              className="flex flex-col items-center mx-6 group relative"
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <span className="text-xs mt-2 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  );

  return (
    <section className="bg-white py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          <MarqueeRow />
        </div>
      </div>
    </section>
  );
};

export default Marquee;