import { useLanguage } from '~/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className='flex items-center bg-white/5 rounded-full p-0.5 border border-white/10'>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-full text-[10px] font-oswald font-bold transition-all duration-300 ${
          language === 'en' ? 'bg-t1-red text-white shadow-lg' : 'text-gray-500 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('vi')}
        className={`px-2 py-1 rounded-full text-[10px] font-oswald font-bold transition-all duration-300 ${
          language === 'vi' ? 'bg-t1-red text-white shadow-lg' : 'text-gray-500 hover:text-white'
        }`}
      >
        VI
      </button>
    </div>
  )
}
