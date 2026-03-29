import React, { useState } from 'react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic gọi API login sẽ được thêm sau
    console.log('Login submitted:', { email, password });
  };

  return (
    // Overlay nền mờ
    <div 
      className="fixed inset-0 z-[200] flex justify-center items-center bg-black/50 transition-colors"
      onClick={onClose}
    >
      {/* Box nội dung Modal */}
      <div 
        className="bg-white w-[90%] max-w-md p-8 rounded-lg shadow-xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Chặn sự kiện click đóng modal khi bấm vào thẻ div cha
      >
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-xl leading-none transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-wide">Đăng nhập</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 uppercase text-gray-600">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-black transition-colors"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 uppercase text-gray-600">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-black transition-colors"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-black text-white py-3 rounded-md font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Đăng nhập
          </button>
        </form>
        
        <div className="mt-5 text-center text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <button type="button" className="text-black font-semibold underline hover:text-gray-700 transition">
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
