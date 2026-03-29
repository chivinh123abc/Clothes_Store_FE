import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '~/components/Navbar/Navbar';

const tabs = ['NOTICE', 'REVIEW', 'EVENT', 'FAQ'];

const Community = () => {
  const { tabName } = useParams();
  const navigate = useNavigate();

  const currentTab = tabName ? tabName.toUpperCase() : 'NOTICE';
  const activeTab = tabs.includes(currentTab) ? currentTab : 'NOTICE';

  const handleTabClick = (tab: string) => {
    navigate(`/community/${tab.toLowerCase()}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'NOTICE': return <NoticeContent />;
      case 'REVIEW': return <ReviewContent />;
      case 'EVENT': return <EventContent />;
      case 'FAQ': return <FaqContent />;
      default: return <NoticeContent />;
    }
  };

  return (
    // Đổi màu nền thành xám than tối (#111111) để không bị chìm Navbar
    <div className="min-h-screen bg-[#111111] text-neutral-200 font-sans pb-20">
      
      {/* Navbar lơ lửng ở trên cùng */}
      <Navbar />

      {/* Dùng pt-32 (padding-top cực lớn) để đẩy nội dung xuống dưới mốc của Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        
        {/* Title (Breadcrumb đã bị xóa) */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-wider text-white">
            COMMUNITY <span className="text-red-600">.</span>
          </h1>
          <p className="text-sm text-neutral-500 uppercase tracking-widest">Connect with our legacy</p>
        </div>

        {/* Custom Tabs Navigation */}
        <div className="flex justify-center items-center gap-8 mb-16 border-b border-neutral-800 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`text-sm font-bold tracking-widest pb-4 relative transition-all duration-300 ${
                activeTab === tab ? 'text-red-600' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></span>
              )}
            </button>
          ))}
        </div>

        {/* Vùng hiển thị nội dung động */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
};

export default Community;

// ==========================================
// CÁC COMPONENT NỘI DUNG GIỮ NGUYÊN
// ==========================================

const NoticeContent = () => {
  const notices = [
    { id: 1, type: 'IMPORTANT', title: 'Cập nhật chính sách vận chuyển quốc tế 2026', date: '2026-03-25' },
    { id: 2, type: 'INFO', title: 'Thông báo nghỉ lễ Giỗ Tổ Hùng Vương', date: '2026-03-20' },
    { id: 3, type: 'RESTOCK', title: 'Hàng về: 2024 WORLD COLLECTION đã có sẵn', date: '2026-03-15' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="border-t-2 border-red-600">
        {notices.map((notice) => (
          <div key={notice.id} className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-neutral-800 hover:bg-neutral-900 transition-colors px-4 cursor-pointer group">
            <div className="flex items-center gap-4">
              <span className={`text-xs font-bold px-2 py-1 ${notice.type === 'IMPORTANT' ? 'bg-red-600 text-white' : 'border border-neutral-600 text-neutral-400'}`}>
                {notice.type}
              </span>
              <h3 className="text-lg font-medium group-hover:text-red-500 transition-colors">{notice.title}</h3>
            </div>
            <span className="text-sm text-neutral-500 mt-2 md:mt-0">{notice.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewContent = () => {
  const reviews = [
    { id: 1, user: 'Hoang Phi', item: 'Zootopia Varsity Jacket', rating: 5, content: 'Chất vải cực kì xịn, form áo đứng dáng. Rất đáng tiền!' },
    { id: 2, user: 'Quan GENG', item: 'T1 Legacy T-Shirt', rating: 5, content: 'Giao hàng nhanh, áo bọc cẩn thận. Mặc rất mát.' },
    { id: 3, user: 'Faker Fan', item: 'World 2024 Cap', rating: 4, content: 'Mũ đẹp nhưng form hơi to so với đầu mình một chút.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-sm hover:border-red-600 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-bold text-white">{review.user}</p>
              <p className="text-xs text-neutral-500">{review.item}</p>
            </div>
            <div className="text-red-500 text-sm">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
          </div>
          <p className="text-sm text-neutral-300 italic">"{review.content}"</p>
        </div>
      ))}
    </div>
  );
};

const EventContent = () => {
  const events = [
    { id: 1, title: 'MID-SEASON INVITATIONAL SALE', status: 'ONGOING', date: 'Mar 25 - Apr 10, 2026', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop' },
    { id: 2, title: 'ZOOTOPIA COLLAB LAUNCH', status: 'ENDED', date: 'Feb 14 - Feb 28, 2026', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {events.map((event) => (
        <div key={event.id} className="group cursor-pointer relative overflow-hidden bg-neutral-900">
          <div className="aspect-video overflow-hidden">
            <img 
              src={event.img} 
              alt={event.title} 
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${event.status === 'ENDED' ? 'grayscale opacity-50' : 'opacity-80'}`} 
            />
          </div>
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-bold px-3 py-1 ${event.status === 'ONGOING' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
              {event.status}
            </span>
          </div>
          <div className="p-6 border-t border-neutral-800">
            <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{event.title}</h3>
            <p className="text-sm text-neutral-500 mt-2">{event.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const FaqContent = () => {
  const faqs = [
    { q: 'Làm thế nào để kiểm tra tình trạng đơn hàng?', a: 'Bạn có thể đăng nhập vào tài khoản, chọn mục "Order History" để xem chi tiết lộ trình vận chuyển.' },
    { q: 'Chính sách đổi trả trong bao nhiêu ngày?', a: 'Chúng tôi hỗ trợ đổi trả miễn phí trong vòng 7 ngày kể từ khi nhận hàng đối với sản phẩm lỗi từ nhà sản xuất.' },
    { q: 'Shop có vận chuyển quốc tế không?', a: 'Hiện tại chúng tôi hỗ trợ vận chuyển toàn cầu (GLOBAL / USD). Chi phí vận chuyển sẽ được tính tại bước thanh toán.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-neutral-900 p-6 border-l-4 border-transparent hover:border-red-600 transition-colors">
          <h3 className="text-lg font-bold text-white flex items-start gap-3">
            <span className="text-red-600">Q.</span> {faq.q}
          </h3>
          <div className="mt-3 text-neutral-400 flex items-start gap-3 pl-1">
            <span className="font-bold text-neutral-600">A.</span>
            <p className="text-sm leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
};