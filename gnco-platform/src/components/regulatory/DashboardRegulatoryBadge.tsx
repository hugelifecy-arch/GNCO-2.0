'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getUnreadRegulatoryUpdatesForStructure } from '@/lib/regulatory-alerts'
import { getRegulatoryUpdates, getSavedStructures } from '@/lib/regulatory-updates-storage'

export function DashboardRegulatoryBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const updates = getRegulatoryUpdates()
    const unread = getSavedStructures().flatMap((structure) =>
      getUnreadRegulatoryUpdatesForStructure(structure, updates)
    )
    setUnreadCount(unread.length)
  }, [])

  if (unreadCount < 1) return null

  return (
    <Link href="/admin/regulatory-updates?role=admin" className="inline-flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden />
      {unreadCount} new regulatory alerts
    </Link>
  )
}
