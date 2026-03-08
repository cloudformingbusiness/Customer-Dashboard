import { useState, useEffect } from 'react'
import { UserCheck, CheckCircle2, Circle, Clock } from 'lucide-react'

interface IOnboardingStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'pending'
  completedAt?: string
}

const STATUS_CONFIG = {
  completed: {
    icon: <CheckCircle2 size={20} className="text-green-500" />,
    label: 'Abgeschlossen',
    labelClass: 'text-green-600 bg-green-50',
  },
  in_progress: {
    icon: <Clock size={20} className="text-yellow-500" />,
    label: 'In Bearbeitung',
    labelClass: 'text-yellow-600 bg-yellow-50',
  },
  pending: {
    icon: <Circle size={20} className="text-gray-300" />,
    label: 'Ausstehend',
    labelClass: 'text-gray-500 bg-gray-50',
  },
}

export default function EmployeeOnboardingPage() {
  const [steps, setSteps] = useState<IOnboardingStep[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data – will be replaced with API call
    const timer = setTimeout(() => {
      setSteps([
        {
          id: '1',
          title: 'Arbeitsvertrag',
          description: 'Arbeitsvertrag wurde erstellt und unterschrieben.',
          status: 'completed',
          completedAt: '2026-03-01',
        },
        {
          id: '2',
          title: 'IT-Ausstattung',
          description: 'Laptop, Bildschirm und Peripheriegeräte bereitgestellt.',
          status: 'completed',
          completedAt: '2026-03-03',
        },
        {
          id: '3',
          title: 'Tool-Zugänge',
          description: 'E-Mail, Slack, GitHub und weitere Tool-Zugänge eingerichtet.',
          status: 'in_progress',
        },
        {
          id: '4',
          title: 'Einarbeitung',
          description: 'Strukturierte Einarbeitung mit Mentor und Dokumentation.',
          status: 'pending',
        },
        {
          id: '5',
          title: 'Probezeit-Review',
          description: 'Feedbackgespräch und Bewertung nach der Probezeit.',
          status: 'pending',
        },
      ])
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const completedCount = steps.filter((s) => s.status === 'completed').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mitarbeiter-Onboarding</h1>
          <p className="text-gray-500 mt-1">Checklisten für neue Mitarbeiter</p>
        </div>
        {steps.length > 0 && (
          <span className="text-sm font-medium text-gray-500">
            {completedCount} / {steps.length} abgeschlossen
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : steps.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
          {steps.map((step, index) => {
            const config = STATUS_CONFIG[step.status]
            return (
              <div key={step.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-400">{index + 1}</span>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.labelClass}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{step.description}</p>
                  {step.completedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Abgeschlossen am {new Date(step.completedAt).toLocaleDateString('de-DE')}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <UserCheck size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Kein Onboarding</h3>
          <p className="text-gray-500 mt-1">Es gibt noch keine Mitarbeiter-Onboarding Checklisten.</p>
        </div>
      )}
    </div>
  )
}
