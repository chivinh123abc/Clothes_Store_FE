/* eslint-disable indent */
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, User, Shirt, Sparkles, Download, ShoppingCart,
  ChevronRight, ChevronLeft, Check, Search, Loader2,
  RefreshCw, Camera, AlertCircle, ImageIcon
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import { useCart } from '~/contexts/CartContext'
import productApi from '~/apis/productApi'
import { runTryOn } from '~/apis/tryOnApi'
import type { Product } from '~/types/product'
import { formatPrice } from '~/utils/format'
import { useLanguage } from '~/contexts/LanguageContext'

// ─── Avatar Templates ──────────────────────────────────────────────────────────
const AVATAR_TEMPLATES = [
  { id: 'male_casual',   label: 'Male – Casual',   src: '/avatars/avatar_male_casual.png',   gender: 'M' },
  { id: 'female_casual', label: 'Female – Casual',  src: '/avatars/avatar_female_casual.png', gender: 'F' },
  { id: 'male_sporty',   label: 'Male – Sporty',   src: '/avatars/avatar_male_sporty.png',   gender: 'M' },
  { id: 'female_sporty', label: 'Female – Sporty',  src: '/avatars/avatar_female_sporty.png', gender: 'F' },
]

// ─── Stepper ──────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, icon: User,    label: 'Choose Model'   },
  { id: 2, icon: Shirt,   label: 'Choose Outfit'  },
  { id: 3, icon: Sparkles, label: 'Try On Result' },
]

function StepBar({ current }: { current: number }) {
  return (
    <div className='flex items-center justify-center gap-0 mb-12'>
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const done    = current > step.id
        const active  = current === step.id
        return (
          <div key={step.id} className='flex items-center'>
            <div className='flex flex-col items-center gap-2'>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500
                ${done   ? 'bg-t1-red border-t1-red text-white shadow-[0_0_20px_rgba(226,1,45,0.4)]'
                         : active ? 'bg-transparent border-t1-red text-t1-red shadow-[0_0_20px_rgba(226,1,45,0.2)]'
                         : 'bg-transparent border-white/20 text-white/30'}`}>
                {done ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <span className={`text-[10px] font-oswald font-bold tracking-widest uppercase transition-colors ${
                active ? 'text-t1-red' : done ? 'text-white' : 'text-white/30'
              }`}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 md:w-28 h-[1px] mx-3 mb-5 transition-colors duration-500 ${
                current > step.id ? 'bg-t1-red' : 'bg-white/10'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1 — Choose Model ────────────────────────────────────────────────────
function Step1({ onNext }: { onNext: (img: string, isFile: boolean) => void }) {
  const [tab, setTab]               = useState<'upload' | 'template'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage]       = useState<string | null>(null)
  const [dragging, setDragging]     = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onloadend = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const canProceed = tab === 'template' ? !!selectedTemplate : !!uploadedImage
  const currentImage = tab === 'template' ? selectedTemplate : uploadedImage

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* Tabs */}
      <div className='flex gap-1 mb-8 border border-white/10 p-1 rounded-sm w-fit mx-auto'>
        {[
          { id: 'template', label: 'Choose Avatar' },
          { id: 'upload',   label: 'Upload My Photo' }
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-oswald font-bold tracking-widest uppercase transition-all duration-300 ${
              tab === id ? 'bg-t1-red text-white' : 'text-white/50 hover:text-white'
            }`}
          >{id === 'upload' ? <Camera size={14} /> : <User size={14} />}{label}</button>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left — selection panel */}
        <div>
          <AnimatePresence mode='wait'>
            {tab === 'template' ? (
              <motion.div key='template' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className='text-xs text-gray-500 font-inter tracking-wider mb-6 uppercase'>
                  Select a model avatar to get started
                </p>
                <div className='grid grid-cols-2 gap-4'>
                  {AVATAR_TEMPLATES.map(av => (
                    <button
                      key={av.id}
                      onClick={() => setSelectedTemplate(av.src)}
                      className={`relative border-2 overflow-hidden transition-all duration-300 group ${
                        selectedTemplate === av.src
                          ? 'border-t1-red shadow-[0_0_25px_rgba(226,1,45,0.4)]'
                          : 'border-white/10 hover:border-white/40'
                      }`}
                    >
                      <img
                        src={av.src}
                        alt={av.label}
                        className='w-full aspect-[3/4] object-cover object-top group-hover:scale-105 transition-transform duration-500'
                      />
                      {selectedTemplate === av.src && (
                        <div className='absolute top-3 right-3 w-7 h-7 rounded-full bg-t1-red flex items-center justify-center'>
                          <Check size={14} className='text-white' />
                        </div>
                      )}
                      <div className='absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3'>
                        <p className='text-xs font-oswald font-bold text-white tracking-wider'>{av.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key='upload' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className='text-xs text-gray-500 font-inter tracking-wider mb-6 uppercase'>
                  Upload a clear full-body photo of yourself
                </p>
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-sm p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
                    dragging ? 'border-t1-red bg-t1-red/5' : 'border-white/20 hover:border-white/50 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center'>
                    <Upload size={28} className='text-white/40' />
                  </div>
                  <div className='text-center'>
                    <p className='text-sm font-oswald font-bold text-white tracking-wider'>DROP PHOTO HERE</p>
                    <p className='text-xs text-gray-500 font-inter mt-1'>or click to browse • JPG, PNG, WEBP</p>
                  </div>
                  <input ref={fileInputRef} type='file' className='hidden' accept='image/*'
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                </div>

                {/* Tips */}
                <div className='mt-6 p-4 bg-white/[0.03] border border-white/5 rounded-sm'>
                  <p className='text-[10px] font-oswald font-bold text-t1-red tracking-widest mb-3 uppercase'>📸 Tips for best results</p>
                  <ul className='space-y-1.5 text-[11px] text-gray-400 font-inter'>
                    <li className='flex items-center gap-2'><Check size={10} className='text-t1-red shrink-0'/> Full body visible from head to toe</li>
                    <li className='flex items-center gap-2'><Check size={10} className='text-t1-red shrink-0'/> Stand straight, arms slightly away from body</li>
                    <li className='flex items-center gap-2'><Check size={10} className='text-t1-red shrink-0'/> Plain / uncluttered background</li>
                    <li className='flex items-center gap-2'><Check size={10} className='text-t1-red shrink-0'/> Good lighting, front-facing</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — preview */}
        <div className='flex flex-col items-center'>
          <div className='w-full max-w-[280px] aspect-[3/4] border border-white/10 bg-white/[0.02] rounded-sm overflow-hidden flex items-center justify-center'>
            {currentImage ? (
              <img src={currentImage} alt='Selected model' className='w-full h-full object-cover object-top' />
            ) : (
              <div className='flex flex-col items-center gap-3 text-white/20'>
                <ImageIcon size={48} />
                <p className='text-xs font-inter tracking-wider'>Preview</p>
              </div>
            )}
          </div>
          <p className='text-[10px] text-gray-600 font-inter mt-3 tracking-wider uppercase'>Model Preview</p>
        </div>
      </div>

      {/* Next */}
      <div className='flex justify-end mt-10'>
        <button
          onClick={() => currentImage && onNext(currentImage, tab === 'upload')}
          disabled={!canProceed}
          className='flex items-center gap-3 px-10 py-4 bg-t1-red text-white font-oswald font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#ff0033] hover:shadow-[0_0_30px_rgba(226,1,45,0.5)] shadow-[0_0_20px_rgba(226,1,45,0.2)]'
        >
          NEXT — CHOOSE OUTFIT <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Step 2 — Choose Outfit ───────────────────────────────────────────────────
function Step2({
  onNext,
  onBack,
  preselectedProductId
}: {
  onNext: (product: Product, garmentImg: string) => void
  onBack: () => void
  preselectedProductId?: number
}) {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<Product | null>(null)
  const { language }              = useLanguage()

  useEffect(() => {
    productApi.getAll().then(res => {
      const data = Array.isArray(res.data) ? res.data : (res as any)
      setProducts(data)
      if (preselectedProductId) {
        const pre = data.find((p: Product) => p.product_id === preselectedProductId)
        if (pre) setSelected(pre)
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [preselectedProductId])

  // clothing-only products (filter out accessories, hats, shoes, bags, keychains, and lower body pants/skirts/dresses)
  const isClothing = (cat?: string, name?: string): boolean => {
    const c = (cat || '').toLowerCase()
    const n = (name || '').toLowerCase()
    // ONLY upper body clothing keywords (tops)
    const clothingKeywords = ['tshirt', 'shirt', 'hoodie', 'sweater', 'jacket', 'apparel', 'áo thun', 'sơ mi', 'áo len', 'áo khoác', 'áo hoodie', 't-shirt', 'uniform', 'team kit', 'jersey', 'áo đấu', 'đồng phục', 'áo']
    // Excluded keywords (accessories, lower body, full body)
    const excludeKeywords = ['pants', 'quần', 'shorts', 'jeans', 'skirt', 'dress', 'váy', 'đầm', 'one-piece', 'suit', 'bag', 'túi', 'balo', 'shoe', 'giày', 'hat', 'mũ', 'nón', 'accessory', 'phụ kiện', 'gift', 'quà', 'chair', 'ghế', 'mouse', 'chuột', 'keyboard', 'bàn phím', 'pad', 'tất', 'sock', 'keycap', 'móc khóa', 'keychain', 'sticker', 'sổ', 'notebook', 'bình nước', 'bottle', 'cup', 'ly', 'cốc', 'banner', 'poster', 'giftcard', 'card']

    const hasClothing = clothingKeywords.some(k => c.includes(k) || n.includes(k))
    const hasExclude = excludeKeywords.some(k => c.includes(k) || n.includes(k))

    return hasClothing && !hasExclude
  }

  const displayProducts = products.filter(p => {
    const isCloth = isClothing(p.category_name, p.product_name)
    const matchesSearch = !search || p.product_name.toLowerCase().includes(search.toLowerCase())
    return isCloth && matchesSearch
  }).filter(p => p.items && p.items.length > 0 && p.items[0].product_item_image)

  const getGarmentImage = (product: Product): string => {
    return product.items?.[0]?.product_item_image || ''
  }

  const canProceed = !!selected && !!getGarmentImage(selected)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left: product grid */}
        <div className='lg:col-span-2'>
          {/* Search */}
          <div className='relative mb-6'>
            <Search size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search clothing...'
              className='w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 text-white text-sm font-inter placeholder-gray-600 focus:outline-none focus:border-t1-red/50 transition-colors'
            />
          </div>

          {loading ? (
            <div className='flex items-center justify-center py-20'>
              <Loader2 className='w-8 h-8 text-t1-red animate-spin' />
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar'>
              {displayProducts.map(product => {
                const img = getGarmentImage(product)
                const price = product.items?.[0]?.sale_price ?? product.items?.[0]?.product_item_price ?? 0
                const isSelected = selected?.product_id === product.product_id
                return (
                  <button
                    key={product.product_id}
                    onClick={() => setSelected(product)}
                    className={`relative border overflow-hidden text-left group transition-all duration-300 ${
                      isSelected
                        ? 'border-t1-red shadow-[0_0_20px_rgba(226,1,45,0.3)]'
                        : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <div className='aspect-square overflow-hidden bg-white/5'>
                      <img
                        src={img}
                        alt={product.product_name}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                    </div>
                    {isSelected && (
                      <div className='absolute top-2 right-2 w-6 h-6 rounded-full bg-t1-red flex items-center justify-center'>
                        <Check size={12} className='text-white' />
                      </div>
                    )}
                    <div className='p-2'>
                      <p className='text-[11px] font-oswald font-bold text-white uppercase line-clamp-1 tracking-wider'>
                        {product.product_name}
                      </p>
                      <p className='text-[10px] text-t1-red font-inter mt-0.5'>{formatPrice(price, language)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: selected preview */}
        <div className='flex flex-col'>
          <p className='text-xs font-oswald font-bold text-gray-500 tracking-widest uppercase mb-4'>Selected Item</p>
          <div className='border border-white/10 bg-white/[0.02] aspect-square flex items-center justify-center overflow-hidden rounded-sm'>
            {selected && getGarmentImage(selected) ? (
              <img
                src={getGarmentImage(selected)}
                alt={selected.product_name}
                className='w-full h-full object-contain'
              />
            ) : (
              <div className='flex flex-col items-center gap-3 text-white/20'>
                <Shirt size={48} />
                <p className='text-xs font-inter tracking-wider'>No item selected</p>
              </div>
            )}
          </div>
          {selected && (
            <div className='mt-4 p-4 bg-white/[0.03] border border-white/5'>
              <p className='text-sm font-oswald font-bold text-white uppercase tracking-wider line-clamp-2'>
                {selected.product_name}
              </p>
              <p className='text-xs text-t1-red font-inter mt-1'>
                {formatPrice(
                  selected.items?.[0]?.sale_price ?? selected.items?.[0]?.product_item_price ?? 0,
                  language
                )}
              </p>
              {selected.category_name && (
                <p className='text-[10px] text-gray-500 font-inter mt-1 uppercase tracking-wider'>
                  {selected.category_name}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className='flex justify-between mt-10'>
        <button
          onClick={onBack}
          className='flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-oswald font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:border-white'
        >
          <ChevronLeft size={18} /> BACK
        </button>
        <button
          onClick={() => {
            if (selected) {
              const img = getGarmentImage(selected)
              onNext(selected, img)
            }
          }}
          disabled={!canProceed}
          className='flex items-center gap-3 px-10 py-4 bg-t1-red text-white font-oswald font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#ff0033] hover:shadow-[0_0_30px_rgba(226,1,45,0.5)] shadow-[0_0_20px_rgba(226,1,45,0.2)]'
        >
          TRY IT ON <Sparkles size={18} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Step 3 — Result ──────────────────────────────────────────────────────────
function Step3({
  modelImage,
  product,
  garmentImage,
  onReset,
  onBack
}: {
  modelImage: string
  product: Product
  garmentImage: string
  onReset: () => void
  onBack: () => void
}) {
  const { addCartItem } = useCart()
  const { language }    = useLanguage()
  const [status, setStatus]     = useState<'processing' | 'done' | 'error'>('processing')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startedRef = useRef(false)

  const [hfToken, setHfToken] = useState(localStorage.getItem('hf_token') || '')
  const [tokenSaved, setTokenSaved] = useState(false)

  const handleSaveToken = () => {
    const trimmed = hfToken.trim()
    if (trimmed) {
      localStorage.setItem('hf_token', trimmed)
    } else {
      localStorage.removeItem('hf_token')
    }
    setTokenSaved(true)
    setTimeout(() => setTokenSaved(false), 3000)
  }

  const handleRetry = () => {
    setStatus('processing')
    setError(null)
    setElapsedSeconds(0)

    runTryOn(modelImage, garmentImage, product.product_name, product.category_name)
      .then(url => {
        setResultUrl(url)
        setStatus('done')
      })
      .catch(err => {
        console.error('Try-on error:', err)
        setError(err?.message || 'Something went wrong. Please try again.')
        setStatus('error')
      })
  }

  // Run try-on on mount
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    runTryOn(modelImage, garmentImage, product.product_name, product.category_name)
      .then(url => {
        setResultUrl(url)
        setStatus('done')
      })
      .catch(err => {
        console.error('Try-on error:', err)
        setError(err?.message || 'Something went wrong. Please try again.')
        setStatus('error')
      })
  }, [modelImage, garmentImage, product.product_name, product.category_name])

  const handleDownload = async () => {
    if (!resultUrl) return
    try {
      const resp = await fetch(resultUrl)
      const blob = await resp.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `tryon_${product.product_name.replace(/\s+/g, '_')}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: open in new tab
      window.open(resultUrl, '_blank')
    }
  }

  const handleAddToCart = () => {
    const item = product.items?.[0]
    addCartItem({
      id: product.product_id,
      name: product.product_name,
      price: item?.sale_price ?? item?.product_item_price ?? 0,
      originalPrice: item?.sale_price ? item.product_item_price : null,
      imageUrl: item?.product_item_image ?? null,
      size: item?.size ?? 'M'
    }, 1, item?.stock_quantity ?? 0)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* Processing state */}
      {status === 'processing' && (
        <div className='flex flex-col items-center justify-center py-20 gap-8'>
          {/* AI visual */}
          <div className='relative w-40 h-40'>
            <div className='absolute inset-0 rounded-full border-2 border-t1-red/20 animate-ping' style={{ animationDuration: '2s' }} />
            <div className='absolute inset-4 rounded-full border-2 border-t1-red/30 animate-ping' style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            <div className='absolute inset-8 rounded-full border-2 border-t1-red/50 animate-ping' style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
            <div className='absolute inset-0 flex items-center justify-center'>
              <Sparkles size={40} className='text-t1-red animate-pulse' />
            </div>
          </div>

          <div className='text-center'>
            <h3 className='text-2xl font-oswald font-black text-white italic uppercase tracking-widest mb-3'>
              AI Is Working Its Magic
            </h3>
            <p className='text-gray-400 font-inter text-sm mb-2'>
              IDM-VTON is generating your virtual outfit...
            </p>
            <p className='text-[11px] text-gray-600 font-inter'>
              Elapsed: {elapsedSeconds}s — May take 30–90 seconds
            </p>
          </div>

          {/* Progress bar (visual only) */}
          <div className='w-64 h-1 bg-white/5 rounded-full overflow-hidden'>
            <div
              className='h-full bg-t1-red rounded-full transition-all duration-1000'
              style={{ width: `${Math.min((elapsedSeconds / 90) * 100, 95)}%` }}
            />
          </div>

          {/* Input previews */}
          <div className='flex items-center gap-6'>
            <div className='flex flex-col items-center gap-2'>
              <div className='w-20 h-28 border border-white/10 overflow-hidden rounded-sm'>
                <img src={modelImage} alt='Model' className='w-full h-full object-cover object-top' />
              </div>
              <p className='text-[10px] text-gray-500 font-inter uppercase tracking-wider'>Your Model</p>
            </div>
            <div className='w-8 h-8 rounded-full bg-t1-red/10 flex items-center justify-center'>
              <Sparkles size={16} className='text-t1-red' />
            </div>
            <div className='flex flex-col items-center gap-2'>
              <div className='w-20 h-28 border border-white/10 overflow-hidden rounded-sm'>
                <img src={garmentImage} alt='Garment' className='w-full h-full object-contain' />
              </div>
              <p className='text-[10px] text-gray-500 font-inter uppercase tracking-wider'>The Outfit</p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className='flex flex-col items-center justify-center py-16 gap-6 max-w-xl mx-auto'>
          <div className='w-20 h-20 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center'>
            <AlertCircle size={36} className='text-red-400' />
          </div>
          <div className='text-center w-full'>
            <h3 className='text-xl font-oswald font-black text-white italic uppercase tracking-wider mb-3'>
              {language === 'vi' ? 'Thử Đồ Thất Bại' : 'Try-On Failed'}
            </h3>
            <p className='text-gray-400 font-inter text-xs mb-4 bg-red-950/20 border border-red-500/20 p-4 rounded-sm break-all font-mono text-left max-w-md mx-auto'>
              {error}
            </p>
            <p className='text-[11px] text-gray-500 font-inter max-w-md mx-auto leading-relaxed'>
              {language === 'vi' 
                ? 'Hệ thống HuggingFace có thể đang bị quá tải hoặc tài khoản của bạn đã đạt giới hạn lượt sử dụng miễn phí (ZeroGPU Quota).' 
                : 'The HuggingFace server may be busy or you have reached your free ZeroGPU Quota limit.'}
            </p>
          </div>

          {/* Quota Bypass / Token input */}
          <div className='w-full border border-white/10 bg-white/[0.02] p-5 rounded-sm text-left my-2'>
            <div className='flex items-center gap-2 mb-2'>
              <Sparkles size={16} className='text-t1-red' />
              <span className='text-xs font-oswald font-bold text-white tracking-wider uppercase'>
                {language === 'vi' ? 'MẸO: BỎ QUA GIỚI HẠN QUOTA (MIỄN PHÍ)' : 'TIP: BYPASS QUOTA LIMIT (FREE)'}
              </span>
            </div>
            <div className='text-[11px] text-gray-400 font-inter leading-relaxed mb-4 space-y-1.5'>
              {language === 'vi' ? (
                <>
                  <p>HuggingFace giới hạn lượt dùng thử miễn phí theo IP. Để lấy thêm quota và không phải chờ đợi:</p>
                  <p>1. Đăng ký hoặc đăng nhập tài khoản tại <a href="https://huggingface.co" target="_blank" rel="noreferrer" className='text-t1-red hover:underline font-bold'>huggingface.co</a>.</p>
                  <p>2. Vào mục <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className='text-t1-red hover:underline font-bold'>Settings ➡️ Access Tokens</a> tạo một token mới (chọn Type là <b>Read</b>).</p>
                  <p>3. Dán Token vào ô bên dưới rồi nhấn Lưu:</p>
                </>
              ) : (
                <>
                  <p>HuggingFace limits free usage per IP. To bypass ZeroGPU limits and get priority queueing:</p>
                  <p>1. Register or login at <a href="https://huggingface.co" target="_blank" rel="noreferrer" className='text-t1-red hover:underline font-bold'>huggingface.co</a>.</p>
                  <p>2. Go to <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className='text-t1-red hover:underline font-bold'>Settings ➡️ Access Tokens</a> and create a token (choose <b>Read</b> role).</p>
                  <p>3. Paste your Token below and save:</p>
                </>
              )}
            </div>

            <div className='flex gap-2'>
              <input
                type='password'
                placeholder='hf_...'
                value={hfToken}
                onChange={e => setHfToken(e.target.value)}
                className='flex-1 bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-t1-red/50'
              />
              <button
                onClick={handleSaveToken}
                className='px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-oswald font-bold text-xs tracking-wider uppercase transition-colors shrink-0'
              >
                {tokenSaved ? (language === 'vi' ? 'ĐÃ LƯU!' : 'SAVED!') : (language === 'vi' ? 'LƯU' : 'SAVE')}
              </button>
            </div>
            {tokenSaved && (
              <p className='text-[10px] text-green-400 font-inter mt-1.5'>
                {language === 'vi' ? '✓ Đã lưu token thành công! Hãy nhấn "THỬ LẠI" ở dưới.' : '✓ Token saved successfully! Press "RETRY" below.'}
              </p>
            )}
          </div>

          <div className='flex gap-4 w-full justify-center'>
            <button
              onClick={onBack}
              className='flex-1 max-w-[150px] flex items-center justify-center gap-2 px-6 py-3.5 border border-white/20 text-white font-oswald font-bold text-xs tracking-wider uppercase hover:border-white transition-all'
            >
              <ChevronLeft size={14} /> {language === 'vi' ? 'QUAY LẠI' : 'BACK'}
            </button>
            <button
              onClick={handleRetry}
              className='flex-1 max-w-[150px] flex items-center justify-center gap-2 px-6 py-3.5 bg-t1-red text-white font-oswald font-bold text-xs tracking-wider uppercase hover:bg-[#ff0033] shadow-[0_0_20px_rgba(226,1,45,0.2)] hover:shadow-[0_0_25px_rgba(226,1,45,0.4)] transition-all'
            >
              <RefreshCw size={14} /> {language === 'vi' ? 'THỬ LẠI' : 'RETRY'}
            </button>
          </div>
        </div>
      )}

      {/* Success state */}
      {status === 'done' && resultUrl && (
        <div>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-full mb-4'>
              <Check size={14} className='text-green-400' />
              <span className='text-xs font-oswald font-bold text-green-400 tracking-wider uppercase'>Try-On Complete!</span>
            </div>
            <h3 className='text-2xl font-oswald font-black text-white italic uppercase tracking-widest'>
              Here's How It Looks!
            </h3>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
            {/* Result image */}
            <div className='lg:col-span-2'>
              <div className='border border-t1-red/30 shadow-[0_0_40px_rgba(226,1,45,0.15)] overflow-hidden rounded-sm'>
                <img
                  src={resultUrl}
                  alt='Virtual try-on result'
                  className='w-full object-contain'
                />
              </div>
              <p className='text-[10px] text-gray-600 font-inter text-center mt-3 tracking-wider uppercase'>
                AI-Generated • Powered by IDM-VTON
              </p>
            </div>

            {/* Action panel */}
            <div className='flex flex-col gap-4'>
              {/* Product card */}
              <div className='border border-white/10 bg-white/[0.02] p-4'>
                <div className='aspect-square overflow-hidden mb-3'>
                  <img
                    src={garmentImage}
                    alt={product.product_name}
                    className='w-full h-full object-contain'
                  />
                </div>
                <p className='text-xs font-oswald font-bold text-white uppercase tracking-wider line-clamp-2'>
                  {product.product_name}
                </p>
                <p className='text-sm text-t1-red font-oswald font-black mt-1'>
                  {formatPrice(
                    product.items?.[0]?.sale_price ?? product.items?.[0]?.product_item_price ?? 0,
                    language
                  )}
                </p>
              </div>

              {/* Buttons */}
              <button
                onClick={handleDownload}
                className='flex items-center justify-center gap-3 w-full py-4 border border-white/30 text-white font-oswald font-bold text-xs tracking-widest uppercase hover:border-white hover:bg-white/5 transition-all duration-300'
              >
                <Download size={16} /> DOWNLOAD PHOTO
              </button>

              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-3 w-full py-4 font-oswald font-bold text-xs tracking-widest uppercase transition-all duration-300 ${
                  addedToCart
                    ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)]'
                    : 'bg-t1-red text-white hover:bg-[#ff0033] shadow-[0_0_20px_rgba(226,1,45,0.2)]'
                }`}
              >
                {addedToCart ? (
                  <><Check size={16} /> ADDED TO CART!</>
                ) : (
                  <><ShoppingCart size={16} /> ADD TO CART</>
                )}
              </button>

              <Link
                to={`/product/${product.product_id}`}
                className='flex items-center justify-center gap-3 w-full py-3 text-gray-400 hover:text-white text-xs font-inter tracking-wider uppercase transition-colors border border-white/5 hover:border-white/20'
              >
                VIEW PRODUCT PAGE
              </Link>

              <button
                onClick={onReset}
                className='flex items-center justify-center gap-2 w-full py-3 text-gray-500 hover:text-white text-xs font-inter tracking-wider uppercase transition-colors'
              >
                <RefreshCw size={12} /> Try Another Outfit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      {status !== 'processing' && (
        <div className='flex justify-between mt-10 pt-8 border-t border-white/5'>
          <button
            onClick={status === 'done' ? onReset : onBack}
            className='flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-oswald font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:border-white'
          >
            <RefreshCw size={16} /> {status === 'done' ? 'START OVER' : 'BACK'}
          </button>
        </div>
      )}
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TryOnPage() {
  const [step, setStep]           = useState(1)
  const [modelImage, setModelImage] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [garmentImage, setGarmentImage]       = useState<string | null>(null)
  const [searchParams]            = useSearchParams()
  const preselectedId             = searchParams.get('productId')

  const handleStep1Next = useCallback((img: string, _isFile: boolean) => {
    setModelImage(img)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleStep2Next = useCallback((product: Product, garment: string) => {
    setSelectedProduct(product)
    setGarmentImage(garment)
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleReset = useCallback(() => {
    setStep(1)
    setModelImage(null)
    setSelectedProduct(null)
    setGarmentImage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <Layout footer={<Footer />} forceNavbarOpaque>
      <div className='min-h-screen bg-t1-dark pt-28 pb-20'>
        <div className='max-w-6xl mx-auto px-4 md:px-10 lg:px-16'>

          {/* Header */}
          <div className='text-center mb-14'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-t1-red/10 border border-t1-red/20 rounded-full mb-6'>
              <Sparkles size={14} className='text-t1-red' />
              <span className='text-[11px] font-oswald font-bold text-t1-red tracking-widest uppercase'>AI Virtual Try-On</span>
            </div>
            <h1 className='text-4xl md:text-6xl font-oswald font-black text-white italic uppercase tracking-tighter leading-none mb-4'>
              Try Before<br /><span className='text-t1-red'>You Buy</span>
            </h1>
            <p className='text-gray-400 font-inter text-sm max-w-lg mx-auto leading-relaxed'>
              Upload your photo or choose an avatar, pick a clothing item, and see yourself wearing it — powered by IDM-VTON AI.
            </p>
          </div>

          {/* Stepper */}
          <StepBar current={step} />

          {/* Step Content */}
          <div className='bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-sm shadow-2xl'>
            <AnimatePresence mode='wait'>
              {step === 1 && (
                <Step1 key='step1' onNext={handleStep1Next} />
              )}
              {step === 2 && (
                <Step2
                  key='step2'
                  onNext={handleStep2Next}
                  onBack={() => setStep(1)}
                  preselectedProductId={preselectedId ? parseInt(preselectedId) : undefined}
                />
              )}
              {step === 3 && modelImage && selectedProduct && garmentImage && (
                <Step3
                  key={`step3-${selectedProduct.product_id}-${modelImage.slice(-10)}`}
                  modelImage={modelImage}
                  product={selectedProduct}
                  garmentImage={garmentImage}
                  onReset={handleReset}
                  onBack={() => setStep(2)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
}
