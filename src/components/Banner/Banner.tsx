import { useState } from 'react';
import LoginModal from '~/components/Modals/LoginModal';

function Banner() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
          <button onClick={() => setIsLoginOpen(true)}>LOGIN</button>
          <span>/</span>
          <a href="">JOIN</a>
          <span>/</span>
          <a href="">ORDER</a>
        </div>
      </div>
      
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}

export default Banner
