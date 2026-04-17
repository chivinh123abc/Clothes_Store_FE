import type { Collection } from '../types/collection'

export const mockCollections: Collection[] = [
  {
    collection_id: 1,
    collection_name: 'TEAM KIT',
    collection_slug: 'team-kit',
    parent_collection_id: null,
    description: 'Official team jerseys and gear'
  },
  {
    collection_id: 2,
    collection_name: 'COLLECTION',
    collection_slug: 'collection',
    parent_collection_id: null,
    description: 'Main season collections',
    children: [
      {
        collection_id: 4,
        collection_name: 'ESSENTIAL',
        collection_slug: 'essential',
        parent_collection_id: 2,
        description: 'Everyday streetwear essentials',
        children: [
          {
            collection_id: 7,
            collection_name: 'GIFT & ACCESSORY',
            collection_slug: 'essential-gift-and-accessory',
            parent_collection_id: 4
          },
          {
            collection_id: 8,
            collection_name: 'APPAREL',
            collection_slug: 'essential-apparel',
            parent_collection_id: 4
          }
        ]
      },
      {
        collection_id: 5,
        collection_name: 'LEAGUE OF LEGENDS',
        collection_slug: 'league-of-legends',
        parent_collection_id: 2,
        description: 'Official LoL themed apparel',
        children: [
          {
            collection_id: 9,
            collection_name: 'GIFT & ACCESSORY',
            collection_slug: 'lol-gift-and-accessory',
            parent_collection_id: 5
          },
          {
            collection_id: 10,
            collection_name: 'APPAREL',
            collection_slug: 'lol-apparel',
            parent_collection_id: 5
          }
        ]
      },
      {
        collection_id: 6,
        collection_name: 'VALORANT',
        collection_slug: 'valorant',
        parent_collection_id: 2,
        description: 'Official Valorant themed apparel',
        children: [
          {
            collection_id: 11,
            collection_name: 'GIFT & ACCESSORY',
            collection_slug: 'valorant-gift-and-accessory',
            parent_collection_id: 6
          },
          {
            collection_id: 12,
            collection_name: 'APPAREL',
            collection_slug: 'valorant-apparel',
            parent_collection_id: 6
          }
        ]
      }
    ]
  },
  {
    collection_id: 3,
    collection_name: 'COLLABORATION',
    collection_slug: 'collaboration',
    parent_collection_id: null,
    description: 'Limited edition collaborations with other brands',
    children: [
      {
        collection_id: 13,
        collection_name: 'DISNEY',
        collection_slug: 'disney',
        parent_collection_id: 3
      },
      {
        collection_id: 14,
        collection_name: 'RINSTORE X GOALSTUDIO',
        collection_slug: 'rinstore-x-goalstudio',
        parent_collection_id: 3
      },
      {
        collection_id: 15,
        collection_name: 'RINSTORE X SECRETLAB',
        collection_slug: 'rinstore-x-secretlab',
        parent_collection_id: 3
      },
      {
        collection_id: 16,
        collection_name: 'RINSTORE X RAZER',
        collection_slug: 'rinstore-x-razer',
        parent_collection_id: 3
      }
    ]
  },
  {
    collection_id: 20,
    collection_name: 'LEGACY',
    collection_slug: 'legacy',
    parent_collection_id: null,
    description: 'Archive of past collections',
    children: [
      {
        collection_id: 17,
        collection_name: 'T1 2025 WORLDS COLLECTION',
        collection_slug: 'worlds-2025',
        parent_collection_id: 20
      },
      {
        collection_id: 18,
        collection_name: 'T1 2024 WORLDS COLLECTION',
        collection_slug: 'worlds-2024',
        parent_collection_id: 20
      },
      {
        collection_id: 19,
        collection_name: 'T1 2023 WORLDS COLLECTION',
        collection_slug: 'worlds-2023',
        parent_collection_id: 20
      },
      {
        collection_id: 21,
        collection_name: 'APPAREL',
        collection_slug: 'legacy-apparel',
        parent_collection_id: 20
      },
      {
        collection_id: 22,
        collection_name: 'GIFTS & ACCESSORIES',
        collection_slug: 'legacy-gifts',
        parent_collection_id: 20
      }
    ]
  }
]

// Helper to flatten collections for easier lookup
export const flattenCollections = (colls: Collection[]): Collection[] => {
  let results: Collection[] = []
  colls.forEach(c => {
    results.push(c)
    if (c.children) {
      results = results.concat(flattenCollections(c.children))
    }
  })
  return results
}

export const allCollections = flattenCollections(mockCollections)

// Helper to get all descendant slugs for a given slug
export const getCollectionFamily = (slug: string): string[] => {
  const root = allCollections.find(c => c.collection_slug === slug)
  if (!root) return []
  let family = [root.collection_slug]
  if (root.children) {
    root.children.forEach(child => {
      family = family.concat(getCollectionFamily(child.collection_slug))
    })
  }
  return family
}
