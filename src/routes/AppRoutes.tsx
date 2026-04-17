import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Home from '../pages/Home/Home'
import Register from '../pages/Register'
import Best from '../pages/Best/Best'
import New from '../pages/New/New'
import Legacy from '../pages/Legacy/Legacy'
import Community from '../pages/Community/Community'
import ProductDetail from '../pages/Product/ProductDetail'
import Shop from '../pages/Shop/Shop'
import Collection from '../pages/Collection/Collection'
import Layout from '../components/layout/Layout'
import Footer from '../components/layout/Footer'
import MyPage from '../pages/MyPage/MyPage'
import SearchPage from '../pages/Search/SearchPage'
import AdminLayout from '../components/layout/AdminLayout'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminProductList from '../pages/Admin/AdminProductList'
import AdminProductForm from '../pages/Admin/AdminProductForm'
import AdminCategoryList from '../pages/Admin/AdminCategoryList'
import AdminCollectionList from '../pages/Admin/AdminCollectionList'

const Private = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  return user ? children : <Navigate to='/' />
}

const AdminProtected = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  if (!user || user.role !== 1) return <Navigate to='/' />
  return <AdminLayout>{children}</AdminLayout>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/new' element={<New />} />
      <Route path='/shop' element={<Shop />} />
      <Route path='/shop/*' element={<Shop />} />
      <Route path='/checkout' element={
        <Private>
          <Layout footer={<Footer />}>
            <div className='py-20 text-center text-white'>
              <h1 className='text-4xl font-oswald font-black uppercase italic mb-8'>Checkout</h1>
              <p className='text-gray-400 italic'>Payment gateway integration in progress...</p>
            </div>
          </Layout>
        </Private>
      } />
      <Route path="/best" element={<Best />} />
      <Route path="/legacy" element={<Legacy />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/collection" element={<Collection />} />
      <Route path='/community' element={<Community />} />
      <Route path='/my-page' element={<Private><MyPage /></Private>} />
      <Route path='/search' element={<SearchPage />} />

      {/* Admin Routes */}
      <Route path='/admin' element={<AdminProtected><AdminDashboard /></AdminProtected>} />
      <Route path='/admin/products' element={<AdminProtected><AdminProductList /></AdminProtected>} />
      <Route path='/admin/products/add' element={<AdminProtected><AdminProductForm /></AdminProtected>} />
      <Route path='/admin/products/edit/:id' element={<AdminProtected><AdminProductForm /></AdminProtected>} />
      <Route path='/admin/categories' element={<AdminProtected><AdminCategoryList /></AdminProtected>} />
      <Route path='/admin/collections' element={<AdminProtected><AdminCollectionList /></AdminProtected>} />
      <Route path='/admin/users' element={<AdminProtected><div className='text-gray-500 font-oswald uppercase tracking-widest'>User Management Coming Soon</div></AdminProtected>} />
      <Route path='/admin/settings' element={<AdminProtected><div className='text-gray-500 font-oswald uppercase tracking-widest'>Site Settings Coming Soon</div></AdminProtected>} />
    </Routes>
  )
}