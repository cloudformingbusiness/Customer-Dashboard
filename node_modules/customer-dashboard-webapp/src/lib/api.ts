const API_URL = import.meta.env.VITE_API_URL || ''

interface IApiOptions {
  method?: string
  body?: unknown
  token?: string
}

export async function apiFetch<T>(path: string, options: IApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((error as { error?: string }).error ?? `API Error ${res.status}`)
  }

  return res.json() as Promise<T>
}
