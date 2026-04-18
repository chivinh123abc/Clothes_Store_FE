/* eslint-disable indent */
import axiosClient from './axiosClient'

export interface Category {
    category_id: number
    category_name: string
    category_slug: string
    category_description?: string
}

const categoryApi = {
    getCategories: () => axiosClient.get<Category[]>('/category'),
    create: (data: Partial<Category>) => axiosClient.post<Category>('/category', data),
    update: (id: number, data: Partial<Category>) => axiosClient.put<Category>(`/category/${id}`, data),
    delete: (id: number) => axiosClient.delete(`/category/${id}`)
}

export default categoryApi
