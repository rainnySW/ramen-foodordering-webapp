import Head from 'next/head';
import { useState, useEffect } from 'react';

const AuthForm = ({ user, setUser, t, setIsDark, setLang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    // When signing up, pass the existing guest preferences so we don't lose them
    const body = isLogin ? { email, password } : { name, email, password, preferences: user?.preferences };
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setUser(data);
      localStorage.setItem('userId', data._id);
      
      if (data.preferences?.ThemeSetting) {
        setIsDark(data.preferences.ThemeSetting === 'dark');
      }
      if (data.preferences?.LanguageSetting) {
        setLang(data.preferences.LanguageSetting);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white dark:bg-[#38302C] rounded-[32px] p-8 shadow-[0_10px_40px_-10px_rgba(74,59,50,0.08)] dark:shadow-none border border-transparent dark:border-white/5 mb-8 text-center max-w-md mx-auto">
      <div className="text-6xl mb-6">🍜</div>
      <h2 className="text-2xl font-bold mb-2 text-[#4A3B32] dark:text-[#F5EFE6]">
        {isLogin ? 'Welcome Back!' : `Join ${t('restaurantName')}`}
      </h2>
      <p className="opacity-60 mb-6 text-sm">
        {isLogin ? 'Sign in to access your orders' : 'Create an account to save preferences'}
      </p>

      {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm font-bold">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {!isLogin && (
          <div>
            <label className="block text-sm font-bold mb-1 opacity-70">Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#2A2421] text-[#4A3B32] dark:text-white border-none focus:ring-2 focus:ring-[#D97736] outline-none" placeholder="Ramen Lover" />
          </div>
        )}
        <div>
          <label className="block text-sm font-bold mb-1 opacity-70">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#2A2421] text-[#4A3B32] dark:text-white border-none focus:ring-2 focus:ring-[#D97736] outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 opacity-70">Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-[#2A2421] text-[#4A3B32] dark:text-white border-none focus:ring-2 focus:ring-[#D97736] outline-none" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-[#D97736] text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-md mt-2">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      <p className="mt-6 text-sm opacity-60">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#D97736] hover:underline">
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
      <div className="mt-4 text-xs opacity-40">
        You can still order food without an account by returning to the Menu.
      </div>
    </div>
  );
};

export default function Account({ isDark, setIsDark, user, setUser, lang, setLang, t }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempTable, setTempTable] = useState('');

  useEffect(() => {
    if (user) {
      setTempName(user.name || 'Ramen Lover');
      setTempTable(user.tableNumber || '');
    }
  }, [user]);

  const saveProfile = async () => {
    const updatedData = { name: tempName, tableNumber: tempTable };
    setUser({ ...user, ...updatedData });
    setIsEditingProfile(false);
    
    if (user && user._id) {
      try {
        await fetch(`/api/users/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });
      } catch(e) { console.error(e) }
    }
  };

  const handleThemeChange = async () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (user && user._id) {
      const updatedPrefs = { 
        ThemeSetting: newDark ? 'dark' : 'light',
        LanguageSetting: user.preferences?.LanguageSetting || lang
      };
      setUser({ ...user, preferences: updatedPrefs });
      try {
        await fetch(`/api/users/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: updatedPrefs })
        });
      } catch(e) {}
    }
  };

  const handleLangChange = async (newLang) => {
    setLang(newLang);
    if (user && user._id) {
      const updatedPrefs = { 
        ThemeSetting: user.preferences?.ThemeSetting || (isDark ? 'dark' : 'light'),
        LanguageSetting: newLang 
      };
      setUser({ ...user, preferences: updatedPrefs });
      try {
        await fetch(`/api/users/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: updatedPrefs })
        });
      } catch(e) {}
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('localUser');
    
    // Create a fresh guest profile instantly
    try {
      const res = await fetch('/api/users', { method: 'POST' });
      if (res.ok) {
        const newUser = await res.json();
        setUser(newUser);
        localStorage.setItem('userId', newUser._id);
      } else {
        throw new Error('Fallback');
      }
    } catch (e) {
      const dummyGuest = { 
        _id: 'local_guest', name: 'Ramen Lover', isRegistered: false, tableNumber: null, orderCount: 0, 
        preferences: { LanguageSetting: 'en', ThemeSetting: 'light' } 
      };
      setUser(dummyGuest);
      localStorage.setItem('localUser', JSON.stringify(dummyGuest));
    }
  };

  return (
    <>
      <Head>
        <title>{t('restaurantName')} - Account</title>
      </Head>
      <main className="p-4 md:p-10 max-w-4xl mx-auto pb-32 md:pb-10 pt-10 min-h-screen animate-fade-in-up">
        
        <h1 className="text-4xl md:text-5xl font-bold text-[#4A3B32] dark:text-[#F5EFE6] tracking-tight mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97736] to-orange-400">
            {t('profile')}
          </span>
        </h1>

        {(!user || !user.isRegistered) ? (
          <AuthForm user={user} setUser={setUser} t={t} setIsDark={setIsDark} setLang={setLang} />
        ) : (
          <div className="bg-white dark:bg-[#38302C] rounded-[32px] p-8 shadow-[0_10px_40px_-10px_rgba(74,59,50,0.08)] dark:shadow-none border border-transparent dark:border-white/5 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#FFDDBF] dark:bg-gray-700 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <span className="text-5xl md:text-6xl">👤</span>
              </div>
              <button onClick={() => setIsEditingProfile(true)} className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-[#D97736] text-white rounded-full flex items-center justify-center border-4 border-white dark:border-[#38302C] hover:scale-105 active:scale-95 transition-all shadow-md">
                <span className="text-sm">✏️</span>
              </button>
            </div>
            
            <div className="text-center md:text-left flex-1">
              {isEditingProfile ? (
                <div className="flex flex-col gap-3 justify-center md:justify-start items-center md:items-start mb-4">
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-48 px-3 py-2 rounded-xl bg-gray-100 dark:bg-[#2A2421] text-[#4A3B32] dark:text-white border-none focus:ring-2 focus:ring-[#D97736] outline-none font-bold"
                    placeholder="Your Name"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#4A3B32] dark:text-[#F5EFE6]">Table:</span>
                    <input 
                      type="number" 
                      value={tempTable}
                      onChange={(e) => setTempTable(e.target.value)}
                      className="w-20 px-3 py-2 rounded-xl bg-gray-100 dark:bg-[#2A2421] text-[#4A3B32] dark:text-white border-none focus:ring-2 focus:ring-[#D97736] outline-none font-bold"
                      placeholder="No."
                    />
                  </div>
                  <button onClick={saveProfile} className="bg-[#D97736] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all w-full md:w-auto mt-2">
                    {t('save')}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#4A3B32] dark:text-[#F5EFE6] mb-1">{user?.name || 'Ramen Lover'}</h2>
                  <p className="opacity-60 text-sm md:text-base text-[#4A3B32] dark:text-[#F5EFE6] mb-4">
                    {user?.tableNumber ? `${t('table')} ${user.tableNumber}` : t('tableNotSet')} • {user?.orderCount || 0} {t('ordersThisMonth')}
                    <button onClick={() => setIsEditingProfile(true)} className="ml-2 underline text-[#D97736] hover:text-orange-400">{t('edit')}</button>
                  </p>
                </>
              )}
            </div>
            
            <div className="mt-4 md:mt-0">
              <button 
                onClick={handleLogout}
                className="bg-red-50 dark:bg-red-900/20 text-red-500 font-bold px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Settings Section */}
        <div className="bg-white dark:bg-[#38302C] rounded-[32px] p-6 shadow-[0_10px_40px_-10px_rgba(74,59,50,0.08)] dark:shadow-none border border-transparent dark:border-white/5">
          <h3 className="text-xl font-bold text-[#4A3B32] dark:text-[#F5EFE6] mb-6 px-2">{t('appSettings')}</h3>
          
          <div className="flex items-center justify-between p-4 bg-[#FAF6F0] dark:bg-[#2A2421] rounded-2xl mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" onClick={handleThemeChange}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white dark:bg-[#38302C] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xl">{isDark ? '🌙' : '☀️'}</span>
              </div>
              <div>
                <div className="font-bold text-[#4A3B32] dark:text-[#F5EFE6]">{t('theme')}</div>
                <div className="text-xs opacity-60 text-[#4A3B32] dark:text-[#F5EFE6]">{t('themeDesc')}</div>
              </div>
            </div>
            
            <button
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 shrink-0 ${isDark ? 'bg-[#D97736]' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#FAF6F0] dark:bg-[#2A2421] rounded-2xl mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white dark:bg-[#38302C] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xl">🌐</span>
              </div>
              <div>
                <div className="font-bold text-[#4A3B32] dark:text-[#F5EFE6]">{t('language')}</div>
                <div className="text-xs opacity-60 text-[#4A3B32] dark:text-[#F5EFE6]">{t('languageDesc')}</div>
              </div>
            </div>
            
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 relative w-32 shrink-0">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#D97736] rounded-full transition-transform duration-300 shadow-sm z-0 ${lang === 'th' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'}`} 
              />
              <button
                onClick={() => handleLangChange('en')}
                className={`relative z-10 w-1/2 py-1 text-sm font-bold transition-colors duration-300 rounded-full ${lang === 'en' ? 'text-white' : 'text-[#4A3B32] dark:text-[#F5EFE6] opacity-70'}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLangChange('th')}
                className={`relative z-10 w-1/2 py-1 text-sm font-bold transition-colors duration-300 rounded-full ${lang === 'th' ? 'text-white' : 'text-[#4A3B32] dark:text-[#F5EFE6] opacity-70'}`}
              >
                ไทย
              </button>
            </div>
          </div>
          
        </div>

      </main>
    </>
  );
}
