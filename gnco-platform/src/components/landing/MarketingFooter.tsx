import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="border-t border-bg-border bg-bg-surface px-8 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none text-accent-gold">◆</span>
            <span className="font-serif text-2xl text-accent-gold">GNCO</span>
          </div>
          <p className="text-sm text-text-secondary">Global Fund Architecture for Family Offices</p>
          <p className="text-sm text-text-tertiary">© 2026 GNCO. All rights reserved.</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-text-primary">Platform</h4>
          <FooterLink href="/architect">Architect Engine</FooterLink>
          <FooterLink href="/coverage">Coverage</FooterLink>
          <FooterLink href="/methodology">Methodology</FooterLink>
          <FooterLink href="/architect">Start Free</FooterLink>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-text-primary">Legal</h4>
          <FooterLink href="/disclosures">Disclosures</FooterLink>
          <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
          <FooterLink href="/data-architecture">Data Architecture</FooterLink>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-text-primary">Contact</h4>
          <p className="text-sm text-text-secondary">Questions about the open beta?</p>
          <a className="text-sm text-accent-gold hover:text-accent-gold-light" href="mailto:contact@gnco.io">
            contact@gnco.io
          </a>
          <p className="text-sm text-text-tertiary">No credit card required during beta.</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-bg-border py-4">
        <p className="text-[11px] text-text-tertiary">Open beta: full platform access is currently available to all users.</p>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-sm text-text-secondary transition hover:text-accent-gold">
      {children}
    </Link>
  )
}
