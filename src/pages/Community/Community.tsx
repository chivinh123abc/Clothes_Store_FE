import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  Search,
  Lock,
  CheckCircle,
  Clock,
  Edit3,
  Filter,
  MessageSquare
} from 'lucide-react'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import BGImage from '~/assets/Background/first_bg_img.jpg'

import {
  notices,
  reviews,
  events,
  qaItems
} from '~/data/communityData'

const tabList = ['NOTICE', 'REVIEW', 'EVENT', 'QA']

function Community() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab')?.toUpperCase() || 'NOTICE'
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [isWriting, setIsWriting] = useState(false)

  useEffect(() => {
    setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName)
    setSearchParams({ tab: tabName })
    setIsWriting(false) // Reset writing mode when changing tabs
  }

  return (
    <Layout footer={<Footer />} bleed={true}>
      {/* Page Hero */}
      <div className='relative w-full h-[35vh] overflow-hidden bg-black'>
        <img className='absolute w-full h-full object-cover opacity-30' src={BGImage} alt='Community' />
        <div className='absolute inset-0 bg-gradient-to-t from-t1-dark via-black/40 to-transparent' />
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <h1 className='font-oswald font-black text-6xl md:text-8xl uppercase tracking-widest text-white italic drop-shadow-2xl'>
            COMMUNITY
          </h1>
          <div className='w-20 h-1 bg-t1-red mt-4' />
          <p className='text-gray-400 font-inter text-sm tracking-widest mt-4 uppercase'>
            Notice · Review · Event · FAQ
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='sticky top-[102px] z-40 bg-t1-dark/90 backdrop-blur-xl border-b border-white/5'>
        <div className='flex justify-center gap-2 md:gap-8 px-4 max-w-6xl mx-auto'>
          {tabList.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative py-5 font-oswald text-sm md:text-xl tracking-widest font-bold transition-all duration-300 px-4 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab === 'QA' ? 'Q&A' : tab}
              {activeTab === tab && (
                <motion.span
                  layoutId='tab-underline'
                  className='absolute bottom-0 left-0 w-full h-[3px] bg-t1-red shadow-[0_0_10px_rgba(226,1,45,0.8)]'
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='py-16 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto min-h-[60vh]'>
        <AnimatePresence mode='wait'>

          {/* NOTICE */}
          {activeTab === 'NOTICE' && (
            <motion.div
              key='notice'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className='bg-[#161616] border border-white/5 shadow-2xl overflow-hidden'>
                {/* Pinned notice */}
                {notices.filter(n => n.pinned).map(notice => (
                  <div key={notice.id} className='flex items-center gap-4 px-6 py-4 bg-t1-red/10 border-b border-t1-red/20'>
                    <span className='text-[10px] font-oswald font-bold text-t1-red border border-t1-red px-2 py-0.5 tracking-widest shrink-0'>📌 PINNED</span>
                    <p className='font-oswald font-bold text-white tracking-wide truncate'>{notice.title}</p>
                    <span className='text-gray-500 text-xs ml-auto shrink-0 hidden md:block'>{notice.date}</span>
                  </div>
                ))}
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='border-b border-white/5 text-xs text-gray-500 font-inter uppercase tracking-widest'>
                      <th className='py-4 px-6 w-20 hidden md:table-cell'>No.</th>
                      <th className='py-4 px-6'>Title</th>
                      <th className='py-4 px-6 w-28 hidden md:table-cell text-center'>Author</th>
                      <th className='py-4 px-6 w-32 text-right'>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.filter(n => !n.pinned).map((notice, index) => (
                      <tr
                        key={notice.id}
                        className='border-b border-white/5 hover:bg-white/3 transition-colors duration-200 cursor-pointer group'
                      >
                        <td className='py-4 px-6 text-gray-600 text-sm hidden md:table-cell'>{notices.filter(n => !n.pinned).length - index}</td>
                        <td className='py-4 px-6 font-inter text-sm text-gray-300 group-hover:text-white transition-colors'>{notice.title}</td>
                        <td className='py-4 px-6 text-xs text-gray-500 hidden md:table-cell text-center'>{notice.author}</td>
                        <td className='py-4 px-6 text-xs text-gray-500 text-right'>{notice.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* REVIEW */}
          {activeTab === 'REVIEW' && (
            <motion.div
              key='review'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            >
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className='bg-[#161616] p-8 border border-white/5 shadow-xl group hover:border-t1-red/40 transition-all duration-300 relative flex flex-col'
                >
                  <div className='absolute top-0 right-0 bg-t1-red text-white text-[9px] font-oswald px-3 py-1 tracking-widest'>
                    VERIFIED
                  </div>
                  <div className='flex gap-0.5 mb-5 text-t1-red text-lg'>
                    {'★'.repeat(review.rating)}
                    <span className='text-gray-700'>{'★'.repeat(5 - review.rating)}</span>
                  </div>
                  <p className='text-gray-400 font-inter text-sm italic leading-relaxed flex-grow mb-6'>
                    "{review.text}"
                  </p>
                  <div className='border-t border-white/5 pt-5'>
                    <p className='font-oswald font-bold tracking-wider text-white text-sm uppercase'>{review.user}</p>
                    <p className='text-[10px] text-t1-red uppercase tracking-widest mt-1'>↳ {review.item}</p>
                    <p className='text-[10px] text-gray-600 mt-1'>{review.date}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* EVENT */}
          {activeTab === 'EVENT' && (
            <motion.div
              key='event'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col gap-8'
            >
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className='relative w-full h-[50vh] overflow-hidden bg-black group border border-white/5 shadow-2xl cursor-pointer'
                >
                  <img
                    className='absolute w-full h-full object-cover opacity-40 group-hover:opacity-25 group-hover:scale-105 transition-all duration-1000'
                    src={event.img}
                    alt={event.title}
                  />
                  <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent' />
                  <div className='absolute inset-0 flex flex-col justify-center px-12 md:px-20'>
                    <div className='flex items-center gap-4 mb-6'>
                      <span className={`px-4 py-1.5 font-oswald text-xs tracking-[0.3em] border ${event.status === 'ONGOING'
                        ? 'border-t1-red text-t1-red bg-t1-red/10 shadow-[0_0_15px_rgba(226,1,45,0.3)]'
                        : 'border-white/30 text-white/60'
                      }`}>
                        {event.status}
                      </span>
                      <span className='text-gray-500 font-inter text-xs tracking-widest'>Ends: {event.end}</span>
                    </div>
                    <h2 className='font-oswald text-4xl md:text-6xl font-black tracking-tight text-white uppercase italic mb-4 leading-none'>
                      {event.title}
                    </h2>
                    <p className='text-gray-300 font-inter text-sm max-w-lg leading-relaxed mb-8'>
                      {event.desc}
                    </p>
                    <div>
                      <button className='font-oswald font-bold text-sm tracking-[0.3em] uppercase px-10 py-3 border border-white text-white hover:bg-white hover:text-t1-dark transition-all duration-300'>
                        VIEW DETAIL →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Q&A section */}
          {activeTab === 'QA' && (
            <motion.div
              key='qa'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='space-y-8'
            >
              {/* Controls */}
              <div className='flex flex-col lg:flex-row gap-6 items-end justify-between bg-[#161616] p-6 border border-white/5'>
                <div className='w-full lg:w-auto space-y-4'>
                  <div className='flex items-center gap-2 text-gray-400 mb-2'>
                    <Filter size={14} />
                    <span className='text-[10px] font-oswald font-bold uppercase tracking-widest'>Filter by Category</span>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {['ALL', 'DELIVERY', 'PRODUCT', 'PAYMENT', 'ORDER'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 text-[10px] font-oswald font-bold tracking-widest transition-all duration-300 ${activeCategory === cat
                          ? 'bg-t1-red text-white shadow-[0_0_15px_rgba(226,1,45,0.4)]'
                          : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row w-full lg:w-auto gap-4'>
                  <div className='relative group shrink-0 sm:w-64'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-t1-red transition-colors' size={16} />
                    <input
                      type="text"
                      placeholder="SEARCH Q&A..."
                      className='w-full bg-black border border-white/10 py-3 pl-10 pr-4 text-xs font-inter text-white outline-none focus:border-t1-red transition-all'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setIsWriting(!isWriting)}
                    className='bg-white text-black font-oswald font-black text-xs tracking-[0.2em] px-6 py-3 flex items-center justify-center gap-2 hover:bg-t1-red hover:text-white transition-all transform hover:-translate-y-0.5 whitespace-nowrap'
                  >
                    <Edit3 size={14} />
                    ASK A QUESTION
                  </button>
                </div>
              </div>

              {/* Writing Form */}
              <AnimatePresence>
                {isWriting && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className='overflow-hidden'
                  >
                    <div className='bg-[#111111] border border-t1-red/30 p-8 shadow-2xl relative'>
                      <div className='absolute top-0 left-0 w-full h-[2px] bg-t1-red' />
                      <h3 className='font-oswald font-black text-2xl text-white italic uppercase tracking-wider mb-8 flex items-center gap-3'>
                        <MessageSquare className='text-t1-red' size={24} />
                        WRITE A QUESTION
                      </h3>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                        <div className='space-y-2'>
                          <label className='block text-[10px] font-oswald font-bold text-gray-500 tracking-widest uppercase'>Category</label>
                          <select className='w-full bg-black border border-white/10 py-4 px-4 text-sm text-white focus:border-t1-red outline-none transition-all'>
                            <option>PRODUCT ENQUIRY</option>
                            <option>DELIVERY STATUS</option>
                            <option>PAYMENT ISSUES</option>
                            <option>RETURN & EXCHANGE</option>
                            <option>OTHERS</option>
                          </select>
                        </div>
                        <div className='space-y-2'>
                          <label className='block text-[10px] font-oswald font-bold text-gray-500 tracking-widest uppercase'>Public / Secret</label>
                          <div className='flex items-center gap-6 h-[54px]'>
                            <label className='flex items-center gap-2 cursor-pointer group'>
                              <input type="radio" name="secret" defaultChecked className='accent-t1-red w-4 h-4' />
                              <span className='text-xs text-gray-300 group-hover:text-white transition-colors'>PUBLIC</span>
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer group'>
                              <input type="radio" name="secret" className='accent-t1-red w-4 h-4' />
                              <span className='text-xs text-gray-300 group-hover:text-white transition-colors flex items-center gap-1.5'>
                                SECRET <Lock size={12} className='text-t1-red' />
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className='md:col-span-2 space-y-2'>
                          <label className='block text-[10px] font-oswald font-bold text-gray-500 tracking-widest uppercase'>Subject</label>
                          <input
                            type="text"
                            className='w-full bg-black border border-white/10 py-4 px-4 text-sm text-white focus:border-t1-red outline-none transition-all'
                            placeholder="WHAT WOULD YOU LIKE TO ASK?"
                          />
                        </div>
                        <div className='md:col-span-2 space-y-2'>
                          <label className='block text-[10px] font-oswald font-bold text-gray-500 tracking-widest uppercase'>Content</label>
                          <textarea
                            rows={5}
                            className='w-full bg-black border border-white/10 py-4 px-4 text-sm text-white focus:border-t1-red outline-none transition-all resize-none font-inter placeholder:text-gray-700'
                            placeholder="PLEASE DESCRIBE YOUR CONCERN IN DETAIL..."
                          />
                        </div>
                      </div>

                      <div className='flex justify-end gap-4'>
                        <button
                          onClick={() => setIsWriting(false)}
                          className='px-8 py-3 font-oswald font-bold text-xs tracking-widest text-gray-500 hover:text-white transition-colors'
                        >
                          CANCEL
                        </button>
                        <button className='px-12 py-3 bg-t1-red text-white font-oswald font-black text-xs tracking-[0.2em] shadow-[0_10px_20px_rgba(226,1,45,0.3)] hover:bg-white hover:text-black transition-all'>
                          SUBMIT QUESTION
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className='space-y-4'>
                {qaItems
                  .filter((item: any) =>
                    (activeCategory === 'ALL' || item.category === activeCategory) &&
                    (item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.category.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((item: any, i: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`border ${openFaqId === item.id ? 'border-t1-red/30' : 'border-white/5'} bg-[#161616] overflow-hidden transition-colors duration-500`}
                    >
                      <button
                        onClick={() => setOpenFaqId(openFaqId === item.id ? null : item.id)}
                        className='w-full text-left px-8 py-7 flex justify-between items-center group relative'
                      >
                        {openFaqId === item.id && <div className='absolute left-0 top-0 w-1 h-full bg-t1-red transition-all' />}

                        <div className='flex flex-col md:flex-row md:items-center gap-4 md:gap-10 w-full'>
                          <div className='flex items-center gap-4 min-w-[140px]'>
                            <span className='text-[10px] font-oswald font-bold text-t1-red tracking-widest bg-t1-red/10 px-2 py-0.5 border border-t1-red/20'>
                              {item.category}
                            </span>
                            {item.status === 'ANSWERED' ? (
                              <span className='flex items-center gap-1.5 text-[9px] font-inter font-bold text-emerald-500 border border-emerald-500/20 px-2 py-0.5 uppercase tracking-tighter'>
                                <CheckCircle size={10} /> ANSWERED
                              </span>
                            ) : (
                              <span className='flex items-center gap-1.5 text-[9px] font-inter font-bold text-amber-500 border border-amber-500/20 px-2 py-0.5 uppercase tracking-tighter'>
                                <Clock size={10} /> PENDING
                              </span>
                            )}
                          </div>

                          <div className='flex items-center gap-3 transition-all duration-300'>
                            {item.isSecret && <Lock size={14} className='text-t1-red shrink-0' />}
                            <h4 className={`font-oswald text-lg md:text-xl font-bold uppercase tracking-tight ${openFaqId === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                            }`}>
                              {item.isSecret ? Array(25).fill('•').join('') : item.question}
                            </h4>
                          </div>

                          <div className='ml-auto flex items-center gap-8 text-[11px] text-gray-600 font-inter uppercase tracking-widest hidden md:flex'>
                            <span className='w-20'>{item.user}</span>
                            <span className='w-24 text-right'>{item.date}</span>
                          </div>
                        </div>

                        <div className={`ml-4 shrink-0 transition-all duration-300 ${openFaqId === item.id ? 'text-t1-red scale-110' : 'text-gray-700'}`}>
                          {openFaqId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {openFaqId === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className='px-10 pb-10 pt-4 flex gap-6 bg-black/40'>
                              <div className='shrink-0 w-8 h-8 rounded-full bg-t1-red/10 flex items-center justify-center text-t1-red font-oswald font-black text-lg border border-t1-red/20'>
                                A
                              </div>
                              <div className='space-y-4 max-w-4xl'>
                                <p className='text-gray-300 font-inter text-base leading-relaxed'>
                                  {item.isSecret
                                    ? 'THÔNG TIN NÀY LÀ RIÊNG TƯ. VUI LÒNG ĐĂNG NHẬP HOẶC KIỂM TRA MẬT KHẨU ĐỂ XEM NỘI DUNG.'
                                    : item.answer || 'CÂU HỎI ĐANG ĐƯỢC CHỜ XỬ LÝ. CHÚNG TÔI SẼ PHẢN HỒI TRONG THỜI GIAN SỚM NHẤT.'
                                  }
                                </p>
                                {item.status === 'ANSWERED' && (
                                  <div className='pt-6 border-t border-white/5'>
                                    <p className='text-[10px] text-gray-600 font-inter uppercase tracking-[0.2em]'>
                                      Response from {item.category} TEAM · {item.date}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
              </div>

              {qaItems.filter((item: any) =>
                (activeCategory === 'ALL' || item.category === activeCategory) &&
                (item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length === 0 && (
                <div className='py-20 text-center border border-white/5 bg-[#161616]'>
                  <p className='font-oswald text-gray-600 tracking-[0.3em] font-bold uppercase'>NO RESULTS FOUND</p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </Layout>
  )
}

export default Community