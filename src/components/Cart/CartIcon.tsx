import cartIcon from '~/assets/CartIcon/shopping-bag.png'

function CartIcon() {
  return (
    <div className='relative w-4 h-4'>
      <input type="image" src={cartIcon} className='w-full h-full filter bg-img-white' />
      <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3 h-3 flex items-center justify-center rounded-full'>1</span>
    </div>
  )
}

export default CartIcon
