import api from './index'

export interface LoginPayload {
  email: string
  password: string
}

export const login = (data: LoginPayload) => api.post<{ token: string }>('/login', data)