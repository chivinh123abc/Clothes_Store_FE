/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import collectionApi from '../apis/collectionApi'
import type { Collection } from '../types/collection'

interface CollectionContextType {
  collections: Collection[]; // Root-level collections
  allCollectionsFlat: Collection[];
  loading: boolean;
  error: string | null;
  findCollectionBySlug: (slug: string) => Collection | null;
  getCollectionDescendants: (slug: string) => string[];
  refreshCollections: () => Promise<void>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allCollectionsFlat, setAllCollectionsFlat] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response = await collectionApi.getAll()
      setAllCollectionsFlat(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  // Build the hierarchical tree from flat data
  const collections = useMemo(() => {
    const map = new Map<number, Collection>()
    const roots: Collection[] = []

    // Initialize map and deep copy objects to avoid modifying base state
    allCollectionsFlat.forEach(c => {
      map.set(c.collection_id, { ...c, children: [] })
    })

    allCollectionsFlat.forEach(c => {
      const node = map.get(c.collection_id)!
      if (c.parent_collection_id && map.has(c.parent_collection_id)) {
        map.get(c.parent_collection_id)!.children?.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }, [allCollectionsFlat])

  const findCollectionBySlug = (slug: string): Collection | null => {
    const findRecursive = (items: Collection[]): Collection | null => {
      for (const item of items) {
        if (item.collection_slug === slug) return item
        if (item.children && item.children.length > 0) {
          const found = findRecursive(item.children)
          if (found) return found
        }
      }
      return null
    }
    return findRecursive(collections)
  }

  const getCollectionDescendants = (slug: string): string[] => {
    const root = findCollectionBySlug(slug)
    if (!root) return []

    const slugs: string[] = [root.collection_slug]
    const getChildSlugs = (items: Collection[]) => {
      items.forEach(item => {
        slugs.push(item.collection_slug)
        if (item.children) getChildSlugs(item.children)
      })
    }
    if (root.children) getChildSlugs(root.children)
    return slugs
  }

  return (
    <CollectionContext.Provider value={{
      collections,
      allCollectionsFlat,
      loading,
      error,
      findCollectionBySlug,
      getCollectionDescendants,
      refreshCollections: fetchCollections
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

export const useCollections = () => {
  const context = useContext(CollectionContext)
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionProvider')
  }
  return context
}
