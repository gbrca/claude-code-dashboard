import type {
  LoginRequest,
  LoginResponse,
  DashboardStats,
  TableDataRequest,
  TableDataResponse,
  Transaction,
} from '@/types'

const API_BASE = '/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      window.location.href = '/login'
    }
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new ApiError(response.status, error.message || 'An error occurred')
  }

  return response.json()
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }))
      throw new ApiError(response.status, error.message || 'Invalid credentials')
    }

    return response.json()
  },

  async getDemoCredentials() {
    return fetch(`${API_BASE}/auth/demo-credentials`).then((r) => r.json())
  },
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    return fetchWithAuth(`${API_BASE}/dashboard/stats`)
  },

  async getTransactions(
    request: TableDataRequest
  ): Promise<TableDataResponse<Transaction>> {
    return fetchWithAuth(`${API_BASE}/dashboard/transactions`, {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },
}
