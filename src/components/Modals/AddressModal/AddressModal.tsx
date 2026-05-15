import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, ChevronRight, Search, Map, Home, Check } from 'lucide-react'
import axios from 'axios'
import { useLanguage } from '~/contexts/LanguageContext'

interface Province {
  code: number
  name: string
}

interface District {
  code: number
  name: string
}

interface Ward {
  code: number
  name: string
}

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: string) => void
}

type Step = 'province' | 'district' | 'ward' | 'detail'

export default function AddressModal({ isOpen, onClose, onSave }: AddressModalProps) {
  const { t } = useLanguage()
  const [step, setStep] = useState<Step>('province')
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null)
  const [detailAddress, setDetailAddress] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchProvinces()
      // Optional: Parse initialAddress to pre-fill?
      // For simplicity, we start fresh unless it's complex
    }
  }, [isOpen])

  const fetchProvinces = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get('https://provinces.open-api.vn/api/p/')
      setProvinces(res.data)
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDistricts = async (provinceCode: number) => {
    setIsLoading(true)
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      setDistricts(res.data.districts)
      setStep('district')
      setSearchTerm('')
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWards = async (districtCode: number) => {
    setIsLoading(true)
    try {
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      setWards(res.data.wards)
      setStep('ward')
      setSearchTerm('')
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = () => {
    const fullAddress = `${detailAddress.trim()}${detailAddress ? ', ' : ''}${selectedWard?.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}`
    onSave(fullAddress)
    onClose()
  }

  const filteredItems = () => {
    const term = searchTerm.toLowerCase()
    if (step === 'province') return provinces.filter(p => p.name.toLowerCase().includes(term))
    if (step === 'district') return districts.filter(d => d.name.toLowerCase().includes(term))
    if (step === 'ward') return wards.filter(w => w.name.toLowerCase().includes(term))
    return []
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#111] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151515]">
            <div>
              <h2 className="text-xl font-oswald font-black uppercase tracking-tight flex items-center gap-2">
                <MapPin className="text-t1-red" size={20} />
                {t('profile.location') || 'Delivery Address'}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-[10px] font-oswald text-gray-500 uppercase tracking-widest">
                <span className={step === 'province' ? 'text-t1-red' : ''}>Tỉnh/TP</span>
                <ChevronRight size={10} />
                <span className={step === 'district' ? 'text-t1-red' : ''}>Quận/Huyện</span>
                <ChevronRight size={10} />
                <span className={step === 'ward' ? 'text-t1-red' : ''}>Phường/Xã</span>
                <ChevronRight size={10} />
                <span className={step === 'detail' ? 'text-t1-red' : ''}>Chi tiết</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Search Bar (except for detail step) */}
          {step !== 'detail' && (
            <div className="p-4 border-b border-white/5 bg-black/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input
                  type="text"
                  placeholder={
                    step === 'province' ? 'Tìm kiếm tỉnh/thành phố...' :
                      step === 'district' ? 'Tìm kiếm quận/huyện...' : 'Tìm kiếm phường/xã...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 py-3 pl-10 pr-4 text-sm outline-none focus:border-t1-red/30 transition-all font-inter"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-8 h-8 border-2 border-t1-red border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-oswald text-gray-500 uppercase tracking-widest">Loading data...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {step === 'province' && filteredItems().map((p: any) => (
                  <button
                    key={p.code}
                    onClick={() => { setSelectedProvince(p); fetchDistricts(p.code) }}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
                  >
                    <span className="text-sm font-inter group-hover:text-t1-red transition-colors">{p.name}</span>
                    <ChevronRight size={16} className="text-gray-700 group-hover:text-t1-red transition-colors" />
                  </button>
                ))}

                {step === 'district' && (
                  <>
                    <button
                      onClick={() => setStep('province')}
                      className="flex items-center gap-2 p-3 text-[10px] font-oswald text-t1-red uppercase tracking-widest hover:bg-t1-red/5 transition-all mb-2"
                    >
                      ← Quay lại chọn Tỉnh/TP
                    </button>
                    {filteredItems().map((d: any) => (
                      <button
                        key={d.code}
                        onClick={() => { setSelectedDistrict(d); fetchWards(d.code) }}
                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
                      >
                        <span className="text-sm font-inter group-hover:text-t1-red transition-colors">{d.name}</span>
                        <ChevronRight size={16} className="text-gray-700 group-hover:text-t1-red transition-colors" />
                      </button>
                    ))}
                  </>
                )}

                {step === 'ward' && (
                  <>
                    <button
                      onClick={() => setStep('district')}
                      className="flex items-center gap-2 p-3 text-[10px] font-oswald text-t1-red uppercase tracking-widest hover:bg-t1-red/5 transition-all mb-2"
                    >
                      ← Quay lại chọn Quận/Huyện
                    </button>
                    {filteredItems().map((w: any) => (
                      <button
                        key={w.code}
                        onClick={() => { setSelectedWard(w); setStep('detail') }}
                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group text-left"
                      >
                        <span className="text-sm font-inter group-hover:text-t1-red transition-colors">{w.name}</span>
                        <ChevronRight size={16} className="text-gray-700 group-hover:text-t1-red transition-colors" />
                      </button>
                    ))}
                  </>
                )}

                {step === 'detail' && (
                  <div className="p-6 space-y-6">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-lg">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-t1-red/10 rounded">
                          <Map size={16} className="text-t1-red" />
                        </div>
                        <div>
                          <p className="text-[10px] font-oswald text-gray-500 uppercase tracking-widest mb-1">Khu vực đã chọn</p>
                          <p className="text-sm font-bold text-white">
                            {selectedWard?.name}, {selectedDistrict?.name}, {selectedProvince?.name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setStep('ward')}
                        className="text-[10px] font-oswald text-t1-red uppercase tracking-widest hover:underline"
                      >
                        Thay đổi khu vực
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-oswald font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        Địa chỉ chi tiết (Số nhà, tên đường...) <span className="text-t1-red font-inter text-sm">*</span>
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-4 text-gray-600" size={16} />
                        <textarea
                          placeholder="Ví dụ: 123 Đường ABC..."
                          value={detailAddress}
                          onChange={(e) => setDetailAddress(e.target.value)}
                          className={`w-full bg-black border ${detailAddress.trim() === '' ? 'border-t1-red/30' : 'border-white/10'} p-4 pl-10 h-32 outline-none focus:border-t1-red/50 transition-all font-inter text-sm resize-none`}
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleFinish}
                      disabled={!detailAddress.trim()}
                      className="w-full bg-t1-red text-white py-4 font-oswald font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(226,1,45,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                    >
                      <Check size={18} />
                      Hoàn tất địa chỉ
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Preview */}
          <div className="p-4 bg-black border-t border-white/5">
            <div className="flex items-center gap-3 text-gray-500">
              <MapPin size={14} className={step === 'detail' ? 'text-t1-red' : ''} />
              <p className="text-[11px] truncate italic">
                {selectedProvince ? `${selectedProvince.name}${selectedDistrict ? `, ${selectedDistrict.name}` : ''}${selectedWard ? `, ${selectedWard.name}` : ''}` : 'Chưa chọn địa chỉ'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
