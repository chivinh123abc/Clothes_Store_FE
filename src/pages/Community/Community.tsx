import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Layout from '~/components/layout/Layout'
import Footer from '~/components/layout/Footer'
import BGImage from '~/assets/Background/first_bg_img.jpg'

// --- MOCK DATA ---
const notices = [
  { id: 1, title: '[THÔNG BÁO] Ra mắt bộ sưu tập Mùa Hè 2026', date: '2026-04-10', author: 'Admin', pinned: true },
  { id: 2, title: '[BẢO TRÌ] Nâng cấp hệ thống thanh toán – 22/04/2026', date: '2026-04-08', author: 'System', pinned: false },
  { id: 3, title: '[SỰ KIỆN] Giảm 10% cho thành viên mới đăng ký', date: '2026-04-01', author: 'Admin', pinned: false },
  { id: 4, title: '[CHÍNH SÁCH] Cập nhật quy định đổi trả hàng', date: '2026-03-25', author: 'Admin', pinned: false },
  { id: 5, title: '[THÔNG BÁO] Mở thêm cửa hàng tại Hà Nội – 01/05/2026', date: '2026-03-20', author: 'Admin', pinned: false },
  { id: 6, title: '[BẢO TRÌ] Website tạm ngừng hoạt động ngày 15/03 từ 00:00-06:00', date: '2026-03-12', author: 'System', pinned: false }
]

const reviews = [
  { id: 1, user: 'Minh_Streetwear', rating: 5, text: 'Áo hoodie quá xịn, chất vải dày dặn, form đẹp. Giao hàng cực nhanh, chỉ 1 ngày là có rồi. Sẽ tiếp tục ủng hộ shop!', item: 'Modern Urban Hoodie Vol.1', date: '2026-04-11' },
  { id: 2, user: 'ThuViOfficial', rating: 4, text: 'Hàng đẹp như mô tả, đóng gói rất cẩn thận. Chỉ có điều size hơi rộng so với bảng size, nên chọn size nhỏ hơn 1 cấp.', item: '2026 Official Jacket', date: '2026-04-09' },
  { id: 3, user: 'HoangDepTrai99', rating: 5, text: 'Chất vải mát, logo in sắc nét không bị bong tróc sau nhiều lần giặt. Giá cả hợp lý. Sẽ mua thêm cho cả nhà!', item: 'Premium Leather Jacket', date: '2026-04-07' },
  { id: 4, user: 'LinhBUI_HN', rating: 5, text: 'Mua làm quà sinh nhật cho bạn trai, bạn ấy rất thích! Shop tư vấn nhiệt tình, gói quà đẹp. Highly recommended!', item: 'Minimal Gray Sweater', date: '2026-04-05' },
  { id: 5, user: 'SonDep_TPHCM', rating: 3, text: 'Sản phẩm ổn, nhưng giao hàng hơi chậm hơn dự kiến 1 ngày. Chất lượng thì không có gì phàn nàn, vẫn sẽ quay lại.', item: 'Champion Signature Pants Vol.5', date: '2026-04-02' },
  { id: 6, user: 'AnhQuan.Outfit', rating: 5, text: 'Đây là lần thứ 4 mình mua ở đây rồi. Chất lượng luôn ổn định, không bao giờ thất vọng. Shop rất đáng tin!', item: 'Essential Black Hoodie', date: '2026-03-30' }
]

const events = [
  {
    id: 1,
    title: 'MIDSUMMER SALE 2026',
    status: 'ONGOING',
    desc: 'Giảm giá lên đến 50% toàn bộ bộ sưu tập mùa hè. Số lượng có hạn – nhanh tay kẻo hết!',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1400',
    end: '30/04/2026'
  },
  {
    id: 2,
    title: 'NEW COLLECTION GIVEAWAY',
    status: 'UPCOMING',
    desc: 'Theo dõi trang và tag bạn bè để có cơ hội nhận trọn bộ sản phẩm từ bộ sưu tập mới nhất.',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1400',
    end: '15/05/2026'
  },
  {
    id: 3,
    title: 'HANOI STORE OPENING',
    status: 'UPCOMING',
    desc: 'Chào mừng khai trương cửa hàng tại Hà Nội – 19 Lê Thánh Tông, Hoàn Kiếm. Quà tặng và ưu đãi hấp dẫn cho 100 khách đầu tiên.',
    img: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1400',
    end: '01/05/2026'
  }
]

const faqs = [
  { id: 1, question: 'Thời gian giao hàng mất bao lâu?', answer: 'Đối với khu vực nội thành TP.HCM và Hà Nội, thời gian giao hàng từ 1-2 ngày. Đối với các tỉnh thành khác, thời gian dự kiến từ 3-5 ngày làm việc.' },
  { id: 2, question: 'Tôi có thể đổi trả hàng không?', answer: 'Có. Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng, với điều kiện tem mác còn nguyên và sản phẩm chưa qua sử dụng. Chi phí vận chuyển đổi trả do khách hàng chịu.' },
  { id: 3, question: 'Làm sao để theo dõi đơn hàng của tôi?', answer: 'Bạn có thể đăng nhập vào tài khoản, vào mục "Order History" để theo dõi trạng thái và thông tin vận chuyển của đơn hàng theo thời gian thực.' },
  { id: 4, question: 'Shop có ship quốc tế không?', answer: 'Hiện tại chúng tôi chỉ hỗ trợ giao hàng trong lãnh thổ Việt Nam. Chúng tôi đang trong quá trình mở rộng và sẽ thông báo ngay khi có dịch vụ ship quốc tế.' },
  { id: 5, question: 'Các phương thức thanh toán được chấp nhận?', answer: 'Chúng tôi chấp nhận: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng, Thẻ tín dụng/ghi nợ (Visa, Mastercard), và các ví điện tử phổ biến (MoMo, ZaloPay, VNPay).' }
]

const tabList = ['NOTICE', 'REVIEW', 'EVENT', 'FAQ']

function Community() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab')?.toUpperCase() || 'NOTICE'
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)

  useEffect(() => {
    setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName)
    setSearchParams({ tab: tabName })
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
              className={`relative py-5 font-oswald text-sm md:text-xl tracking-widest font-bold transition-all duration-300 px-4 ${
                activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab}
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
                      <span className={`px-4 py-1.5 font-oswald text-xs tracking-[0.3em] border ${
                        event.status === 'ONGOING'
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

          {/* FAQ */}
          {activeTab === 'FAQ' && (
            <motion.div
              key='faq'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='max-w-3xl mx-auto space-y-3'
            >
              <p className='text-center text-gray-500 font-inter text-sm tracking-widest uppercase mb-10'>
                Câu hỏi thường gặp — Liên hệ <span className='text-t1-red underline cursor-pointer'>contact@clothesstore.vn</span> nếu cần thêm hỗ trợ
              </p>
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className='border border-white/5 bg-[#161616] overflow-hidden'
                >
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className='w-full text-left px-8 py-6 flex justify-between items-center group transition-all duration-300 hover:bg-white/3'
                  >
                    <span className={`font-oswald text-base md:text-lg tracking-wide font-bold uppercase transition-colors ${
                      openFaqId === faq.id ? 'text-t1-red' : 'text-gray-200 group-hover:text-white'
                    }`}>
                      <span className='text-t1-red mr-3 opacity-60'>Q.</span>{faq.question}
                    </span>
                    <span className='text-gray-500 ml-4 shrink-0 transition-transform duration-300'>
                      {openFaqId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaqId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className='overflow-hidden'
                      >
                        <div className='px-8 pb-6 pt-2 text-gray-400 font-inter text-sm leading-relaxed border-t border-white/5'>
                          <span className='font-oswald font-bold text-white mr-2 tracking-widest'>A.</span>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </Layout>
  )
}

export default Community