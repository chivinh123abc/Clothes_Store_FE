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
import MyPage from '../pages/MyPage/MyPage'
import SearchPage from '../pages/Search/SearchPage'
import AdminLayout from '../components/layout/AdminLayout'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminProductList from '../pages/Admin/AdminProductList'
import AdminUserList from '../pages/Admin/AdminUserList'
import AdminProductForm from '../pages/Admin/AdminProductForm'
import AdminCategoryList from '../pages/Admin/AdminCategoryList'
import AdminCollectionList from '../pages/Admin/AdminCollectionList'
import AdminOrderList from '../pages/Admin/AdminOrderList'
import AdminDiscountList from '../pages/Admin/AdminDiscountList'
import VerifyAccount from '../pages/VerifyAccount/VerifyAccount'
import Checkout from '../pages/Checkout/Checkout'
import MoMoReturn from '../pages/Checkout/MoMoReturn'
import TryOnPage from '../pages/TryOn/TryOnPage'

const Private = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  return user ? children : <Navigate to='/?login=true' />
}

const AdminProtected = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  if (!user || Number(user.role) !== 1) return <Navigate to='/' />
  return <AdminLayout>{children}</AdminLayout>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/verify-account' element={<VerifyAccount />} />
      <Route path='/new' element={<New />} />
      <Route path='/shop' element={<Shop />} />
      <Route path='/shop/*' element={<Shop />} />
      <Route path='/checkout' element={
        <Private>
          <Checkout />
        </Private>
      } />
      <Route path='/checkout/momo-return' element={
        <Private>
          <MoMoReturn />
        </Private>
      } />
      <Route path="/best" element={<Best />} />
      <Route path="/legacy" element={<Legacy />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/collection" element={<Collection />} />
      <Route path='/community' element={<Community />} />
      <Route path='/my-page' element={<Private><MyPage /></Private>} />
      <Route path='/search' element={<SearchPage />} />
      <Route path='/try-on' element={<Private><TryOnPage /></Private>} />

      {/* Admin Routes */}
      <Route path='/admin' element={<AdminProtected><AdminDashboard /></AdminProtected>} />
      <Route path='/admin/products' element={<AdminProtected><AdminProductList /></AdminProtected>} />
      <Route path='/admin/products/add' element={<AdminProtected><AdminProductForm /></AdminProtected>} />
      <Route path='/admin/products/edit/:id' element={<AdminProtected><AdminProductForm /></AdminProtected>} />
      <Route path='/admin/categories' element={<AdminProtected><AdminCategoryList /></AdminProtected>} />
      <Route path='/admin/collections' element={<AdminProtected><AdminCollectionList /></AdminProtected>} />
      <Route path='/admin/users' element={<AdminProtected><AdminUserList /></AdminProtected>} />
      <Route path='/admin/orders' element={<AdminProtected><AdminOrderList /></AdminProtected>} />
      <Route path='/admin/discounts' element={<AdminProtected><AdminDiscountList /></AdminProtected>} />
    </Routes>
  )
}