import { useState, useEffect } from 'react'
import { Phone, TrendingUp, TrendingDown, Minus, Clock, Users, Star } from 'lucide-react'

interface IVoiceAgentStat {
  id: string
  label: string
  value: string
  unit: string
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
}

const TREND_ICON: Record<string, React.ReactNode> = {
  up: <TrendingUp size={18} className="text-green-500" />,
  down: <TrendingDown size={18} className="text-red-500" />,
  stable: <Minus size={18} className="text-gray-400" />,
}

export default function VoiceAgentPage() {
  const [stats, setStats] = useState<IVoiceAgentStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data – will be replaced with API call
    const timer = setTimeout(() => {
      setStats([
        {
          id: '1',
          label: 'Erreichbarkeit',
          value: '94.2',
          unit: '%',
          trend: 'up',
          icon: <Phone size={24} className="text-primary" />,
        },
        {
          id: '2',
          label: 'CSAT Score',
          value: '4.6',
          unit: '/ 5',
          trend: 'up',
          icon: <Star size={24} className="text-primary" />,
        },
        {
          id: '3',
          label: 'Durchschnittliche Gesprächsdauer',
          value: '3:42',
          unit: 'min',
          trend: 'stable',
          icon: <Clock size={24} className="text-primary" />,
        },
        {
          id: '4',
          label: 'Anrufe heute',
          value: '127',
          unit: '',
          trend: 'down',
          icon: <Users size={24} className="text-primary" />,
        },
      ])
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Agent</h1>
          <p className="text-gray-500 mt-1">KPI-Tracking für den Voice Agent</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  {stat.icon}
                </div>
                {TREND_ICON[stat.trend] ?? TREND_ICON.stable}
              </div>

              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {stat.label}
              </h3>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-sm text-gray-500">{stat.unit}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Phone size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine Daten</h3>
          <p className="text-gray-500 mt-1">Es liegen noch keine Voice Agent Daten vor.</p>
        </div>
      )}
    </div>
  )
}
