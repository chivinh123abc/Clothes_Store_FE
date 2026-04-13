import { motion } from 'framer-motion'
import heroImg from '~/assets/Background/hero_fashion.png'

const HeroSection = () => {
  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-black">
      {/* Background with zoom effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img
          src={heroImg}
          alt="Premium Fashion Collection"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-t1-dark via-transparent to-black/30" />
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="font-momo-signature text-3xl md:text-5xl text-white mb-2 drop-shadow-lg italic">
            Elegance in Motion
          </h2>
          <h1 className="font-oswald text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-8 drop-shadow-2xl">
            <span className="block">MODERN URBAN</span>
            <span className="text-white">COLLECTION</span>
          </h1>

          <div className="flex justify-center items-center gap-2 mb-10">
            {[1, 2, 3, 4, 5, 6].map((star) => (
              <motion.span
                key={star}
                className="text-white text-3xl md:text-4xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + (star * 0.1) }}
              >
                ★
              </motion.span>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-3 font-oswald font-bold text-lg tracking-widest overflow-hidden"
          >
            <span className="absolute inset-0 bg-t1-red transition-transform duration-300 group-hover:translate-x-full" />
            <span className="absolute inset-0 bg-white translate-x-[-101%] transition-transform duration-300 group-hover:translate-x-0" />
            <span className="relative z-10 text-white group-hover:text-t1-dark transition-colors duration-300 uppercase">
              Explore Collection
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Side Decorative Text */}
      <div className="absolute left-6 bottom-20 hidden lg:block">
        <p className="font-oswald text-white/20 uppercase tracking-[1em] rotate-90 origin-left text-xs">
          EST. 2026 CLOTHES STORE
        </p>
      </div>
    </section>
  )
}

export default HeroSection
