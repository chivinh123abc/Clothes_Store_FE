import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Home from '../pages/Home/Home'
import Register from '../pages/Register'
import Best from '../pages/Best/Best'
import Community from '../pages/Community/Community' // 1. Import trang Community vào đây

const Private = ({ children }: { children: React.ReactElement }) => {
    const { user } = useAuth()
    return user ? children : <Navigate to='/' />
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/checkout' element={<Private><div>Checkout</div></Private>} />
            <Route path='/best' element={<Best />} />
            {/* 2. Thêm route cho trang Community */}
            <Route path='/community' element={<Community />} /> 
        </Routes>
    )
}