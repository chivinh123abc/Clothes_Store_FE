if (typeof window !== 'undefined' && !('Buffer' in window)) {
  (window as any).Buffer = class Buffer {}
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '~/contexts/AuthContext'
import { NotificationProvider } from '~/contexts/NotificationContext'
import { CartProvider } from '~/contexts/CartContext'
import { FavoritesProvider } from '~/contexts/FavoritesContext'
import { LanguageProvider } from '~/contexts/LanguageContext'
import { CollectionProvider } from '~/contexts/CollectionContext'
import { ToastProvider } from '~/contexts/ToastContext'
import App from '~/pages/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <CollectionProvider>
          <AuthProvider>
            <NotificationProvider>
              <ToastProvider>
                <FavoritesProvider>
                  <CartProvider>
                    <App />
                  </CartProvider>
                </FavoritesProvider>
              </ToastProvider>
            </NotificationProvider>
          </AuthProvider>
        </CollectionProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
)