import cartIcon from '~/assets/CartIcon/shopping-bag.png'
import { useCart } from '~/contexts/CartContext'

interface CartIconProps {
  onClick?: () => void;
}

function CartIcon({ onClick }: CartIconProps) {
  const { totalItems } = useCart()

  return (
    <div
      className='relative w-5 h-5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer -translate-y-[1px]'
      onClick={onClick}
    >
      <input type="image" src={cartIcon} className='w-full h-full filter invert pointer-events-none' />
      {totalItems > 0 && (
        <span className='absolute -top-1 -right-2 bg-[#e2012d] text-white text-[10px] w-4 h-4 font-inter font-bold flex items-center justify-center rounded-full pointer-events-none'>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </div>
  )
}

export default CartIcon
