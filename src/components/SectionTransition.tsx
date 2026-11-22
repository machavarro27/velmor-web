import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface SectionDividerProps {
  variant?: 'cream-to-cream' | 'cream-to-sand' | 'sand-to-cream' | 'cream-to-white' | 'white-to-sky';
}

const VARIANT_BG: Record<NonNullable<SectionDividerProps['variant']>, string> = {
  'cream-to-cream': 'bg-gradient-to-b from-[#FAF8F5] via-[#F3EFEA]/70 to-[#FAF8F5]',
  'cream-to-sand': 'bg-gradient-to-b from-[#FAF8F5] via-[#EFECE6]/55 to-[#EFECE6]/75',
  'sand-to-cream': 'bg-gradient-to-b from-[#EFECE6]/75 via-[#F4F1EC] to-[#FAF8F5]',
  'cream-to-white': 'bg-gradient-to-b from-[#FAF8F5] via-[#FCFBF9] to-white',
  'white-to-sky': 'bg-gradient-to-b from-white via-[#F4F9FD] to-[#EBF4FA]',
};

/**
 * Minimalist Nordic section divider with a tapered semi-transparent gradient line,
 * soft ambient wash, and a centered artisanal gold diamond accent that expands on scroll.
 */
export function SectionDivider({ variant = 'cream-to-cream' }: SectionDividerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`relative w-full py-2.5 sm:py-3.5 -my-px overflow-hidden select-none ${VARIANT_BG[variant]}`}
    >
      {/* Subtle ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(180,123,43,0.06),transparent_80%)]" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-center gap-4">
        {/* Left tapered gradient line */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.25 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="h-px flex-1 origin-right bg-gradient-to-r from-transparent via-[#004B87]/20 to-[#B47B2B]/40"
        />

        {/* Centered minimalist Nordic emblem (diamond + micro dots) */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="w-1 h-1 rounded-full bg-[#004B87]/35" />
          <span className="w-2 h-2 rotate-45 rounded-[2px] border border-[#B47B2B]/60 bg-white shadow-[0_0_10px_rgba(180,123,43,0.25)]" />
          <span className="w-1 h-1 rounded-full bg-[#004B87]/35" />
        </motion.div>

        {/* Right tapered gradient line */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.25 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="h-px flex-1 origin-left bg-gradient-to-l from-transparent via-[#004B87]/20 to-[#B47B2B]/40"
        />
      </div>
    </div>
  );
}

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

/**
 * Progressive scroll-reveal wrapper that smoothly fades in and slides up (~22px)
 * as each section enters the viewport.
 */
export function SectionReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 22,
}: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.08, margin: '0px 0px -45px 0px' }}
      transition={{
        duration: 0.68,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
