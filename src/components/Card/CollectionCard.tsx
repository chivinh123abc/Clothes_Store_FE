import { Link } from 'react-router-dom'

function CollectionCard() {
  return (
    <Link className='group relative block bg-t1-dark overflow-hidden' to='/collection'>
      {/* IMAGE */}
      <div className='overflow-hidden w-90 h-120'>
        <img className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-125' src="https://i.pinimg.com/1200x/8a/6d/a4/8a6da44fd555cdef4768b409557d5022.jpg" alt="" />
      </div>

      {/* TEXT */}
      <div className="collection_title absolute bottom-4 left-4 md:bottom-8 md:left-5 text-white z-10">
        <p className='font-extralight text-sm'>Exclusive for Rin Fans</p>
        <p></p>
        <h3 className='font-oswald tracking-wider font-bold text-xl md:text-3xl group-hover:text-t1-red transition-colors'>TEAM KIT</h3>
      </div>
    </Link>
  )
}

export default CollectionCard
