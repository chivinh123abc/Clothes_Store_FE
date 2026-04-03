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
    // console.log('index: ', index)
    if (index === data.length + 1) {
      listRef.current.style.transition = 'transform 0s'
      listRef.current.style.transform = 'translateY(0px)'
      requestAnimationFrame(() => {
        setIndex(1) // hoặc 0 nếu bạn duplicate item đầu ở cuối
        // Sau khi setIndex, useEffect lần sau sẽ chạy với transition bình thường
      })
    } else {
      listRef.current.style.transition = 'transform 0.5s ease-in-out'
      listRef.current.style.transform = `translateY(-${index * 24}px)`
    }
  }, [index])

  const hidePlaceholder = isFocused || value !== ''

  return (
    <form
      action="/search"
      method="GET"
      className="search_form flex md:border-b items-center relative h-6"
    >
      <p className="hidden md:block">SEARCH&nbsp;&nbsp;</p>

      <div className="relative flex items-center h-6 hidden md:flex">
        <input
          type="text"
          className="w-32 h-full focus:outline-none relative z-10 bg-transparent font-inter text-base tracking-normal"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={blurSearchBar}
          onChange={(e) => setValue(e.target.value)}
        />

        {/* SLIDE PLACEHOLDER */}
        {!hidePlaceholder && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 overflow-hidden h-6 pointer-events-none w-full">
            <div ref={listRef}>
              {extend.map((item, idx) => (
                <div key={idx} className="flex gap-2 h-6 items-center font-inter text-sm tracking-normal">
                  <span className="text-t1-red font-bold translate-y-[1px]">{item.num}</span>
                  <span className="text-white whitespace-nowrap translate-y-[1px]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
