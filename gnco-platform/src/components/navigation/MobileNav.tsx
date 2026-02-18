'use client'

import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  navLinks: Array<{ label: string; href: string }>
  onRequestAccess: () => void
}

export function MobileNav({ open, onOpenChange, navLinks, onRequestAccess }: MobileNavProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg-primary/70 backdrop-blur-sm md:hidden" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-screen w-80 max-w-full flex-col gap-6 border-l border-bg-border bg-bg-elevated p-6 shadow-surface md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl text-accent-gold">GNCO</span>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-sm p-2 text-text-secondary transition hover:text-text-primary"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Dialog.Close asChild key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm px-2 py-3 text-sm text-text-secondary transition hover:bg-bg-primary hover:text-text-primary"
                >
                  {item.label}
                </Link>
              </Dialog.Close>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <button
              type="button"
              className="rounded-sm border border-bg-border px-4 py-2 text-sm text-text-secondary transition hover:border-accent-gold/50 hover:text-text-primary"
            >
              Sign In
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onRequestAccess}
                className="rounded-sm bg-accent-gold px-4 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-gold-light"
              >
                Request Access
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
