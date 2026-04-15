import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { searchSuggestions as data } from '~/data/searchData'
import { useLanguage } from '~/contexts/LanguageContext'

export default function SearchBar() {
  const { t } = useLanguage()
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState('')
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

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
      // h-9 is 36px
      listRef.current.style.transform = `translateY(-${index * 36}px)`
    }
  }, [index])

  const hidePlaceholder = isFocused || value !== ''

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  const handleSearchClick = () => {
    if (!isFocused) {
      inputRef.current?.focus()
    } else {
      navigate(value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : '/search')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`search_form flex items-center relative h-9 transition-all duration-300 rounded-full bg-white/5 border border-white/10 px-3 hover:bg-white/10 hover:border-white/20 group ${isFocused ? 'w-48 md:w-64 border-t1-red/50 bg-white/10' : 'w-10 md:w-48 xl:w-64'}`}
    >
      <button
        type="button"
        onClick={handleSearchClick}
        className="flex-shrink-0 text-gray-400 group-hover:text-white transition-colors"
      >
        <Search size={18} />
      </button>

      <div className="relative flex items-center h-full flex-1 ml-2 overflow-hidden">
        <input
          ref={inputRef}
          type="text"
          className={`w-full h-full focus:outline-none relative z-10 bg-transparent font-inter text-xs text-white placeholder:text-transparent transition-opacity duration-300 ${!isFocused && value === '' ? 'md:opacity-100 opacity-0' : 'opacity-100'}`}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={blurSearchBar}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('common.search')}
        />

        {/* SLIDE PLACEHOLDER */}
        {!hidePlaceholder && (
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden hidden md:block">
            <div ref={listRef} className="flex flex-col">
              {extend.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault() // Prevent onBlur from firing before this interaction
                    setValue(item.text)
                    navigate(`/search?q=${encodeURIComponent(item.text)}`)
                  }}
                  className="flex gap-2 h-9 min-h-[36px] items-center font-inter text-[11px] w-full text-left"
                >
                  <span className="text-t1-red font-bold text-[10px] sm:text-xs">{item.num}</span>
                  <span className="text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isFocused && value !== '' && (
          <button
            type="button"
            onClick={() => setValue('')}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white z-20"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </form>
  )
}
