import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Input, Select } from '../components/ui';
import { store } from '../store';
import { CourseType, Role, Course } from '../types';
import { Plus, Users, Calendar, Settings as SettingsIcon, ArrowLeft, ExternalLink, RefreshCw, FileText, Database, Link, Save } from 'lucide-react';
import { Link2 } from 'lucide-react';

export const Courses: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'settings'>('list');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const user = store.currentUser!;
  const courses = store.getCourses(user.orgId);
  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  
  // Hack for reactivity
  const [_, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  // --- EDIT STATE ---
  const [editForm, setEditForm] = useState<Partial<Course>>({});
  const [editAssets, setEditAssets] = useState({
    formUrl: '',
    sheetUrl: '',
    midtermExamUrl: '',
    finalExamUrl: ''
  });

  useEffect(() => {
    if (selectedCourse) {
      setEditForm(selectedCourse);
      const assets = store.getCourseGoogleAssets(selectedCourse.id);
      setEditAssets({
        formUrl: assets?.formUrl || '',
        sheetUrl: assets?.sheetUrl || '',
        midtermExamUrl: assets?.midtermExamUrl || '',
        finalExamUrl: assets?.finalExamUrl || ''
      });
    }
  }, [selectedCourse, view]);


  // --- CREATE FORM STATE ---
  const [newCourse, setNewCourse] = useState({
    name: '',
    startDate: '',
    endDate: '',
    type: CourseType.SURAH_SINGLE,
    dailyAmount: '',
    logo: '',
    midtermDate: '',
    finalExamDate: '',
    recitationDays: [] as number[],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    store.addCourse({
      id: `c_${Date.now()}`,
      orgId: user.orgId,
      ...newCourse,
      passingScore: 8,
      recitationDays: [0, 1, 2, 3, 4] // Default Sun-Thu
    });
    setView('list');
  };

  const handleUpdate = () => {
    if (!selectedCourse) return;
    store.updateCourse(selectedCourse.id, editForm);
    store.updateCourseAssets(selectedCourse.id, user.orgId, editAssets);
    alert('تم حفظ التغييرات بنجاح');
    setView('list');
  };

  const openSettings = (courseId: string) => {
    setSelectedCourseId(courseId);
    setView('settings');
  };

  // --- GOOGLE ACTIONS ---
  const handleCreateForm = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const assets = await store.createCourseForm(selectedCourse.id, user.orgId);
      // Update local state to reflect new assets
      setEditAssets(prev => ({
        ...prev,
        formUrl: assets.formUrl,
        sheetUrl: assets.sheetUrl
      }));
      forceUpdate();
    } catch (e: any) {
      alert(e.message || 'Error creating form');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const count = await store.syncStudentsFromSheet(selectedCourse.id, user.orgId);
      alert(`تم استيراد ${count} طالب بنجاح!`);
      forceUpdate();
    } catch (e: any) {
      alert(e.message || 'Error syncing');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERERS ---

  if (view === 'create') {
    return (
      <Card title="إضافة دورة جديدة" className="max-w-3xl mx-auto">
        <form onSubmit={handleCreate} className="space-y-6">
          <Input 
            label="1. اسم الدورة" 
            placeholder="مثال: دورة حفظ سورة البقرة" 
            value={newCourse.name}
            onChange={e => setNewCourse({...newCourse, name: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="date" 
              label="2. تاريخ البدء" 
              value={newCourse.startDate}
              onChange={e => setNewCourse({...newCourse, startDate: e.target.value})}
              required
            />
             <Input 
              type="date" 
              label="3. تاريخ الانتهاء" 
              value={newCourse.endDate}
              onChange={e => setNewCourse({...newCourse, endDate: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Input 
              type="date" 
              label="7. تاريخ الاختبار النصفي" 
              value={newCourse.midtermDate}
              onChange={e => setNewCourse({...newCourse, midtermDate: e.target.value})}
            />
             <Input 
              type="date" 
              label="8. تاريخ الاختبار النهائي" 
              value={newCourse.finalExamDate}
              onChange={e => setNewCourse({...newCourse, finalExamDate: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="نوع المنهج"
              options={[
                { label: 'سورة واحدة', value: CourseType.SURAH_SINGLE },
                { label: 'مجال أجزاء', value: CourseType.JUZ_RANGE },
                { label: 'سور متعددة', value: CourseType.MULTI_SURAHS },
              ]}
              value={newCourse.type}
              onChange={e => setNewCourse({...newCourse, type: e.target.value as CourseType})}
            />
            <Input 
              label="مقدار الحفظ اليومي" 
              placeholder="مثال: صفحة واحدة"
              value={newCourse.dailyAmount}
              onChange={e => setNewCourse({...newCourse, dailyAmount: e.target.value})}
              required
            />
          </div>

          <Input 
            label="4. رابط الشعار (Logo URL)" 
            placeholder="https://example.com/logo.png"
            value={newCourse.logo}
            onChange={e => setNewCourse({...newCourse, logo: e.target.value})}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setView('list')}>إلغاء</Button>
            <Button type="submit">إنشاء الدورة</Button>
          </div>
        </form>
      </Card>
    );
  }

  if (view === 'settings' && selectedCourse) {
    const googleConnected = !!store.getGoogleConnection(user.orgId);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setView('list')} className="p-2">
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-2xl font-bold text-slate-800">إعدادات الدورة</h2>
          </div>
          <Button onClick={handleUpdate} className="bg-primary-600 hover:bg-primary-700">
            <Save size={18} className="ml-2" />
            حفظ التعديلات
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 1: Basic Info */}
          <Card title="1-4. البيانات الأساسية">
             <div className="space-y-4">
                <Input 
                  label="1. اسم الدورة"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    type="date"
                    label="2. تاريخ البدء"
                    value={editForm.startDate || ''}
                    onChange={e => setEditForm({...editForm, startDate: e.target.value})}
                  />
                  <Input 
                    type="date"
                    label="3. تاريخ الانتهاء"
                    value={editForm.endDate || ''}
                    onChange={e => setEditForm({...editForm, endDate: e.target.value})}
                  />
                </div>
                <Input 
                  label="4. رابط الشعار (Logo URL)"
                  value={editForm.logo || ''}
                  placeholder="https://..."
                  onChange={e => setEditForm({...editForm, logo: e.target.value})}
                />
             </div>
          </Card>

           {/* Section 2: Exams Dates */}
           <Card title="7-8. مواعيد الاختبارات">
             <div className="space-y-4">
                <Input 
                  type="date"
                  label="7. تاريخ الاختبار النصفي"
                  value={editForm.midtermDate || ''}
                  onChange={e => setEditForm({...editForm, midtermDate: e.target.value})}
                />
                <Input 
                  type="date"
                  label="8. تاريخ الاختبار النهائي"
                  value={editForm.finalExamDate || ''}
                  onChange={e => setEditForm({...editForm, finalExamDate: e.target.value})}
                />
             </div>
          </Card>

          {/* Section 3: Links */}
          <Card title="9-12. الروابط الخارجية">
            <div className="space-y-6">
               {/* 9 & 10 Registration */}
               <div className="space-y-3 p-3 bg-slate-50 rounded border border-slate-100">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FileText size={16} /> التسجيل والمتابعة
                  </h4>
                  
                  {/* Auto Generate Button */}
                  {!editAssets.formUrl && (
                    <div className="mb-2">
                      {googleConnected ? (
                        <Button size="sm" variant="outline" onClick={handleCreateForm} disabled={loading}>
                           {loading ? 'جاري الإنشاء...' : '✨ إنشاء تلقائي (Google Form & Sheet)'}
                        </Button>
                      ) : (
                        <p className="text-xs text-amber-600">يمكنك ربط Google من الإعدادات لإنشاء الروابط تلقائياً.</p>
                      )}
                    </div>
                  )}

                  <Input 
                    label="9. رابط ردود التسجيل (Google Form)"
                    value={editAssets.formUrl}
                    onChange={e => setEditAssets({...editAssets, formUrl: e.target.value})}
                    placeholder="https://docs.google.com/forms/..."
                  />
                   <Input 
                    label="10. رابط متابعة الحفظ (Google Sheet)"
                    value={editAssets.sheetUrl}
                    onChange={e => setEditAssets({...editAssets, sheetUrl: e.target.value})}
                    placeholder="https://docs.google.com/spreadsheets/..."
                  />
                  {editAssets.sheetUrl && (
                     <Button size="sm" variant="ghost" onClick={handleSync} disabled={loading} className="text-xs w-full justify-start">
                        <RefreshCw size={14} className={`ml-2 ${loading ? 'animate-spin' : ''}`} />
                        مزامنة الطلاب من ملف المتابعة يدوياً
                     </Button>
                  )}
               </div>

               {/* 11 & 12 Exams */}
               <div className="space-y-3 p-3 bg-slate-50 rounded border border-slate-100">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Link size={16} /> روابط الاختبارات
                  </h4>
                  <Input 
                    label="11. رابط الاختبار النصفي"
                    value={editAssets.midtermExamUrl}
                    onChange={e => setEditAssets({...editAssets, midtermExamUrl: e.target.value})}
                    placeholder="https://..."
                  />
                   <Input 
                    label="12. رابط الاختبار النهائي"
                    value={editAssets.finalExamUrl}
                    onChange={e => setEditAssets({...editAssets, finalExamUrl: e.target.value})}
                    placeholder="https://..."
                  />
               </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">إدارة الدورات</h2>
        {user.role !== Role.TEACHER && (
           <Button onClick={() => setView('create')}>
            <Plus size={16} className="ml-2" />
            دورة جديدة
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map(course => {
          const halaqat = store.getHalaqat(course.id);
          const students = store.getStudents(user.orgId, course.id);
          return (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                 <Badge variant="primary">{course.type}</Badge>
                 <button 
                   onClick={() => openSettings(course.id)}
                   className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded"
                 >
                   <SettingsIcon size={18} />
                 </button>
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-2">{course.name}</h3>
               <p className="text-sm text-slate-500 mb-6">{course.dailyAmount} يومياً</p>
               
               <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-slate-100 py-4">
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users size={16} className="text-primary-500" />
                    <span>{students.length} طالب</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} className="text-primary-500" />
                    <span>{halaqat.length} حلقات</span>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="flex-1">الخطة</Button>
                 <Button variant="outline" size="sm" className="flex-1" onClick={() => openSettings(course.id)}>تعديل</Button>
               </div>
            </Card>
          )
        })}
      </div>
    </div>
  );
};
