/* eslint-disable indent */
import { useState, useMemo, useEffect, useCallback } from 'react'
import type { ChangeEvent } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Camera,
  X,
  Loader2,
  Edit3,
  Trash2,
  Sparkles
} from 'lucide-react'
import { useAuth } from '~/hooks/useAuth'
import { reviewApi } from '~/apis/reviewApi'
import { useCart } from '~/contexts/CartContext'
import { combinedProducts } from '~/data/products'
import { ProductCard } from '~/components/Product/ProductCard'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import { useLanguage } from '~/contexts/LanguageContext'
import { formatPrice } from '~/utils/format'
import type { Product } from '~/types/product'
import productApi from '~/apis/productApi'

const isClothingProduct = (cat?: string, name?: string): boolean => {
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

function ProductDetailContent({ product }: { product: Product }) {
  const { addCartItem } = useCart()
  const { t, language } = useLanguage()
  const { user } = useAuth()

  const [productReviews, setProductReviews] = useState<any[]>([])
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)

  // Edit Review Modal States
  const [editingReview, setEditingReview] = useState<any | null>(null)
  const [editRating, setEditRating] = useState<number>(5)
  const [editHoverRating, setEditHoverRating] = useState<number>(0)
  const [editText, setEditText] = useState<string>('')
  const [, setEditImageFile] = useState<File | null>(null)
  const [editImageUrlPreview, setEditImageUrlPreview] = useState<string | null>(null)
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false)
  const [isUploadingEditImage, setIsUploadingEditImage] = useState<boolean>(false)

  // Write Review Modal States
  const [isOpenWriteModal, setIsOpenWriteModal] = useState<boolean>(false)
  const [writeRating, setWriteRating] = useState<number>(5)
  const [writeHoverRating, setWriteHoverRating] = useState<number>(0)
  const [writeText, setWriteText] = useState<string>('')
  const [, setWriteImageFile] = useState<File | null>(null)
  const [writeImageUrlPreview, setWriteImageUrlPreview] = useState<string | null>(null)
  const [isSubmittingWrite, setIsSubmittingWrite] = useState<boolean>(false)
  const [isUploadingWriteImage, setIsUploadingWriteImage] = useState<boolean>(false)

  // Size Guide Modal States
  const [isOpenSizeGuide, setIsOpenSizeGuide] = useState<boolean>(false)
  const [sgHeight, setSgHeight] = useState<string>('')
  const [sgWeight, setSgWeight] = useState<string>('')
  const [sgRecommendedSize, setSgRecommendedSize] = useState<string | null>(null)

  const handleOpenSizeGuide = () => {
    setIsOpenSizeGuide(true)
    setSgHeight('')
    setSgWeight('')
    setSgRecommendedSize(null)
  }

  const handleCloseSizeGuide = () => {
    setIsOpenSizeGuide(false)
  }

  const handleCalculateSize = () => {
    const h = parseInt(sgHeight)
    const w = parseInt(sgWeight)
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setSgRecommendedSize(null)
      return
    }
    let sizeByHeight = 'M'
    if (h < 160) sizeByHeight = 'S'
    else if (h < 168) sizeByHeight = 'M'
    else if (h < 175) sizeByHeight = 'L'
    else if (h < 182) sizeByHeight = 'XL'
    else if (h < 190) sizeByHeight = 'XXL'
    else sizeByHeight = 'XXXL'

    let sizeByWeight = 'M'
    if (w < 50) sizeByWeight = 'S'
    else if (w < 60) sizeByWeight = 'M'
    else if (w < 70) sizeByWeight = 'L'
    else if (w < 80) sizeByWeight = 'XL'
    else if (w < 90) sizeByWeight = 'XXL'
    else sizeByWeight = 'XXXL'

    const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    const idxH = sizes.indexOf(sizeByHeight)
    const idxW = sizes.indexOf(sizeByWeight)
    const finalSize = sizes[Math.max(idxH, idxW)] || 'M'

    setSgRecommendedSize(finalSize)
  }

  const handleOpenWriteModal = () => {
    setIsOpenWriteModal(true)
    setWriteRating(5)
    setWriteText('')
    setWriteImageUrlPreview(null)
    setWriteImageFile(null)
  }

  const handleCloseWriteModal = () => {
    setIsOpenWriteModal(false)
    setWriteImageUrlPreview(null)
    setWriteImageFile(null)
  }

  const handleWriteImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setWriteImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setWriteImageUrlPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveWriteImage = () => {
    setWriteImageFile(null)
    setWriteImageUrlPreview(null)
  }

  const handleSubmitWrite = async () => {
    if (!writeText.trim()) return
    try {
      setIsSubmittingWrite(true)
      let image_url = ''

      if (writeImageUrlPreview) {
        setIsUploadingWriteImage(true)
        try {
          const res = await reviewApi.uploadImage({ file: writeImageUrlPreview })
          image_url = res.data.secure_url
        } catch (uploadErr) {
          console.error(uploadErr)
          setIsUploadingWriteImage(false)
          return
        } finally {
          setIsUploadingWriteImage(false)
        }
      }

      await reviewApi.create({
        product_id: product.product_id,
        rating: writeRating,
        text: writeText,
        image_url: image_url || undefined
      })

      handleCloseWriteModal()
      fetchProductReviews()
    } catch (err) {
      console.error('Failed to create review:', err)
    } finally {
      setIsSubmittingWrite(false)
    }
  }

  const fetchProductReviews = useCallback(async () => {
    try {
      setIsLoadingReviews(true)
      const res = await reviewApi.getByProductId(product.product_id)
      setProductReviews(res.data || res)
    } catch (err) {
      console.error('Failed to load reviews:', err)
    } finally {
      setIsLoadingReviews(false)
    }
  }, [product.product_id])

  useEffect(() => {
    fetchProductReviews()
  }, [fetchProductReviews])

  const handleOpenEditModal = (review: any) => {
    setEditingReview(review)
    setEditRating(review.rating)
    setEditText(review.text)
    setEditImageUrlPreview(review.image_url || null)
    setEditImageFile(null)
  }

  const handleCloseEditModal = () => {
    setEditingReview(null)
    setEditImageUrlPreview(null)
    setEditImageFile(null)
  }

  const handleEditImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setEditImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setEditImageUrlPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveEditImage = () => {
    setEditImageFile(null)
    setEditImageUrlPreview(null)
  }

  const handleDeleteReview = async (reviewId: number) => {
    const confirmMessage = language === 'vi'
      ? 'Bạn có chắc chắn muốn xóa đánh giá này không?'
      : 'Are you sure you want to delete this review?'
    if (!window.confirm(confirmMessage)) return

    try {
      await reviewApi.delete(reviewId)
      fetchProductReviews()
    } catch (err) {
      console.error('Failed to delete review:', err)
    }
  }

  const handleSubmitEdit = async () => {
    if (!editingReview || !editText.trim()) return
    try {
      setIsSubmittingEdit(true)
      let image_url = editImageUrlPreview

      // If a new image was chosen (Base64 data in editImageUrlPreview)
      if (editImageUrlPreview && editImageUrlPreview.startsWith('data:image')) {
        setIsUploadingEditImage(true)
        try {
          const res = await reviewApi.uploadImage({ file: editImageUrlPreview })
          image_url = res.data.secure_url
        } catch (uploadErr) {
          console.error(uploadErr)
          setIsUploadingEditImage(false)
          return
        } finally {
          setIsUploadingEditImage(false)
        }
      }

      await reviewApi.update(editingReview.review_id, {
        rating: editRating,
        text: editText,
        image_url: image_url || undefined
      })

      handleCloseEditModal()
      fetchProductReviews()
    } catch (err) {
      console.error('Failed to update review:', err)
    } finally {
      setIsSubmittingEdit(false)
    }
  }

  const [userSelectedSize, setUserSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isAdded, setIsAdded] = useState(false)

  // Calculate isProductSoldOut globally for this product page
  const isProductSoldOut = useMemo(() => {
    return product.soldOut ?? (
      product.items && product.items.length > 0
        ? product.items.every(item => item.stock_quantity === 0)
        : true
    )
  }, [product])

  // Extract unique sizes from product items and sort them in standard order
  const availableSizes = useMemo(() => {
    if (!product?.items) return []
    const distinctSizes = [...new Set(product.items.map(item => item.size).filter(Boolean))] as string[]
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    return distinctSizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a.toUpperCase())
      const indexB = sizeOrder.indexOf(b.toUpperCase())
      const valA = indexA === -1 ? 999 : indexA
      const valB = indexB === -1 ? 999 : indexB
      return valA - valB
    })
  }, [product])

  // Helper to check if a specific size is sold out
  const isSizeSoldOut = (size: string) => {
    const itemForSize = product.items?.find(item => item.size === size)
    return itemForSize ? itemForSize.stock_quantity === 0 : true
  }

  // Determine the final active size (user selection or default to first available in-stock size)
  const activeSize = useMemo(() => {
    if (userSelectedSize && availableSizes.includes(userSelectedSize)) {
      return userSelectedSize
    }
    const firstInStockSize = availableSizes.find(size => {
      const itemForSize = product.items?.find(item => item.size === size)
      return itemForSize ? itemForSize.stock_quantity > 0 : false
    })
    return firstInStockSize || availableSizes[0] || ''
  }, [userSelectedSize, availableSizes, product])

  // Get stock for active size
  const stockForActiveSize = useMemo(() => {
    const item = product.items?.find(item => item.size === activeSize)
    return item ? item.stock_quantity : 0
  }, [product, activeSize])

  // Get active variant based on selected size
  const activeVariant = useMemo(() => {
    return product.items?.find(item => item.size === activeSize) || product.items?.[0]
  }, [product, activeSize])

  // Related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    return combinedProducts
      .filter((p) => p.category_name === product.category_name && p.product_id !== product.product_id)
      .slice(0, 4)
  }, [product])

  const handleAddToCart = () => {
    const selectedItem = product.items?.find(item => item.size === activeSize) || product.items?.[0]
    setIsAdded(true)
    addCartItem({
      id: product.product_id,
      name: product.product_name,
      price: selectedItem?.sale_price ?? selectedItem?.product_item_price ?? 0,
      imageUrl: selectedItem?.product_item_image ?? null,
      size: activeSize
    }, quantity)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Layout footer={<Footer />} bleed={true}>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 pt-32 pb-8">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-oswald font-bold tracking-widest text-gray-500 uppercase">
          <Link to="/" className="hover:text-white transition-colors">{t('footer.home').toUpperCase()}</Link>
          <ChevronRight size={12} className="text-white/50" />
          <Link to="/shop" className="hover:text-white transition-colors">{t('nav.shop').toUpperCase()}</Link>
          <ChevronRight size={12} className="text-white/50" />
          <span className="text-t1-red">{t(`categories.${product.category_name}`)}</span>
          <ChevronRight size={12} className="text-white/50" />
          <span className="text-white truncate max-w-[150px]">{product.product_name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">

          {/* Left Column: Image */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square sm:aspect-[4/5] bg-t1-gray/10 border border-t1-gray/30 overflow-hidden group"
            >
              {(activeVariant?.product_item_image || product.items?.[0]?.product_item_image) && (
                <img
                  src={(activeVariant?.product_item_image || product.items?.[0]?.product_item_image) || undefined}
                  alt={product.product_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {isProductSoldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <span className="px-10 py-5 text-4xl font-oswald font-black text-white border-4 border-white italic uppercase tracking-[0.2em]">{t('productDetail.soldOut')}</span>
                </div>
              )}
              {activeVariant?.sale_price && !isProductSoldOut && (
                <div className="absolute top-6 left-6 z-20 bg-t1-red text-white font-oswald font-bold px-4 py-1 text-sm tracking-widest italic shadow-lg shadow-t1-red/20">
                  {t('shop.sale').toUpperCase()}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-oswald font-black text-white italic uppercase leading-none tracking-tighter mb-4">
                {product.product_name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                {activeVariant?.sale_price && activeVariant.sale_price < activeVariant.product_item_price ? (
                  <>
                    <span className="text-3xl font-oswald font-black text-t1-red italic tracking-wide">
                      {formatPrice(activeVariant.sale_price, language)}
                    </span>
                    <span className="text-lg text-gray-500 line-through font-light">
                      {formatPrice(activeVariant.product_item_price, language)}
                    </span>
                    <span className="bg-t1-red/10 text-t1-red text-[10px] font-bold px-2 py-0.5 rounded border border-t1-red/20">{t('productDetail.save')} {Math.round((1 - activeVariant.sale_price / activeVariant.product_item_price) * 100)}%</span>
                  </>
                ) : (
                  <span className="text-3xl font-oswald font-black text-t1-red italic tracking-wide">
                    {formatPrice(activeVariant?.product_item_price ?? 0, language)}
                  </span>
                )}
              </div>

              <p className="text-gray-400 font-light leading-relaxed mb-10 italic">
                {product.product_description || 'Premium clothing merchandise designed for those who demand excellence. This high-quality piece combines athletic performance with street-ready style.'}
              </p>

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-oswald font-bold tracking-[0.2em] uppercase text-gray-400">{t('productDetail.selectSize')}</span>
                    <button onClick={handleOpenSizeGuide} className="text-[10px] font-inter text-t1-red hover:underline uppercase tracking-widest">{t('productDetail.sizeGuide')}</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size: string) => {
                      const soldOutSize = isSizeSoldOut(size)
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setUserSelectedSize(size)
                            setQuantity(1)
                          }}
                          disabled={isProductSoldOut || soldOutSize}
                          className={`min-w-[54px] h-[54px] border flex items-center justify-center font-oswald font-bold text-sm transition-all duration-300 ${activeSize === size
                            ? 'bg-white border-white text-t1-dark shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                            : 'bg-transparent border-t1-gray/40 text-gray-400 hover:border-white hover:text-white'
                            } ${isProductSoldOut || soldOutSize
                              ? 'opacity-30 cursor-not-allowed line-through border-dashed border-gray-600'
                              : ''
                            }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-10">
                <span className="text-xs font-oswald font-bold tracking-[0.2em] uppercase text-gray-400 block mb-4">{t('productDetail.quantity')}</span>
                <div className="flex items-center border border-t1-gray/40 w-fit h-14">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={isProductSoldOut || isSizeSoldOut(activeSize)}
                    className="w-14 h-full flex items-center justify-center hover:bg-t1-gray/10 transition-colors text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-14 text-center font-oswald font-bold text-lg text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(stockForActiveSize, q + 1))}
                    disabled={isProductSoldOut || isSizeSoldOut(activeSize) || quantity >= stockForActiveSize}
                    className="w-14 h-full flex items-center justify-center hover:bg-t1-gray/10 transition-colors text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {/* Visual indicator of remaining stock */}
                {!isProductSoldOut && !isSizeSoldOut(activeSize) && stockForActiveSize <= 10 && (
                  <span className="text-[10px] font-bold text-t1-red mt-2 block tracking-wider uppercase">
                    Only {stockForActiveSize} left in stock!
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleAddToCart}
                  disabled={isProductSoldOut || isSizeSoldOut(activeSize) || isAdded}
                  className={`flex-1 h-16 flex items-center justify-center gap-3 font-oswald font-black text-sm tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden relative ${isAdded
                    ? 'bg-green-600 text-white shadow-[0_0_30px_rgba(22,163,74,0.4)]'
                    : 'bg-t1-red text-white hover:bg-[#ff0033] shadow-[0_0_20px_rgba(226,1,45,0.3)] hover:shadow-[0_0_35px_rgba(226,1,45,0.6)]'
                    } ${isProductSoldOut || isSizeSoldOut(activeSize) ? 'bg-t1-gray/40 cursor-not-allowed shadow-none hover:bg-t1-gray/40' : ''}`}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div
                        key="added"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <ShieldCheck size={20} /> {t('productDetail.addedToCart')}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart size={20} /> {
                          isProductSoldOut || isSizeSoldOut(activeSize)
                            ? t('productDetail.soldOut').toUpperCase()
                            : t('productDetail.addToCart')
                        }
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* TRY ON Button */}
                {user && isClothingProduct(product.category_name, product.product_name) && (
                  <Link
                    to={`/try-on?productId=${product.product_id}`}
                    className="h-16 px-5 border border-t1-red/60 hover:border-t1-red text-t1-red hover:bg-t1-red hover:text-white flex items-center justify-center gap-2 font-oswald font-bold text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(226,1,45,0.3)] group whitespace-nowrap"
                  >
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                    {language === 'vi' ? 'THỬ ĐỒ' : 'TRY ON'}
                  </Link>
                )}

                <button className="w-16 h-16 border border-t1-gray/40 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all duration-300">
                  <Heart size={20} />
                </button>
                <button className="w-16 h-16 border border-t1-gray/40 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all duration-300">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Secondary Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-t1-gray/20">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={20} className="text-t1-red" />
                  <span className="text-[10px] font-oswald font-bold tracking-widest text-white uppercase">{t('productDetail.fastShipping')}</span>
                  <span className="text-[10px] text-gray-500">{t('productDetail.days25')}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw size={20} className="text-t1-red" />
                  <span className="text-[10px] font-oswald font-bold tracking-widest text-white uppercase">{t('productDetail.easyReturns')}</span>
                  <span className="text-[10px] text-gray-500">{t('productDetail.policy30')}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck size={20} className="text-t1-red" />
                  <span className="text-[10px] font-oswald font-bold tracking-widest text-white uppercase">{t('productDetail.secureCheckout')}</span>
                  <span className="text-[10px] text-gray-500">{t('productDetail.ssl')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mt-24">
          <div className="flex border-b border-t1-gray/20 mb-10 overflow-x-auto no-scrollbar">
            {['description', 'specs', 'shipping', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-5 font-oswald font-bold tracking-[0.2em] uppercase text-sm border-b-2 transition-all duration-300 whitespace-nowrap ${activeTab === tab
                  ? 'border-t1-red text-white'
                  : 'border-transparent text-gray-500 hover:text-white'
                  }`}
              >
                {tab === 'reviews' ? (language === 'vi' ? 'ĐÁNH GIÁ' : 'REVIEWS') : t(`productDetail.${tab}`)}
              </button>
            ))}
          </div>

          <div className="min-h-[200px] max-w-4xl italic text-gray-400 font-light leading-relaxed">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="mb-6">
                  {product.product_description || t('productDetail.descriptionPlaceholder') || 'Represent the world champions in style with this premium merchandise. Craftsmanship meets heritage in every stitch.'}
                </p>
                <p>
                  Built for the next generation of esports athletes and fans alike. This item features high-performance textile engineering while maintaining a refined aesthetic suitable for everyday wear. Whether you're grinding on the ladder or cheering from the stands, this is the ultimate way to show your T1 pride.
                </p>
              </motion.div>
            )}
            {activeTab === 'specs' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex justify-between border-b border-t1-gray/10 pb-2 pr-10">
                  <span className="font-oswald text-xs tracking-widest text-white uppercase">{t('productDetail.material')}</span>
                  <span className="text-xs uppercase">{t('productDetail.cottonBlend')}</span>
                </div>
                <div className="flex justify-between border-b border-t1-gray/10 pb-2 pr-10">
                  <span className="font-oswald text-xs tracking-widest text-white uppercase">{t('productDetail.weight')}</span>
                  <span className="text-xs uppercase">320 GSM</span>
                </div>
                <div className="flex justify-between border-b border-t1-gray/10 pb-2 pr-10">
                  <span className="font-oswald text-xs tracking-widest text-white uppercase">{t('productDetail.fit')}</span>
                  <span className="text-xs uppercase">{t('productDetail.regularOversized')}</span>
                </div>
                <div className="flex justify-between border-b border-t1-gray/10 pb-2 pr-10">
                  <span className="font-oswald text-xs tracking-widest text-white uppercase">{t('productDetail.country')}</span>
                  <span className="text-xs uppercase">{t('productDetail.southKorea')}</span>
                </div>
              </motion.div>
            )}
            {activeTab === 'shipping' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="mb-4">{t('productDetail.shippingInfo')}</p>
                <p>{t('productDetail.returnInfo')}</p>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                  <div>
                    <h3 className="font-oswald font-black text-xl text-white uppercase italic tracking-wider">
                      {language === 'vi' ? 'ĐÁNH GIÁ TỪ KHÁCH HÀNG' : 'CUSTOMER REVIEWS'}
                    </h3>
                    <p className="text-xs text-gray-500 font-inter mt-1">
                      {productReviews.length} {language === 'vi' ? 'lượt đánh giá' : 'reviews'}
                    </p>
                  </div>
                  {user && (
                    <button
                      onClick={handleOpenWriteModal}
                      className="px-6 py-3 bg-t1-red hover:bg-white text-white hover:text-black font-oswald font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_10px_20px_rgba(226,1,45,0.2)]"
                    >
                      {language === 'vi' ? 'VIẾT ĐÁNH GIÁ' : 'WRITE A REVIEW'}
                    </button>
                  )}
                </div>
                {isLoadingReviews ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 text-t1-red animate-spin" />
                  </div>
                ) : productReviews.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                    <p className="text-gray-500 font-inter text-sm italic">
                      {language === 'vi' ? 'Chưa có đánh giá nào cho sản phẩm này.' : 'No reviews yet for this product.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productReviews.map((rev: any, idx: number) => {
                      const rating = rev.rating
                      const text = rev.text
                      const userDisplay = rev.display_name || rev.username || rev.user || 'Customer'
                      const date = rev.created_at ? new Date(rev.created_at).toISOString().split('T')[0] : 'Recently'
                      const isOwnReview = Number(rev.user_id) === Number(user?.user_id)
                      const isAdmin = Number(user?.role) === 1

                      return (
                        <div key={rev.review_id || idx} className="bg-[#111111] p-6 border border-white/5 shadow-md flex flex-col justify-between relative group">
                          {(isOwnReview || isAdmin) && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                              <button
                                onClick={() => handleOpenEditModal(rev)}
                                className="p-1.5 bg-white/5 hover:bg-t1-red text-gray-400 hover:text-white rounded-md transition-colors"
                                title={language === 'vi' ? 'Chỉnh sửa đánh giá' : 'Edit review'}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(rev.review_id)}
                                className="p-1.5 bg-white/5 hover:bg-t1-red text-gray-400 hover:text-white rounded-md transition-colors"
                                title={language === 'vi' ? 'Xóa đánh giá' : 'Delete review'}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                          <div>
                            <div className="flex justify-between items-start mb-3 pr-16">
                              <div className="flex gap-0.5 text-t1-red text-sm">
                                {'★'.repeat(rating)}
                                <span className="text-gray-700">{'★'.repeat(5 - rating)}</span>
                              </div>
                            </div>
                            <p className="text-gray-300 font-inter text-sm italic leading-relaxed mb-4">
                              "{text}"
                            </p>
                          </div>

                          {rev.image_url && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/5 bg-black/40 mb-4 shrink-0">
                              <img src={rev.image_url} alt="Review attachment" className="w-full h-full object-cover" />
                            </div>
                          )}

                          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                            <span className="font-oswald font-bold tracking-wider text-white text-xs uppercase block">{userDisplay}</span>
                            <span className="text-[10px] text-gray-600 font-inter">{date}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-oswald font-black text-white italic uppercase tracking-tighter">{t('productDetail.related')}</h2>
              <Link to="/shop" className="text-xs font-oswald font-bold text-t1-red tracking-[0.2em] uppercase hover:underline">{t('productDetail.viewAll')}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.product_id} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Write Review Modal */}
      <AnimatePresence>
        {isOpenWriteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseWriteModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative bg-t1-dark border border-white/10 w-full max-w-lg p-8 shadow-2xl flex flex-col z-10"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseWriteModal}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="font-oswald font-black text-2xl text-white italic uppercase tracking-wider mb-2">
                  {language === 'vi' ? 'VIẾT ĐÁNH GIÁ MỚI' : 'WRITE NEW REVIEW'}
                </h2>
                <div className="w-10 h-0.5 bg-t1-red" />
              </div>

              {/* Rating selection */}
              <div className="mb-6">
                <label className="block text-xs text-gray-500 font-inter uppercase tracking-wider mb-3">
                  {language === 'vi' ? 'Đánh giá của bạn:' : 'Your Rating:'}
                </label>
                <div className="flex gap-2 text-3xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setWriteRating(star)}
                      onMouseEnter={() => setWriteHoverRating(star)}
                      onMouseLeave={() => setWriteHoverRating(0)}
                      className="transition-colors duration-150"
                    >
                      <span
                        className={
                          star <= (writeHoverRating || writeRating)
                            ? 'text-t1-red'
                            : 'text-gray-800 hover:text-t1-red/50'
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="mb-6">
                <label className="block text-xs text-gray-500 font-inter uppercase tracking-wider mb-2">
                  {language === 'vi' ? 'Nhận xét chi tiết:' : 'Detailed Review:'}
                </label>
                <textarea
                  rows={4}
                  value={writeText}
                  onChange={(e) => setWriteText(e.target.value)}
                  placeholder={
                    language === 'vi'
                      ? 'Hãy chia sẻ cảm nhận của bạn về sản phẩm này...'
                      : 'Share your thoughts about this product...'
                  }
                  className="w-full bg-[#151515] border border-white/5 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-t1-red/50 transition-all font-inter placeholder:text-gray-600"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <label className="block text-xs text-gray-500 font-inter uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{language === 'vi' ? 'Hình ảnh đính kèm:' : 'Attached Image:'}</span>
                  <span className="text-[10px] text-gray-600 font-normal uppercase tracking-normal">
                    {language === 'vi' ? 'Tối đa 1 ảnh (PNG, JPG)' : 'Max 1 photo (PNG, JPG)'}
                  </span>
                </label>

                {writeImageUrlPreview ? (
                  <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-white/10 bg-[#151515] flex items-center justify-center">
                    <img src={writeImageUrlPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveWriteImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-t1-red text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-white/10 hover:border-t1-red/40 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera size={24} className="text-gray-500 group-hover:text-t1-red mb-2 transition-colors duration-200" />
                      <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
                        {language === 'vi' ? 'Nhấp để chọn ảnh chụp sản phẩm' : 'Click to select product image'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleWriteImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end mt-auto">
                <button
                  type="button"
                  onClick={handleCloseWriteModal}
                  className="px-6 py-3 font-oswald font-bold text-xs tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'HỦY BỎ' : 'CANCEL'}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitWrite}
                  disabled={isSubmittingWrite}
                  className="px-8 py-3 bg-t1-red text-white font-oswald font-black text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(226,1,45,0.3)] disabled:bg-t1-gray/40 disabled:cursor-not-allowed"
                >
                  {isSubmittingWrite ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      {isUploadingWriteImage
                        ? (language === 'vi' ? 'ĐANG TẢI ẢNH...' : 'UPLOADING...')
                        : (language === 'vi' ? 'ĐANG GỬI...' : 'SUBMITTING...')}
                    </>
                  ) : (
                    language === 'vi' ? 'GỬI ĐÁNH GIÁ' : 'SUBMIT REVIEW'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Review Modal */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseEditModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative bg-t1-dark border border-white/10 w-full max-w-lg p-8 shadow-2xl flex flex-col z-10"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseEditModal}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="font-oswald font-black text-2xl text-white italic uppercase tracking-wider mb-2">
                  {language === 'vi' ? 'CHỈNH SỬA ĐÁNH GIÁ' : 'EDIT YOUR REVIEW'}
                </h2>
                <div className="w-10 h-0.5 bg-t1-red" />
              </div>

              {/* Rating selection */}
              <div className="mb-6">
                <label className="block text-xs text-gray-500 font-inter uppercase tracking-wider mb-3">
                  {language === 'vi' ? 'Đánh giá của bạn:' : 'Your Rating:'}
                </label>
                <div className="flex gap-2 text-3xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      onMouseEnter={() => setEditHoverRating(star)}
                      onMouseLeave={() => setEditHoverRating(0)}
                      className="transition-colors duration-150"
                    >
                      <span
                        className={
                          star <= (editHoverRating || editRating)
                            ? 'text-t1-red'
                            : 'text-gray-800 hover:text-t1-red/50'
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="mb-6">
                <label className="block text-xs text-gray-500 font-inter uppercase tracking-wider mb-2">
                  {language === 'vi' ? 'Nhận xét chi tiết:' : 'Detailed Review:'}
                </label>
                <textarea
                  rows={4}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder={
                    language === 'vi'
                      ? 'Hãy chia sẻ cảm nhận của bạn về sản phẩm này...'
                      : 'Share your thoughts about this product...'
                  }
                  className="w-full bg-[#151515] border border-white/5 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-t1-red/50 transition-all font-inter placeholder:text-gray-600"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-8">
                <label className="block text-xs text-gray-500 font-inter uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{language === 'vi' ? 'Hình ảnh đính kèm:' : 'Attached Image:'}</span>
                  <span className="text-[10px] text-gray-600 font-normal uppercase tracking-normal">
                    {language === 'vi' ? 'Tối đa 1 ảnh (PNG, JPG)' : 'Max 1 photo (PNG, JPG)'}
                  </span>
                </label>

                {editImageUrlPreview ? (
                  <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-white/10 bg-[#151515] flex items-center justify-center">
                    <img src={editImageUrlPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveEditImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-t1-red text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-white/10 hover:border-t1-red/40 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Camera size={24} className="text-gray-500 group-hover:text-t1-red mb-2 transition-colors duration-200" />
                      <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
                        {language === 'vi' ? 'Nhấp để chọn ảnh chụp sản phẩm' : 'Click to select product image'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end mt-auto">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-6 py-3 font-oswald font-bold text-xs tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  {language === 'vi' ? 'HỦY BỎ' : 'CANCEL'}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitEdit}
                  disabled={isSubmittingEdit}
                  className="px-8 py-3 bg-t1-red text-white font-oswald font-black text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_10px_20px_rgba(226,1,45,0.3)] disabled:bg-t1-gray/40 disabled:cursor-not-allowed"
                >
                  {isSubmittingEdit ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      {isUploadingEditImage
                        ? (language === 'vi' ? 'ĐANG TẢI ẢNH...' : 'UPLOADING...')
                        : (language === 'vi' ? 'ĐANG LƯU...' : 'SAVING...')}
                    </>
                  ) : (
                    language === 'vi' ? 'LƯU THAY ĐỔI' : 'SAVE CHANGES'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Size Guide Modal */}
      <AnimatePresence>
        {isOpenSizeGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSizeGuide}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative bg-t1-dark border border-white/10 w-full max-w-md p-8 shadow-2xl flex flex-col z-10"
            >
              <button
                onClick={handleCloseSizeGuide}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="mb-6">
                <h2 className="font-oswald font-black text-2xl text-white italic uppercase tracking-wider mb-2">
                  {language === 'vi' ? 'ƯỚC LƯỢNG KÍCH CỠ' : 'SIZE ESTIMATOR'}
                </h2>
                <div className="w-10 h-0.5 bg-t1-red" />
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-gray-400 font-inter uppercase tracking-wider mb-2">
                    {language === 'vi' ? 'Chiều cao (cm):' : 'Height (cm):'}
                  </label>
                  <input
                    type="number"
                    value={sgHeight}
                    onChange={(e) => setSgHeight(e.target.value)}
                    placeholder="VD: 170"
                    className="w-full bg-[#151515] border border-white/5 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-t1-red/50 transition-all font-inter placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-inter uppercase tracking-wider mb-2">
                    {language === 'vi' ? 'Cân nặng (kg):' : 'Weight (kg):'}
                  </label>
                  <input
                    type="number"
                    value={sgWeight}
                    onChange={(e) => setSgWeight(e.target.value)}
                    placeholder="VD: 60"
                    className="w-full bg-[#151515] border border-white/5 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-t1-red/50 transition-all font-inter placeholder:text-gray-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCalculateSize}
                className="w-full py-3 bg-white text-black font-oswald font-bold text-sm tracking-wider uppercase hover:bg-t1-red hover:text-white transition-colors mb-6"
              >
                {language === 'vi' ? 'GỢI Ý SIZE' : 'SUGGEST SIZE'}
              </button>

              {sgRecommendedSize && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-400 font-inter uppercase tracking-wider mb-2">
                    {language === 'vi' ? 'Size phù hợp với bạn là:' : 'Recommended Size for you:'}
                  </p>
                  <p className="text-4xl font-oswald font-black text-t1-red italic">
                    {sgRecommendedSize}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setLoading(true)
        setError(null)
        const response = await productApi.getById(Number(id))
        setProduct(response.data)
      } catch (err: any) {
        // console.error('Error fetching product:', err)
        setError(err.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <Layout footer={<Footer />}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t1-red/20 border-t-t1-red rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  if (error || !product) {
    return (
      <Layout footer={<Footer />}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-white px-4 text-center">
          <h2 className="text-4xl font-oswald font-black mb-6 italic uppercase tracking-tighter">
            {error ? t('productDetail.error') : t('productDetail.notFound')}
          </h2>
          {error && <p className="text-gray-500 mb-8 italic">{error}</p>}
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-t1-red font-oswald font-bold hover:gap-4 transition-all"
          >
            <ArrowLeft size={18} /> {t('productDetail.backToShop')}
          </button>
        </div>
      </Layout>
    )
  }

  return <ProductDetailContent key={id} product={product} />
}
