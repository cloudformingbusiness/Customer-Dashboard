import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { INavItem, NavGroup } from '../../modules/_registry/types'
import {
  LayoutDashboard, Workflow, Plug, BarChart3, AlertTriangle,
  GitBranch, Map, FileText, Users, Shield, ChevronLeft, ChevronRight,
  Phone, UserPlus, UserCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Workflow, Plug, BarChart3, AlertTriangle,
  GitBranch, Map, FileText, Users, Shield,
  Phone, UserPlus, UserCheck,
}

const GROUP_ORDER: NavGroup[] = ['main', 'operations', 'planning', 'addons', 'admin']

const GROUP_LABELS: Partial<Record<NavGroup, string>> = {
  operations: 'Operations',
  planning:   'Planung',
  addons:     'Add-ons',
  admin:      'Verwaltung',
}

interface ISidebarProps {
  navItems: INavItem[]
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ navItems, collapsed, onToggle }: ISidebarProps) {
  const location = useLocation()

  const grouped = useMemo(() => {
    const groups: { group: NavGroup; label?: string; items: INavItem[] }[] = []

    for (const group of GROUP_ORDER) {
      const items = navItems.filter((item) => (item.group ?? 'main') === group)
      if (items.length > 0) {
        groups.push({ group, label: GROUP_LABELS[group], items })
      }
    }

    return groups
  }, [navItems])

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
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {grouped.map(({ group, label, items }, groupIndex) => (
          <div key={group}>
            {/* Separator between groups */}
            {groupIndex > 0 && (
              <div className={`my-2 ${collapsed ? 'mx-2' : 'mx-3'}`}>
                <div className="border-t border-gray-200" />
              </div>
            )}

            {/* Group label */}
            {label && !collapsed && (
              <div className="px-3 pt-2 pb-1">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {label}
                </span>
              </div>
            )}

            {/* Nav items */}
            {items.map((item) => {
              const Icon = iconMap[item.icon] ?? LayoutDashboard
              const isActive = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5
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
          </div>
        ))}
      </nav>
    </aside>
  )
}
