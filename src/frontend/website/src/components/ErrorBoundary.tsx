import { Component, ErrorInfo, ReactNode } from 'react'

interface IErrorBoundaryProps {
  children:   ReactNode
  fallback?:  ReactNode
}

interface IErrorBoundaryState {
  hasError: boolean
  error?:   Error
}

/**
 * ErrorBoundary – fängt React-Render-Fehler ab und zeigt Fallback-UI
 *
 * Verwendung:
 * <ErrorBoundary>
 *   <MeineKomponente />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
    // ✏️ Hier z.B. Sentry.captureException(error) einbauen
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Etwas ist schiefgelaufen
            </h1>
            <p className="text-gray-500 mb-6">
              Ein unerwarteter Fehler ist aufgetreten. Bitte lade die Seite neu.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Seite neu laden
            </button>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="mt-6 text-left text-xs bg-red-50 text-red-700 p-4 rounded-lg overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
