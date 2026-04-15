import { CheckCircle, Clock, TrendingUp } from 'lucide-react'

export interface MockOrderItem {
  name: string
  size: string
  qty: number
  price: number
  image: string
}

export interface MockOrder {
  id: string
  date: string
  status: 'DELIVERED' | 'SHIPPED' | 'PROCESSING'
  total: number
  items: MockOrderItem[]
}

export const mockOrders: MockOrder[] = [
  {
    id: 'T1-240415-001',
    date: '2026-04-10',
    status: 'DELIVERED',
    total: 189.98,
    items: [
      { name: 'Essential Black Hoodie', size: 'M', qty: 1, price: 89.99, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400' },
      { name: 'Urban Black Tee', size: 'L', qty: 2, price: 49.99, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'T1-240403-002',
    date: '2026-04-03',
    status: 'SHIPPED',
    total: 319.99,
    items: [
      { name: 'Faker Unkillable Demon King Jacket', size: 'XL', qty: 1, price: 150.00, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400' },
      { name: 'Keria Lux Mastercap', size: 'ONE SIZE', qty: 1, price: 35.00, image: 'https://images.unsplash.com/photo-1534215754734-18e547076132?auto=format&fit=crop&q=80&w=400' },
      { name: 'T1 Official Team Jersey 2024', size: 'S', qty: 1, price: 110.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'T1-240320-003',
    date: '2026-03-20',
    status: 'PROCESSING',
    total: 29.99,
    items: [
      { name: 'Faker "What was that" Mousepad', size: 'N/A', qty: 1, price: 29.99, image: 'https://images.unsplash.com/photo-1527814050087-3793815479fa?auto=format&fit=crop&q=80&w=400' }
    ]
  }
]

export const STATUS_CONFIG = {
  DELIVERED: { label: 'Delivered', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle },
  SHIPPED:   { label: 'Shipped',   color: 'text-blue-400 border-blue-400/30 bg-blue-400/10',     icon: TrendingUp },
  PROCESSING: { label: 'Processing', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10', icon: Clock }
}
