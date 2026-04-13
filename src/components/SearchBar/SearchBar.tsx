import { useEffect, useRef, useState } from 'react'

const data = [
  { num: '1', text: 'Quan GENG' },
  { num: '2', text: 'Ao T1' },
  { num: '3', text: 'Giay HLE' },
  { num: '4', text: 'Tat KT' }
]

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState('')
  const [index, setIndex] = useState(0)

  const extend = [...data, data[0]]

  const listRef = useRef<HTMLDivElement | null>(null)

  const blurSearchBar = () => {
    setIsFocused(false)
    setIndex(0)
  }

  // Auto slide index
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  // Apply sliding effect using transform
  useEffect(() => {
    if (!listRef.current) return
    if (index === data.length + 1) {
      listRef.current.style.transition = 'transform 0s'
      listRef.current.style.transform = 'translateY(0px)'
      requestAnimationFrame(() => {
        setIndex(1)
      })
    } else {
      listRef.current.style.transition = 'transform 0.5s ease-in-out'
      // h-6 is 24px
      listRef.current.style.transform = `translateY(-${index * 24}px)`
    }
  }, [index])

  const hidePlaceholder = isFocused || value !== ''

  return (
    <form
      action="/search"
      method="GET"
      className="search_form flex items-center relative h-6 gap-2 md:border-b border-transparent md:border-t1-gray/40 hover:border-t1-gray transition-colors group"
    >
      <p className="hidden md:block font-oswald text-base tracking-widest text-[#f1f1f1] whitespace-nowrap cursor-pointer" onClick={() => setIsFocused(true)}>
        SEARCH&nbsp;&nbsp;
      </p>

      <div className="relative flex items-center h-full w-0 md:w-36 xl:w-56 transition-all duration-300 overflow-hidden">
        <input
          type="text"
          className="w-full h-full focus:outline-none relative z-10 bg-transparent font-inter text-sm text-white placeholder:text-transparent"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={blurSearchBar}
          onChange={(e) => setValue(e.target.value)}
        />

        {/* SLIDE PLACEHOLDER */}
        {!hidePlaceholder && (
          <div className="absolute left-0 top-0 h-full pointer-events-none w-full overflow-hidden">
            <div ref={listRef} className="flex flex-col">
              {extend.map((item, idx) => (
                <div key={idx} className="flex gap-2 h-6 min-h-[24px] items-center font-inter text-sm w-full">
                  <span className="text-t1-red font-bold text-[10px] sm:text-xs translate-y-[1px]">{item.num}</span>
                  <span className="text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis translate-y-[1px]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
