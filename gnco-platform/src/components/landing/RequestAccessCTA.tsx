'use client'

import { motion } from 'framer-motion'

interface RequestAccessCTAProps {
  onRequestAccess: () => void
}

export function RequestAccessCTA({ onRequestAccess }: RequestAccessCTAProps) {
  return (
    <section className="border-y border-bg-border bg-bg-elevated py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-6 text-center"
      >
        <p className="text-xs tracking-widest text-accent-gold">LIMITED EARLY ACCESS</p>
        <h2 className="mt-4 font-serif text-4xl text-text-primary">Join the Due Diligence Program</h2>
        <p className="mt-5 text-text-secondary">
          GNCO is currently available to a select group of family offices and fund managers. Applications are reviewed individually.
          Pricing starts at €11,000/year — less than 2 hours of structuring counsel.
        </p>

        <button
          type="button"
          onClick={onRequestAccess}
          className="mt-8 rounded-sm bg-accent-gold px-10 py-4 text-lg font-semibold text-bg-primary transition hover:bg-accent-gold-light"
        >
          Apply for Access
        </button>

        <p className="mt-4 text-xs text-text-tertiary">
          We respond to all applications within 48 hours. No spam. No automatic sign-ups. Every access is reviewed.
        </p>
      </motion.div>
    </section>
  )
}
