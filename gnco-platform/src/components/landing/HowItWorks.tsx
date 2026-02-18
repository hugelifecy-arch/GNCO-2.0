'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    title: 'Define Your Structure',
    body: 'Complete our 8-question intake. Tell us your fund strategy, LP mix, GP jurisdiction, target asset geography, and key priorities. It takes under 5 minutes.',
    visual: (
      <div className="rounded-lg border border-bg-border bg-bg-elevated p-5">
        <div className="space-y-3">
          {[56, 76, 68, 84].map((width, idx) => (
            <motion.div
              key={width + idx}
              className="h-2 rounded bg-bg-border"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.2 }}
              style={{ width: `${width}%` }}
            />
          ))}
          <div className="h-8 w-36 rounded-sm bg-accent-gold/20" />
        </div>
      </div>
    ),
  },
  {
    title: 'Model & Compare',
    body: 'GNCO scores all 15 jurisdictions and recommends your top 3 structures. Compare tax efficiency, formation cost, LP familiarity, and timeline side by side. Model the tax impact for each LP individually.',
    visual: (
      <div className="rounded-lg border border-bg-border bg-bg-elevated p-5">
        <div className="space-y-4">
          {[82, 64, 74].map((score, idx) => (
            <div key={score + idx} className="space-y-1">
              <div className="h-2 w-full rounded bg-bg-border">
                <motion.div
                  className="h-2 rounded bg-accent-blue"
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Execute & Report',
    body: 'Onboard LPs, manage capital calls, calculate waterfall distributions, and generate ILPA-standard quarterly reports — all from one audited platform.',
    visual: (
      <div className="rounded-lg border border-bg-border bg-bg-elevated p-5">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 h-20 rounded bg-bg-border/80" />
          <div className="h-20 rounded bg-accent-green/20" />
          <div className="h-10 rounded bg-bg-border/70" />
          <div className="h-10 rounded bg-bg-border/70" />
          <div className="h-10 rounded bg-bg-border/70" />
        </div>
      </div>
    ),
  },
]

export function HowItWorks() {
  return (
    <section className="bg-bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-14 text-center font-serif text-4xl text-text-primary">From First Sketch to Final Signature</h2>

        <div className="space-y-14">
          {steps.map((step, idx) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5 }}
              className="grid items-center gap-8 md:grid-cols-2"
            >
              <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                <p className="text-sm uppercase tracking-[0.2em] text-accent-gold">Step {idx + 1}</p>
                <h3 className="mt-3 font-serif text-3xl text-text-primary">{step.title}</h3>
                <p className="mt-4 text-text-secondary">{step.body}</p>
              </div>
              <div className={idx % 2 === 1 ? 'md:order-1' : ''}>{step.visual}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
