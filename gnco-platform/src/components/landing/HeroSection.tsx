'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'

const headlineWords = "Architect the World's Most Sophisticated Fund Structures.".split(' ')

const stats = [
  { value: JURISDICTIONS.length, label: 'Jurisdictions Covered', suffix: '' },
  { value: 52, label: 'Templates Available', suffix: '' },
  { value: 0, label: 'ILPA-Aligned', suffix: '', isText: true },
]

function StatsStrip() {
  return (
    <div className="mt-16 flex items-center justify-center gap-12 md:gap-16">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          {stat.isText ? (
            <>
              <p className="text-sm font-sans uppercase tracking-wider text-text-secondary">ILPA-Aligned</p>
              <p className="mt-1 text-sm font-sans text-text-secondary">Reporting Standard</p>
            </>
          ) : (
            <>
              <motion.div
                className="font-serif text-4xl font-bold text-accent-gold md:text-5xl"
                aria-label={`${stat.value} ${stat.label.toLowerCase()}`}
                initial={{ opacity: 0.7, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                {stat.value}
                {stat.suffix}
              </motion.div>
              <p className="mt-2 text-sm font-sans text-text-secondary">{stat.label}</p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="hero-grid-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 85%, rgba(10, 22, 40, 0.95) 0%, rgba(10, 22, 40, 0.55) 35%, transparent 70%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        {[
          { left: '18%', top: '26%', delay: 0 },
          { left: '74%', top: '20%', delay: 2.2 },
          { left: '30%', top: '72%', delay: 1.1 },
          { left: '84%', top: '60%', delay: 3 },
        ].map((dot, idx) => (
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
          GNCO eliminates 6 weeks and €50,000+ in legal fees by modeling your optimal fund structure before you call counsel. Make jurisdiction decisions in hours, not months.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/architect"
            className="w-full rounded-sm bg-accent-gold px-8 py-4 font-semibold text-bg-primary transition hover:bg-accent-gold-light sm:w-auto"
          >
            Start Free →
          </Link>
          <Link
            href="/methodology"
            className="w-full rounded-sm border border-accent-gold/40 px-8 py-4 text-accent-gold transition hover:bg-accent-gold/5 sm:w-auto"
          >
            View Methodology →
          </Link>
        </motion.div>

        <StatsStrip />
      </div>
    </section>
  )
}
