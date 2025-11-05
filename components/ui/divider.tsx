"use client";

import { motion } from "framer-motion";

interface DividerProps {
  className?: string;
  delay?: number;
}

export function Divider({ className, delay = 0 }: DividerProps) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`h-px bg-gradient-to-r from-transparent via-border to-transparent ${className || ""}`}
    />
  );
}

