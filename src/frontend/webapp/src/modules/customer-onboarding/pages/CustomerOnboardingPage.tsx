import { useState, useEffect } from 'react'
import { UserPlus, CheckCircle2, Circle, Clock } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Card } from '../../../components/ui'

interface IOnboardingStep {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'pending'
  completedAt?: string
}

const STATUS_CONFIG = {
  completed: { icon: <CheckCircle2 size={20} className="text-green-500" />, label: 'Abgeschlossen', labelClass: 'text-green-600 bg-green-50' },
  in_progress: { icon: <Clock size={20} className="text-yellow-500" />, label: 'In Bearbeitung', labelClass: 'text-yellow-600 bg-yellow-50' },
  pending: { icon: <Circle size={20} className="text-gray-300" />, label: 'Ausstehend', labelClass: 'text-gray-500 bg-gray-50' },
}

export default function CustomerOnboardingPage() {
  const [steps, setSteps] = useState<IOnboardingStep[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data – will be replaced with API call
    const timer = setTimeout(() => {
      setSteps([
        { id: '1', title: 'Vertrag unterschrieben', description: 'Vertrag wurde vom Kunden geprüft und unterzeichnet.', status: 'completed', completedAt: '2026-02-15' },
        { id: '2', title: 'Zugänge eingerichtet', description: 'Alle notwendigen Accounts und Zugänge wurden erstellt.', status: 'completed', completedAt: '2026-02-18' },
        { id: '3', title: 'Kickoff-Meeting', description: 'Erstes Meeting mit dem Kunden zur Projektbesprechung.', status: 'in_progress' },
        { id: '4', title: 'System-Setup', description: 'Technische Einrichtung der Systeme und Infrastruktur.', status: 'pending' },
        { id: '5', title: 'Go-Live', description: 'Produktivsetzung und finale Übergabe an den Kunden.', status: 'pending' },
      ])
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const completedCount = steps.filter((s) => s.status === 'completed').length

  return (
    <div>
      <PageHeader title="Kunden-Onboarding" subtitle="Onboarding-Workflows und Fortschritt">
        {steps.length > 0 && (
          <span className="text-sm font-medium text-gray-500">
            {completedCount} / {steps.length} abgeschlossen
          </span>
        )}
      </PageHeader>

      {isLoading ? <Spinner /> : steps.length > 0 ? (
        <Card className="divide-y divide-gray-100">
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
        </Card>
      ) : (
        <EmptyState icon={UserPlus} title="Kein Onboarding" description="Es gibt noch keine Kunden-Onboarding Workflows." />
      )}
    </div>
  )
}
