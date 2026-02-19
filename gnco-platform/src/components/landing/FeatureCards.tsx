'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BarChart2, Cpu, Globe } from 'lucide-react'
import { JURISDICTIONS } from '@/lib/jurisdiction-data'

const jurisdictionCount = JURISDICTIONS.length

const features = [
  {
    title: `${jurisdictionCount}-Jurisdiction Architecture`,
    body: `Model fund structures across Cayman Islands, Luxembourg, Delaware, Singapore, Ireland, BVI, Cyprus, and ${jurisdictionCount - 7} additional domiciles. Every structure accounts for tax treaty networks and LP domicile optimization.`,
    footer: '→ View Coverage',
    href: '/coverage',
    icon: Globe,
    iconColor: 'text-accent-blue',
    featured: false,
  },
  {
    title: 'GNCO Architect Engine',
    body: `Input your LP mix, GP domicile, fund size, and priorities. The Engine scores all ${jurisdictionCount} jurisdictions across 6 weighted criteria, models tax impact for up to 50 LPs, and generates your attorney brief in under 30 seconds.`,
    footer: '→ Try the Architect',
    href: '/architect',
    icon: Cpu,
    iconColor: 'text-accent-gold',
    featured: true,
  },
  {
    title: 'Full Operator Suite',
    body: 'LP registry, capital call manager, distribution waterfall calculator, document vault, and ILPA-aligned reporting — all in one authenticated, audited environment.',
    footer: '→ See All Features',
    href: '/dashboard',
    icon: BarChart2,
    iconColor: 'text-accent-green',
    featured: false,
  },
]

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center font-serif text-4xl text-text-primary">Built for Institutional Precision</h2>
      <p className="mb-16 mt-4 text-center text-lg text-text-secondary">
        Every feature designed around how family offices and fund managers actually work.
      </p>

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
              className={`rounded-lg border bg-bg-surface p-8 transition-all duration-300 hover:border-accent-gold/30 ${
                feature.featured ? 'border-accent-gold/40' : 'border-bg-border'
              }`}
            >
              {feature.featured && (
                <span className="mb-6 inline-flex rounded-full border border-accent-gold/30 bg-accent-gold/10 px-2.5 py-0.5 text-xs text-accent-gold">
                  Flagship Feature
                </span>
              )}
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
