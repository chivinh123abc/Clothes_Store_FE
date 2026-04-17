export interface Collection {
  collection_id: number;
  collection_name: string;
  collection_slug: string;
  parent_collection_id: number | null;
  description?: string;
  children?: Collection[];
}
