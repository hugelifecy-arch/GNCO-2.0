'use client'

import { Calendar, CheckCircle, FileText, Users } from 'lucide-react'

export function BookCallCTA() {
  return (
    <div className="mt-12 rounded-lg border border-accent-gold/30 bg-bg-elevated p-8">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent-gold/30 bg-accent-gold/10">
            <Calendar className="h-6 w-6 text-accent-gold" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="mb-2 font-serif text-2xl text-text-primary">Want Expert Guidance?</h3>
          <p className="mb-6 text-text-secondary">
            Book a 1-hour strategy call with a fund formation specialist to review your specific situation,
            answer questions, and develop your execution plan.
          </p>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 flex-shrink-0 text-accent-gold" />
              <div>
                <div className="text-sm font-semibold text-text-primary">Expert Review</div>
                <div className="text-xs text-text-tertiary">20+ years fund formation experience</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-accent-gold" />
              <div>
                <div className="text-sm font-semibold text-text-primary">Customized Plan</div>
                <div className="text-xs text-text-tertiary">Tailored to your LP mix and strategy</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent-gold" />
              <div>
                <div className="text-sm font-semibold text-text-primary">Action Items</div>
                <div className="text-xs text-text-tertiary">Leave with clear next steps</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://calendly.com/gnco/strategy-call"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-accent-gold px-6 py-3 font-semibold text-bg-primary transition-all hover:bg-accent-gold-light"
            >
              <Calendar className="h-4 w-4" />
              Book Strategy Call
            </a>
            <div className="text-sm text-text-secondary">
              <span className="text-text-tertiary line-through">€1,500</span>
              <span className="ml-2 font-semibold text-accent-gold">FREE</span>
              <span className="ml-1 text-text-tertiary">(Beta Launch Offer)</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-text-tertiary">Limited availability • First 50 users only • Normal price €1,500/hour</p>
        </div>
      </div>
    </div>
  )
}
