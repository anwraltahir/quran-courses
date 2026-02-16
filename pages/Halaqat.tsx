import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { store } from '../store';
import { 
  Users, 
  Edit3, 
  CheckSquare, 
  Settings,
  BarChart2,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Halaqat: React.FC = () => {
  const user = store.currentUser!;
  // Get all halaqat for the org
  const activeCourse = store.getCourses(user.orgId)[0];
  const halaqat = activeCourse ? store.getHalaqat(activeCourse.id) : [];

  // Mock Data for the Sketch 2 Bar Chart
  const chartData = [
    { name: 'اليوم', value: 85 },
    { name: 'الأسبوع', value: 72 },
    { name: 'الشهر', value: 90 },
    { name: 'الدورة', value: 78 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: Stats (Sketch 2) */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
              <BarChart2 size={20} className="text-primary-500" />
              نسبة الحفظ والتسميع
            </h3>
            
            {/* Sketch 2: Filter Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
               <span className="text-sm text-slate-500">التقرير بحسب:</span>
               <select className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer">
                 <option>الطالب</option>
                 <option>الحلقة</option>
                 <option>المحفظ</option>
               </select>
            </div>
          </div>

          {/* Sketch 2: Bar Chart */}
          <div className="h-64 w-full bg-white border-2 border-slate-100 rounded-xl p-4 flex items-end justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" fill="#15803d" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </Card>

        {/* Sketch 3: Halaqa Details (Action Area) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {halaqat.map(halaqa => (
             <div key={halaqa.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                 <h4 className="font-bold text-lg text-slate-800">{halaqa.name}</h4>
                 <Badge variant="neutral">{halaqa.capacity} طالب</Badge>
               </div>
               
               {/* Sketch 3: Buttons */}
               <div className="space-y-3">
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-xs flex items-center justify-center gap-1">
                      <Settings size={14} />
                      تعديل الحلقة
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs flex items-center justify-center gap-1">
                      <Users size={14} />
                      تعديل الطلاب
                    </Button>
                 </div>
                 <Button className="w-full" size="sm">
                   <CheckSquare size={16} className="ml-2" />
                   رصد الحضور والتسميع
                 </Button>
               </div>
             </div>
           ))}
         </div>
      </div>

      {/* RIGHT COLUMN: Sidebar Summary (Sketch 3 Sidebar) */}
      <div className="lg:col-span-1">
        <div className="bg-primary-900 text-white rounded-2xl p-6 h-full relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
             <Users size={120} />
           </div>
           
           <h3 className="text-2xl font-bold mb-8 relative z-10">الحلقات</h3>
           
           <div className="space-y-6 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-primary-100 text-sm mb-1">عدد الحلقات الكلي</p>
                <p className="text-3xl font-bold">{halaqat.length}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                 <p className="text-primary-100 text-sm mb-1">عدد الطلاب</p>
                 <p className="text-3xl font-bold">{store.getStudents(user.orgId, activeCourse?.id).length}</p>
              </div>

              <div className="pt-8">
                <Button className="w-full bg-white text-primary-900 hover:bg-primary-50">
                   + إضافة حلقة جديدة
                </Button>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};