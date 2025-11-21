import { useEffect, useRef, useState } from "react";

const data = [
  { num: "1", text: "Quan GENG" },
  { num: "2", text: "Ao T1" },
  { num: "3", text: "Giay HLE" },
  { num: "4", text: "Tat KT" },
];

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);

  const extend = [...data, data[0]]

  const listRef = useRef<HTMLDivElement | null>(null);


  const blurSearchBar = () => {
    setIsFocused(false);
    setIndex(0);
  }

  // Auto slide index
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Apply sliding effect using transform
  useEffect(() => {
    if (!listRef.current) return;
    // console.log('index: ', index)
    if (index === data.length + 1) {
      listRef.current.style.transition = "transform 0s";
      listRef.current.style.transform = "translateY(0px)";
      requestAnimationFrame(() => {
        setIndex(1); // hoặc 0 nếu bạn duplicate item đầu ở cuối
        // Sau khi setIndex, useEffect lần sau sẽ chạy với transition bình thường
      });
    } else {
      listRef.current.style.transition = "transform 0.5s ease-in-out";
      listRef.current.style.transform = `translateY(-${index * 24}px)`;
    }
  }, [index]);

  const hidePlaceholder = isFocused || value !== "";

  return (
    <form
      action="/search"
      method="GET"
      className="search_form flex md:border-b items-center relative h-6"
    >
      <p className="hidden md:block">SEARCH&nbsp;&nbsp;</p>

      <input
        type="text"
        className="w-30 hidden md:block focus:outline-none relative z-10 bg-transparent"
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={blurSearchBar}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* SLIDE PLACEHOLDER */}
      {!hidePlaceholder && (
        <div className="absolute left-13 top-0 overflow-hidden h-6 pointer-events-none hidden md:block">
          <div ref={listRef}>
            {extend.map((item, idx) => (
              <div key={idx} className="flex gap-1 h-6 items-center">
                <span className="text-blood-red font-bold">{item.num}</span>
                <span className="text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
