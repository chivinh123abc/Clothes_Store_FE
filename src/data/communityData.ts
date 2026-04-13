export const notices = [
  { id: 1, title: '[THÔNG BÁO] Ra mắt bộ sưu tập Mùa Hè 2026', date: '2026-04-10', author: 'Admin', pinned: true },
  { id: 2, title: '[BẢO TRÌ] Nâng cấp hệ thống thanh toán – 22/04/2026', date: '2026-04-08', author: 'System', pinned: false },
  { id: 3, title: '[SỰ KIỆN] Giảm 10% cho thành viên mới đăng ký', date: '2026-04-01', author: 'Admin', pinned: false },
  { id: 4, title: '[CHÍNH SÁCH] Cập nhật quy định đổi trả hàng', date: '2026-03-25', author: 'Admin', pinned: false },
  { id: 5, title: '[THÔNG BÁO] Mở thêm cửa hàng tại Hà Nội – 01/05/2026', date: '2026-03-20', author: 'Admin', pinned: false },
  { id: 6, title: '[BẢO TRÌ] Website tạm ngừng hoạt động ngày 15/03 từ 00:00-06:00', date: '2026-03-12', author: 'System', pinned: false }
]

export const reviews = [
  { id: 1, user: 'Minh_Streetwear', rating: 5, text: 'Áo hoodie quá xịn, chất vải dày dặn, form đẹp. Giao hàng cực nhanh, chỉ 1 ngày là có rồi. Sẽ tiếp tục ủng hộ shop!', item: 'Modern Urban Hoodie Vol.1', date: '2026-04-11' },
  { id: 2, user: 'ThuViOfficial', rating: 4, text: 'Hàng đẹp như mô tả, đóng gói rất cẩn thận. Chỉ có điều size hơi rộng so với bảng size, nên chọn size nhỏ hơn 1 cấp.', item: '2026 Official Jacket', date: '2026-04-09' },
  { id: 3, user: 'HoangDepTrai99', rating: 5, text: 'Chất vải mát, logo in sắc nét không bị bong tróc sau nhiều lần giặt. Giá cả hợp lý. Sẽ mua thêm cho cả nhà!', item: 'Premium Leather Jacket', date: '2026-04-07' },
  { id: 4, user: 'LinhBUI_HN', rating: 5, text: 'Mua làm quà sinh nhật cho bạn trai, bạn ấy rất thích! Shop tư vấn nhiệt tình, gói quà đẹp. Highly recommended!', item: 'Minimal Gray Sweater', date: '2026-04-05' },
  { id: 5, user: 'SonDep_TPHCM', rating: 3, text: 'Sản phẩm ổn, nhưng giao hàng hơi chậm hơn dự kiến 1 ngày. Chất lượng thì không có gì phàn nàn, vẫn sẽ quay lại.', item: 'Champion Signature Pants Vol.5', date: '2026-04-02' },
  { id: 6, user: 'AnhQuan.Outfit', rating: 5, text: 'Đây là lần thứ 4 mình mua ở đây rồi. Chất lượng luôn ổn định, không bao giờ thất vọng. Shop rất đáng tin!', item: 'Essential Black Hoodie', date: '2026-03-30' }
]

export const events = [
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

export const qaItems = [
  { id: 1, category: 'DELIVERY', question: 'Thời gian giao hàng mất bao lâu?', answer: 'Đối với khu vực nội thành TP.HCM và Hà Nội, thời gian giao hàng từ 1-2 ngày. Đối với các tỉnh thành khác, thời gian dự kiến từ 3-5 ngày làm việc.', status: 'ANSWERED', user: 'Admin', date: '2026-04-12', isSecret: false },
  { id: 2, category: 'PRODUCT', question: 'Làm sao để biết size áo nào phù hợp với mình?', answer: 'Bạn có thể tham khảo bảng size chi tiết ở cuối mỗi trang sản phẩm. Nếu vẫn còn phân vân, đừng ngần ngại chat với chúng tôi qua nút hỗ trợ hoặc Fanpage để được tư vấn chính xác nhất.', status: 'ANSWERED', user: 'Admin', date: '2026-04-11', isSecret: false },
  { id: 3, category: 'PAYMENT', question: 'Hệ thống bảo trì thanh toán bao lâu?', answer: 'Dự kiến diễn ra trong 2 giờ từ 00:00 - 02:00 ngày 22/04. Mọi giao dịch sẽ hoạt động bình thường trở lại ngay sau đó.', status: 'ANSWERED', user: 'System', date: '2026-04-08', isSecret: false },
  { id: 4, category: 'ORDER', question: 'Đơn hàng #CL1025 của tôi đang ở đâu?', answer: null, status: 'PENDING', user: 'minh***', date: '2026-04-13', isSecret: true },
  { id: 5, category: 'PRODUCT', question: 'Vải cotton của shop có bị xù lông không?', answer: 'Chất liệu vải của chúng tôi đã qua xử lý chống xù lông. Tuy nhiên, để sản phẩm bền đẹp nhất, bạn nên giặt tay hoặc dùng túi giặt ở chế độ nhẹ nhàng.', status: 'ANSWERED', user: 'Admin', date: '2026-04-12', isSecret: false },
  { id: 6, category: 'DELIVERY', question: 'Shop có hỗ trợ giao hỏa tốc không?', answer: null, status: 'PENDING', user: 'hoan***', date: '2026-04-13', isSecret: false }
]
