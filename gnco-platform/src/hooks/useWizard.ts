'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const WIZARD_STORAGE_KEY = 'gnco:architect-brief'

type BriefData = Record<string, unknown>

interface UseWizardOptions {
  totalSteps?: number
}

export function useWizard(options: UseWizardOptions = {}) {
  const totalSteps = options.totalSteps ?? 5
  const [currentStep, setCurrentStep] = useState(1)
  const [briefData, setBriefData] = useState<BriefData>({})

  useEffect(() => {
    const saved = window.localStorage.getItem(WIZARD_STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as BriefData
      setBriefData(parsed)
    } catch {
      window.localStorage.removeItem(WIZARD_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(briefData))
  }, [briefData])

  const goNext = useCallback(() => {
    setCurrentStep((step) => Math.min(step + 1, totalSteps))
  }, [totalSteps])

  const goBack = useCallback(() => {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }, [])

  const updateBrief = useCallback((data: Partial<BriefData>) => {
    setBriefData((prev) => ({ ...prev, ...data }))
  }, [])

  const resetWizard = useCallback(() => {
    setCurrentStep(1)
    setBriefData({})
    window.localStorage.removeItem(WIZARD_STORAGE_KEY)
  }, [])

  const canGoNext = useMemo(() => currentStep < totalSteps, [currentStep, totalSteps])
  const isComplete = useMemo(() => currentStep === totalSteps, [currentStep, totalSteps])

  return {
    currentStep,
    totalSteps,
    goNext,
    goBack,
    canGoNext,
    briefData,
    updateBrief,
    isComplete,
    resetWizard,
  }
}
