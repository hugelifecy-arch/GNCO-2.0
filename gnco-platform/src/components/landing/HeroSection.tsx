'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const headlineWords = 'Architect fund structures with clearer assumptions—before you call counsel.'.split(' ')

const stats = [
  { value: '15', label: 'Jurisdictions in Coverage Library' },
  { value: '8', label: 'Guided Intake Steps' },
  { value: 'Open', label: 'Beta Status' },
]

export function HeroSection() {
  return (
    <section className="hero-grid-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="relative mx-auto w-full max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 font-sans text-xs uppercase tracking-[0.3em] text-accent-gold"
        >
          OPEN BETA
        </motion.p>

        <h1 className="font-serif text-4xl leading-tight text-text-primary md:text-6xl">
          {headlineWords.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="mr-2 inline-block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 + index * 0.04 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 max-w-3xl text-lg text-text-secondary md:text-xl"
        >
          GNCO (Open Beta) helps you compare domiciles, timelines, and operating requirements in one place. Outputs are decision support—not legal, tax, or investment advice.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/architect" className="w-full rounded-sm bg-accent-gold px-8 py-4 font-semibold text-bg-primary transition hover:bg-accent-gold-light sm:w-auto">
            Enter Beta (Demo)
          </Link>
          <Link href="/coverage" className="w-full rounded-sm border border-accent-gold/40 px-8 py-4 text-accent-gold transition hover:border-accent-gold sm:w-auto">
            View Coverage
          </Link>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-bg-border bg-bg-surface/60 p-5">
              <p className="font-serif text-3xl text-accent-gold">{stat.value}</p>
              <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
