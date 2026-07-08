import { useState, useEffect } from 'react';

export default function CartDrawer({ cart, setCart, isCartOpen, setIsCartOpen, setEditingItem, t, user, setUser, lang }) {
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, checkout, confirm, slip, clear_confirm
  const [tableNumber, setTableNumber] = useState('');
  const [paymentOption, setPaymentOption] = useState('Transfer');
  const [paymentSlip, setPaymentSlip] = useState(''); // boolean mock
  
  // Sync tableNumber from user when opened
  useEffect(() => {
    if (isCartOpen && user?.tableNumber) {
      setTableNumber(user.tableNumber);
    }
  }, [isCartOpen, user]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQtyChange = (uid, delta) => {
    setCart(prev => prev.map(item => {
      if (item.uid === uid) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!tableNumber) return;
    setUser({ ...user, tableNumber }); // Save table globally
    setCheckoutStep('confirm');
  };

  const handleConfirmProceed = async () => {
    try {
      // Send to MongoDB
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: cartTotal,
          table: tableNumber,
          paymentMethod: paymentOption,
          status: 'Pending'
        })
      });

      setUser(prev => ({ ...prev, orderCount: (prev.orderCount || 0) + 1 }));
      setCheckoutStep('slip'); // Show the restaurant slip
    } catch (error) {
      console.error(error);
      setCheckoutStep('slip'); // fallback if API fails
    }
  };

  const closeCart = () => {
    setIsCartOpen(false); 
    setTimeout(() => {
      if (checkoutStep === 'slip') {
        setCart([]); // Clear cart only after slip is closed
        setPaymentSlip('');
      }
      setCheckoutStep('cart');
    }, 300);
  };

  // Drawer classes handling PC/Mobile differently
  const overlayClasses = `fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;
  const panelClasses = `absolute bottom-0 md:top-0 md:bottom-auto md:right-0 w-full md:w-[450px] h-[85vh] md:h-screen bg-[#FAF6F0] dark:bg-[#2A2421] md:rounded-l-3xl rounded-t-3xl md:rounded-tr-none shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isCartOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`;

  return (
    <div className={overlayClasses}>
      <div className={panelClasses}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-2xl font-bold">
            {checkoutStep === 'cart' ? t('yourOrder') : checkoutStep === 'checkout' ? t('checkoutTitle') : checkoutStep === 'confirm' ? t('confirmTitle') : checkoutStep === 'clear_confirm' ? t('clearCartTitle') : t('receiptTitle')}
          </h2>
          <div className="flex items-center gap-2">
            {cart.length > 0 && checkoutStep === 'cart' && (
              <button
                onClick={() => setCheckoutStep('clear_confirm')}
                className="text-red-500 font-bold px-4 py-1.5 bg-red-50 dark:bg-red-950/30 rounded-full hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors text-sm"
              >
                {t('clear')}
              </button>
            )}
            <button 
              onClick={closeCart} 
              className="p-2 bg-white dark:bg-[#38302C] rounded-full hover:scale-110 transition-transform"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 && checkoutStep === 'cart' ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
              <span className="text-6xl">🛒</span>
              <p>{t('emptyCart')}</p>
            </div>
          ) : checkoutStep === 'cart' ? (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.uid} className="flex flex-col bg-white dark:bg-[#38302C] p-4 rounded-2xl shadow-[0_4px_15px_rgba(74,59,50,0.05)] border border-transparent dark:border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
                      <p className="text-sm opacity-70">฿{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#FAF6F0] dark:bg-[#1A1A1A] rounded-full px-2 py-1">
                      <button onClick={() => handleQtyChange(item.uid, -1)} className="w-8 h-8 rounded-full bg-white dark:bg-[#38302C] font-bold hover:scale-105 active:scale-95 transition-all shadow-sm">-</button>
                      <span className="font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => handleQtyChange(item.uid, 1)} className="w-8 h-8 rounded-full bg-white dark:bg-[#38302C] font-bold hover:scale-105 active:scale-95 transition-all shadow-sm">+</button>
                    </div>
                  </div>
                  
                  {/* Options Display & Edit Button */}
                  {(item.options?.size || item.options?.extras?.length > 0 || item.options?.sauce || item.options?.sweetness) ? (
                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-100 dark:border-white/5 text-sm">
                      <div className="opacity-70 flex-1">
                        {item.options.size && <div>Size: {item.options.size}</div>}
                        {item.options.extras?.length > 0 && <div>Extras: {item.options.extras.join(', ')}</div>}
                        {item.options.sauce && item.options.sauce !== 'None' && <div>Sauce: {item.options.sauce}</div>}
                        {item.options.sweetness && <div>Sweetness: {item.options.sweetness}</div>}
                      </div>
                      <button onClick={() => setEditingItem(item)} className="text-[#D97736] font-semibold hover:underline bg-[#D97736]/10 px-3 py-1 rounded-xl">{t('edit')}</button>
                    </div>
                  ) : (
                    <div className="flex justify-end mt-2 pt-2 border-t border-gray-100 dark:border-white/5 text-sm">
                      <button onClick={() => setEditingItem(item)} className="text-[#D97736] font-semibold hover:underline bg-[#D97736]/10 px-3 py-1 rounded-xl">Edit Options</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : checkoutStep === 'checkout' ? (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label className="block font-bold mb-2">{t('tableNumber')}</label>
                <input 
                  type="number" 
                  required 
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full bg-white dark:bg-[#38302C] px-4 py-4 rounded-2xl border-none focus:ring-2 focus:ring-[#D97736] outline-none shadow-sm text-lg font-semibold"
                  placeholder={t('tablePlaceholder')}
                />
              </div>

              <div>
                <label className="block font-bold mb-3">{t('paymentOption')}</label>
                <div className="flex gap-3">
                  {['Transfer', 'Scan QR'].map(opt => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setPaymentOption(opt)}
                      className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${paymentOption === opt ? 'bg-[#D97736] text-white border-[#D97736] shadow-md' : 'bg-transparent text-[#4A3B32] dark:text-white border-gray-300 dark:border-gray-600'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {paymentOption === 'Transfer' && (
                <div>
                  <label className="block font-bold mb-2">{t('uploadSlipTitle')}</label>
                  <div 
                    onClick={() => setPaymentSlip('uploaded')}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${paymentSlip ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-[#D97736] hover:bg-[#D97736]/5'}`}
                  >
                    <span className="text-4xl block mb-2">{paymentSlip ? '✅' : '📸'}</span>
                    <p className="text-sm font-semibold opacity-70">
                      {paymentSlip ? t('slipAttached') : t('uploadSlipDesc')}
                    </p>
                  </div>
                </div>
              )}
              {paymentOption === 'Scan QR' && (
                <div className="bg-white dark:bg-[#38302C] rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 mx-auto rounded-xl flex items-center justify-center mb-4">
                    <span className="text-3xl">QR</span>
                  </div>
                  <p className="font-bold text-[#D97736]">{t('scanQRTitle')}</p>
                  <p className="text-sm opacity-70 mt-1">{t('total')}: ฿{cartTotal.toFixed(2)}</p>
                </div>
              )}
            </form>
          ) : checkoutStep === 'confirm' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              <span className="text-6xl">🤔</span>
              <h3 className="text-2xl font-bold">{t('readyToOrder')}</h3>
              <p className="opacity-70">{t('table')}: <span className="font-bold text-[#D97736]">{tableNumber}</span> | {t('paidVia')} <span className="font-bold text-[#D97736]">{paymentOption}</span></p>
              
              <div className="w-full space-y-3 mt-4">
                <button 
                  onClick={handleConfirmProceed}
                  className="w-full bg-[#D97736] text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_15px_rgba(217,119,54,0.3)]"
                >
                  {t('sendToKitchen')}
                </button>
                <button 
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full bg-gray-200 dark:bg-[#38302C] text-[#4A3B32] dark:text-white py-4 rounded-2xl font-bold text-lg hover:opacity-80 active:scale-95 transition-all"
                >
                  {t('goBack')}
                </button>
              </div>
            </div>
          ) : checkoutStep === 'clear_confirm' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              <span className="text-6xl">🗑️</span>
              <h3 className="text-2xl font-bold">Are you sure?</h3>
              <p className="opacity-70">{t('areYouSureClear')}</p>
              
              <div className="w-full space-y-3 mt-4">
                <button 
                  onClick={() => {
                    setCart([]);
                    setCheckoutStep('cart');
                  }}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_15px_rgba(239,68,68,0.3)]"
                >
                  {t('proceed')}
                </button>
                <button 
                  onClick={() => setCheckoutStep('cart')}
                  className="w-full bg-gray-200 dark:bg-[#38302C] text-[#4A3B32] dark:text-white py-4 rounded-2xl font-bold text-lg hover:opacity-80 active:scale-95 transition-all"
                >
                  {t('nevermind')}
                </button>
              </div>
            </div>
          ) : checkoutStep === 'slip' ? (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in pt-10">
              <div className="w-full bg-white dark:bg-[#EAE1D9] text-[#4A3B32] rounded-none p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-t-[12px] border-[#D97736] relative overflow-hidden" 
                   style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e5e7eb 28px)', backgroundSize: '100% 28px', lineHeight: '28px' }}>
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>
                <div className="text-center font-bold text-2xl mb-1 mt-4 uppercase tracking-widest text-[#4A3B32]">{t('restaurantName')}</div>
                <div className="text-center text-sm font-semibold opacity-60 mb-6 tracking-widest">ORDER SLIP</div>
                
                <div className="text-sm font-bold bg-[#4A3B32]/5 p-2 rounded mb-4 text-center border border-[#4A3B32]/10">
                  {t('table')}: <span className="text-[#D97736]">{tableNumber}</span> | {t('paymentOption')}: {paymentOption}
                </div>
                
                <div className="border-t-2 border-dashed border-[#4A3B32]/30 my-4"></div>
                
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.uid} className="flex justify-between text-sm font-medium">
                      <span className="flex-1 truncate pr-2 leading-none mt-2">
                        {item.quantity}x {lang === 'th' && item.name_th ? item.name_th : item.name}
                      </span>
                      <span className="leading-none mt-2">฿{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-dashed border-[#4A3B32]/30 my-4"></div>
                
                <div className="flex justify-between font-extrabold text-xl text-[#D97736]">
                  <span>{t('total').toUpperCase()}</span>
                  <span>฿{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="text-center mt-8 mb-2 text-xs font-bold uppercase tracking-wider bg-[#D97736] text-white py-2 rounded shadow-sm opacity-90">
                  ✓ {t('orderSent')}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && checkoutStep !== 'slip' && checkoutStep !== 'confirm' && checkoutStep !== 'clear_confirm' && (
          <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#2A2421]">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="opacity-70 font-semibold">{t('total')}</span>
              <span className="text-2xl font-bold text-[#D97736]">฿{cartTotal.toFixed(2)}</span>
            </div>
            {checkoutStep === 'cart' ? (
              <button 
                onClick={() => setCheckoutStep('checkout')}
                className="w-full bg-[#D97736] text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_15px_rgba(217,119,54,0.3)] flex justify-center items-center gap-2"
              >
                {t('proceedToPayment')}
              </button>
            ) : checkoutStep === 'checkout' ? (
              <div className="flex gap-3">
                <button 
                  onClick={() => setCheckoutStep('cart')}
                  className="w-1/3 bg-[#FAF6F0] dark:bg-[#38302C] py-4 rounded-2xl font-bold hover:opacity-80 active:scale-95 transition-all"
                >
                  {t('goBack')}
                </button>
                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={paymentOption === 'Transfer' && !paymentSlip}
                  className="w-2/3 bg-[#D97736] text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all flex justify-center items-center gap-2 shadow-[0_4px_15px_rgba(217,119,54,0.3)] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
                >
                  {t('proceed')}
                </button>
              </div>
            ) : null}
          </div>
        )}

        {checkoutStep === 'slip' && (
          <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#2A2421]">
             <button 
                onClick={closeCart}
                className="w-full bg-[#4A3B32] dark:bg-white text-white dark:text-[#4A3B32] py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-md flex justify-center items-center gap-2"
              >
                {t('closeAndStartNew')}
              </button>
          </div>
        )}
      </div>
    </div>
  );
}
