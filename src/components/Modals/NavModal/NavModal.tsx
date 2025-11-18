import type { ReactNode } from 'react';
import { NavMenuListModal } from '~/components/MenuList/NavMenuList';

interface NavModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function NavModal({ open, onClose, children }: NavModalProps) {
  return (
    <div onClick={onClose} className={`fixed inset-0 flex justify-start items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}>
      <div onClick={(e) => e.stopPropagation()} className='inset w-[30vw] h-screen bg-white text-black text-xs font-bold border-b border-black'>
        {children}
        <NavMenuListModal />
      </div>

    </div>
  );
}

