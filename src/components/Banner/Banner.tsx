import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '~/components/Modals/LoginModal';
import { useAuth } from '~/hooks/useAuth';

function Banner() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className={'z-100 hd-banner fixed inset-0 font-macondo font-bold bg-black w-full text-blood-red h-8 px-3 flex justify-center sm:justify-between items-center'}>
        <div className='hidden sm:block'>
          <p>GLOBAL / USD</p>
        </div>
        <div className='slogan '>
          <a href="">TALK LESS DO MORE</a>
        </div>
        <div className='space-x-1 hidden sm:block'>
          {user ? (
            <>
              <button onClick={() => navigate('/my-page')}>MY PAGE</button>
              <span>/</span>
              <button onClick={() => { logout(); navigate('/'); }}>LOGOUT</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsLoginOpen(true)}>LOGIN</button>
              <span>/</span>
              <button onClick={() => navigate('/register')}>JOIN</button>
              <span>/</span>
              <a href="">ORDER</a>
            </>
          )}
        </div>
      </div>

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}

export default Banner
