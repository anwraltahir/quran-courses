import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { store } from '../store';
import { Send, Check, MessageCircle } from 'lucide-react';

export const Messages: React.FC = () => {
  const user = store.currentUser!;
  
  // Sketch 4: Predefined Message Types
  const messageTypes = [
    'إعلان الدورة',
    'ضوابط الدورة',
    'بداية الدورة والترحيب',
    'الاختبارات النصفية',
    'الاختبارات النهائية',
    'نهاية الدورة'
  ];

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSend = () => {
    alert(`Sending: ${selectedTypes.join(', ')} \nCustom: ${customText}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
      
      {/* Center/Left: Message Content (Sketch 4 Left Side) */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle className="text-primary-600" />
          الرسائل
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
           <h3 className="font-bold text-lg mb-4 text-slate-700">محتوى الرسالة</h3>
           
           <div className="mb-6">
             <label className="block text-sm font-medium text-slate-600 mb-2">النص الإضافي (اختياري)</label>
             <textarea 
               className="w-full h-40 border-2 border-slate-100 rounded-xl p-4 focus:border-primary-500 outline-none resize-none transition-colors"
               placeholder="اكتب نص الرسالة هنا..."
               value={customText}
               onChange={e => setCustomText(e.target.value)}
             />
           </div>

           <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg mb-6">
             <span className="text-primary-800 font-medium text-sm">سيتم الإرسال إلى جميع طلاب الدورة النشطة</span>
             <span className="bg-white px-2 py-1 rounded text-xs font-bold text-primary-600">SMS / WhatsApp</span>
           </div>

           <Button onClick={handleSend} className="w-full py-3 text-lg">
             <Send size={20} className="ml-2" />
             إرسال الرسائل المحددة
           </Button>
        </div>
      </div>

      {/* Right/Sidebar: Message Types Selection (Sketch 4 Right Side) */}
      <div className="lg:col-span-1">
        <div className="bg-white h-full border-r border-slate-200 p-6 rounded-l-xl lg:rounded-none lg:border-l lg:border-r-0">
          <h3 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">اختر نوع الرسالة</h3>
          
          <div className="space-y-3">
            {messageTypes.map(type => {
              const isSelected = selectedTypes.includes(type);
              return (
                <div 
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50 text-primary-900' 
                      : 'border-slate-100 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="font-medium">{type}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </div>
  );
};