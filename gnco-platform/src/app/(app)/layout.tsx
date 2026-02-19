import { AppSidebar } from '@/components/navigation/AppSidebar'
import { DemoDatasetNotice } from '@/components/shared/DemoDatasetNotice'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-surface md:flex">
      <AppSidebar />
      <div className="flex-1 pt-4 md:pt-6">
        <div className="px-6 lg:px-8">
          <DemoDatasetNotice compact />
        </div>
        {children}
      </div>
    </div>
  )
}
