import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { REVIEWS } from '~/data/homeData'
import { useLanguage } from '~/contexts/LanguageContext'
import { reviewApi } from '~/apis/reviewApi'

const ReviewSection = () => {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewsList, setReviewsList] = useState<any[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res: any = await reviewApi.getAll()
        const fetchedReviews = res.data || res
        if (Array.isArray(fetchedReviews) && fetchedReviews.length > 0) {
          // Strict filter: Only 5-star reviews with active images
          const filtered = fetchedReviews.filter(
            (r: any) => r.rating === 5 && (r.image_url || r.image)
          )
          if (filtered.length > 0) {
            setReviewsList(filtered)
          } else {
            setReviewsList(REVIEWS.filter((r: any) => r.rating === 5 && r.image))
          }
        } else {
          setReviewsList(REVIEWS.filter((r: any) => r.rating === 5 && r.image))
        }
      } catch {
        setReviewsList(REVIEWS.filter((r: any) => r.rating === 5 && r.image))
      }
    }
    fetchReviews()
  }, [])

  const maxIndex = Math.max(1, reviewsList.length - 3)
  const next = () => setCurrentIndex((prev: number) => (prev + 1) % maxIndex)
  const prev = () => setCurrentIndex((prev: number) => (prev - 1 + maxIndex) % maxIndex)

  return (
    <section className="py-20 bg-t1-dark border-t border-white/5">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-[1600px]">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-oswald text-3xl font-black text-white uppercase tracking-widest italic">
            {t('nav.review')}
          </h2>
          {reviewsList.length > 4 && (
            <div className="flex gap-4">
              <button
                onClick={prev}
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-6 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 27}%)` }}>
            {reviewsList.map((review, idx) => {
              const rating = review.rating || 5
              const text = review.text || review.content || ''
              const user = review.display_name || review.username || review.user || 'T1 Supporter'
              const date = review.created_at ? new Date(review.created_at).toISOString().split('T')[0] : (review.date || '2024.03.15')
              const productTitle = review.product || review.item || (review.product_id ? `Product #${review.product_id}` : 'T1 Gear')
              const imageUrl = review.image_url || review.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400'

              return (
                <div key={review.review_id || review.id || idx} className="min-w-[300px] flex-shrink-0 w-1/4">
                  <div className="bg-[#1a1a1a] border border-white/5 p-6 h-full flex flex-col hover:-translate-y-2 hover:border-t1-red/30 hover:shadow-[0_10px_30px_rgba(226,1,45,0.15)] transition-all duration-300">
                    {/* Review Image */}
                    <div className="aspect-square overflow-hidden mb-6 bg-neutral-900 border border-white/5 flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt={user}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400'
                        }}
                        className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                      />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#e2012d" color="#e2012d" />
                      ))}
                    </div>

                    {/* User info */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-inter font-bold text-sm tracking-tighter">{user}</span>
                      <span className="text-gray-500 font-inter text-[10px]">{date}</span>
                    </div>

                    {/* Content */}
                    <p className="text-gray-400 font-inter text-xs leading-relaxed mb-6 flex-grow italic line-clamp-3">
                      "{text}"
                    </p>

                    {/* Product small footer */}
                    <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 bg-black p-1 border border-white/10">
                        <div className="w-full h-full bg-t1-red/20 flex items-center justify-center">
                          <span className="text-[8px] text-t1-red">T1</span>
                        </div>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white font-inter text-[10px] truncate uppercase font-bold">{productTitle}</p>
                        <p className="text-[10px] text-gray-600">{t('home.ratings')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        {maxIndex > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {[...Array(maxIndex)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-4 h-1 transition-all duration-300 ${currentIndex === i ? 'bg-t1-red w-8' : 'bg-white/10'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewSection
