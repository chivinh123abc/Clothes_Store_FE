import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Home from '../pages/Home/Home'
import Register from '../pages/Register'
import BEST from "../pages/BEST/BEST";

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
            <Route path="/BEST" element={<BEST />} />
        </Routes>
    )
}