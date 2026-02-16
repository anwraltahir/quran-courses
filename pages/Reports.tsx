import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '../components/ui';
import { store } from '../store';
import { 
  FileText, 
  PenTool, 
  Stamp, 
  Download, 
  ChevronRight, 
  User, 
  MessageSquare, 
  Upload, 
  X,
  Award,
  BookOpen
} from 'lucide-react';

type CertificateType = 'COMPLETION' | 'PARTICIPATION';

export const Reports: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN'>('STUDENT');
  const [certType, setCertType] = useState<CertificateType>('COMPLETION');
  
  // Customization State
  const [recipientName, setRecipientName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [signatureTitle, setSignatureTitle] = useState('مدير المركز');
  const [showStamp, setShowStamp] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [themeColor, setThemeColor] = useState('#064e3b'); // Default primary-700
  
  // Image Assets State
  const [stampImage, setStampImage] = useState<string | null>(null);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);

  const stampInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // Update default message when type or role changes
  useEffect(() => {
    if (selectedRole === 'STUDENT') {
      if (certType === 'COMPLETION') {
        setCustomMessage('تتشرف الإدارة بمنح هذه الشهادة تقديراً لإتمامه حفظ المقرر الدراسي المحدد في الدورة بنجاح وإتقان');
      } else {
        setCustomMessage('تتشرف الإدارة بمنح هذه الشهادة تقديراً لمشاركته الفاعلة وجهوده المبذولة خلال فترة انعقاد الدورة');
      }
    } else {
      setCustomMessage('تتشرف الإدارة بمنح هذه الشهادة تقديراً للجهود المتميزة والعطاء المستمر في خدمة كتاب الله تعالى');
    }
  }, [certType, selectedRole]);

  const roles = [
    { id: 'STUDENT', label: 'طالب' },
    { id: 'TEACHER', label: 'محفظ' },
    { id: 'ADMIN', label: 'إداري' },
  ];

  const colors = [
    { name: 'emerald', value: '#064e3b' },
    { name: 'slate', value: '#1e293b' },
    { name: 'gold', value: '#d97706' },
    { name: 'blue', value: '#1e40af' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'stamp' | 'signature') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'stamp') setStampImage(reader.result as string);
        else setSignatureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    alert('جاري تجهيز الشهادة بصيغة عالية الجودة للتحميل...');
  };

  const getCertTitle = () => {
    if (selectedRole !== 'STUDENT') return 'شهادة شكر وتقدير';
    return certType === 'COMPLETION' ? 'شهادة إكمال دورة' : 'شهادة مشاركة';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 min-h-[800px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      
      {/* Sidebar (Right) */}
      <div className="lg:col-span-1 bg-slate-50 border-l border-slate-200 p-6 flex flex-col overflow-y-auto max-h-[900px]">
         <h2 className="text-2xl font-bold text-slate-800 mb-8">إصدار الشهادات</h2>
         
         <div className="space-y-2 mb-6">
           {roles.map(r => (
             <button
               key={r.id}
               onClick={() => setSelectedRole(r.id as any)}
               className={`w-full text-right p-4 rounded-xl font-bold text-lg transition-all flex justify-between items-center ${
                 selectedRole === r.id 
                   ? 'bg-white text-primary-700 shadow-sm border border-slate-100' 
                   : 'text-slate-400 hover:bg-slate-100'
               }`}
             >
               <span>{r.label}</span>
               {selectedRole === r.id && <ChevronRight size={20} />}
             </button>
           ))}
         </div>

         {/* Student-specific Type Toggle */}
         {selectedRole === 'STUDENT' && (
           <div className="mb-8 p-1 bg-slate-200 rounded-lg flex gap-1">
              <button 
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${certType === 'COMPLETION' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setCertType('COMPLETION')}
              >
                شهادة إكمال
              </button>
              <button 
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${certType === 'PARTICIPATION' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setCertType('PARTICIPATION')}
              >
                شهادة مشاركة
              </button>
           </div>
         )}

         {/* Customization Panel */}
         <div className="space-y-6 flex-1">
            <div>
              <h4 className="font-bold text-slate-700 text-sm mb-4 border-b pb-2">بيانات المحتوى</h4>
              <div className="space-y-3">
                <div className="relative">
                  <User size={14} className="absolute right-3 top-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="اسم المستلم" 
                    className="w-full pr-10 pl-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <MessageSquare size={14} className="absolute right-3 top-3.5 text-slate-400" />
                  <textarea 
                    placeholder="نص الشهادة" 
                    className="w-full pr-10 pl-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none h-24 resize-none leading-relaxed"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-700 text-sm mb-4 border-b pb-2">التوقيع والختم</h4>
              <div className="space-y-4">
                <div className="relative">
                  <PenTool size={14} className="absolute right-3 top-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="المسمى الوظيفي للموقع" 
                    className="w-full pr-10 pl-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    value={signatureTitle}
                    onChange={(e) => setSignatureTitle(e.target.value)}
                  />
                </div>

                {/* Upload Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 mr-1">صورة التوقيع (اختياري)</label>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => signatureInputRef.current?.click()}
                      >
                        <Upload size={14} className="ml-1" /> رفع توقيع
                      </Button>
                      {signatureImage && (
                        <Button size="sm" variant="danger" className="px-2" onClick={() => setSignatureImage(null)}>
                          <X size={14} />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 mr-1">صورة الختم (اختياري)</label>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => stampInputRef.current?.click()}
                      >
                        <Upload size={14} className="ml-1" /> رفع ختم
                      </Button>
                      {stampImage && (
                        <Button size="sm" variant="danger" className="px-2" onClick={() => setStampImage(null)}>
                          <X size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <input type="file" hidden ref={signatureInputRef} accept="image/*" onChange={(e) => handleImageUpload(e, 'signature')} />
                <input type="file" hidden ref={stampInputRef} accept="image/*" onChange={(e) => handleImageUpload(e, 'stamp')} />
              </div>
            </div>
         </div>

         <div className="pt-6 border-t border-slate-200 mt-6">
            <p className="text-xs text-slate-400 text-center">الإصدار المطور 2.5</p>
         </div>
      </div>

      {/* Main Content (Preview & Options) */}
      <div className="lg:col-span-3 p-8 bg-slate-100 relative flex flex-col items-center overflow-y-auto">
         
         <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <div>
             <h3 className="text-lg font-bold text-slate-800">معاينة مباشرة</h3>
             <p className="text-xs text-slate-500">نوع الشهادة: {getCertTitle()}</p>
           </div>
           <div className="flex gap-2">
             {colors.map(c => (
               <div 
                key={c.name}
                onClick={() => setThemeColor(c.value)}
                className={`w-8 h-8 rounded-full cursor-pointer transition-all ${themeColor === c.value ? 'ring-4 ring-offset-2 scale-110 shadow-md' : 'hover:scale-110'}`}
                style={{ backgroundColor: c.value, ringColor: `${c.value}40` }}
               ></div>
             ))}
           </div>
         </div>

         {/* Certificate Preview Box */}
         <div 
          className="w-full aspect-[1.414] bg-white border-[12px] shadow-2xl mx-auto rounded-sm p-16 flex flex-col items-center justify-center text-center relative max-w-3xl mb-8 overflow-hidden transition-all duration-500"
          style={{ borderColor: `${themeColor}20`, borderStyle: 'double' }}
         >
            {/* Decorative Borders */}
            <div className="absolute inset-4 border-2 border-solid pointer-events-none" style={{ borderColor: `${themeColor}10` }}></div>
            <div className="absolute inset-8 border-4 border-double pointer-events-none opacity-40" style={{ borderColor: themeColor }}></div>
            
            {/* Header Area */}
            <div className="mb-10 relative z-10 w-full">
               <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center opacity-80" style={{ color: themeColor }}>
                 {selectedRole === 'STUDENT' && certType === 'COMPLETION' ? (
                   <Award size={64} strokeWidth={1.2} />
                 ) : (
                   <BookOpen size={64} strokeWidth={1.2} />
                 )}
               </div>
               <h1 className="font-serif text-5xl mb-3 tracking-wide" style={{ color: themeColor }}>
                 {getCertTitle()}
               </h1>
               <div className="h-0.5 w-32 mx-auto rounded-full" style={{ backgroundColor: themeColor, opacity: 0.3 }}></div>
            </div>

            {/* Content Area */}
            <div className="w-full space-y-8 my-4 relative z-10 px-12">
               <p className="text-xl text-slate-500 font-medium">تتشرف إدارة المركز بمنح هذه الشهادة لـ</p>
               <div className="py-2 border-b-2 border-slate-100 inline-block px-12 relative">
                  <p className="text-4xl font-bold text-slate-900 font-sans tracking-tight">
                    {recipientName || 'الاسم الكامل للمستلم'}
                  </p>
                  <div className="absolute -bottom-0.5 left-0 right-0 h-1 rounded-full opacity-20" style={{ backgroundColor: themeColor }}></div>
               </div>
               <p className="text-xl text-slate-600 leading-relaxed max-w-lg mx-auto italic font-light">
                 "{customMessage}"
               </p>
            </div>

            {/* Bottom Section: Stamp and Signature */}
            <div className="mt-auto w-full flex justify-between items-end px-16 pb-6">
               <div className={`text-center transition-all duration-500 w-48 ${showSignature ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                 <p className="text-sm font-bold text-slate-700 mb-2">{signatureTitle}</p>
                 <div className="h-20 w-full flex items-center justify-center relative group">
                    {signatureImage ? (
                      <img src={signatureImage} alt="Signature" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    ) : (
                      <div className="h-full w-full border-b border-dashed border-slate-300 flex items-center justify-center italic text-slate-300 text-xs">
                         بانتظار التوقيع
                      </div>
                    )}
                 </div>
               </div>
               
               <div className={`text-center transition-all duration-500 ${showStamp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                 <div 
                    className="h-32 w-32 rounded-full border-4 border-double flex items-center justify-center mx-auto transition-transform hover:scale-105 cursor-default relative overflow-hidden"
                    style={{ borderColor: `${themeColor}20`, color: `${themeColor}40` }}
                  >
                    {stampImage ? (
                      <img src={stampImage} alt="Stamp" className="w-full h-full object-contain p-2 mix-blend-multiply opacity-80" />
                    ) : (
                      <>
                        <Stamp size={48} />
                        <span className="absolute text-[8px] font-bold uppercase tracking-widest bottom-6" style={{ color: themeColor }}>الختم الرسمي</span>
                      </>
                    )}
                 </div>
               </div>
            </div>

            {/* Background watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none transform -rotate-12">
                {selectedRole === 'STUDENT' && certType === 'COMPLETION' ? (
                  <Award size={400} style={{ color: themeColor }} />
                ) : (
                  <FileText size={400} style={{ color: themeColor }} />
                )}
            </div>
         </div>

         {/* Interactive Toggle Buttons */}
         <div className="flex gap-4 w-full max-w-lg">
            <Button 
              variant="outline" 
              onClick={() => setShowStamp(!showStamp)}
              className={`flex-1 py-4 flex flex-col gap-2 h-auto transition-all bg-white border-2 ${showStamp ? 'border-primary-500 text-primary-700 shadow-sm' : 'border-slate-200 opacity-60'}`}
            >
              <Stamp size={20} className={showStamp ? 'text-primary-600' : 'text-slate-400'} />
              <span className="text-xs font-bold">الختم</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowSignature(!showSignature)}
              className={`flex-1 py-4 flex flex-col gap-2 h-auto transition-all bg-white border-2 ${showSignature ? 'border-primary-500 text-primary-700 shadow-sm' : 'border-slate-200 opacity-60'}`}
            >
              <PenTool size={20} className={showSignature ? 'text-primary-600' : 'text-slate-400'} />
              <span className="text-xs font-bold">التوقيع</span>
            </Button>
         </div>

         <div className="mt-8 mb-12 flex justify-center w-full max-w-3xl">
            <Button className="w-full py-5 text-xl shadow-2xl hover:scale-[1.01] transition-all bg-primary-700 hover:bg-primary-800" onClick={handleExport}>
              <Download size={24} className="ml-3" />
              تصدير {getCertTitle()}
            </Button>
         </div>

      </div>

    </div>
  );
};