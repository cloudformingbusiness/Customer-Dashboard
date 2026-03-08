import { useNavigate } from 'react-router-dom'
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Users, Percent, Settings } from 'lucide-react'
import { PageHeader, Spinner, EmptyState, Card, Badge, variantFor, DataTable } from '../../../components/ui'
import type { IColumn } from '../../../components/ui'
import type { BadgeVariant } from '../../../components/ui'
import { useVoiceAgentStats, useVoiceAgentCalls } from '../../../hooks/useApi'

// ── Color maps ───────────────────────────────────────────────

const CALL_STATUS_VARIANT: Record<string, BadgeVariant> = {
  completed: 'green',
  in_progress: 'blue',
  ringing: 'yellow',
  missed: 'red',
  failed: 'red',
  voicemail: 'purple',
}

const SENTIMENT_VARIANT: Record<string, BadgeVariant> = {
  positive: 'green',
  neutral: 'gray',
  negative: 'red',
}

const DIRECTION_ICON: Record<string, React.ReactNode> = {
  inbound: <PhoneIncoming size={16} className="text-blue-500" />,
  outbound: <PhoneOutgoing size={16} className="text-orange-500" />,
}

// ── Helpers ──────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatPhone(num?: string): string {
  if (!num) return '–'
  return num
}

// ── Call table columns ───────────────────────────────────────

type Call = Record<string, unknown>

const callColumns: IColumn<Call>[] = [
  {
    key: 'direction',
    header: '',
    className: 'w-10',
    render: (c) => DIRECTION_ICON[(c.direction as string) ?? 'inbound'] ?? DIRECTION_ICON.inbound,
  },
  {
    key: 'caller',
    header: 'Von / An',
    render: (c) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{formatPhone(c.caller_number as string)}</p>
        {c.callee_number ? <p className="text-xs text-gray-500">{formatPhone(c.callee_number as string)}</p> : null}
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (c) => (
      <Badge variant={variantFor(c.status as string, CALL_STATUS_VARIANT)}>
        {c.status as string}
      </Badge>
    ),
  },
  {
    key: 'duration',
    header: 'Dauer',
    render: (c) => (
      <span className="text-sm text-gray-500">
        {(c.duration_seconds as number) > 0 ? formatDuration(c.duration_seconds as number) : '–'}
      </span>
    ),
  },
  {
    key: 'sentiment',
    header: 'Stimmung',
    render: (c) => c.sentiment ? (
      <Badge variant={variantFor(c.sentiment as string, SENTIMENT_VARIANT)}>
        {c.sentiment as string}
      </Badge>
    ) : <span className="text-xs text-gray-400">–</span>,
  },
  {
    key: 'summary',
    header: 'Zusammenfassung',
    render: (c) => c.summary
      ? <p className="text-sm text-gray-600 truncate max-w-xs">{c.summary as string}</p>
      : <span className="text-xs text-gray-400">–</span>,
  },
  {
    key: 'started_at',
    header: 'Zeitpunkt',
    render: (c) => (
      <span className="text-sm text-gray-500">
        {c.started_at ? new Date(c.started_at as string).toLocaleString('de-DE') : '–'}
      </span>
    ),
  },
]

// ── Page ─────────────────────────────────────────────────────

export default function VoiceAgentPage() {
  const navigate = useNavigate()
  const { data: stats, isLoading: statsLoading } = useVoiceAgentStats()
  const { data: calls, isLoading: callsLoading } = useVoiceAgentCalls(20)

  const isLoading = statsLoading || callsLoading

  return (
    <div>
      <PageHeader
        title="Voice Agent"
        subtitle="Anrufe, Erreichbarkeit und Performance"
        actionLabel="Konfiguration"
        actionIcon={Settings}
        onAction={() => navigate('/voice-agent/config')}
      />

      {isLoading ? <Spinner /> : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Percent size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Erreichbarkeit</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.reachabilityPercent ?? 0}<span className="text-sm font-normal text-gray-500 ml-1">%</span>
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Anrufe heute</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.callsToday ?? 0}</p>
              <p className="text-xs text-gray-400 mt-1">Diese Woche: {stats?.callsThisWeek ?? 0}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Clock size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Durchschn. Dauer</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats ? formatDuration(stats.avgDurationSeconds) : '–'}<span className="text-sm font-normal text-gray-500 ml-1">min</span>
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <PhoneMissed size={20} className="text-red-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Verpasste Anrufe</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.missedCalls ?? 0}</p>
              <p className="text-xs text-gray-400 mt-1">Gesamt: {stats?.totalCalls ?? 0}</p>
            </Card>
          </div>

          {/* Sentiment breakdown */}
          {stats && stats.totalCalls > 0 && (
            <Card className="p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stimmungsanalyse</h2>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-600">Positiv: {stats.sentiment.positive}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className="text-sm text-gray-600">Neutral: {stats.sentiment.neutral}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">Negativ: {stats.sentiment.negative}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="flex h-2 rounded-full overflow-hidden mt-3 bg-gray-100">
                {stats.totalCalls > 0 && (
                  <>
                    <div className="bg-green-500" style={{ width: `${(stats.sentiment.positive / stats.totalCalls) * 100}%` }} />
                    <div className="bg-gray-400" style={{ width: `${(stats.sentiment.neutral / stats.totalCalls) * 100}%` }} />
                    <div className="bg-red-500" style={{ width: `${(stats.sentiment.negative / stats.totalCalls) * 100}%` }} />
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Call history */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Letzte Anrufe</h2>
          {calls && calls.length > 0 ? (
            <DataTable columns={callColumns} data={calls} rowKey={(c) => c.id as string} />
          ) : (
            <EmptyState icon={Phone} title="Keine Anrufe" description="Es wurden noch keine Anrufe aufgezeichnet. Verbinde einen Voice Agent Provider via Webhook." />
          )}
        </>
      )}
    </div>
  )
}
