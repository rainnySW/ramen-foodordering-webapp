import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home({ t, lang }) {
  const [featured, setFeatured] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Fetch menu and get 3 ramens
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        const ramens = data.filter(i => i.category === 'Ramen').slice(0, 3);
        setFeatured(ramens);
      })
      .catch(err => console.error(err));
  }, []);

  // Slider effect
  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featured.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [featured]);

  return (
    <>
      <Head>
        <title>{t('restaurantName')} - Home</title>
      </Head>
      <main className="min-h-screen p-4 md:p-10 flex flex-col items-center justify-center pb-32 md:pb-10 relative overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D97736]/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D5ECC2]/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="max-w-4xl w-full flex flex-col items-center text-center pt-16 md:pt-0">
          
          {/* Animated Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#4A3B32] dark:text-[#F5EFE6] tracking-tighter mb-4 animate-fade-in-up">
            {t('title1')} <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97736] to-orange-400">{t('title2')}</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-70 mb-10 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('subtitle')}
          </p>

          {/* Slider for Featured Ramen */}
          <div className="w-full max-w-sm md:max-w-md mx-auto relative h-[320px] md:h-[350px] mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {featured.length > 0 ? (
              featured.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <div 
                    key={item._id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col items-center justify-center bg-white dark:bg-[#38302C] rounded-[40px] p-8 shadow-[0_20px_50px_-10px_rgba(217,119,54,0.15)] dark:shadow-none border border-transparent dark:border-white/5
                      ${isActive ? 'opacity-100 translate-y-0 scale-100 z-10' : 'opacity-0 translate-y-8 scale-95 z-0 pointer-events-none'}
                    `}
                  >
                    {item.image_url ? (
                      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-inner mb-6 transition-transform duration-500 hover:scale-110 bg-[#FFDDBF] dark:bg-gray-700 border-4 border-white dark:border-[#2A2421]">
                        <img src={item.image_url} alt={lang === 'th' && item.name_th ? item.name_th : item.name} className="w-full h-full object-cover object-center" />
                      </div>
                    ) : (
                      <div className="w-28 h-28 md:w-32 md:h-32 bg-[#FFDDBF] dark:bg-gray-700 rounded-full flex items-center justify-center shadow-inner mb-6 transition-transform duration-500 hover:scale-110">
                        <span className="text-6xl md:text-7xl">🍜</span>
                      </div>
                    )}
                    <div className="text-xs font-bold uppercase tracking-wider text-[#D97736] mb-2 bg-[#D97736]/10 px-3 py-1 rounded-full">{t('chefsPick')}</div>
                    <h3 className="text-2xl font-bold mb-3 text-[#4A3B32] dark:text-[#F5EFE6]">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
                    <p className="opacity-70 text-sm line-clamp-2 text-[#4A3B32] dark:text-[#F5EFE6] px-4">{lang === 'th' && item.description_th ? item.description_th : item.description}</p>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full bg-white/50 dark:bg-[#38302C]/50 rounded-[40px] animate-pulse"></div>
            )}

            {/* Slider Dots */}
            {featured.length > 0 && (
              <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
                {featured.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-[#D97736]' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Call to action */}
          <div className="animate-fade-in-up mt-8" style={{ animationDelay: '0.6s' }}>
            <Link 
              href="/menu"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D97736] text-white rounded-full font-bold text-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(217,119,54,0.3)]"
            >
              <span>{t('exploreMenu')}</span>
              <span className="text-2xl leading-none">→</span>
            </Link>
          </div>
          
        </div>
      </main>
    </>
  );
}
