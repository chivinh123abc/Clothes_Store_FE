import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginModal from '~/components/Modals/LoginModal'
import { useAuth } from '~/hooks/useAuth'

function Banner() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <div className={'z-[100] fixed top-0 w-full bg-t1-dark text-t1-text h-8 px-5 flex justify-center sm:justify-between items-center font-inter text-xs tracking-widest'}>
        <div className='hidden sm:block opacity-80 hover:opacity-100 transition-opacity'>
          <p>GLOBAL / USD</p>
        </div>
        <div className='font-oswald tracking-[0.2em] text-[#e2012d] font-bold uppercase'>
          JUST DO IT
        </div>
        <div className='space-x-3 hidden sm:flex items-center opacity-80'>
          {user ? (
            <>
              <button className="hover:text-white transition-colors" onClick={() => navigate('/my-page')}>MY PAGE</button>
              <span>/</span>
              <button className="hover:text-[#e2012d] transition-colors" onClick={() => { logout(); navigate('/') }}>LOGOUT</button>
            </>
          ) : (
            <>
              <button className="hover:text-white transition-colors" onClick={() => setIsLoginOpen(true)}>LOGIN</button>
              <span>/</span>
              <button className="hover:text-white transition-colors" onClick={() => navigate('/register')}>JOIN</button>
              <span>/</span>
              <a className="hover:text-white transition-colors cursor-pointer">ORDER</a>
            </>
          )}
        </div>
      </div>

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}

export default Banner
