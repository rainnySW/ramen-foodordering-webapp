import { useState, useEffect } from 'react';

export default function OptionsModal({ item, onClose, onSave, lang, t }) {
  // If no item, don't render
  if (!item) return null;

  const isEdit = !!item.uid; // If it has uid, it's already in the cart

  // Initialize options based on existing item.options or defaults
  const [size, setSize] = useState(item.options?.size || 'Normal');
  const [extras, setExtras] = useState(item.options?.extras || []);
  const [sauce, setSauce] = useState(item.options?.sauce || 'None');
  const [sweetness, setSweetness] = useState(item.options?.sweetness || '100%');

  // Compute the current price
  let currentPrice = item.basePrice || item.price; // fallback to item.price if basePrice is missing
  
  // Example pricing logic based on category
  const isRamen = item.category === 'Ramen';
  const isSides = item.category === 'Sides';
  const isDrinks = item.category === 'Drinks';

  if (size === 'Special') {
    currentPrice += 20; // Add 20 THB for Special size
  } else if (size === 'Super Special') {
    currentPrice += 40; // Add 40 THB for Super Special size
  }

  extras.forEach(ext => {
    if (ext === 'Add Egg') currentPrice += 15;
    if (ext === 'Extra Chashu') currentPrice += 25;
  });

  const toggleExtra = (ext) => {
    if (extras.includes(ext)) {
      setExtras(extras.filter(e => e !== ext));
    } else {
      setExtras([...extras, ext]);
    }
  };

  const handleSave = () => {
    onSave({
      ...item,
      price: currentPrice, // Update the price based on options
      basePrice: item.basePrice || item.price, // Keep track of base price
      options: {
        size: (isRamen || isSides) ? size : null,
        extras: isRamen ? extras : [],
        sauce: isSides ? sauce : null,
        sweetness: isDrinks ? sweetness : null
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-[#FAF6F0] dark:bg-[#2A2421] w-full sm:w-[500px] max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl transition-transform transform translate-y-0 p-6 flex flex-col animate-slide-up-panel">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isEdit ? t('editOptions') : t('customize')}</h2>
          <button onClick={onClose} className="p-2 bg-white dark:bg-[#38302C] rounded-full hover:scale-110 transition-transform">✕</button>
        </div>

        <h3 className="text-xl font-bold mb-1 text-[#D97736]">{lang === 'th' && item.name_th ? item.name_th : item.name}</h3>
        <p className="opacity-70 text-sm mb-6">{lang === 'th' && item.description_th ? item.description_th : item.description}</p>

        {/* Options based on category */}
        {(isRamen || isSides) && (
          <div className="mb-6">
            <h4 className="font-bold mb-3 uppercase text-sm tracking-wider opacity-60">{t('size')}</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-4 bg-white dark:bg-[#38302C] rounded-2xl cursor-pointer shadow-sm hover:ring-2 hover:ring-[#D97736] transition-all">
                <div className="flex items-center gap-3">
                  <input type="radio" name="size" value="Normal" checked={size === 'Normal'} onChange={() => setSize('Normal')} className="w-5 h-5 accent-[#D97736]" />
                  <span className="font-semibold">{t('normal')}</span>
                </div>
                <span className="opacity-70">{t('included')}</span>
              </label>
              <label className="flex items-center justify-between p-4 bg-white dark:bg-[#38302C] rounded-2xl cursor-pointer shadow-sm hover:ring-2 hover:ring-[#D97736] transition-all">
                <div className="flex items-center gap-3">
                  <input type="radio" name="size" value="Special" checked={size === 'Special'} onChange={() => setSize('Special')} className="w-5 h-5 accent-[#D97736]" />
                  <span className="font-semibold">{t('special')}</span>
                </div>
                <span className="opacity-70">+฿20</span>
              </label>
              {isSides && (
                <label className="flex items-center justify-between p-4 bg-white dark:bg-[#38302C] rounded-2xl cursor-pointer shadow-sm hover:ring-2 hover:ring-[#D97736] transition-all">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="size" value="Super Special" checked={size === 'Super Special'} onChange={() => setSize('Super Special')} className="w-5 h-5 accent-[#D97736]" />
                    <span className="font-semibold">{t('superSpecial')}</span>
                  </div>
                  <span className="opacity-70">+฿40</span>
                </label>
              )}
            </div>
          </div>
        )}

        {isRamen && (
          <div className="mb-6">
            <h4 className="font-bold mb-3 uppercase text-sm tracking-wider opacity-60">{t('extras')}</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-4 bg-white dark:bg-[#38302C] rounded-2xl cursor-pointer shadow-sm hover:ring-2 hover:ring-[#D97736] transition-all">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={extras.includes('Add Egg')} onChange={() => toggleExtra('Add Egg')} className="w-5 h-5 accent-[#D97736] rounded" />
                  <span className="font-semibold">{t('addEgg')}</span>
                </div>
                <span className="opacity-70">+฿15</span>
              </label>
              <label className="flex items-center justify-between p-4 bg-white dark:bg-[#38302C] rounded-2xl cursor-pointer shadow-sm hover:ring-2 hover:ring-[#D97736] transition-all">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={extras.includes('Extra Chashu')} onChange={() => toggleExtra('Extra Chashu')} className="w-5 h-5 accent-[#D97736] rounded" />
                  <span className="font-semibold">{t('extraChashu')}</span>
                </div>
                <span className="opacity-70">+฿25</span>
              </label>
            </div>
          </div>
        )}

        {isSides && (
          <div className="mb-6">
            <h4 className="font-bold mb-3 uppercase text-sm tracking-wider opacity-60">{t('sauce')}</h4>
            <div className="flex gap-4">
              {['None', 'Ketchup', 'Mayo'].map(s => (
                <label key={s} className="flex-1 flex items-center justify-center p-3 bg-white dark:bg-[#38302C] rounded-2xl cursor-pointer shadow-sm hover:ring-2 hover:ring-[#D97736] transition-all">
                  <input type="radio" name="sauce" value={s} checked={sauce === s} onChange={() => setSauce(s)} className="hidden" />
                  <span className={`font-semibold ${sauce === s ? 'text-[#D97736]' : ''}`}>
                    {s === 'None' ? t('none') : s === 'Ketchup' ? t('ketchup') : s === 'Mayo' ? t('mayo') : s}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {isDrinks && (
          <div className="mb-6">
            <h4 className="font-bold mb-3 uppercase text-sm tracking-wider opacity-60">{t('sweetness')}</h4>
            <div className="flex gap-4">
              {['0%', '50%', '100%'].map(s => (
                <label key={s} className="flex-1 flex items-center justify-center p-3 bg-white dark:bg-[#38302C] rounded-2xl cursor-pointer shadow-sm hover:ring-2 hover:ring-[#D97736] transition-all">
                  <input type="radio" name="sweetness" value={s} checked={sweetness === s} onChange={() => setSweetness(s)} className="hidden" />
                  <span className={`font-semibold ${sweetness === s ? 'text-[#D97736]' : ''}`}>{s}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <button 
            onClick={handleSave}
            className="w-full bg-[#D97736] text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_15px_rgba(217,119,54,0.3)] flex justify-between px-6"
          >
            <span>{isEdit ? t('updateOrder') : t('addToOrder')}</span>
            <span>฿{currentPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
