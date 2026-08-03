"use client";

import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Animate as a `<li>` when true (for use inside lists). */
  as?: "div" | "li";
}

export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
