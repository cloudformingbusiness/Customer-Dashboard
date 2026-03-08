import { NavLink, useLocation } from 'react-router-dom'
import type { INavItem } from '../../modules/_registry/types'
import {
  LayoutDashboard, Workflow, Plug, BarChart3, AlertTriangle,
  GitBranch, Map, FileText, Users, Shield, ChevronLeft, ChevronRight,
  Phone, UserPlus, UserCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Icon-Map: String → Lucide Component
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Workflow, Plug, BarChart3, AlertTriangle,
  GitBranch, Map, FileText, Users, Shield,
  Phone, UserPlus, UserCheck,
}

interface ISidebarProps {
  navItems: INavItem[]
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ navItems, collapsed, onToggle }: ISidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200
        flex flex-col transition-all duration-200 z-30
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        {!collapsed && (
          <span className="text-lg font-bold text-gray-900 truncate">
            Dashboard
          </span>
        )}
        <button
          onClick={onToggle}
          className={`
            p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
            transition-colors ${collapsed ? 'mx-auto' : 'ml-auto'}
          `}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1
                transition-colors text-sm font-medium
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (() => {
                const val = item.badge()
                if (val == null) return null
                return (
                  <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {val}
                  </span>
                )
              })()}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
