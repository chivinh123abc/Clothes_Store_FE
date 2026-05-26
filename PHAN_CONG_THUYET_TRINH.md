# KẾ HOẠCH PHÂN CÔNG VÀ KỊCH BẢN THUYẾT TRÌNH BÁO CÁO DỰ ÁN
## ĐỀ TÀI: CLOTHES STORE - FRONTEND (rinstore-web)
*(Mẫu phân công tối ưu cho nhóm 4 thành viên – Đảm bảo chia đều khối lượng công việc, tính kỹ thuật và tính trình diễn)*

Tài liệu này được biên soạn nhằm phân chia nội dung thuyết trình báo cáo môn học/đồ án một cách khoa học. Mỗi thành viên sẽ phụ trách một mảng chức năng độc lập, có mối liên kết chặt chẽ và trực tiếp demo các tệp mã nguồn tương ứng để đạt điểm số tối đa.

---

## TÓM TẮT KHUNG THỜI GIAN THUYẾT TRÌNH (Tổng: 20 - 25 phút)

| Thứ tự | Thành viên phụ trách | Chủ đề thuyết trình chính | Thời lượng dự kiến | Slide liên quan |
| :---: | :--- | :--- | :---: | :---: |
| **1** | **Thành viên A**<br>*(Trưởng nhóm / Tổng quan)* | Giới thiệu dự án, Công nghệ cốt lõi & Luồng đăng ký/đăng nhập | 5 - 6 phút | Slide 1 - 5 |
| **2** | **Thành viên B**<br>*(Kỹ thuật AI / UX)* | Tính năng đột phá: Thử đồ ảo AI (Virtual Try-On) & HuggingFace | 6 - 7 phút | Slide 6 - 10 |
| **3** | **Thành viên C**<br>*(Giao dịch / Thanh toán)* | Giỏ hàng, Luồng thanh toán Checkout & Cổng thanh toán MoMo | 5 - 6 phút | Slide 11 - 15 |
| **4** | **Thành viên D**<br>*(Real-time / Admin)* | Thông báo thời gian thực Socket.io & Hệ thống quản trị Admin | 5 - 6 phút | Slide 16 - 20 |

---

## PHẦN CHI TIẾT KỊCH BẢN CHO TỪNG THÀNH VIÊN

### 👤 THÀNH VIÊN A: TỔNG QUAN HỆ THỐNG, CẤU TRÚC VÀ XÁC THỰC TÀI KHOẢN
> *Vai trò: Đặt vấn đề, giới thiệu kiến trúc nền tảng và dẫn dắt luồng đi từ bước đăng ký tài khoản của khách hàng.*

#### 1. Nội dung thuyết trình:
*   **Đặt vấn đề & Mục tiêu:** Sự phát triển của thương mại điện tử thời trang và nhu cầu tương tác thực tế của người dùng. Giới thiệu tổng quan về sản phẩm **Clothes Store**.
*   **Kiến trúc Stack Công nghệ:**
    *   Lý do chọn **React 19 (TypeScript)** kết hợp **Vite** để tối ưu hóa hiệu năng build và re-render.
    *   Ứng dụng **Tailwind CSS v4** và **Framer Motion** để tạo giao diện hiện đại, tối giản nhưng lôi cuốn (Rich Aesthetics).
*   **Bản đồ cấu trúc thư mục:** Giới thiệu ngắn gọn cách phân chia dự án thành các tầng: `apis/` (kết nối), `contexts/` (quản lý trạng thái), và `pages/` (giao diện).
*   **Luồng Xác thực & Bảo mật người dùng:**
    *   *Đăng ký & Kích hoạt OTP:* Gửi dữ liệu đăng ký qua API, điều hướng sang trang xác thực mã OTP gửi về Email để kích hoạt tài khoản (`/verify-account`).
    *   *Đăng nhập bảo mật:* Nhận JWT token từ Backend, lưu trữ an toàn trong `localStorage` dưới khóa `access_token`.
    *   *Interceptors tự động:* Cách cấu hình `axiosClient.ts` để tự động chèn JWT token vào header `Authorization: Bearer <token>` của tất cả các API gửi lên máy chủ.
*   **Khám phá cửa hàng:** Demo nhanh giao diện Trang chủ, Trang danh mục (`/shop`), Tìm kiếm (`/search`) và Bộ lọc sản phẩm.

#### 2. Tệp tin mã nguồn cần mở để giải thích/demo:
*   `package.json` (Giải thích các dependencies chính).
*   [AppRoutes.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/routes/AppRoutes.tsx) (Giải thích định tuyến tổng quan).
*   [axiosClient.ts](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/apis/axiosClient.ts) (Giải thích Request Interceptor đính kèm token).
*   [userApi.ts](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/apis/userApi.ts) (Giải thích các API Login/Register/GetProfile).

---

### 👤 THÀNH VIÊN B: TÍNH NĂNG ĐỘT PHÁ - THỬ ĐỒ ẢO AI (VIRTUAL TRY-ON)
> *Vai trò: Thuyết trình phần đặc sắc nhất của dự án, chứng minh năng lực tích hợp công nghệ AI mới vào ứng dụng Web.*

#### 1. Nội dung thuyết trình:
*   **Giới thiệu giải pháp Virtual Try-On:** Giải quyết bài toán lớn nhất của mua sắm quần áo online: "Liệu bộ quần áo này mặc lên người trông sẽ thế nào?".
*   **Quy trình Stepper 3 bước tại giao diện (`TryOnPage.tsx`):**
    *   *Bước 1 (Chọn Model):* Chọn avatar chuẩn hóa của hệ thống hoặc tự tải ảnh chân dung cá nhân lên (hỗ trợ kéo thả).
    *   *Bước 2 (Lọc & Chọn Outfit):* Giải thích cơ chế lọc an toàn **`isClothing`** ngầm tại Client. Hệ thống chỉ cho chọn áo thun, sơ mi, hoodie, áo len... và loại bỏ toàn bộ quần, váy liền, giày, mũ để tránh làm crash/lỗi mô hình AI đầu cuối.
    *   *Bước 3 (Gửi AI & Nhận ảnh):* Hiển thị trạng thái xử lý lấp lánh và đếm giây thực tế. Trích xuất URL ảnh kết quả trả về để hiển thị, cho phép người dùng Tải ảnh (.png), Thêm vào giỏ hàng hoặc xem sản phẩm.
*   **Chi tiết Kiến trúc Kỹ thuật (`tryOnApi.ts`):**
    *   Cơ chế chuyển đổi ảnh URL hoặc ảnh Base64 của người dùng thành đối tượng nhị phân **Blob** (`base64ToBlob` và `urlToBlob`).
    *   Giải thuật tự động sinh Prompt tối ưu dựa vào tên và danh mục trang phục (Tops, Bottoms, Dresses).
    *   Cách sử dụng thư viện **`@gradio/client`** để mở cổng kết nối thời gian thực qua giao thức SSE (Server-Sent Events) tới mô hình **IDM-VTON** chạy trên Hugging Face Space.
    *   **Giải pháp Vượt rào giới hạn (Bypass Quota Limit):** Cách cho phép người dùng tự dán Hugging Face Access Token cá nhân và lưu trữ trong trình duyệt để được ưu tiên xử lý nhanh và không bị giới hạn IP miễn phí (ZeroGPU).

#### 2. Tệp tin mã nguồn cần mở để giải thích/demo:
*   [tryOnApi.ts](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/apis/tryOnApi.ts) (Giải thích hàm `runTryOn`, xử lý Blob, phân loại prompt và gọi `client.predict`).
*   [TryOnPage.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/pages/TryOn/TryOnPage.tsx) (Giải thích hàm lọc sản phẩm `isClothing` và cấu trúc giao diện Stepper 3 bước).

---

### 👤 THÀNH VIÊN C: QUẢN LÝ GIỎ HÀNG, CHECKOUT & TÍCH HỢP THANH TOÁN MOMO
> *Vai trò: Thuyết trình luồng nghiệp vụ kinh doanh cốt lõi của website thương mại điện tử, xử lý tính toán tiền tệ và thanh toán an toàn.*

#### 1. Nội dung thuyết trình:
*   **Quản lý trạng thái Giỏ hàng (`CartContext.tsx`):**
    *   Cách thức tổ chức State lưu trữ các mặt hàng, tính toán tổng tiền, số lượng.
    *   Cơ chế đồng bộ hóa tự động trạng thái giỏ hàng với trình duyệt thông qua `localStorage` để chống mất dữ liệu khi người dùng tắt trình duyệt.
*   **Luồng Checkout & Đặt hàng (`Checkout.tsx`):**
    *   Biểu mẫu điền thông tin khách hàng, số điện thoại, địa chỉ nhận hàng.
    *   Luồng áp dụng mã giảm giá (Discount) được tính toán động tại Client.
*   **Phương thức thanh toán COD:** Đơn giản, tạo đơn hàng thành công, hiển thị popup chúc mừng.
*   **Luồng Tích hợp Thanh toán Ví MoMo (`MoMoReturn.tsx`):**
    *   Giải thích quy trình kết nối cổng thanh toán: FE gửi thông tin đơn -> BE tạo giao dịch với API MoMo và trả về liên kết thanh toán (`payUrl`).
    *   FE chuyển hướng trình duyệt của người dùng sang cổng MoMo để thực hiện quét mã QR / đăng nhập thanh toán.
    *   **Xử lý kết quả trả về (Redirect Return URL):** Sau khi thanh toán xong trên MoMo, hệ thống tự động redirect về đường dẫn `/checkout/momo-return` kèm theo chuỗi truy vấn bảo mật (`orderId`, `partnerCode`, `signature`, `resultCode`...).
    *   Cách FE thu thập các tham số URL này, gửi request xác thực lên Backend để đồng bộ trạng thái đơn hàng thành "Paid" (Đã thanh toán) trong Cơ sở dữ liệu và hiển thị kết quả thành công cho người dùng.

#### 2. Tệp tin mã nguồn cần mở để giải thích/demo:
*   [CartContext.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/contexts/CartContext.tsx) (Giải thích state giỏ hàng và đồng bộ `localStorage`).
*   [Checkout.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/pages/Checkout/Checkout.tsx) (Giải thích giao diện chọn phương thức thanh toán).
*   [MoMoReturn.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/pages/Checkout/MoMoReturn.tsx) (Giải thích cơ chế thu thập chữ ký số từ URL để xác thực thanh toán).

---

### 👤 THÀNH VIÊN D: ĐỒNG BỘ THÔNG BÁO THỜI GIAN THỰC KÉP & PHÂN HỆ QUẢN TRỊ (ADMIN)
> *Vai trò: Thuyết trình phần hạ tầng mạng thời gian thực, cơ chế đồng bộ hóa dữ liệu giữa các tab, và toàn bộ luồng quản trị viên.*

#### 1. Nội dung thuyết trình:
*   **Cơ chế bảo mật tuyến đường Quản trị (`AppRoutes.tsx`):**
    *   Giải thích cấu trúc `AdminProtected` component. Chỉ cho phép tài khoản có `role === 1` truy cập các trang `/admin/*`. Quyền khách hàng hoặc khách chưa đăng nhập sẽ bị tự động chặn và đẩy về trang chủ.
*   **Phân hệ Quản trị viên (Admin Workspace - `/admin/*`):**
    *   *Dashboard:* Các biểu đồ, dữ liệu thống kê trực quan về doanh thu, số lượng đơn hàng, người dùng.
    *   *Quản lý danh mục & sản phẩm:* Nơi Admin cập nhật hàng hóa cho cửa hàng.
    *   *Quản lý đơn hàng:* Admin xem danh sách đơn hàng toàn hệ thống, cập nhật trạng thái đơn (Shipping, Completed, Cancelled, Paid).
    *   *Ứng dụng Design Pattern - Factory Method cho Theme Switching:* 
        *   Trình bày mẫu thiết kế Factory Method dùng để đổi trạng thái giao diện Dark/Light Mode chuyên nghiệp trong phân hệ Admin.
        *   Giải thích vai trò các thành phần: `ThemeProduct` (Product Interface), các concrete products (`LightThemeProduct`, `DarkThemeProduct`), `ThemeCreator` (Abstract Creator), các concrete creators, và `ThemeFactorySelector` (Helper).
        *   Cách tích hợp `AdminThemeContext.tsx` và gọi Factory để cập nhật động các lớp CSS cho Sidebar, Header, Background và các thẻ Card trên Dashboard.
*   **Hệ thống Thông báo Thời gian thực Kép (`NotificationContext.tsx`):**
    *   **Kênh 1 - Socket.io:** Thiết lập kết nối WebSockets thời gian thực.
        *   Cơ chế phân phòng (`Room`): Khách hàng join phòng `user_<userId>`, Admin join phòng `admin`.
        *   Khi khách hàng đặt hàng, Admin nhận sự kiện `new_order` hiển thị thông báo đẩy ngay lập tức.
        *   Khi Admin đổi trạng thái đơn hàng, Khách hàng tương ứng nhận sự kiện `order_status_updated` hiển thị trạng thái đang giao/hoàn thành tức thời.
    *   **Kênh 2 - DB Polling Fallback (Cơ chế Dự phòng):** Dự phòng trường hợp mất kết nối Socket. Khởi tạo bộ đếm ngầm chạy mỗi **7 giây** để gọi API truy vấn database. Lưu lịch sử đơn hàng vào `localStorage` (`t1_notified_orders_admin`) để so sánh trạng thái, đảm bảo không bị thông báo lặp lại.
    *   **Cross-Tab Sync:** Cách sử dụng sự kiện `storage` để khi người dùng đọc/xóa thông báo ở tab này thì các tab khác tự động cập nhật theo.

#### 2. Tệp tin mã nguồn cần mở để giải thích/demo:
*   [ThemeFactory.ts](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/patterns/ThemeFactory.ts) (Giải thích chi tiết 5 thành phần của mẫu thiết kế Factory Method).
*   [AdminThemeContext.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/contexts/AdminThemeContext.tsx) (Giải thích Context quản lý trạng thái giao diện toàn cục).
*   [AdminLayout.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/components/layout/AdminLayout.tsx) (Demo nút chuyển đổi Sun/Moon và cách thay đổi CSS động).
*   [AdminDashboard.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/pages/Admin/AdminDashboard.tsx) (Demo các Widget Dashboard đổi màu nền và màu chữ theo ThemeProduct thực tế).
*   [NotificationContext.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/contexts/NotificationContext.tsx) (Giải thích kết nối Socket.io và cơ chế DB Polling Fallback).
*   [AppRoutes.tsx](file:///d:/0%20Mon%20hoc/LapTrinhUngDung/Clothes_Store_FE/src/routes/AppRoutes.tsx) (Giải thích component `AdminProtected` bọc `AdminThemeProvider`).

---

## 🛠️ CHECKLIST CHUẨN BỊ TRƯỚC BUỔI THUYẾT TRÌNH (Dành cho cả nhóm)

*   [ ] **Chuẩn bị file cấu hình `.env`:** Đảm bảo `VITE_API_URL` cấu hình chuẩn xác dẫn đến Backend đang chạy thực tế.
*   [ ] **Chuẩn bị sẵn 1 Token Hugging Face:** Lưu sẵn vào trình duyệt ở máy thuyết trình hoặc cấu hình biến `VITE_HF_TOKEN` để phần demo AI Try-On diễn ra siêu tốc, không bị lỗi nghẽn Quota trước mặt Hội đồng chấm thi.
*   [ ] **Tạo sẵn dữ liệu mẫu (Seeding Data):** 
    *   Tạo sẵn 1 tài khoản Admin (`role = 1`) và 1 tài khoản khách hàng thường để chuyển đổi nhanh giữa hai trình duyệt (hoặc dùng chế độ ẩn danh) để demo tính năng thông báo đẩy thời gian thực tức thì.
    *   Chuẩn bị sẵn 1 đơn hàng ở trạng thái Chờ xử lý để demo luồng cập nhật trạng thái đơn hàng phía Admin.
*   [ ] **Chạy thử toàn bộ luồng (Dry Run):** Cả nhóm chạy thử kịch bản thuyết trình ít nhất 2 lần để đảm bảo khớp thời gian và chuyển tiếp phần trình bày giữa các thành viên mượt mà, chuyên nghiệp.

> [!TIP]
> **Mẹo đạt điểm tối đa từ Hội đồng chấm thi:**
> Khi Thành viên B demo tính năng AI Try-On, hãy thực hiện chụp trực tiếp một tấm ảnh chân dung của một thành viên trong nhóm đang ngồi thuyết trình bằng điện thoại, gửi sang máy tính demo để tải lên hệ thống. Việc này sẽ thuyết phục Hội đồng 100% rằng hệ thống AI hoạt động thực tế theo thời gian thực (Real-time Dynamic AI) chứ không phải là ảnh dựng sẵn!
