import React, { useState } from 'react';
import { 
  FileText, 
  LogOut, 
  Menu,
  MessageSquare,
  Circle,
  BarChart3
} from 'lucide-react';
import { store } from '../store';
import { Role } from '../types';
import { Logo } from './ui';

interface LayoutProps {
  children: React.ReactNode;
  userRole: Role;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, userRole, onNavigate, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Updated menu: Added 'Analytics' (التقارير)
  const menuItems = [
    // 1. الحلقات (Halaqat)
    { id: 'halaqat', label: 'الحلقات', icon: Circle, roles: [Role.PLATFORM_ADMIN, Role.ORG_ADMIN, Role.COORDINATOR, Role.TEACHER] },
    
    // 2. التقارير (Analytics - New)
    { id: 'analytics', label: 'التقارير', icon: BarChart3, roles: [Role.PLATFORM_ADMIN, Role.ORG_ADMIN, Role.COORDINATOR] },

    // 3. الرسائل (Messages)
    { id: 'messages', label: 'الرسائل', icon: MessageSquare, roles: [Role.PLATFORM_ADMIN, Role.ORG_ADMIN, Role.COORDINATOR, Role.TEACHER] },

    // 4. الشهادات (Certificates)
    { id: 'reports', label: 'الشهادات', icon: FileText, roles: [Role.PLATFORM_ADMIN, Role.ORG_ADMIN, Role.COORDINATOR] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-l border-slate-200 text-slate-700 transition-all duration-300 flex flex-col fixed h-full z-20 shadow-sm`}>
        <div className="h-24 flex items-center gap-4 px-6 border-b border-slate-100 overflow-hidden">
           {/* Responsive logo size: 50px mobile, 70px desktop */}
           <Logo size="responsive" />
           {sidebarOpen && (
             <div className="flex flex-col">
               <span className="font-bold text-lg text-primary-700 leading-tight">المنصة القرآنية</span>
               <span className="text-xs text-gold-500 font-semibold">الإدارة الذكية</span>
             </div>
           )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-auto p-1 hover:bg-slate-100 rounded text-slate-400 lg:hidden">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                currentPage === item.id 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <item.icon size={22} strokeWidth={1.5} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button 
             onClick={() => window.location.reload()} 
             className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
           >
             <LogOut size={20} />
             {sidebarOpen && <span>تسجيل خروج</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-20'}`}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">
            {menuItems.find(i => i.id === currentPage)?.label || 'الرئيسية'}
          </h1>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-bold text-slate-800">{store.currentUser?.name}</span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1">{store.currentUser?.role}</span>
             </div>
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
               {store.currentUser?.name.charAt(0)}
             </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};