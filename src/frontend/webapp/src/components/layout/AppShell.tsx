import { useState, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import type { INavItem } from '../../modules/_registry/types'

interface IAppShellProps {
  navItems: INavItem[]
}

export function AppShell({ navItems }: IAppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        navItems={navItems}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <TopBar sidebarCollapsed={sidebarCollapsed} />

      <main
        className={`
          pt-16 min-h-screen transition-all duration-200
          ${sidebarCollapsed ? 'pl-16' : 'pl-64'}
        `}
      >
        <div className="p-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
