import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Plus } from 'lucide-react'

interface IPageHeaderProps {
  title: string
  subtitle?: string
  action?: { label: string; onClick?: () => void; icon?: LucideIcon }
  actionLabel?: string
  actionIcon?: LucideIcon
  onAction?: () => void
  children?: ReactNode
}

export function PageHeader({ title, subtitle, action, actionLabel, actionIcon, onAction, children }: IPageHeaderProps) {
  const btn = action ?? (actionLabel ? { label: actionLabel, onClick: onAction, icon: actionIcon } : null)
  const Icon = btn?.icon ?? Plus

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {btn && (
        <button
          onClick={btn.onClick}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          <Icon size={18} />
          {btn.label}
        </button>
      )}
      {children}
    </div>
  )
}
