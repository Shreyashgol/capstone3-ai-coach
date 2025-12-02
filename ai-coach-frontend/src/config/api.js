// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001'

export const apiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_BASE_URL}/${cleanEndpoint}`
}

export default {
  baseURL: API_BASE_URL,
  url: apiUrl
}