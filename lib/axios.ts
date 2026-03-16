import axios from "axios"
import { API_BASE_URL, ENDPOINTS } from "./constants"
import { useAuthStore } from "./auth-store"

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

type FailedRequest = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      const message =
        error.response?.data?.message ?? error.message ?? "Request failed"
      return Promise.reject(new Error(message))
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return axiosInstance(original)
      })
    }

    original._retry = true
    isRefreshing = true

    const { refreshToken, setTokens, clearAuth } = useAuthStore.getState()

    if (!refreshToken) {
      clearAuth()
      isRefreshing = false
      return Promise.reject(new Error("Session expired. Please sign in again."))
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.auth.refresh}`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      )
      setTokens(data.accessToken, refreshToken)
      processQueue(null, data.accessToken)
      original.headers.Authorization = `Bearer ${data.accessToken}`
      return axiosInstance(original)
    } catch (err) {
      processQueue(err, null)
      clearAuth()
      return Promise.reject(new Error("Session expired. Please sign in again."))
    } finally {
      isRefreshing = false
    }
  }
)
