/**
 * Liquid Glass Design System - Preset classes for Rent.ca
 * Supports both light and dark mode via Tailwind dark: variants.
 *
 * Usage: import { glass } from '@/shared/lib/glass'
 * Then use: className={glass.card}
 * Or combine: className={cn(glass.card, 'p-6')}
 */

export const glass = {
  /** Base glass panel */
  base: 'bg-white/80 dark:bg-white/15 backdrop-blur-lg border border-gray-200 dark:border-white/25 rounded-2xl',

  /** Card with stronger blur and shadow */
  card: 'bg-white/80 dark:bg-white/15 backdrop-blur-xl border border-gray-200 dark:border-white/25 rounded-3xl shadow-xl',

  /** Premium card with gradient */
  cardPremium:
    'relative bg-gradient-to-br from-white dark:from-white/25 to-gray-100/80 dark:to-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/25 rounded-3xl shadow-2xl overflow-hidden',

  /** Interactive button */
  button:
    'bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-gray-200 dark:border-white/25 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]',

  /** Primary CTA button with glow */
  buttonPrimary:
    'relative bg-gradient-to-r from-brand-500 to-cyan-500 dark:from-brand-500/20 dark:to-cyan-500/20 hover:from-brand-600 hover:to-cyan-600 dark:hover:from-brand-500/30 dark:hover:to-cyan-500/30 backdrop-blur-xl border border-brand-400/50 dark:border-white/25 rounded-2xl shadow-xl shadow-brand-500/20 hover:shadow-2xl hover:shadow-brand-500/30 transition-all duration-300',

  /** Text input */
  input:
    'bg-gray-50 hover:bg-gray-100 dark:bg-white/10 dark:hover:bg-white/10 dark:focus:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/15 focus:border-brand-500 dark:focus:border-white/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 outline-none transition-all duration-300',

  /** Floating navbar */
  navbar: 'bg-white/80 dark:bg-black/30 backdrop-blur-xl border-b border-gray-200 dark:border-white/15',

  /** Sidebar panel */
  sidebar: 'bg-white/80 dark:bg-black/30 backdrop-blur-2xl border-r border-gray-200 dark:border-white/15',

  /** Modal/dialog */
  modal:
    'bg-white dark:bg-white/15 backdrop-blur-2xl border border-gray-200 dark:border-white/25 rounded-3xl shadow-2xl',

  /** Badge/pill */
  badge:
    'bg-gray-100 dark:bg-white/15 backdrop-blur-md border border-gray-200 dark:border-white/25 rounded-full px-3 py-1 text-sm',

  /** Top highlight line (add inside a relative parent) */
  highlight:
    'absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-white/50 to-transparent',
} as const;

/** Background mesh gradient — light and dark mode */
export const meshBackground =
  'bg-gray-50 dark:bg-slate-900 [background-image:radial-gradient(at_40%_20%,rgba(51,141,255,0.08)_0px,transparent_50%),radial-gradient(at_80%_0%,rgba(168,85,247,0.08)_0px,transparent_50%),radial-gradient(at_0%_50%,rgba(6,182,212,0.08)_0px,transparent_50%),radial-gradient(at_80%_50%,rgba(51,141,255,0.06)_0px,transparent_50%),radial-gradient(at_0%_100%,rgba(20,184,166,0.08)_0px,transparent_50%)] dark:[background-image:radial-gradient(at_40%_20%,rgba(51,141,255,0.22)_0px,transparent_50%),radial-gradient(at_80%_0%,rgba(168,85,247,0.22)_0px,transparent_50%),radial-gradient(at_0%_50%,rgba(6,182,212,0.22)_0px,transparent_50%),radial-gradient(at_80%_50%,rgba(51,141,255,0.18)_0px,transparent_50%),radial-gradient(at_0%_100%,rgba(20,184,166,0.22)_0px,transparent_50%)]';

/** Color constants for the Liquid Glass theme (light + dark) */
export const glassColors = {
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-white/70',
    muted: 'text-gray-500 dark:text-white/60',
    accent: 'text-brand-600 dark:text-brand-400',
  },
  bg: {
    page: 'bg-gray-50 dark:bg-slate-900',
    elevated: 'bg-gray-100/50 dark:bg-white/5',
    hover: 'bg-gray-200/50 dark:bg-white/10',
    active: 'bg-gray-200 dark:bg-white/15',
  },
  border: {
    subtle: 'border-gray-200 dark:border-white/15',
    default: 'border-gray-300 dark:border-white/25',
    strong: 'border-gray-400 dark:border-white/30',
  },
} as const;
