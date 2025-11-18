function SearchBar() {
  const firstPH = 0
  const secondPH = "T1"
  const finalPH = firstPH + " " + secondPH
  return (
    <form
      action='/search'
      method='GET'
      className='search_form flex md:border-b items-center'
    >
      <p className='hidden md:block'>SEARCH&nbsp;&nbsp;</p>
      <input type="text" className='w-30 hidden md:block' placeholder={finalPH} />
      <input type="image" src='src/assets/SearchBar/loupe.png' className='w-3 bg-img-white' />
    </form >
  )
}

export default SearchBar
