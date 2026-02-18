'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2, Cpu, Globe } from 'lucide-react'

const features = [
  {
    title: 'Coverage Library (15 Domiciles)',
    body: 'Review directional formation cost and timeline ranges for core fund domiciles in one place.',
    footer: '→ View Coverage',
    href: '/coverage',
    icon: Globe,
    iconColor: 'text-accent-blue',
  },
  {
    title: 'Guided Architect Intake',
    body: 'Capture fund type, size, GP domicile, LP base, and priorities through an 8-step workflow designed for early structuring conversations.',
    footer: '→ Enter Beta',
    href: '/architect',
    icon: Cpu,
    iconColor: 'text-accent-gold',
  },
  {
    title: 'Methodology & Disclosures',
    body: 'Understand how scoring is designed, what the model does today, and where legal and tax review remains essential.',
    footer: '→ Read Methodology',
    href: '/methodology',
    icon: BarChart2,
    iconColor: 'text-accent-green',
  },
]

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center font-serif text-4xl text-text-primary">Built for practical pre-counsel planning</h2>
      <p className="mb-16 mt-4 text-center text-lg text-text-secondary">Use GNCO to organize assumptions and compare options before formal legal structuring.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="rounded-lg border border-bg-border bg-bg-surface p-8 transition-all duration-300 hover:border-accent-gold/30"
            >
              <Icon className={`mb-6 h-7 w-7 ${feature.iconColor}`} />
              <h3 className="font-serif text-2xl text-text-primary">{feature.title}</h3>
              <p className="mt-4 text-text-secondary">{feature.body}</p>
              <Link href={feature.href} className="mt-6 inline-block text-sm text-accent-gold hover:text-accent-gold-light">
                {feature.footer}
              </Link>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
