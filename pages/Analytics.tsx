import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../components/ui';
import { store } from '../store';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Filter, Search } from 'lucide-react';

export const Analytics: React.FC = () => {
  const [filterBy, setFilterBy] = useState('student');
  const [period, setPeriod] = useState('today');
  
  // Mock data for the chart based on sketch
  const data = [
    { name: '1', value: 30 },
    { name: '2', value: 45 },
    { name: '3', value: 20 },
    { name: '4', value: 60 },
    { name: '5', value: 80 },
    { name: '6', value: 55 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
      
      {/* Left Column: The Chart (Matches Sketch Layout) */}
      <div className="lg:col-span-3">
        <Card className="h-full min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
               {period === 'today' && 'إحصائيات اليوم'}
               {period === 'week' && 'إحصائيات الأسبوع'}
               {period === 'month' && 'إحصائيات الشهر'}
               {period === 'course' && 'إحصائيات الدورة كاملة'}
            </h3>
            <span className="text-sm text-slate-400">عدد الصفحات / الدرجات</span>
          </div>
          
          <div className="flex-1 w-full min-h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                 <Bar dataKey="value" fill="#15803d" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Right Column: Sidebar Controls (Matches Sketch Sidebar) */}
      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-full shadow-sm flex flex-col gap-6">
           <div>
             <h2 className="text-2xl font-bold text-slate-800 mb-6">التقارير</h2>
             
             {/* 1. Report By */}
             <div className="space-y-2 mb-6">
               <label className="text-sm font-medium text-slate-600">التقرير بحسب:</label>
               <select 
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-primary-500"
                 value={filterBy}
                 onChange={(e) => setFilterBy(e.target.value)}
               >
                 <option value="student">طالب</option>
                 <option value="halaqa">حلقة</option>
                 <option value="teacher">محفظ</option>
               </select>
             </div>

             {/* 2. Search Input */}
             {filterBy === 'student' && (
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-slate-600">طالب:</label>
                  <div className="relative">
                    <Search className="absolute right-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="بحث عن طالب..." 
                      className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
             )}

             {/* 3. Period Selection (Radio-like list from sketch) */}
             <div className="space-y-3">
               <label className="text-sm font-medium text-slate-600 block">الفترة:</label>
               
               {[
                 { id: 'today', label: 'الحفظ - اليوم' },
                 { id: 'week', label: 'الحفظ - الأسبوع' },
                 { id: 'month', label: 'الحفظ - الشهر' },
                 { id: 'course', label: 'الدورة كاملة' },
               ].map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setPeriod(opt.id)}
                   className={`w-full text-right px-4 py-3 rounded-lg border transition-all ${
                     period === opt.id 
                       ? 'bg-primary-50 border-primary-500 text-primary-700 font-bold' 
                       : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                   }`}
                 >
                   {opt.label}
                 </button>
               ))}
             </div>
           </div>

           <div className="mt-auto pt-6 border-t border-slate-100">
             <Button className="w-full py-3 text-lg">
               (اختيار) عرض
             </Button>
           </div>
        </div>
      </div>

    </div>
  );
};