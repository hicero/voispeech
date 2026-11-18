"use client";

import { motion, useReducedMotion } from "motion/react";

export default function MotionPress({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: "tween", duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
