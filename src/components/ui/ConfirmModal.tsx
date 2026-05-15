import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onClose: () => void
  type?: 'danger' | 'warning' | 'info'
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Icon */}
            <div className={`p-6 flex flex-col items-center text-center space-y-4 ${
                type === 'danger' ? 'bg-rose-500/5' :
                  type === 'warning' ? 'bg-amber-500/5' :
                    'bg-blue-500/5'
              }`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  type === 'danger' ? 'bg-rose-500/20 text-rose-500' :
                    type === 'warning' ? 'bg-amber-500/20 text-amber-500' :
                      'bg-blue-500/20 text-blue-500'
                }`}>
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-oswald font-bold uppercase tracking-tight text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed px-4">
                  {message}
                </p>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="p-6 bg-white/[0.02] flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-oswald text-xs uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-oswald text-xs uppercase tracking-widest text-white transition-all shadow-lg ${
                    type === 'danger' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' :
                      type === 'warning' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' :
                        'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                  }`}
              >
                {confirmText}
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal
