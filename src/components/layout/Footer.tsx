import { Link } from 'react-router-dom'
import { Camera, Play, MessageSquare, Globe } from 'lucide-react'
import { useLanguage } from '~/contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
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
              <p>{t('footer.company')}: Clothes Store Vietnam Co., Ltd.</p>
              <p>{t('footer.ceo')}: Nguyen Van A</p>
              <p>{t('footer.address')}: 88 Dong Khoi, District 1, Ho Chi Minh City, Vietnam</p>
              <p>{t('footer.businessNo')}: 0123456789</p>
              <p>{t('footer.privacyOfficer')}: Tran Thi B</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-oswald text-white font-bold text-xs tracking-[0.3em] uppercase mb-8">{t('footer.contact')}</h4>
            <div className="space-y-4 text-[10px] text-gray-400 font-inter tracking-widest">
              <p>{t('footer.phone')}: <span className="text-white">+84 28 3823 6688</span></p>
              <p>{t('footer.email')}: <span className="text-white underline cursor-pointer">contact@clothesstore.vn</span></p>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-oswald text-white font-bold text-xs tracking-[0.3em] uppercase mb-8">{t('footer.support')}</h4>
            <div className="space-y-4 text-[10px] text-gray-400 font-inter tracking-widest leading-relaxed">
              <p>{t('nav.qa')}</p>
              <p>{t('footer.hours')}: AM 10:00 ~ PM 18:00</p>
              <p>{t('footer.hoursDesc')}</p>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-oswald text-white font-bold text-xs tracking-[0.3em] uppercase mb-8">{t('nav.community')}</h4>
            <div className="space-y-4 text-[10px] text-gray-400 font-inter tracking-widest">
              <Link to="/community?tab=notice" className="block hover:text-white transition-colors uppercase">{t('nav.notice')}</Link>
              <Link to="/community?tab=review" className="block hover:text-white transition-colors uppercase">{t('nav.review')}</Link>
              <Link to="/community?tab=qa" className="block hover:text-white transition-colors uppercase">{t('nav.qa')}</Link>
              <Link to="/community?tab=event" className="block hover:text-white transition-colors uppercase">{t('nav.event')}</Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-oswald text-white font-bold text-xs tracking-[0.3em] uppercase mb-8">{t('footer.social')}</h4>
            <div className="flex gap-4 mb-10">
              <a href="#" className="p-2 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"><Camera size={16} /></a>
              <a href="#" className="p-2 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"><Play size={16} /></a>
              <a href="#" className="p-2 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"><MessageSquare size={16} /></a>
              <a href="#" className="p-2 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"><Globe size={16} /></a>
            </div>
            <div className="space-y-4 text-[10px] font-bold text-white tracking-widest uppercase">
              <Link to="/terms" className="block hover:text-t1-red transition-colors italic">{t('footer.terms')}</Link>
              <Link to="/privacy" className="block hover:text-t1-red transition-colors italic">{t('footer.privacy')}</Link>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="border border-white/20 px-4 py-2 flex flex-col">
              <span className="text-white font-oswald font-black text-sm tracking-tighter uppercase whitespace-pre-line">{t('footer.noFakes')}</span>
            </div>
            <p className="text-[9px] text-gray-600 max-w-md leading-relaxed font-inter tracking-wider">
              {t('footer.disclaimer')}
            </p>
          </div>
          <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-white font-bold italic tracking-[0.2em] font-oswald">CLOTHES STORE x MARKVISION</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 text-center">
          <p className="text-[10px] text-gray-700 font-inter tracking-[0.4em] uppercase">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
