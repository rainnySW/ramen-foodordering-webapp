import Link from 'next/link';
import { useRouter } from 'next/router';

// Simple SVG Icons with warm rounded strokes
const HouseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ShoppingBagsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const BasketIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const PeopleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c4.418 0 8 3.134 8 7H4c0-3.866 3.582-7 8-7zM12 11a4 4 0 110-8 4 4 0 010 8z" />
  </svg>
);

export default function NavBar({ cartCount, setIsCartOpen, t }) {
  const router = useRouter();
  
  const navItems = [
    { name: 'Home', labelKey: 'navHome', href: '/', icon: HouseIcon },
    { name: 'Menu', labelKey: 'navMenu', href: '/menu', icon: ShoppingBagsIcon },
    { name: 'Cart', labelKey: 'navCart', isAction: true, action: () => setIsCartOpen(true), icon: BasketIcon, count: cartCount },
    { name: 'Account', labelKey: 'navAccount', href: '/account', icon: PeopleIcon },
  ];

  return (
    <>
      {/* PC Left Sidebar */}
      <div className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-24 bg-white dark:bg-[#2A2421] shadow-[4px_0_24px_rgba(74,59,50,0.05)] dark:shadow-none border-r border-transparent dark:border-white/5 py-8 z-40 items-center justify-between">
        <div className="w-12 h-12 bg-gradient-to-br from-[#D97736] to-orange-400 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(217,119,54,0.3)] mb-10 shrink-0">
          <span className="text-2xl font-bold text-white">🍜</span>
        </div>
        
        <div className="flex flex-col gap-6 w-full px-4">
          {navItems.map(item => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            
            const content = (
              <div className={`relative flex flex-col items-center justify-center p-3 w-full rounded-2xl transition-all duration-300 group cursor-pointer ${isActive ? 'bg-[#FAF6F0] dark:bg-[#38302C]' : 'hover:bg-[#FAF6F0] dark:hover:bg-[#38302C]'}`}>
                <Icon className={`w-7 h-7 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 ${isActive ? 'text-[#D97736]' : 'text-gray-400 group-hover:text-[#D97736]'}`} />
                <span className={`whitespace-nowrap text-[10px] font-bold mt-1 transition-colors duration-300 ${isActive ? 'text-[#D97736]' : 'text-gray-400 group-hover:text-[#D97736]'}`}>{t(item.labelKey)}</span>
                {item.count > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#D97736] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {item.count}
                  </div>
                )}
              </div>
            );

            if (item.isAction) {
              return <button key={item.name} onClick={item.action} className="w-full">{content}</button>;
            }
            return <Link key={item.name} href={item.href} className="w-full">{content}</Link>;
          })}
        </div>
        <div className="mt-auto pt-10"></div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#2A2421]/90 backdrop-blur-xl shadow-[0_-4px_30px_rgba(74,59,50,0.08)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.5)] border-t border-transparent dark:border-white/5 z-40 px-6 pt-3 pb-safe-bottom" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
        <div className="flex justify-between items-center w-full max-w-sm mx-auto">
          {navItems.map(item => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            
            const content = (
              <div className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 active:scale-75 ${isActive ? 'text-[#D97736]' : 'text-gray-400'}`}>
                {/* Active Indicator Blob */}
                {isActive && <div className="absolute inset-0 bg-[#D97736]/10 dark:bg-[#D97736]/20 rounded-2xl -z-10 scale-110"></div>}
                
                <Icon className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-[#D97736]' : 'text-gray-400'}`} />
                <span className={`whitespace-nowrap text-[10px] font-bold mt-1 transition-colors duration-300 ${isActive ? 'text-[#D97736]' : 'text-gray-400'}`}>{t(item.labelKey)}</span>
                
                {item.count > 0 && (
                  <div className="absolute top-1 right-1 bg-[#D97736] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.count}
                  </div>
                )}
              </div>
            );

            if (item.isAction) {
              return <button key={item.name} onClick={item.action} className="flex-1 flex justify-center">{content}</button>;
            }
            return <Link key={item.name} href={item.href} className="flex-1 flex justify-center">{content}</Link>;
          })}
        </div>
      </div>
    </>
  );
}
