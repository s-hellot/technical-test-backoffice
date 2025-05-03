import api from './index'

export interface User {
    id?: string,
    firstName: string,
    lastName: string,
    email: string,
    birthDate: string,
}

export interface NewUser extends User {
    password?: string
}

export const getUsers = (search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    return api.get<Array<User>>('/users', {
        params: {
            search,
            sortBy,
            sortOrder
        }
    })
}

export const getUserById = (id: string) => api.get<User>(`/users/${id}`)

export const createUser = (user: NewUser) => api.post<User>(`/users`, user)

export const updateUser = (id: string, user: Partial<User>) => api.put<User>(`/users/${id}`, user)
  
export const deleteUser = (id: string) => api.delete(`/users/${id}`)