const partners = [
  {
    name: 'Carey Olsen',
    role: 'Legal',
    href: 'https://www.careyolsen.com',
  },
  {
    name: 'Alter Domus',
    role: 'Administration',
    href: 'https://www.alterdomus.com',
  },
  {
    name: 'Mercury',
    role: 'Banking',
    href: 'https://mercury.com',
  },
  {
    name: 'DocuSign',
    role: 'Execution',
    href: 'https://www.docusign.com',
  },
]

export function PartnerStrip() {
  return (
    <section className="w-full bg-bg-primary py-16">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-text-tertiary">
          Powered by industry-leading partners
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${partner.name} - opens in new tab`}
              title={`Official ${partner.role} partner`}
              className="group rounded-2xl border border-border-subtle bg-bg-secondary/40 px-5 py-6 text-center transition hover:border-border-primary hover:bg-bg-secondary/70"
            >
              <p className="font-sans text-base font-medium text-text-primary">{partner.name}</p>
              <p className="mt-2 text-xs text-text-tertiary transition group-hover:text-text-secondary">
                Official {partner.role} partner
              </p>
            </a>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-border-subtle bg-bg-secondary/50 px-5 py-4 text-center text-sm font-medium text-text-secondary">
          Partnership relationships in place. All legal opinions provided by licensed counsel. GNCO provides software
          infrastructure only.
        </p>
      </div>
    </section>
  )
}
