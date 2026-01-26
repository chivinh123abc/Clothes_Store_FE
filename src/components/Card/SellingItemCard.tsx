function SellingItemCard() {
  return (
    <a className='group bg-blue-100 overflow-hidden' href=''>
      {/* IMAGE */}
      <div className='overflow-hidden w-60 h-90'>
        <img className='transition-transform duration-500 ease-out group-hover:scale-125' src="https://i.pinimg.com/1200x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" alt="" />
      </div>

      {/* TEXT */}
      <div className="collection_title relative left-1 -top-1/5 md:left-5 md:-top-25 text-white z-10">
        <p className='font-extralight text-sm'>Exclusive for Rin Fans</p>
        <p></p>
        <h3 className='font-bold text-xl md:text-3xl group-hover:text-blood-red'>TEAM KIT</h3>
      </div>
    </a>
  )
}

export default SellingItemCard
