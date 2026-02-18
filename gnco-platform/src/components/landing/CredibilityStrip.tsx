'use client'

import { motion } from 'framer-motion'

const segments = [
  'Single Family Office',
  'Multi-Family Office',
  'Private Equity GP',
  'Real Assets Fund',
  'Endowment & Foundation',
]

export function CredibilityStrip() {
  return (
    <section className="border-y border-bg-border bg-bg-surface py-10">
      <p className="mb-6 text-center text-xs uppercase tracking-[0.2em] text-text-tertiary">Designed for practitioners across:</p>

      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-6">
        {segments.map((segment, idx) => (
          <motion.span
            key={segment}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="rounded-full border border-bg-border px-5 py-2 text-sm text-text-secondary"
          >
            {segment}
          </motion.span>
        ))}
      </div>
    </section>
  )
}
