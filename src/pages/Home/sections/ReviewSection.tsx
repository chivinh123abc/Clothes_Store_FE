import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { REVIEWS } from '~/data/homeData'
import { useLanguage } from '~/contexts/LanguageContext'

const ReviewSection = () => {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev: number) => (prev + 1) % (REVIEWS.length - 3))
  const prev = () => setCurrentIndex((prev: number) => (prev - 1 + (REVIEWS.length - 3)) % (REVIEWS.length - 3))

  return (
    <section className="py-20 bg-t1-dark border-t border-white/5">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-[1600px]">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-oswald text-3xl font-black text-white uppercase tracking-widest italic">
            {t('nav.review')}
          </h2>
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
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-6 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 27}%)` }}>
            {REVIEWS.map((review) => (
              <div key={review.id} className="min-w-[300px] flex-shrink-0 w-1/4">
                <div className="bg-[#1a1a1a] border border-white/5 p-6 h-full flex flex-col">
                  {/* Review Image */}
                  <div className="aspect-square overflow-hidden mb-6">
                    <img
                      src={review.image}
                      alt={review.user}
                      className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#e2012d" color="#e2012d" />
                    ))}
                  </div>

                  {/* User info */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-inter font-bold text-sm tracking-tighter">{review.user}</span>
                    <span className="text-gray-500 font-inter text-[10px]">{review.date}</span>
                  </div>

                  {/* Content */}
                  <p className="text-gray-400 font-inter text-xs leading-relaxed mb-6 flex-grow italic line-clamp-3">
                    "{review.content}"
                  </p>

                  {/* Product small footer */}
                  <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-black p-1 border border-white/10">
                      <div className="w-full h-full bg-t1-red/20 flex items-center justify-center">
                        <span className="text-[8px] text-t1-red">T1</span>
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white font-inter text-[10px] truncate uppercase font-bold">{review.product}</p>
                      <p className="text-[10px] text-gray-600">{t('home.ratings')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-12 gap-2">
          {[...Array(REVIEWS.length - 3)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-4 h-1 transition-all duration-300 ${currentIndex === i ? 'bg-t1-red w-8' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewSection
