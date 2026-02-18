'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useCountUp } from '@/hooks/useCountUp'

interface HeroSectionProps {
  onRequestAccess: () => void
}

const headlineWords = "Architect the World's Most Sophisticated Fund Structures.".split(' ')

function StatItem({ value, label, statRef }: { value: number; label: string; statRef: React.RefObject<HTMLDivElement> }) {
  const count = useCountUp({ end: value, duration: 1400 }, statRef)

  return (
    <div className="flex-1 text-center">
      <p className="font-serif text-3xl text-accent-gold">{Math.round(count)}</p>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </div>
  )
}

export function HeroSection({ onRequestAccess }: HeroSectionProps) {
  const statsRef = useRef<HTMLDivElement>(null)

  return (
    <section className="hero-grid-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 85%, rgba(10, 22, 40, 0.95) 0%, rgba(10, 22, 40, 0.55) 35%, transparent 70%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        {[{ left: '18%', top: '26%', delay: 0 }, { left: '74%', top: '20%', delay: 2.2 }, { left: '30%', top: '72%', delay: 1.1 }, { left: '84%', top: '60%', delay: 3 }].map((dot, idx) => (
          <motion.span
            key={idx}
            className="absolute h-1.5 w-1.5 rounded-full bg-accent-gold/70"
            style={{ left: dot.left, top: dot.top }}
            animate={{ y: [0, -14, 0], opacity: [0.25, 0.9, 0.25] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="mb-6 font-sans text-xs uppercase tracking-[0.3em] text-accent-gold"
        >
          INSTITUTIONAL FUND ARCHITECTURE
        </motion.p>

        <h1 className="font-serif text-5xl leading-tight text-text-primary md:text-7xl">
          {headlineWords.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="mr-3 inline-block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.05 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-3xl text-lg text-text-secondary md:text-xl"
        >
          GNCO gives family offices, GPs, and fund architects the intelligence layer to model, compare, and execute globally optimized fund structures — from jurisdiction selection to LP onboarding.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={onRequestAccess}
            className="w-full rounded-sm bg-accent-gold px-8 py-4 font-semibold text-bg-primary transition hover:bg-accent-gold-light sm:w-auto"
          >
            Apply for Early Access
          </button>
          <Link
            href="/methodology"
            className="w-full rounded-sm border border-accent-gold/40 px-8 py-4 text-accent-gold transition hover:bg-accent-gold/5 sm:w-auto"
          >
            View Methodology →
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 text-xs text-text-tertiary"
        >
          Reviewed by family offices across 14 jurisdictions. Access available by application.
        </motion.p>

        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto mt-16 flex max-w-3xl flex-col divide-y divide-bg-border border border-bg-border bg-bg-surface/50 sm:flex-row sm:divide-x sm:divide-y-0"
        >
          <StatItem value={14} label="Jurisdictions Covered" statRef={statsRef} />
          <StatItem value={47} label="Templates Available" statRef={statsRef} />
          <div className="flex-1 py-6 text-center">
            <p className="font-serif text-3xl text-accent-gold">ILPA-Aligned</p>
            <p className="mt-1 text-sm text-text-secondary">Reporting Standard</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
