import { Link } from 'react-router-dom'
import { Camera, Play, MessageSquare, Globe } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-t1-dark pt-20 pb-10 border-t border-white/5">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-[1600px]">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand & Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-white font-black text-3xl italic tracking-tighter mb-8 block hover:text-t1-red transition-colors">
              CLOTHES STORE
            </Link>
            <div className="space-y-4 text-[10px] text-gray-500 font-inter uppercase tracking-widest leading-relaxed">
              <p>COMPANY: Clothes Store Vietnam Co., Ltd.</p>
              <p>CEO: Nguyen Van A</p>
              <p>ADDRESS: 88 Dong Khoi, District 1, Ho Chi Minh City, Vietnam</p>
              <p>BUSINESS NO: 0123456789</p>
              <p>PRIVACY POLICY RESPONSIBLE PERSON: Tran Thi B</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-oswald text-white font-bold text-xs tracking-[0.3em] uppercase mb-8">Contact</h4>
            <div className="space-y-4 text-[10px] text-gray-400 font-inter tracking-widest">
              <p>Phone: <span className="text-white">+84 28 3823 6688</span></p>
              <p>Email: <span className="text-white underline cursor-pointer">contact@clothesstore.vn</span></p>
            </div>
          </div>

          {/* Service Center */}
          <div>
            <h4 className="font-oswald text-white font-bold text-xs tracking-[0.3em] uppercase mb-8">Service Center</h4>
            <div className="space-y-4 text-[10px] text-gray-400 font-inter tracking-widest leading-relaxed">
              <p>Q&A</p>
              <p>Operating Hours: AM 10:00 ~ PM 18:00</p>
              <p>(Lunch: 12:00 ~ 13:00 Sat & Sun & public holiday off)</p>
            </div>
          </div>

          {/* Community & Legal */}
          <div>
            <h4 className="font-oswald text-white font-bold text-xs tracking-[0.3em] uppercase mb-8">Community</h4>
            <div className="space-y-4 text-[10px] text-gray-400 font-inter tracking-widest">
              <Link to="/community" className="block hover:text-white transition-colors">NOTICE</Link>
              <Link to="/community" className="block hover:text-white transition-colors">REVIEW</Link>
              <Link to="/community" className="block hover:text-white transition-colors">FAQ</Link>
              <Link to="/community" className="block hover:text-white transition-colors">EVENT</Link>
            </div>
          </div>

          {/* Social & Legal links */}
          <div>
            <h4 className="font-oswald text-white font-bold text-xs tracking-[0.3em] uppercase mb-8">Follow Us</h4>
            <div className="flex gap-4 mb-10">
              <a href="#" className="p-2 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"><Camera size={16} /></a>
              <a href="#" className="p-2 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"><Play size={16} /></a>
              <a href="#" className="p-2 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"><MessageSquare size={16} /></a>
              <a href="#" className="p-2 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"><Globe size={16} /></a>
            </div>
            <div className="space-y-4 text-[10px] font-bold text-white tracking-widest">
              <Link to="/terms" className="block hover:text-t1-red transition-colors italic">TERMS OF USE</Link>
              <Link to="/privacy" className="block hover:text-t1-red transition-colors italic">PRIVACY POLICY</Link>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="border border-white/20 px-4 py-2 flex flex-col">
              <span className="text-white font-oswald font-black text-sm tracking-tighter">NO MORE</span>
              <span className="text-white font-oswald font-black text-sm tracking-tighter -mt-1">FAKES</span>
            </div>
            <p className="text-[9px] text-gray-600 max-w-md leading-relaxed font-inter tracking-wider">
              Clothes Store reserves the right to take specific legal action against the unauthorized use of its official images or the sale of products infringing upon its intellectual property rights, including counterfeits. We partner with MarkVision for the protection of our intellectual property.
            </p>
          </div>
          <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-white font-bold italic tracking-[0.2em] font-oswald">CLOTHES STORE x MARKVISION</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 text-center">
          <p className="text-[10px] text-gray-700 font-inter tracking-[0.4em] uppercase">
            COPYRIGHT © 2026 CLOTHES STORE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
