"use client";

import React from "react";
import { Smartphone, Monitor } from "lucide-react";
import { motion } from "motion/react";

export function MobileBlocker() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center select-none text-white">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        {/* Glow pulsing ring in the background */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl">
          <Smartphone className="h-10 w-10 text-white/40" />
          
          <motion.div
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Monitor className="h-3.5 w-3.5" />
          </motion.div>
        </div>
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-3 font-serif text-2xl font-semibold tracking-tight text-white/95"
      >
        Desktop view required
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="max-w-xs text-sm leading-relaxed text-white/45"
      >
        The Forge Live IDE and code preview sandbox require a wider screen to operate comfortably. Please switch to a desktop or expand your browser window.
      </motion.p>
    </div>
  );
}
