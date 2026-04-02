import cartIcon from '~/assets/CartIcon/shopping-bag.png'

function CartIcon() {
  return (
    <div className='relative w-5 h-5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer -translate-y-[1px]'>
      <input type="image" src={cartIcon} className='w-full h-full filter invert' />
      <span className='absolute -top-1 -right-2 bg-[#e2012d] text-white text-[10px] w-4 h-4 font-inter font-bold flex items-center justify-center rounded-full'>1</span>
    </div>
  )
}

export default CartIcon
