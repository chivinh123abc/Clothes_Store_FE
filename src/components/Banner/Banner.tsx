function Banner() {
  return (
    <div className='hd-banner font-macondo font-bold bg-black w-full text-[#e2012d] h-8 px-3 flex justify-center sm:justify-between items-center'>
      <div className='hidden sm:block'>
        <p>GLOBAL / USD</p>
      </div>
      <div className='slogan'>
        <a href="">TALK LESS DO MORE</a>
      </div>
      <div className='space-x-1 hidden sm:block'>
        <a href="">LOGIN</a>
        <span>/</span>
        <a href="">JOIN</a>
        <span>/</span>
        <a href="">ORDER</a>
      </div>
    </div>
  )
}

export default Banner
