'use client'

import { AlertTriangle } from 'lucide-react'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // No-op, could send to monitoring.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-bg-border bg-bg-surface p-6 text-center">
          <AlertTriangle className="mb-3 h-8 w-8 text-accent-gold" />
          <p className="mb-4 font-medium">Something went wrong</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="rounded-md border border-accent-gold/40 bg-accent-gold/10 px-4 py-2 text-sm text-accent-gold"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
