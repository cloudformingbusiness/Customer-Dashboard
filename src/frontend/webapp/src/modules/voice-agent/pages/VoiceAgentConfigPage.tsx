import { useState, useEffect, type FormEvent } from 'react'
import { Save, Phone, Globe, Webhook, Settings2, ExternalLink, Cpu, Play, Square, CheckCircle, XCircle, Clock, Activity, Send, MessageSquare, Loader2 } from 'lucide-react'
import { PageHeader, Spinner, Card, Badge } from '../../../components/ui'
import type { BadgeVariant } from '../../../components/ui'
import {
  useVoiceAgentConfig,
  useVoiceAgentConfigMutation,
  useVoiceAgentN8nStatus,
  useVoiceAgentN8nActivate,
  useVoiceAgentN8nDeactivate,
} from '../../../hooks/useApi'

// ── Provider definitions ─────────────────────────────────────

type ProviderType = 'retell' | 'vapi' | 'bland' | 'n8n' | 'custom'

interface IProviderOption {
  id: ProviderType
  name: string
  description: string
  icon: React.ReactNode
  website?: string
  fields: IConfigField[]
}

interface IConfigField {
  key: string
  label: string
  type: 'text' | 'url' | 'password' | 'textarea'
  placeholder: string
  required?: boolean
  helpText?: string
}

const COMMON_FIELDS: IConfigField[] = [
  { key: 'webhook_secret', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...', helpText: 'Zum Verifizieren eingehender Webhooks' },
]

const PROVIDERS: IProviderOption[] = [
  {
    id: 'retell',
    name: 'Retell AI',
    description: 'KI-Telefonagent mit natuerlicher Stimme. Ideal fuer Kundenservice und Terminbuchung.',
    icon: <Phone size={24} className="text-blue-600" />,
    website: 'https://retell.ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'key_...', required: true },
      { key: 'agent_id', label: 'Agent ID', type: 'text', placeholder: 'agent_...', required: true },
      ...COMMON_FIELDS,
    ],
  },
  {
    id: 'vapi',
    name: 'Vapi',
    description: 'Voice AI Platform mit flexibler Konfiguration. Gut fuer komplexe Gespraechsablaeufe.',
    icon: <Globe size={24} className="text-purple-600" />,
    website: 'https://vapi.ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'vapi_...', required: true },
      { key: 'assistant_id', label: 'Assistant ID', type: 'text', placeholder: 'asst_...', required: true },
      ...COMMON_FIELDS,
    ],
  },
  {
    id: 'bland',
    name: 'Bland.ai',
    description: 'KI-Anrufe im grossen Stil. Fuer Outbound-Kampagnen und hohe Volumen.',
    icon: <Phone size={24} className="text-orange-600" />,
    website: 'https://bland.ai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'sk-...', required: true },
      { key: 'pathway_id', label: 'Pathway ID', type: 'text', placeholder: 'pathway_...', helpText: 'Optional: Vordefinierter Gespraechspfad' },
      ...COMMON_FIELDS,
    ],
  },
  {
    id: 'n8n',
    name: 'Eigener Agent (n8n)',
    description: 'Eigenen Voice Agent mit n8n-Workflows bauen. Volle Kontrolle ueber Logik und Anbindung.',
    icon: <Cpu size={24} className="text-green-600" />,
    fields: [
      { key: 'n8n_workflow_id', label: 'n8n Workflow ID', type: 'text', placeholder: 'CLKxBg3U2WBsVf0s', required: true, helpText: 'ID des Voice Agent Workflows in n8n' },
      { key: 'n8n_webhook_url', label: 'n8n Webhook URL (eingehend)', type: 'url', placeholder: 'https://n8ndeploy.cloudforming.de/webhook/voice-agent-call', helpText: 'Webhook-URL des n8n-Workflows fuer eingehende Anrufe' },
      { key: 'system_prompt', label: 'System-Prompt (KI-Persoenlichkeit)', type: 'textarea', placeholder: 'Du bist ein freundlicher und professioneller KI-Telefonassistent...', helpText: 'Definiert wie der KI-Agent sich verhaelt und antwortet' },
      { key: 'llm_model', label: 'LLM Modell (Antwort)', type: 'text', placeholder: 'gpt-4o', helpText: 'KI-Modell fuer die Gespraechsfuehrung' },
      { key: 'llm_temperature', label: 'Temperatur', type: 'text', placeholder: '0.7', helpText: '0 = deterministisch, 1 = kreativ (Standard: 0.7)' },
      { key: 'llm_max_tokens', label: 'Max Tokens (Antwort)', type: 'text', placeholder: '300', helpText: 'Maximale Laenge der KI-Antwort' },
      { key: 'sentiment_model', label: 'LLM Modell (Sentiment)', type: 'text', placeholder: 'gpt-4o-mini', helpText: 'Leichteres Modell fuer die Stimmungsanalyse' },
      { key: 'stt_provider', label: 'STT (Speech-to-Text)', type: 'text', placeholder: 'OpenAI Whisper', helpText: 'Spracherkennung – im Workflow konfiguriert' },
      { key: 'stt_language', label: 'STT Sprache', type: 'text', placeholder: 'de', helpText: 'Sprache fuer die Spracherkennung (ISO 639-1)' },
      { key: 'tts_provider', label: 'TTS (Text-to-Speech)', type: 'text', placeholder: 'OpenAI TTS', helpText: 'Sprachsynthese – im Workflow konfiguriert' },
      { key: 'sip_provider', label: 'SIP/Telefonie-Provider', type: 'text', placeholder: 'z.B. Twilio, Sipgate, Plivo', helpText: 'Welcher Telefonie-Provider die Anrufe liefert' },
      ...COMMON_FIELDS,
    ],
  },
  {
    id: 'custom',
    name: 'Custom Provider',
    description: 'Eigener oder anderer Voice Agent Provider. Daten werden per Webhook empfangen.',
    icon: <Webhook size={24} className="text-gray-600" />,
    fields: [
      { key: 'provider_name', label: 'Provider Name', type: 'text', placeholder: 'Mein Provider', required: true },
      { key: 'api_url', label: 'API URL', type: 'url', placeholder: 'https://api.mein-provider.de' },
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'API Key' },
      ...COMMON_FIELDS,
    ],
  },
]

// ── Execution status colors ──────────────────────────────────

const EXEC_STATUS_VARIANT: Record<string, BadgeVariant> = {
  success: 'green',
  error: 'red',
  running: 'blue',
  waiting: 'yellow',
}

// ── n8n Status Panel ─────────────────────────────────────────

function N8nWorkflowPanel({ workflowId }: { workflowId: string }) {
  const { data: status, isLoading, isError } = useVoiceAgentN8nStatus(workflowId)
  const activateMutation = useVoiceAgentN8nActivate(workflowId)
  const deactivateMutation = useVoiceAgentN8nDeactivate(workflowId)

  if (!workflowId) return null

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-gray-500">
          <Activity size={16} className="animate-pulse" />
          <span className="text-sm">n8n-Workflow wird geladen...</span>
        </div>
      </Card>
    )
  }

  if (isError || !status) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center gap-2 text-red-600">
          <XCircle size={16} />
          <span className="text-sm font-medium">n8n-Workflow nicht erreichbar</span>
        </div>
        <p className="text-xs text-red-500 mt-1">
          Pruefe ob die n8n-Instanz laeuft und die Workflow-ID korrekt ist.
        </p>
      </Card>
    )
  }

  const { workflow, recentExecutions, n8nUrl } = status
  const isToggling = activateMutation.isPending || deactivateMutation.isPending

  const handleToggle = () => {
    if (workflow.active) {
      deactivateMutation.mutate(undefined as never)
    } else {
      activateMutation.mutate(undefined as never)
    }
  }

  const n8nEditorUrl = n8nUrl ? `${n8nUrl.replace(/\/+$/, '')}/workflow/${workflow.id}` : null

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">n8n Workflow Status</h2>
        {n8nEditorUrl && (
          <a
            href={n8nEditorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
          >
            In n8n oeffnen <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Workflow info */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${workflow.active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <div>
            <p className="text-sm font-medium text-gray-900">{workflow.name}</p>
            <p className="text-xs text-gray-500">ID: {workflow.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={workflow.active ? 'green' : 'gray'}>
            {workflow.active ? 'Aktiv' : 'Inaktiv'}
          </Badge>
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
              workflow.active
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {workflow.active ? (
              <><Square size={14} /> Deaktivieren</>
            ) : (
              <><Play size={14} /> Aktivieren</>
            )}
          </button>
        </div>
      </div>

      {/* Webhook URL */}
      {workflow.active && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-xs font-medium text-green-700 mb-1">Webhook-URL (aktiv):</p>
          <code className="text-xs text-green-800 font-mono break-all">
            {n8nUrl?.replace(/\/+$/, '')}/webhook/voice-agent-call
          </code>
        </div>
      )}

      {/* Recent executions */}
      {recentExecutions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Letzte Ausfuehrungen</h3>
          <div className="space-y-1.5">
            {recentExecutions.slice(0, 5).map((exec) => (
              <div key={exec.id} className={`text-xs rounded-lg px-3 py-2 ${exec.status === 'error' ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {exec.status === 'success' ? (
                      <CheckCircle size={14} className="text-green-500" />
                    ) : exec.status === 'error' ? (
                      <XCircle size={14} className="text-red-500" />
                    ) : (
                      <Clock size={14} className="text-yellow-500" />
                    )}
                    <Badge variant={EXEC_STATUS_VARIANT[exec.status] ?? 'gray'}>
                      {exec.status === 'success' ? 'Erfolgreich' : exec.status === 'error' ? 'Fehler' : exec.status}
                    </Badge>
                    {exec.stoppedAt && exec.startedAt && (
                      <span className="text-gray-400">
                        {((new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime()) / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">
                    {new Date(exec.startedAt).toLocaleString('de-DE')}
                  </span>
                </div>
                {exec.status === 'error' && exec.errorMessage && (
                  <div className="mt-1.5 pl-6 text-red-600">
                    <span className="font-medium">{exec.errorNode}:</span>{' '}
                    {exec.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {recentExecutions.length === 0 && (
        <p className="text-xs text-gray-400">Noch keine Ausfuehrungen vorhanden.</p>
      )}
    </Card>
  )
}

// ── Test Panel ───────────────────────────────────────────────

interface ITestResult {
  response_text: string
  sentiment: string
  status: string
  audio_available: boolean
}

const EXAMPLE_MESSAGES = [
  'Hallo, ich haette gerne Informationen zu euren Dienstleistungen.',
  'Ich bin sehr unzufrieden mit eurem Service! Nichts funktioniert!',
  'Vielen Dank, ihr habt mir super geholfen! Alles laeuft perfekt.',
  'Koennen Sie mich bitte mit einem Mitarbeiter verbinden?',
  'Was sind eure Oeffnungszeiten?',
]

const SENTIMENT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  positive: { bg: 'bg-green-100', text: 'text-green-700', label: 'Positiv' },
  neutral: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Neutral' },
  negative: { bg: 'bg-red-100', text: 'text-red-700', label: 'Negativ' },
}

function VoiceAgentTestPanel({ webhookUrl }: { webhookUrl: string }) {
  const [testMessage, setTestMessage] = useState(EXAMPLE_MESSAGES[0])
  const [callerNumber, setCallerNumber] = useState('+49 151 12345678')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<ITestResult | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  const [durationMs, setDurationMs] = useState<number | null>(null)

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)
    setTestError(null)
    setDurationMs(null)

    const start = Date.now()
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: testMessage,
          caller_number: callerNumber,
          callee_number: '+49 89 00000000',
        }),
      })

      setDurationMs(Date.now() - start)

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText)
        throw new Error(`HTTP ${res.status}: ${errText}`)
      }

      const data = await res.json() as ITestResult
      setTestResult(data)
    } catch (err) {
      setDurationMs(Date.now() - start)
      setTestError((err as Error).message)
    } finally {
      setIsTesting(false)
    }
  }

  const sentimentStyle = testResult?.sentiment
    ? SENTIMENT_STYLES[testResult.sentiment.toLowerCase()] ?? SENTIMENT_STYLES.neutral
    : null

  return (
    <Card className="p-6 border-blue-200 bg-blue-50/30">
      <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <MessageSquare size={20} className="text-blue-600" />
        Voice Agent testen
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Simuliere einen Anruf mit Text und erhalte die KI-Antwort in Echtzeit.
      </p>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {EXAMPLE_MESSAGES.map((msg, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setTestMessage(msg)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              testMessage === msg
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            {msg.length > 40 ? msg.substring(0, 40) + '...' : msg}
          </button>
        ))}
      </div>

      {/* Input fields */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht (simulierter Anruftext)</label>
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            placeholder="Was der Anrufer sagt..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anrufernummer (optional)</label>
          <input
            type="text"
            value={callerNumber}
            onChange={(e) => setCallerNumber(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            placeholder="+49 151 12345678"
          />
        </div>
      </div>

      {/* Test button */}
      <button
        type="button"
        onClick={handleTest}
        disabled={isTesting || !testMessage.trim()}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 mb-4"
      >
        {isTesting ? (
          <><Loader2 size={16} className="animate-spin" /> KI antwortet...</>
        ) : (
          <><Send size={16} /> Test-Anruf senden</>
        )}
      </button>

      {/* Result */}
      {testResult && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-700">Antwort erhalten</span>
            </div>
            <div className="flex items-center gap-3">
              {sentimentStyle && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sentimentStyle.bg} ${sentimentStyle.text}`}>
                  Stimmung: {sentimentStyle.label}
                </span>
              )}
              {durationMs !== null && (
                <span className="text-xs text-gray-400">{(durationMs / 1000).toFixed(1)}s</span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Anrufer:</p>
            <p className="text-sm text-gray-600 mb-3 italic">&quot;{testMessage}&quot;</p>
            <p className="text-xs text-gray-400 mb-1">KI-Assistent:</p>
            <p className="text-sm text-gray-900 font-medium">&quot;{testResult.response_text}&quot;</p>
          </div>

          {testResult.audio_available && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Phone size={12} /> Audio wurde generiert (TTS)
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {testError && (
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-red-500" />
            <span className="text-sm font-medium text-red-700">Test fehlgeschlagen</span>
            {durationMs !== null && (
              <span className="text-xs text-gray-400 ml-auto">{(durationMs / 1000).toFixed(1)}s</span>
            )}
          </div>
          <p className="text-sm text-red-600">{testError}</p>
        </div>
      )}
    </Card>
  )
}

// ── Main Component ───────────────────────────────────────────

const DEFAULT_N8N_WORKFLOW_ID = 'CLKxBg3U2WBsVf0s'

export default function VoiceAgentConfigPage() {
  const { data: config, isLoading } = useVoiceAgentConfig()
  const mutation = useVoiceAgentConfigMutation()

  const [selectedProvider, setSelectedProvider] = useState<ProviderType>('n8n')
  const [phoneNumbers, setPhoneNumbers] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [settings, setSettings] = useState<Record<string, string>>({
    n8n_workflow_id: DEFAULT_N8N_WORKFLOW_ID,
    n8n_webhook_url: 'https://n8ndeploy.cloudforming.de/webhook/voice-agent-call',
    system_prompt: 'Du bist ein freundlicher und professioneller KI-Telefonassistent. Antworte auf Deutsch, kurz und praezise (max 2-3 Saetze). Sei hilfsbereit. Wenn du etwas nicht beantworten kannst, biete an, den Anrufer mit einem Mitarbeiter zu verbinden. Nenne keine internen Details oder Preise, verweise auf die Website.',
    llm_model: 'gpt-4o',
    llm_temperature: '0.7',
    llm_max_tokens: '300',
    sentiment_model: 'gpt-4o-mini',
    stt_provider: 'OpenAI Whisper',
    stt_language: 'de',
    tts_provider: 'OpenAI TTS',
  })
  const [saved, setSaved] = useState(false)

  // Load existing config
  useEffect(() => {
    if (config) {
      setSelectedProvider((config.provider as ProviderType) || 'n8n')
      setPhoneNumbers(Array.isArray(config.phone_numbers) ? (config.phone_numbers as string[]).join(', ') : '')
      setIsActive(config.is_active as boolean ?? true)
      const loadedSettings = (config.settings as Record<string, string>) ?? {}
      setSettings({
        n8n_workflow_id: DEFAULT_N8N_WORKFLOW_ID,
        ...loadedSettings,
      })
    }
  }, [config])

  const activeProvider = PROVIDERS.find((p) => p.id === selectedProvider)!
  const n8nWorkflowId = selectedProvider === 'n8n' ? (settings.n8n_workflow_id || DEFAULT_N8N_WORKFLOW_ID) : ''

  const handleFieldChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaved(false)

    const numbers = phoneNumbers
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)

    await mutation.mutateAsync({
      provider: selectedProvider,
      phone_numbers: numbers,
      is_active: isActive,
      settings,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const webhookUrl = `${window.location.origin.replace(/:\d+$/, ':3000')}/api/voice-agent/webhook`

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Voice Agent Konfiguration" subtitle="Provider und Einstellungen verwalten" />
        <Spinner />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Voice Agent Konfiguration"
        subtitle="Provider, Telefonnummern und Einstellungen verwalten"
        actionIcon={Settings2}
      />

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

        {/* ── Provider Selection ─────────────────────────────── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider waehlen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROVIDERS.map((provider) => (
              <Card
                key={provider.id}
                hover
                onClick={() => setSelectedProvider(provider.id)}
                className={`p-4 ${selectedProvider === provider.id ? 'ring-2 ring-primary border-primary' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    {provider.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 text-sm">{provider.name}</h3>
                      {provider.website && (
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-primary"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{provider.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── n8n Live Status ──────────────────────────────────── */}
        {selectedProvider === 'n8n' && n8nWorkflowId && (
          <N8nWorkflowPanel workflowId={n8nWorkflowId} />
        )}

        {/* ── n8n Architecture Info ─────────────────────────── */}
        {selectedProvider === 'n8n' && (
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">Eigener Voice Agent mit n8n</h3>
            <p className="text-sm text-green-800 mb-3">
              Dein KI-Telefonagent laeuft als n8n-Workflow mit voller Kontrolle ueber alle Komponenten:
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200 font-mono text-xs text-gray-700 space-y-1">
              <p>Anruf eingehend</p>
              <p className="text-gray-400">  |</p>
              <p>  Telefonie-Provider ({settings.sip_provider || 'noch nicht konfiguriert'})</p>
              <p className="text-gray-400">  |  Webhook</p>
              <p>  n8n Workflow (ID: {n8nWorkflowId})</p>
              <p className="text-gray-400">  |  |── STT: {settings.stt_provider || 'OpenAI Whisper'} ({settings.stt_language || 'de'}) → Text</p>
              <p className="text-gray-400">  |  |── LLM: {settings.llm_model || 'gpt-4o'} (Temp: {settings.llm_temperature || '0.7'}) → Antwort</p>
              <p className="text-gray-400">  |  |── Sentiment: {settings.sentiment_model || 'gpt-4o-mini'} → Stimmung</p>
              <p className="text-gray-400">  |  |── TTS: {settings.tts_provider || 'OpenAI TTS'} → Audio</p>
              <p className="text-gray-400">  |  └── Webhook → Dashboard (Logging)</p>
              <p>  Dashboard (Anzeige + Analyse)</p>
            </div>
          </Card>
        )}

        {/* ── Provider Settings ─────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {activeProvider.name} – Einstellungen
          </h2>

          <div className="space-y-4">
            {activeProvider.fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.key}
                    value={settings[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  />
                ) : (
                  <input
                    id={field.key}
                    type={field.type}
                    value={settings[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  />
                )}
                {field.helpText && (
                  <p className="text-xs text-gray-400 mt-1">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ── Phone Numbers ─────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Telefonnummern</h2>
          <div>
            <label htmlFor="phone_numbers" className="block text-sm font-medium text-gray-700 mb-1">
              Telefonnummern (kommagetrennt)
            </label>
            <input
              id="phone_numbers"
              type="text"
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="+49 89 12345678, +49 89 87654321"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Die Telefonnummern, die der Voice Agent bedient
            </p>
          </div>
        </Card>

        {/* ── Webhook Info ──────────────────────────────────── */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Webhook</h2>
          <p className="text-sm text-gray-600 mb-3">
            {selectedProvider === 'n8n'
              ? 'Diese URL ist bereits im n8n-Workflow konfiguriert. Der Workflow sendet Anrufdaten automatisch ans Dashboard:'
              : 'Trage diese URL in deinem Provider ein, um Anrufdaten ans Dashboard zu senden:'}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-mono break-all">
              POST {webhookUrl}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(webhookUrl)}
              className="px-3 py-2.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Kopieren
            </button>
          </div>
        </Card>

        {/* ── Test Panel ───────────────────────────────────── */}
        {selectedProvider === 'n8n' && settings.n8n_webhook_url && (
          <VoiceAgentTestPanel webhookUrl={settings.n8n_webhook_url} />
        )}

        {/* ── Active Toggle + Save ──────────────────────────── */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-300'}`}
              onClick={() => setIsActive(!isActive)}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Voice Agent {isActive ? 'aktiv' : 'inaktiv'}
            </span>
          </label>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600 font-medium">Gespeichert!</span>
            )}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {mutation.isPending ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        </div>

        {mutation.isError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
            Fehler beim Speichern: {(mutation.error as Error).message}
          </div>
        )}
      </form>
    </div>
  )
}
