import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout';
import { Halaqat } from './pages/Halaqat';
import { Reports } from './pages/Reports'; // This is Certificates
import { Analytics } from './pages/Analytics'; // This is the new "Reports" page per sketch
import { Messages } from './pages/Messages';
import { store } from './store';
import { Role } from './types';
import { Button, Card, Input, Logo } from './components/ui';

const App = () => {
  // Default page is now Halaqat since Dashboard is removed
  const [currentPage, setCurrentPage] = useState('halaqat');
  const [user, setUser] = useState(store.currentUser);
  
  // Login State
  const [loginType, setLoginType] = useState<'admin' | 'teacher'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === 'admin') {
      setUser(store.login(Role.ORG_ADMIN));
      setCurrentPage('halaqat'); // Redirect to Halaqat
    } else {
      setUser(store.login(Role.TEACHER));
      setCurrentPage('halaqat'); // Redirect to Halaqat
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
        <div className="w-full max-w-sm flex flex-col items-center">
          
          {/* Logo and Branding - Splash Screen Identity */}
          {/* Updated to use size="responsive" to match specific requirement: max-height 50px mobile / 70px desktop */}
          <div className="mb-8 flex flex-col items-center gap-4">
             <Logo size="responsive" className="drop-shadow-sm" /> 
             <div className="text-center">
               <h1 className="text-2xl font-bold text-primary-900 font-sans">المنصة القرآنية</h1>
               <p className="text-gold-500 font-medium text-sm">الإدارة الذكية لحلقات التحفيظ</p>
             </div>
          </div>

          <Card className="overflow-hidden border border-slate-300 shadow-xl rounded-2xl w-full">
            <div className="flex border-b border-slate-200">
              <button
                className={`flex-1 py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  loginType === 'admin' 
                    ? 'bg-white text-primary-700 border-b-2 border-primary-600' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
                onClick={() => setLoginType('admin')}
              >
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs border-current">1</span>
                دخول إداري
              </button>
              <button
                className={`flex-1 py-4 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  loginType === 'teacher' 
                    ? 'bg-white text-primary-700 border-b-2 border-primary-600' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
                onClick={() => setLoginType('teacher')}
              >
                 <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs border-current">2</span>
                دخول محفظ
              </button>
            </div>

            <div className="p-8 py-10">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-600">Username</label>
                  <div className="relative">
                     <input 
                        type="text" 
                        className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500 transition-colors"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                     />
                  </div>
                </div>

                 <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-600">Password</label>
                  <div className="relative">
                     <input 
                        type="password" 
                        className="w-full border-2 border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500 transition-colors"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                     />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full py-6 rounded-xl text-lg bg-primary-700 hover:bg-primary-800 shadow-lg shadow-primary-200">
                    تسجيل الدخول
                  </Button>
                </div>

                <div className="text-center">
                  <button type="button" className="text-sm text-slate-400 hover:text-primary-600 font-medium">
                    (Create Account) إنشاء حساب
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'halaqat': return <Halaqat />;
      case 'analytics': return <Analytics />;
      case 'messages': return <Messages />;
      case 'reports': return <Reports />;
      default: return <Halaqat />;
    }
  };

  return (
    <Layout userRole={user.role} onNavigate={setCurrentPage} currentPage={currentPage}>
      {renderPage()}
    </Layout>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);