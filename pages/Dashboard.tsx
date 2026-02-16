import React from 'react';
import { Card, Badge, Button, Logo } from '../components/ui';
import { store } from '../store';
import { 
  Plus,
  BookOpen,
  ChevronLeft
} from 'lucide-react';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const user = store.currentUser!;
  const courses = store.getCourses(user.orgId);
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 relative min-h-[600px]">
      
      {/* Sketch 1: Welcome Header */}
      <div className="flex items-center gap-4">
        <Logo size="lg" />
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold text-slate-800">مرحباً {user.name}</h2>
          <p className="text-primary-700 font-medium text-lg">منصة النور القرآني - الإدارة الذكية</p>
        </div>
      </div>

      {/* Sketch 1: List of items (Courses) */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-xl text-slate-700 border-b-2 border-primary-500 pb-1 inline-block">الدورات الحالية</h3>
        </div>

        {courses.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-400">
            لا توجد دورات حالياً
          </div>
        ) : (
          courses.map(course => (
            <div 
              key={course.id} 
              onClick={() => onNavigate && onNavigate('courses')}
              className="group bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-primary-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center group-hover:bg-primary-700 group-hover:text-white transition-colors">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 group-hover:text-primary-700">{course.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <span>{course.type}</span>
                    <span>•</span>
                    <span>{store.getStudents(user.orgId, course.id).length} طالب</span>
                  </div>
                </div>
              </div>
              <ChevronLeft className="text-slate-300 group-hover:text-primary-500 group-hover:-translate-x-1 transition-all" />
            </div>
          ))
        )}
      </div>

      {/* Sketch 1: Floating/Bottom "Add New Course" Button */}
      <div className="fixed bottom-12 left-12 md:absolute md:bottom-0 md:left-0">
        <Button 
          onClick={() => onNavigate && onNavigate('courses')}
          className="rounded-full px-6 py-4 shadow-xl bg-primary-700 text-white font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={24} />
          <span>إضافة دورة جديدة</span>
        </Button>
      </div>

    </div>
  );
};