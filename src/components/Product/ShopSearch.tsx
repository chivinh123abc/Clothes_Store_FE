import { Search, X } from 'lucide-react'

interface ShopSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ShopSearch({ value, onChange }: ShopSearchProps) {
  return (
    <div className='relative w-full max-w-md group'>
      <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-t1-red transition-colors'>
        <Search className='w-5 h-5' />
      </div>
      <input
        type='text'
        placeholder='Search for products...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full bg-t1-gray/50 border border-white/5 py-4 pl-12 pr-12 text-sm font-inter text-white placeholder:text-gray-600 focus:outline-none focus:border-t1-red/50 focus:bg-t1-gray/80 transition-all backdrop-blur-sm'
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors'
        >
          <X className='w-4 h-4' />
        </button>
      )}
    </div>
  )
}
