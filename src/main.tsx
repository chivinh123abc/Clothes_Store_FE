import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '~/contexts/AuthContext'
import { CartProvider } from '~/contexts/CartContext'
import { FavoritesProvider } from '~/contexts/FavoritesContext'
import { LanguageProvider } from '~/contexts/LanguageContext'
import { CollectionProvider } from '~/contexts/CollectionContext'
import App from '~/pages/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <CollectionProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </FavoritesProvider>
          </AuthProvider>
        </CollectionProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
)