'use client'

import type { ComponentType } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowUpDown,
  Brain,
  Cpu,
  Columns3,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Radar,
  ShieldAlert,
  Settings,
  TrendingUp,
  Users,
  Handshake,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
  iconClassName?: string
}

type NavSection = {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Compliance Calendar', href: '/dashboard/compliance', icon: FileText },
    ],
  },
  {
    title: 'Module 1 — Architect',
    items: [
      { label: 'Fund Architect', href: '/architect', icon: Cpu, iconClassName: 'text-accent-gold' },
      { label: 'Structure Compare', href: '/compare', icon: Columns3 },
    ],
  },
  {
    title: 'Module 2 — Operator',
    items: [
      { label: 'LP Registry', href: '/operator/lp-registry', icon: Users },
      { label: 'Capital Calls', href: '/operator/capital-calls', icon: ArrowUpDown },
      { label: 'Distributions', href: '/operator/distributions', icon: TrendingUp },
      { label: 'Documents', href: '/operator/documents', icon: FolderOpen },
    ],
  },
  {
    title: 'Module 3 — Intelligence',
    items: [
      { label: 'Ask GNCO', href: '/intelligence', icon: Brain },
      { label: 'Regulatory Radar', href: '/intelligence/radar', icon: Radar },
      { label: 'Scenario Stress Tester', href: '/intelligence/scenarios', icon: ShieldAlert },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'ILPA Report Generator', href: '/reports', icon: FileText },
      { label: 'Marketplace', href: '/marketplace', icon: Handshake },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-16 shrink-0 border-r border-bg-border bg-bg-primary lg:w-60 md:flex">
      <div className="flex h-full w-full flex-col px-2 py-5 lg:px-4">
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <span className="text-sm text-accent-gold">◆</span>
          <span className="hidden font-serif text-lg font-semibold text-accent-gold lg:inline">GNCO</span>
        </Link>
        <div className="my-4 border-t border-bg-border" />

        <nav className="flex-1 space-y-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mb-1 hidden px-2 text-xs text-text-tertiary lg:block">{section.title}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-r-sm border-l-2 border-transparent px-2 py-2 text-sm text-text-secondary transition hover:text-text-primary',
                        isActive && 'border-accent-gold bg-bg-elevated text-text-primary'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', item.iconClassName)} />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-4 flex items-center justify-between border-t border-bg-border pt-4 px-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-border text-xs font-medium text-text-primary">
              AD
            </span>
            <span className="hidden truncate text-sm text-text-secondary lg:inline">Demo User</span>
          </div>
          <Link href="/settings" className="text-text-secondary transition hover:text-text-primary" aria-label="Open settings">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
