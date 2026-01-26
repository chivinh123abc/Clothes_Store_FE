function BannerCard() {
  return (
    <a className='group bg-blue-100 overflow-hidden' href=''>
      {/* IMAGE */}
      <div className='overflow-hidden w-full h-90 transition-all duration-500 ease-out group-hover:border-b-4 group-hover:border-b-blood-red'>
        <img className='w-full h-90 transition-transform duration-500 ease-out group-hover:scale-125' src="https://i.pinimg.com/736x/6b/09/e9/6b09e91287d1010f3c16e889d5b9f66d.jpg" alt="" />
      </div>

      {/* TEXT */}
      <div className="collection_title relative left-1 -top-1/5 md:left-5 md:-top-25 text-white z-10">
        <p className='font-extralight text-sm'>Exclusive for Rin Fans</p>
        <p></p>
        <h3 className='font-bold text-xl md:text-2xl group-hover:text-blood-red '>TEAM KIT</h3>
      </div>
    </a>
  )
}

export default BannerCard
