'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const accessSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  organization: z.string().min(1, 'Organization is required'),
  role: z.enum(['CIO', 'CFO', 'Fund Manager', 'Legal Counsel', 'Other']),
  aumRange: z.enum(['Under $100M', '$100M–$500M', '$500M–$2B', '$2B+']),
  email: z.string().email('Valid email is required'),
  referralSource: z.enum(['Referral', 'LinkedIn', 'Conference', 'Other']),
})

type AccessFormValues = z.infer<typeof accessSchema>

interface RequestAccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const inputClassName =
  'w-full rounded-sm border border-bg-border bg-bg-surface px-4 py-3 font-sans text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30'

export function RequestAccessModal({ open, onOpenChange }: RequestAccessModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<{ fullName: string; email: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AccessFormValues>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      fullName: '',
      organization: '',
      role: 'CIO',
      aumRange: 'Under $100M',
      email: '',
      referralSource: 'Referral',
    },
  })

  const onSubmit = async (data: AccessFormValues) => {
    await fetch('/api/access-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setSubmittedData({ fullName: data.fullName, email: data.email })
    setIsSubmitted(true)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)

    if (!nextOpen) {
      setTimeout(() => {
        setIsSubmitted(false)
        setSubmittedData(null)
        reset()
      }, 100)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-bg-primary/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-4 top-20 z-[61] mx-auto w-full max-w-md rounded-lg border border-bg-border bg-bg-elevated p-8 shadow-surface">
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-sm p-1 text-text-secondary transition hover:text-text-primary"
              aria-label="Close request access modal"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          {!isSubmitted ? (
            <>
              <div className="space-y-3">
                <p className="text-xs tracking-widest text-accent-gold">◆ GNCO</p>
                <Dialog.Title className="font-serif text-2xl text-text-primary">Apply for Due Diligence Access</Dialog.Title>
                <Dialog.Description className="text-sm text-text-secondary">
                  We review all applications within 48 hours. Access is by invitation only.
                </Dialog.Description>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
                <div>
                  <input placeholder="Full Name" {...register('fullName')} className={inputClassName} />
                  {errors.fullName && <p className="mt-1 text-xs text-accent-red">{errors.fullName.message}</p>}
                </div>
                <div>
                  <input placeholder="Organization" {...register('organization')} className={inputClassName} />
                  {errors.organization && <p className="mt-1 text-xs text-accent-red">{errors.organization.message}</p>}
                </div>
                <div>
                  <select {...register('role')} className={inputClassName}>
                    <option>CIO</option>
                    <option>CFO</option>
                    <option>Fund Manager</option>
                    <option>Legal Counsel</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <select {...register('aumRange')} className={inputClassName}>
                    <option>Under $100M</option>
                    <option>$100M–$500M</option>
                    <option>$500M–$2B</option>
                    <option>$2B+</option>
                  </select>
                </div>
                <div>
                  <input placeholder="Email Address" type="email" {...register('email')} className={inputClassName} />
                  {errors.email && <p className="mt-1 text-xs text-accent-red">{errors.email.message}</p>}
                </div>
                <div>
                  <select {...register('referralSource')} className={inputClassName}>
                    <option>Referral</option>
                    <option>LinkedIn</option>
                    <option>Conference</option>
                    <option>Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-sm bg-accent-gold py-3 font-semibold text-bg-primary transition hover:bg-accent-gold-light disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-accent-green" />
              <h3 className="mt-4 font-serif text-[22px] text-text-primary">Application Received</h3>
              <p className="mt-3 text-sm text-text-secondary">
                Thank you, {submittedData?.fullName}. We&apos;ll review your application and respond to {submittedData?.email} within
                48 hours.
              </p>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="mt-6 rounded-sm bg-accent-gold px-6 py-2 text-sm font-semibold text-bg-primary transition hover:bg-accent-gold-light"
                >
                  Close
                </button>
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
