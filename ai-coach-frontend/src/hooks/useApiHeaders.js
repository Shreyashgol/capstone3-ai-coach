export function useApiHeaders() {
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  return { headers }
}

