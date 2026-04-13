import { motion } from 'framer-motion'
import noticeBanner from '~/assets/Background/notice_banner.png'
import eventBanner from '~/assets/Background/event_banner.png'

const CommunitySection = () => {
  return (
    <section className="py-20 bg-t1-dark px-4 md:px-10 lg:px-20">
      <div className="flex flex-col items-center mb-16">
        <h2 className="font-oswald text-4xl font-black text-white uppercase tracking-widest italic mb-4">
          Community
        </h2>
        <div className="w-20 h-1 bg-t1-red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Notice Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="relative group h-[300px] overflow-hidden cursor-pointer border border-white/5"
        >
          <div className="absolute inset-0 bg-black/40 group-hover:bg-t1-red/10 transition-colors duration-500 z-10" />
          <img
            src={noticeBanner}
            alt="Notice"
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col items-center">
            <h3 className="font-oswald text-7xl font-black text-white/10 group-hover:text-white/20 transition-colors duration-500 uppercase tracking-tighter absolute top-10 pointer-events-none">
              NOTICE
            </h3>
            <div className="relative mt-20 text-center">
              <p className="text-t1-red font-oswald font-bold tracking-[0.3em] uppercase mb-2">Announcement</p>
              <h4 className="text-white text-xl font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Official Updates
              </h4>
            </div>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-t1-red/30 transition-colors duration-500 z-30" />
        </motion.div>

        {/* Event Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="relative group h-[300px] overflow-hidden cursor-pointer border border-white/5"
        >
          <div className="absolute inset-0 bg-black/40 group-hover:bg-t1-red/10 transition-colors duration-500 z-10" />
          <img
            src={eventBanner}
            alt="Event"
            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col items-center">
            <h3 className="font-oswald text-7xl font-black text-white/10 group-hover:text-white/20 transition-colors duration-500 uppercase tracking-tighter absolute top-10 pointer-events-none">
              EVENT
            </h3>
            <div className="relative mt-20 text-center">
              <p className="text-t1-red font-oswald font-bold tracking-[0.3em] uppercase mb-2">Rewards</p>
              <h4 className="text-white text-xl font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Participate & Win
              </h4>
            </div>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-t1-red/30 transition-colors duration-500 z-30" />
        </motion.div>
      </div>
    </section>
  )
}

export default CommunitySection
