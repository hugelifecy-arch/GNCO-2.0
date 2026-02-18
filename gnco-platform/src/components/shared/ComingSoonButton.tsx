import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ComingSoonButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  children: ReactNode
}

export function ComingSoonButton({ children, className = '', ...props }: ComingSoonButtonProps) {
  return (
    <button
      type="button"
      title="Coming soon"
      aria-disabled="true"
      {...props}
      className={`${className} cursor-not-allowed`}
      onClick={(event) => {
        event.preventDefault()
        props.onClick?.(event)
      }}
    >
      {children}
    </button>
  )
}
