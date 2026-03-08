import { useKpis } from '../../../hooks/useApi'
import { TrendingUp, TrendingDown, Minus, Plus, BarChart3 } from 'lucide-react'

const TREND_ICON: Record<string, React.ReactNode> = {
  up: <TrendingUp size={18} className="text-green-500" />,
  down: <TrendingDown size={18} className="text-red-500" />,
  stable: <Minus size={18} className="text-gray-400" />,
}

export default function KpisPage() {
  const { data: kpis, isLoading } = useKpis()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KPIs</h1>
          <p className="text-gray-500 mt-1">Kennzahlen und Zielverfolgung</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Neuer KPI
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : kpis && kpis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const current = kpi.current_value as number | undefined
            const target = kpi.target_value as number | undefined
            const trend = (kpi.trend as string) ?? 'stable'
            const unit = (kpi.unit as string) ?? ''
            const progress = current != null && target != null && target !== 0
              ? Math.min(Math.round((current / target) * 100), 100)
              : null

            return (
              <div
                key={kpi.id as string}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500 truncate pr-2">
                    {kpi.name as string}
                  </h3>
                  {TREND_ICON[trend] ?? TREND_ICON.stable}
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {current != null ? current.toLocaleString('de-DE') : '–'}
                  </span>
                  {unit && <span className="text-sm text-gray-500">{unit}</span>}
                </div>

                {target != null && (
                  <p className="text-xs text-gray-400 mb-3">
                    Ziel: {target.toLocaleString('de-DE')} {unit}
                  </p>
                )}

                {progress != null && (
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Keine KPIs</h3>
          <p className="text-gray-500 mt-1">Es wurden noch keine KPIs angelegt.</p>
        </div>
      )}
    </div>
  )
}
