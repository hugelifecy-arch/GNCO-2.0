import { useState } from 'react'

export function useWizard(totalSteps: number) {
  const [step, setStep] = useState(1)
  const next = () => setStep((value) => Math.min(value + 1, totalSteps))
  const previous = () => setStep((value) => Math.max(value - 1, 1))
  return { step, next, previous }
}
