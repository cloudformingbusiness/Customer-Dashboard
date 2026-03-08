import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray'

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  red:    'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  green:  'bg-green-100 text-green-700',
  blue:   'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  gray:   'bg-gray-100 text-gray-600',
}

interface IBadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'gray', className = '' }: IBadgeProps) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Helper: resolve variant from a lookup map, with fallback
export function variantFor(value: string, map: Record<string, BadgeVariant>): BadgeVariant {
  return map[value] ?? 'gray'
}
