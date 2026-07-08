import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home({ cart, setCart, t, setIsCartOpen, isDark, setIsDark, setEditingItem, lang }) {
  const [menuItems, setMenuItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Fetch menu from API
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error(err))
  }, [])

  const handleDirectAdd = (item) => {
    if (cart.length === 0) {
      setIsCartOpen(true);
    }
    const isRamen = item.category === 'Ramen';
    const isSides = item.category === 'Sides';
    const isDrinks = item.category === 'Drinks';
    
    const defaultOptions = {
      size: (isRamen || isSides) ? 'Normal' : null,
      extras: isRamen ? [] : [],
      sauce: isSides ? 'None' : null,
      sweetness: isDrinks ? '100%' : null
    };

    setCart([...cart, { ...item, quantity: 1, options: defaultOptions, uid: Date.now() }]);
  };

  const filteredMenu = menuItems.filter(item => {
    const itemName = lang === 'th' && item.name_th ? item.name_th : item.name;
    const itemDesc = lang === 'th' && item.description_th ? item.description_th : item.description;
    return itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (itemDesc && itemDesc.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <>
      <Head>
        <title>{t('restaurantName')} - Menu</title>
        <meta name="description" content="In-Restaurant Table Ordering Web Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="p-4 max-w-6xl mx-auto pb-24 md:pb-10 pt-10">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
          <div className="flex justify-between items-center w-full md:w-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#4A3B32] dark:text-[#F5EFE6] tracking-tight md:mb-0">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97736] to-orange-400">
                {t('menuTitle')}
              </span>
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">

            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 opacity-70">🔍</span>
              </div>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#38302C] border-none rounded-2xl shadow-[0_4px_15px_rgba(74,59,50,0.05)] focus:ring-2 focus:ring-[#D97736] outline-none text-[#4A3B32] dark:text-white transition-all font-semibold"
              />
            </div>

            {/* Desktop Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hidden md:flex items-center gap-2 bg-[#D97736] text-white px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-[0_4px_15px_rgba(217,119,54,0.3)] active:scale-95 whitespace-nowrap"
            >
              🛒 {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </button>
          </div>
        </div>
        
        {filteredMenu.length === 0 ? (
          <div className="text-center py-20 opacity-50 animate-fade-in">
            <span className="text-6xl block mb-4">🍜</span>
            <p className="text-lg font-semibold">{t('noRamenFound')} "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredMenu.map(item => (
              <div 
                key={item._id} 
                onClick={() => setEditingItem(item)}
                className="group bg-white dark:bg-[#38302C] rounded-2xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-none border border-transparent dark:border-white/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-32 md:h-40 bg-[#FAF6F0] dark:bg-[#2A2421] m-2 rounded-xl overflow-hidden shadow-sm">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#FAF6F0] dark:bg-[#2A2421]">
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-[#FFDDBF] dark:bg-gray-700 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <span className="text-2xl md:text-4xl">🍜</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-3 md:p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm md:text-lg font-bold leading-tight text-[#4A3B32] dark:text-[#F5EFE6] line-clamp-2 pr-1">
                      {lang === 'th' && item.name_th ? item.name_th : item.name}
                    </h3>
                  </div>
                  
                  <p className="opacity-60 text-[10px] md:text-xs mb-3 line-clamp-2 text-[#4A3B32] dark:text-[#F5EFE6] flex-1 leading-snug">
                    {lang === 'th' && item.description_th ? item.description_th : item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[#D97736] text-sm md:text-base">฿{item.price.toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectAdd(item);
                      }}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FAF6F0] dark:bg-[#2A2421] text-[#D97736] border border-[#D97736]/30 flex items-center justify-center hover:bg-[#D97736] hover:text-white dark:hover:text-white transition-colors active:scale-90 shadow-sm shrink-0"
                      title="Quick Add"
                    >
                      <span className="text-lg md:text-xl leading-none font-medium mb-0.5">+</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
