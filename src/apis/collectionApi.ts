/* eslint-disable indent */
import axiosClient from './axiosClient'
import type { Collection } from '../types/collection'

const collectionApi = {
    getAll: () => axiosClient.get<Collection[]>('/collection'),
    getById: (id: number) => axiosClient.get<Collection>(`/collection/${id}`),
    getBySlug: (slug: string) => axiosClient.get<Collection>(`/collection/slug/${slug}`),
    getProductsByCollection: (slug: string) => axiosClient.get<any>(`/collection/slug/${slug}/products`),
    create: (data: Partial<Collection>) => axiosClient.post<Collection>('/collection', data),
    update: (id: number, data: Partial<Collection>) => axiosClient.put<Collection>(`/collection/${id}`, data),
    delete: (id: number) => axiosClient.delete(`/collection/${id}`)
}

export default collectionApi
