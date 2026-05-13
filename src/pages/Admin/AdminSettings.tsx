import React, { useState } from 'react'
import { Settings, Save, Globe, Lock, Bell, Palette, Database, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '../../contexts/ToastContext'

const AdminSettings: React.FC = () => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Clothes Official Store',
    siteEmail: 'support@clothes.gg',
    maintenanceMode: false,
    allowRegistration: true,
    currency: 'VND',
    lowStockThreshold: 5,
    orderPrefix: 'CLK-'
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    showToast('Settings saved successfully', 'success')
  }

  const sections = [
    { id: 'general', icon: <Globe size={18} />, label: 'General' },
    { id: 'security', icon: <Lock size={18} />, label: 'Security' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'appearance', icon: <Palette size={18} />, label: 'Appearance' },
    { id: 'advanced', icon: <Database size={18} />, label: 'Advanced' }
  ]

  const [activeSection, setActiveSection] = useState('general')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-oswald uppercase tracking-wider text-white flex items-center gap-3">
            <Settings className="text-t1-red" size={32} />
            System Settings
          </h1>
          <p className="text-gray-400 mt-1 font-oswald text-xs uppercase tracking-[0.2em]">Configure your store's core behavior</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-t1-red hover:bg-red-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-oswald font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-t1-red/20"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-oswald font-bold uppercase tracking-widest text-xs transition-all ${activeSection === section.id
                  ? 'bg-t1-red text-white shadow-lg shadow-t1-red/20'
                  : 'bg-white/[0.02] border border-white/5 text-gray-500 hover:text-white hover:bg-white/5'
                }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-sm"
          >
            {activeSection === 'general' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Store Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Support Email</label>
                    <input
                      type="email"
                      value={settings.siteEmail}
                      onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm appearance-none"
                    >
                      <option value="USD" className="bg-[#0f0f0f]">USD ($)</option>
                      <option value="EUR" className="bg-[#0f0f0f]">EUR (€)</option>
                      <option value="VND" className="bg-[#0f0f0f]">VND (₫)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Order Prefix</label>
                    <input
                      type="text"
                      value={settings.orderPrefix}
                      onChange={(e) => setSettings({ ...settings, orderPrefix: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-oswald uppercase tracking-[0.2em] text-gray-500 ml-1">Stock Threshold</label>
                    <input
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-t1-red/50 focus:outline-none transition-all font-oswald text-sm"
                    />
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                    <div>
                      <p className="font-oswald text-xs uppercase tracking-widest text-white">Maintenance Mode</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Disable store frontend for customers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-t1-red' : 'bg-gray-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                    <div>
                      <p className="font-oswald text-xs uppercase tracking-widest text-white">Public Registration</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Allow new customers to create accounts</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.allowRegistration ? 'bg-green-600' : 'bg-gray-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.allowRegistration ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeSection !== 'general' && (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-gray-600" size={32} />
                </div>
                <p className="font-oswald font-black text-2xl uppercase tracking-tighter text-gray-700">Module Locked</p>
                <p className="text-xs text-gray-600 font-oswald uppercase tracking-widest">Extended security required for this section</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
