import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const REVIEWS = [
  {
    id: 1,
    user: 'NiceT1Line',
    rating: 5,
    date: '2024.03.15',
    product: '2025 T1 World Champions Artisan Keycap',
    content: 'Absolutely peak quality. Came really fast and looks incredible on my keyboard. Worth every penny for a 3-peat fan!',
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    user: 'FakerFan88',
    rating: 5,
    date: '2024.03.12',
    product: '2026 T1 Uniform Jacket',
    content: 'The material is premium. Fit is perfect (ordered XL). Highly recommend for anyone looking to support the goat.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aec369a70?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    user: 'OnerJungle',
    rating: 5,
    date: '2024.03.10',
    product: '2025 T1 Player Plushie Keychain (Oner)',
    content: 'He is so cute and tiny! Puts perfectly on my bag. Shipping was fast and the packaging was protective.',
    image: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    user: 'Champion_Keria',
    rating: 5,
    date: '2024.03.05',
    product: '[Pro Order] 2025 T1 World Champions Jacket',
    content: 'The gold embroidery is stunning. Much better than the pictures. It feels like wearing history.',
    image: 'https://images.unsplash.com/photo-1544022613-e87f17a784de?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 5,
    user: 'T1BaseCamp_Regular',
    rating: 4,
    date: '2024.02.28',
    product: '2024 T1 World Champions Half Zip-Up',
    content: 'Good product, but shipping took a week to AUS. The half zip is cozy though and fits true to size.',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=400'
  }
]

const ReviewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev: number) => (prev + 1) % (REVIEWS.length - 3))
  const prev = () => setCurrentIndex((prev: number) => (prev - 1 + (REVIEWS.length - 3)) % (REVIEWS.length - 3))

  return (
    <section className="py-20 bg-t1-dark border-t border-white/5">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-[1600px]">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-oswald text-3xl font-black text-white uppercase tracking-widest italic">
            Review
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
                      <p className="text-[10px] text-gray-600">Ratings 5.0 | Review 1</p>
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
