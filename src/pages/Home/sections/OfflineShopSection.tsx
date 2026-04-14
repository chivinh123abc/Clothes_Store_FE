import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOPS } from '~/data/shopData'

const OfflineShopSection = () => {
  const [activeShop, setActiveShop] = useState(SHOPS[0])

  return (
    <section className="py-20 bg-t1-dark border-t border-white/5">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-[1600px]">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-oswald text-4xl font-black text-white uppercase tracking-widest italic mb-8">
            Offline Shop
          </h2>

          <div className="flex gap-4">
            {SHOPS.map((shop) => (
              <button
                key={shop.id}
                onClick={() => setActiveShop(shop)}
                className={`px-8 py-3 font-oswald font-bold tracking-widest uppercase transition-all duration-300 border ${activeShop.id === shop.id
                  ? 'bg-t1-red border-t1-red text-white shadow-[0_0_20px_rgba(226,1,45,0.3)]'
                  : 'bg-transparent border-white/10 text-white/50 hover:text-white hover:border-white/30'}`}
              >
                {shop.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row bg-[#111111] border border-white/5 overflow-hidden shadow-2xl">
          {/* Shop Image/Info Overlay */}
          <div className="relative lg:w-3/5 h-[400px] lg:h-[500px] overflow-hidden group">
            <AnimatePresence mode='wait'>
              <motion.img
                key={activeShop.id}
                src={activeShop.image}
                alt={activeShop.name}
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

            <div className="absolute left-10 bottom-10 z-10 max-w-sm">
              <motion.div
                key={activeShop.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-oswald text-4xl font-black text-white mb-6 uppercase tracking-tight">{activeShop.name}</h3>
                <div className="space-y-4 font-inter text-xs text-gray-300">
                  <div className="flex gap-3">
                    <span className="text-t1-red font-bold uppercase w-16">Address</span>
                    <span className="flex-1 opacity-80">{activeShop.address}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-t1-red font-bold uppercase w-16">Phone</span>
                    <span className="flex-1 opacity-80">{activeShop.phone}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-t1-red font-bold uppercase w-16">Hours</span>
                    <span className="flex-1 opacity-80">{activeShop.hours}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Simulated Map */}
          <div className="lg:w-2/5 h-[300px] lg:h-[500px] relative bg-[#222]">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeShop.id}
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_API_KEY&q=${encodeURIComponent(activeShop.address)}&zoom=15`}
                  className="w-full h-full border-0 grayscale invert contrast-125 opacity-70"
                  allowFullScreen
                />
                {/* Overlay for "mock" feel if no API key */}
                <div className="absolute inset-0 bg-t1-red/5 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-11 pointer-events-none">
                  <div className="w-6 h-6 bg-t1-red rounded-full animate-ping opacity-75" />
                  <div className="w-4 h-4 bg-t1-red rounded-full -mt-5 ml-1 border-2 border-white shadow-lg" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OfflineShopSection
