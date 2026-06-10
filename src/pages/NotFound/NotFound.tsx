import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import { useLanguage } from '~/contexts/LanguageContext'

export default function NotFound() {
  const { language } = useLanguage()

  return (
    <Layout footer={<Footer />} forceNavbarOpaque={true}>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white bg-[#0a0a0a] px-6 text-center select-none font-inter relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-t1-red/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md w-full flex flex-col items-center"
        >
          {/* Animated 404 text */}
          <motion.h1
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-8xl md:text-9xl font-oswald font-black text-t1-red italic tracking-tighter drop-shadow-[0_0_35px_rgba(226,1,45,0.4)] mb-4 animate-pulse"
          >
            404
          </motion.h1>

          <h2 className="text-2xl md:text-3xl font-oswald font-bold uppercase tracking-wider text-white mb-4 italic">
            {language === 'vi' ? 'TRANG KHÔNG TỒN TẠI' : 'PAGE NOT FOUND'}
          </h2>

          <p className="text-gray-500 font-light italic mb-8 max-w-sm">
            {language === 'vi'
              ? 'Đường dẫn bạn yêu cầu không khả dụng hoặc đã bị thay đổi.'
              : 'The link you requested is unavailable or has been changed.'}
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-t1-red text-white hover:bg-white hover:text-black font-oswald font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(226,1,45,0.35)] hover:shadow-[0_15px_35px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {language === 'vi' ? 'QUAY LẠI TRANG CHỦ' : 'BACK TO HOME'}
          </Link>
        </motion.div>
      </div>
    </Layout>
  )
}
