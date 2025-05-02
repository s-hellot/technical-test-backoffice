import api from './index'

export interface User {
    id?: string,
    firstName: string,
    lastName: string,
    email: string,
    birthdate: string
}

export const getUsers = () => api.get<Array<User>>('/users')

export const getUserById = (id: string) => api.get<User>(`/users/${id}`)

export const createUser = (user: User) => api.post<User>(`/users`, user)

export const updateUser = (id: string, user: Partial<User>) => api.put<User>(`/users/${id}`, user)
  
export const deleteUser = (id: string) => api.delete(`/users/${id}`)