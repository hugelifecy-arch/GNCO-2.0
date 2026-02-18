import { ReactNode } from 'react'

export function AuthGate({ children }: { children: ReactNode }) {
  // OPEN BETA — no auth required
  return <>{children}</>
}
