import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Banner from '~/components/Banner/Banner'
import Navbar from '~/components/Navbar/Navbar'
import NavModal from '~/components/Modals/NavModal/NavModal'
import BGImage from '~/assets/Background/first_bg_img.jpg'

// --- MOCK DATA (Dữ liệu mẫu) ---
const notices = [
  { id: 1, title: '[THÔNG BÁO] Ra mắt bộ sưu tập 2026 Official Uniform', date: '2026-04-03', author: 'Admin' },
  { id: 2, title: '[BẢO TRÌ] Nâng cấp hệ thống thanh toán', date: '2026-03-28', author: 'System' },
  { id: 3, title: '[SỰ KIỆN] Chào đón thành viên mới với mã giảm giá 10%', date: '2026-03-15', author: 'Admin' }
]

const reviews = [
  { id: 1, user: 'FakerFan', rating: 5, text: 'Áo khoác 2026 chất lượng quá tuyệt vời. Đóng gói rất cẩn thận!', item: '2026 Official Jacket' },
  { id: 2, user: 'ChovyLife', rating: 4, text: 'Giao hàng nhanh, form áo đẹp nhưng hơi rộng so với size bảng.', item: 'T1 Short Sleeve' },
  { id: 3, user: 'ZeusGoat', rating: 5, text: 'Chất vải mát, logo in sắc nét. Will buy again 100%!', item: '2026 Official Uniform' }
]

const events = [
  { id: 1, title: 'MIDSUMMER SALE 2026', status: 'ONGOING', desc: 'Giảm giá lên đến 50% cho các sản phẩm mùa hè.', img: BGImage },
  { id: 2, title: 'WORLDS 2026 GIVEAWAY', status: 'UPCOMING', desc: 'Dự đoán kết quả, nhận ngay Official Uniform.', img: 'https://i.pinimg.com/736x/f6/14/00/f61400d720bc2c4dbd8eb4bbf949cc8b.jpg' }
]

const faqs = [
  { id: 1, question: 'Thời gian giao hàng mất bao lâu?', answer: 'Đối với khu vực nội thành, thời gian giao hàng từ 1-2 ngày. Đối với các tỉnh thành khác, thời gian dự kiến từ 3-5 ngày làm việc.' },
  { id: 2, question: 'Tôi có thể đổi trả hàng không?', answer: 'Có. Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng, với điều kiện tem mác còn nguyên và chưa qua sử dụng.' },
  { id: 3, question: 'Làm sao để theo dõi đơn hàng của tôi?', answer: 'Bạn có thể đăng nhập vào tài khoản, vào mục \'Order History\' để theo dõi trạng thái vận chuyển của đơn hàng.' }
]

function Community() {
  const [openNav, setOpenNav] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  // Logic: Lấy tab từ URL, nếu không có mặc định là NOTICE
  const tabFromUrl = searchParams.get('tab')?.toUpperCase() || 'NOTICE'
  const [activeTab, setActiveTab] = useState(tabFromUrl)

  // Logic: Accordion cho FAQ
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)

  // Đồng bộ activeTab khi URL thay đổi (Bấm từ Navbar)
  useEffect(() => {
    setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  // Hàm xử lý chuyển tab thủ công trên trang
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName)
    setSearchParams({ tab: tabName }) // Cập nhật URL
  }

  const tabs = ['NOTICE', 'REVIEW', 'EVENT', 'FAQ']

  return (
    <div className='bg-t1-dark min-h-screen text-t1-text font-t1-body selection:bg-t1-red selection:text-white'>
      <Banner />
      <Navbar setOpenNav={setOpenNav} />
      {/* Sửa lỗi children rỗng cho NavModal */}
      <NavModal open={openNav} onClose={() => setOpenNav(false)}>{null}</NavModal>

      <div className='py-20 px-4 md:px-10 lg:px-16 max-w-7xl mx-auto'>
        {/* Title */}
        <h1 className='font-oswald font-black text-5xl mt-10 mb-10 text-center tracking-widest text-t1-text italic uppercase'>
          <Link to='/community?tab=NOTICE' className='hover:text-t1-red transition-colors'>
            COMMUNITY
          </Link>
        </h1>

        {/* Tab Navigation */}
        <div className='flex justify-center space-x-6 md:space-x-12 mb-12 border-b border-t1-gray/30'>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-4 font-oswald text-xl md:text-2xl tracking-widest font-bold transition-all duration-300 relative
                ${activeTab === tab ? 'text-t1-red' : 'text-gray-500 hover:text-white'}`}
            >
              {tab}
              {activeTab === tab && (
                <span className='absolute bottom-0 left-0 w-full h-[3px] bg-t1-red shadow-[0_0_10px_rgba(226,1,45,0.8)]'></span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className='min-h-[50vh]'>

          {/* NOTICE TAB */}
          {activeTab === 'NOTICE' && (
            <div className='bg-[#1b1b1b] border border-t1-gray shadow-2xl p-6 animate-fade-in'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b-2 border-t1-red text-t1-red font-oswald text-lg tracking-wider uppercase'>
                    <th className='py-4 px-4 w-24 hidden md:table-cell'>NO.</th>
                    <th className='py-4 px-4'>TITLE</th>
                    <th className='py-4 px-4 w-32 hidden md:table-cell text-center'>AUTHOR</th>
                    <th className='py-4 px-4 w-32 text-right'>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice, index) => (
                    <tr key={notice.id} className='border-b border-t1-gray/20 hover:bg-black/40 transition-colors duration-200 cursor-pointer group'>
                      <td className='py-4 px-4 text-t1-gray hidden md:table-cell'>{notices.length - index}</td>
                      <td className='py-4 px-4 font-bold group-hover:text-t1-red transition-colors'>{notice.title}</td>
                      <td className='py-4 px-4 text-sm text-gray-400 hidden md:table-cell text-center'>{notice.author}</td>
                      <td className='py-4 px-4 text-sm text-gray-400 text-right'>{notice.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REVIEW TAB */}
          {activeTab === 'REVIEW' && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in'>
              {reviews.map((review) => (
                <div key={review.id} className='bg-[#1b1b1b] p-8 border border-t1-gray shadow-xl relative group hover:border-t1-red transition-all duration-300'>
                  <div className='absolute top-0 right-0 bg-t1-red text-white text-[10px] font-oswald px-3 py-1 tracking-widest'>VERIFIED</div>
                  <div className='flex items-center space-x-1 mb-4 text-t1-red text-xl'>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className='text-gray-300 font-light italic mb-6 leading-relaxed'>'{review.text}'</p>
                  <div className='border-t border-t1-gray/50 pt-4'>
                    <p className='font-oswald font-bold tracking-wider text-white uppercase'>{review.user}</p>
                    <p className='text-[10px] text-t1-red uppercase tracking-widest mt-1'>Product: {review.item}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EVENT TAB */}
          {activeTab === 'EVENT' && (
            <div className='flex flex-col space-y-10 animate-fade-in'>
              {events.map((event) => (
                <div key={event.id} className='relative w-full h-[45vh] overflow-hidden bg-black group border border-t1-gray shadow-2xl'>
                  <img className='absolute w-full h-full object-cover opacity-50 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000' src={event.img} alt={event.title} />
                  <div className='absolute inset-0 flex flex-col items-center justify-center text-center p-6'>
                    <span className={`px-4 py-1 font-oswald text-xs tracking-widest mb-4 border ${event.status === 'ONGOING' ? 'border-t1-red text-t1-red shadow-[0_0_15px_rgba(226,1,45,0.4)]' : 'border-white text-white'}`}>
                      {event.status}
                    </span>
                    <h2 className='font-oswald text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 uppercase italic'>{event.title}</h2>
                    <p className='text-lg font-light text-gray-200 max-w-xl'>{event.desc}</p>
                    <button className='mt-8 bg-transparent border border-white text-white font-oswald font-bold px-10 py-3 tracking-widest hover:bg-t1-red hover:border-t1-red transition-all duration-300'>VIEW DETAIL</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ TAB */}
          {activeTab === 'FAQ' && (
            <div className='max-w-3xl mx-auto space-y-4 animate-fade-in'>
              {faqs.map((faq) => (
                <div key={faq.id} className='border border-t1-gray bg-[#1b1b1b] shadow-lg'>
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className='w-full text-left px-6 py-6 flex justify-between items-center group transition-all duration-300'
                  >
                    <span className={`font-oswald text-lg tracking-wider uppercase ${openFaqId === faq.id ? 'text-t1-red' : 'text-white group-hover:text-t1-red'}`}>
                      <span className='mr-4 opacity-50'>Q.</span>{faq.question}
                    </span>
                    <span className='text-t1-red text-2xl font-light'>{openFaqId === faq.id ? '−' : '+'}</span>
                  </button>
                  {openFaqId === faq.id && (
                    <div className='px-6 pb-6 pt-2 text-gray-400 font-light border-t border-t1-gray/20 leading-relaxed italic animate-fade-in'>
                      <span className='font-bold text-t1-red mr-2 not-italic font-oswald'>ANSWER:</span> {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Community