import { AppSidebar } from '@/components/navigation/AppSidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-surface md:flex">
      <AppSidebar />
      <div className="flex-1 pt-4 md:pt-6">{children}</div>
    </div>
  )
}
