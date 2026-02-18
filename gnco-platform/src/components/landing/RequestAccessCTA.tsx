'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function RequestAccessCTA() {
  return (
    <section className="border-y border-bg-border bg-bg-elevated py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-6 text-center"
      >
        <p className="text-xs tracking-widest text-accent-gold">OPEN BETA</p>
        <h2 className="mt-4 font-serif text-4xl text-text-primary">Explore GNCO in demo mode</h2>
        <p className="mt-5 text-text-secondary">
          Use the Architect flow and operator surfaces to preview workflows. Demo outputs are synthetic and intended for evaluation only.
        </p>

        <Link href="/architect" className="mt-8 inline-block rounded-sm bg-accent-gold px-10 py-4 text-lg font-semibold text-bg-primary transition hover:bg-accent-gold-light">
          Enter Beta (Demo)
        </Link>
      </motion.div>
    </section>
  )
}
