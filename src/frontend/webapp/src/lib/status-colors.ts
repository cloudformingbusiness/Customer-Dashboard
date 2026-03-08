import type { BadgeVariant } from '../components/ui'

// Severity / Criticality / Priority
export const SEVERITY_VARIANT: Record<string, BadgeVariant> = {
  critical: 'red',
  high:     'orange',
  medium:   'yellow',
  low:      'gray',
}

// Incident status
export const INCIDENT_STATUS_VARIANT: Record<string, BadgeVariant> = {
  open:          'red',
  investigating: 'yellow',
  resolved:      'green',
  closed:        'gray',
}

// Automation run status
export const AUTOMATION_STATUS_VARIANT: Record<string, BadgeVariant> = {
  success: 'green',
  error:   'red',
  running: 'blue',
  waiting: 'yellow',
  unknown: 'gray',
}

// Change type
export const CHANGE_TYPE_VARIANT: Record<string, BadgeVariant> = {
  standard:  'blue',
  normal:    'blue',
  emergency: 'red',
  minor:     'gray',
}

// Change status
export const CHANGE_STATUS_VARIANT: Record<string, BadgeVariant> = {
  draft:       'gray',
  submitted:   'yellow',
  approved:    'green',
  rejected:    'red',
  implemented: 'blue',
  deployed:    'green',
  in_progress: 'blue',
  closed:      'gray',
}

// Integration auth status
export const AUTH_STATUS_VARIANT: Record<string, BadgeVariant> = {
  connected:    'green',
  disconnected: 'gray',
  error:        'red',
  pending:      'yellow',
}

export const AUTH_STATUS_LABEL: Record<string, string> = {
  connected:    'Verbunden',
  disconnected: 'Getrennt',
  error:        'Fehler',
  pending:      'Ausstehend',
}

// Document category
export const DOC_CATEGORY_VARIANT: Record<string, BadgeVariant> = {
  sop:      'blue',
  policy:   'purple',
  guide:    'green',
  template: 'orange',
  other:    'gray',
}

// Contact type
export const CONTACT_TYPE_VARIANT: Record<string, BadgeVariant> = {
  customer: 'blue',
  partner:  'purple',
  vendor:   'orange',
  internal: 'gray',
}

// Risk level text colors (for non-badge inline display)
export const RISK_TEXT_COLOR: Record<string, string> = {
  critical: 'text-red-600',
  high:     'text-orange-600',
  medium:   'text-yellow-600',
  low:      'text-green-600',
}

// Roadmap status
export const ROADMAP_STATUS_LABEL: Record<string, string> = {
  backlog:     'Backlog',
  planned:     'Geplant',
  in_progress: 'In Bearbeitung',
  done:        'Erledigt',
}

export const ROADMAP_STATUS_HEADER: Record<string, string> = {
  backlog:     'bg-gray-100 text-gray-700',
  planned:     'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done:        'bg-green-100 text-green-700',
}

// Priority text colors (for non-badge inline display)
export const PRIORITY_TEXT_COLOR: Record<string, string> = {
  critical: 'text-red-600',
  high:     'text-orange-600',
  medium:   'text-yellow-600',
  low:      'text-gray-400',
}
