import '@/styles/globals.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CartDrawer from '@/components/CartDrawer'
import OptionsModal from '@/components/OptionsModal'
import NavBar from '@/components/NavBar'
import TransitionLayout from '@/components/TransitionLayout'

export default function App({ Component, pageProps }) {
  // Monolithic State Container as per BLUEPRINT
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const [lang, setLangState] = useState('th')
  const [isLangChanging, setIsLangChanging] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()

  const setLang = (newLang) => {
    if (newLang === lang) return;
    setIsLangChanging(true);
    setTimeout(() => {
      setLangState(newLang);
      setTimeout(() => {
        setIsLangChanging(false);
      }, 50);
    }, 300); // Wait for overlay to fade in
  };
  
  // Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  
  // Comprehensive i18n
  const translations = {
    en: {
      // Global
      restaurantName: "Ginza Ramen",
      // NavBar
      navHome: "Home", navMenu: "Menu", navCart: "Cart", navAccount: "Account",
      // Home
      title1: "Experience the True Taste of", title2: "Ginza Ramen",
      subtitle: "Rich, slow-simmered broth, premium ingredients, and the coziest atmosphere. Your perfect bowl is waiting.",
      exploreMenu: "Explore Menu", chefsPick: "Chef's Pick",
      // Menu
      menuTitle: "Menu.", searchPlaceholder: "Search ramen...",
      addToOrder: "Add to Order", noRamenFound: "No ramen found matching",
      // Cart
      yourOrder: "Your Order", checkoutTitle: "Payment", confirmTitle: "Confirmation",
      clearCartTitle: "Clear Cart", receiptTitle: "Receipt", clear: "Clear",
      emptyCart: "Your comfy cart is empty.", total: "Total",
      proceedToPayment: "Proceed to Payment",
      tableNumber: "Table Number", tablePlaceholder: "e.g., 12",
      paymentOption: "Payment Option", uploadSlipTitle: "Upload Transfer Slip",
      uploadSlipDesc: "Tap to upload your bank transfer slip", slipAttached: "Slip Attached!",
      scanQRTitle: "Scan with any banking app",
      readyToOrder: "Ready to order?", table: "Table", paidVia: "Paid via",
      sendToKitchen: "Send to Kitchen!", goBack: "Go Back",
      areYouSureClear: "This will remove all items from your order.",
      proceed: "Proceed!", nevermind: "Nevermind",
      closeAndStartNew: "Close & Start New Order", orderSent: "Order Sent to Kitchen",
      // Account
      profile: "Profile.", tableNotSet: "Table not set",
      ordersThisMonth: "Orders this month", edit: "Edit", save: "Save",
      appSettings: "App Settings", theme: "Theme", themeDesc: "Switch between Light and Dark mode",
      language: "Language", languageDesc: "English / ไทย",
      notifications: "Notifications", notificationsDesc: "Order status alerts (Coming soon)"
    },
    th: {
      restaurantName: "กินซ่า ราเมง",
      navHome: "หน้าหลัก", navMenu: "เมนู", navCart: "ตะกร้า", navAccount: "บัญชี",
      title1: "สัมผัสรสชาติแท้จริงของ", title2: "กินซ่า ราเมง",
      subtitle: "น้ำซุปเคี่ยวจนเข้มข้น วัตถุดิบพรีเมียม และบรรยากาศที่อบอุ่นที่สุด ราเมนชามโปรดของคุณรออยู่",
      exploreMenu: "ดูเมนู", chefsPick: "เชฟแนะนำ",
      menuTitle: "เมนู.", searchPlaceholder: "ค้นหาราเมน...",
      addToOrder: "เพิ่มลงตะกร้า", noRamenFound: "ไม่พบราเมนที่ตรงกับ",
      yourOrder: "รายการอาหาร", checkoutTitle: "ชำระเงิน", confirmTitle: "ยืนยันการสั่ง",
      clearCartTitle: "ล้างตะกร้า", receiptTitle: "ใบเสร็จ", clear: "ล้าง",
      emptyCart: "ตะกร้าของคุณว่างเปล่า", total: "ยอดรวม",
      proceedToPayment: "ดำเนินการชำระเงิน",
      tableNumber: "หมายเลขโต๊ะ", tablePlaceholder: "เช่น 12",
      paymentOption: "ช่องทางการชำระเงิน", uploadSlipTitle: "อัปโหลดสลิปโอนเงิน",
      uploadSlipDesc: "แตะเพื่ออัปโหลดสลิปธนาคาร", slipAttached: "แนบสลิปแล้ว!",
      scanQRTitle: "สแกนด้วยแอปธนาคารใดก็ได้",
      readyToOrder: "พร้อมสั่งอาหารหรือยัง?", table: "โต๊ะ", paidVia: "ชำระผ่าน",
      sendToKitchen: "ส่งไปที่ครัว!", goBack: "ย้อนกลับ",
      areYouSureClear: "รายการอาหารทั้งหมดจะถูกลบออก",
      proceed: "ดำเนินการ!", nevermind: "ยกเลิก",
      closeAndStartNew: "ปิดและเริ่มรายการใหม่", orderSent: "ส่งออเดอร์เข้าครัวแล้ว",
      profile: "โปรไฟล์.", tableNotSet: "ยังไม่ได้ระบุโต๊ะ",
      ordersThisMonth: "ออเดอร์เดือนนี้", edit: "แก้ไข", save: "บันทึก",
      appSettings: "การตั้งค่าแอป", theme: "ธีม", themeDesc: "สลับระหว่างโหมดสว่างและมืด",
      language: "ภาษา", languageDesc: "English / ไทย",
      notifications: "การแจ้งเตือน", notificationsDesc: "แจ้งเตือนสถานะอาหาร (เร็วๆ นี้)"
    }
  }
  const t = (key) => translations[lang]?.[key] || key

  useEffect(() => {
    // Load preferences
    const savedLang = localStorage.getItem('lang')
    if (savedLang) setLangState(savedLang)
    
    // Load cart
    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))

    // Initialize User from MongoDB or Local Storage
    const initializeUser = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId && storedUserId !== 'local_guest') {
        try {
          const res = await fetch(`/api/users/${storedUserId}`);
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            if (data.preferences?.LanguageSetting) setLangState(data.preferences.LanguageSetting);
            if (data.preferences?.ThemeSetting === 'dark') setIsDark(true);
          } else {
            createNewUser();
          }
        } catch (e) {
          console.error('MongoDB disconnected, using local user', e);
          fallbackToLocalUser();
        }
      } else {
        createNewUser();
      }
    };

    const fallbackToLocalUser = () => {
      const localUserStr = localStorage.getItem('localUser');
      if (localUserStr) {
        setUser(JSON.parse(localUserStr));
      } else {
        const dummyGuest = { _id: 'local_guest', name: 'Ramen Lover', isRegistered: false, tableNumber: null, orderCount: 0, preferences: { LanguageSetting: 'th', ThemeSetting: 'light' } };
        setUser(dummyGuest);
        localStorage.setItem('localUser', JSON.stringify(dummyGuest));
      }
    };

    const createNewUser = async () => {
      try {
        const res = await fetch('/api/users', { method: 'POST' });
        if (res.ok) {
          const newUser = await res.json();
          setUser(newUser);
          localStorage.setItem('userId', newUser._id);
        } else {
          fallbackToLocalUser();
        }
      } catch (e) {
        console.error('MongoDB disconnected, creating local user', e);
        fallbackToLocalUser();
      }
    };

    initializeUser();
  }, [])

  // Sync user to localStorage as backup for hybrid mode
  useEffect(() => {
    if (user) {
      localStorage.setItem('localUser', JSON.stringify(user));
    }
  }, [user])

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Sync lang to localStorage
  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  // Calculate cart metrics for FAB
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSaveItem = (itemData) => {
    if (itemData.uid) {
      // Edit existing
      setCart(prev => prev.map(i => i.uid === itemData.uid ? itemData : i));
    } else {
      // Add new
      if (cart.length === 0) {
        setIsCartOpen(true);
      }
      setCart(prev => [...prev, { ...itemData, quantity: 1, uid: Date.now() }]);
    }
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      {/* Language Transition Overlay */}
      <div 
        className={`fixed inset-0 bg-[#FAF6F0] dark:bg-[#1A1A1A] z-[100] transition-opacity duration-300 pointer-events-none flex items-center justify-center ${isLangChanging ? 'opacity-100' : 'opacity-0'}`}
      >
      </div>

      <div className="min-h-screen bg-[#FAF6F0] dark:bg-[#1A1A1A] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 relative flex pb-20 md:pb-0 md:pl-24">
        
        <NavBar cartCount={cartCount} setIsCartOpen={setIsCartOpen} t={t} />

        <div className="flex-1 w-full relative overflow-x-hidden">
          <TransitionLayout>
            <Component 
              key={router.pathname}
              {...pageProps} 
              cart={cart} setCart={setCart}
              user={user} setUser={setUser}
              lang={lang} setLang={setLang}
              isDark={isDark} setIsDark={setIsDark}
              isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}
              setEditingItem={setEditingItem}
              t={t}
            />
          </TransitionLayout>
          
          {/* Global Floating Cart Button (Visible on mobile when cart has items) */}
          {cartCount > 0 && !isCartOpen && (
            <div className="md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm animate-fade-in">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="w-full bg-[#D97736] text-white px-6 py-4 rounded-3xl font-bold text-lg shadow-[0_10px_30px_rgba(217,119,54,0.4)] flex items-center justify-between active:scale-95 transition-transform"
              >
                <span className="flex items-center gap-2">
                  🛒 View Order ({cartCount})
                </span>
                <span>${cartTotal.toFixed(2)}</span>
              </button>
            </div>
          )}

          <CartDrawer 
            cart={cart} 
            setCart={setCart} 
            isCartOpen={isCartOpen} 
            setIsCartOpen={setIsCartOpen}
            setEditingItem={setEditingItem}
            t={t} 
            user={user}
            setUser={setUser}
            lang={lang}
          />
          
          <OptionsModal 
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={handleSaveItem}
            lang={lang}
          />
        </div>
      </div>
    </div>
  )
}
