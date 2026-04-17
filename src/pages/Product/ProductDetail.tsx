import { useState, useMemo, useEffect } from 'react'
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
  RotateCcw
} from 'lucide-react'
import { useCart } from '~/contexts/CartContext'
import { combinedProducts } from '~/data/products'
import { ProductCard } from '~/components/Product/ProductCard'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import { sizes } from '~/data/productDetailData'
import { useLanguage } from '~/contexts/LanguageContext'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addCartItem } = useCart()
  const { t } = useLanguage()

  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isAdded, setIsAdded] = useState(false)

  // Find product
  const product = useMemo(() => {
    return combinedProducts.find((p) => p.product_id === Number(id))
  }, [id])

  // Related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return combinedProducts
      .filter((p) => p.category_name === product.category_name && p.product_id !== product.product_id)
      .slice(0, 4)
  }, [product])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!product) {
    return (
      <Layout footer={<Footer />}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-white px-4">
          <h2 className="text-4xl font-oswald font-black mb-6 italic uppercase tracking-tighter">{t('productDetail.notFound')}</h2>
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

  const handleAddToCart = () => {
    setIsAdded(true)
    addCartItem({
      id: product.product_id,
      name: product.product_name,
      price: product.items?.[0]?.sale_price ?? product.items?.[0]?.product_item_price ?? 0,
      imageUrl: product.items?.[0]?.product_item_image ?? '',
      size: selectedSize
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
              <img
                src={product.items?.[0]?.product_item_image}
                alt={product.product_name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.soldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <span className="px-10 py-5 text-4xl font-oswald font-black text-white border-4 border-white italic uppercase tracking-[0.2em]">{t('productDetail.soldOut')}</span>
                </div>
              )}
              {product.items?.[0]?.sale_price && !product.soldOut && (
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
                {product.items?.[0]?.sale_price ? (
                  <>
                    <span className="text-3xl font-oswald font-black text-t1-red italic tracking-wide">${product.items[0].sale_price.toFixed(2)}</span>
                    <span className="text-lg text-gray-500 line-through font-light">${product.items[0].product_item_price.toFixed(2)}</span>
                    <span className="bg-t1-red/10 text-t1-red text-[10px] font-bold px-2 py-0.5 rounded border border-t1-red/20">{t('productDetail.save')} {Math.round((1 - product.items[0].sale_price / product.items[0].product_item_price) * 100)}%</span>
                  </>
                ) : (
                  <span className="text-3xl font-oswald font-black text-white italic tracking-wide">${(product.items?.[0]?.product_item_price ?? 0).toFixed(2)}</span>
                )}
              </div>

              <p className="text-gray-400 font-light leading-relaxed mb-10 italic">
                {product.product_description || 'Premium clothing merchandise designed for those who demand excellence. This high-quality piece combines athletic performance with street-ready style.'}
              </p>

              {/* Size Selector */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-oswald font-bold tracking-[0.2em] uppercase text-gray-400">{t('productDetail.selectSize')}</span>
                  <button className="text-[10px] font-inter text-t1-red hover:underline uppercase tracking-widest">{t('productDetail.sizeGuide')}</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={product.soldOut}
                      className={`min-w-[54px] h-[54px] border flex items-center justify-center font-oswald font-bold text-sm transition-all duration-300 ${selectedSize === size
                        ? 'bg-white border-white text-t1-dark shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        : 'bg-transparent border-t1-gray/40 text-gray-400 hover:border-white hover:text-white'
                      } ${product.soldOut ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-10">
                <span className="text-xs font-oswald font-bold tracking-[0.2em] uppercase text-gray-400 block mb-4">{t('productDetail.quantity')}</span>
                <div className="flex items-center border border-t1-gray/40 w-fit h-14">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={product.soldOut}
                    className="w-14 h-full flex items-center justify-center hover:bg-t1-gray/10 transition-colors text-gray-400"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-14 text-center font-oswald font-bold text-lg text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    disabled={product.soldOut}
                    className="w-14 h-full flex items-center justify-center hover:bg-t1-gray/10 transition-colors text-gray-400"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleAddToCart}
                  disabled={product.soldOut || isAdded}
                  className={`flex-1 h-16 flex items-center justify-center gap-3 font-oswald font-black text-sm tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden relative ${isAdded
                    ? 'bg-green-600 text-white shadow-[0_0_30px_rgba(22,163,74,0.4)]'
                    : 'bg-t1-red text-white hover:bg-[#ff0033] shadow-[0_0_20px_rgba(226,1,45,0.3)] hover:shadow-[0_0_35px_rgba(226,1,45,0.6)]'
                  } ${product.soldOut ? 'bg-t1-gray/40 cursor-not-allowed shadow-none hover:bg-t1-gray/40' : ''}`}
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
                        <ShoppingCart size={20} /> {t('productDetail.addToCart')}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
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
            {['description', 'specs', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-5 font-oswald font-bold tracking-[0.2em] uppercase text-sm border-b-2 transition-all duration-300 whitespace-nowrap ${activeTab === tab
                  ? 'border-t1-red text-white'
                  : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                {t(`productDetail.${tab}`)}
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
    </Layout>
  )
}
