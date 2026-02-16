import React, { useState } from 'react';
import { Card, Button, Table, Badge, Input, Select } from '../components/ui';
import { store } from '../store';
import { RecitationRecord, Student } from '../types';
import { Check, X, MessageCircle, Save } from 'lucide-react';

export const Recitation: React.FC = () => {
  const user = store.currentUser!;
  // Assuming first halaqa for MVP simplicity if teacher has multiple
  const myHalaqat = store.getTeacherHalaqat(user.id);
  const selectedHalaqa = myHalaqat[0];
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<Record<string, Partial<RecitationRecord>>>({});

  if (!selectedHalaqa) {
    return <div className="text-center p-12 text-slate-500">لا توجد حلقات مسندة إليك حالياً.</div>;
  }

  const students = store.getStudents(user.orgId, undefined, selectedHalaqa.id);

  // Initialize records if empty
  const getRecord = (studentId: string) => {
    return records[studentId] || {
      studentId,
      date,
      attendance: 'PRESENT',
      recited: 'YES',
      score: 10,
      rating: 'EXCELLENT'
    };
  };

  const updateRecord = (studentId: string, updates: Partial<RecitationRecord>) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: { ...getRecord(studentId), ...updates }
    }));
  };

  const handleBulkSave = () => {
    const recordsToSave = students.map(s => ({
      ...getRecord(s.id),
      id: `r_${s.id}_${date}`
    } as RecitationRecord));
    
    store.saveRecords(recordsToSave);
    alert('تم حفظ البيانات بنجاح!');
  };

  // Send message to Telegram Group
  const handleSendReminder = () => {
    if (selectedHalaqa.telegramChatId) {
       store.sendMessage({
         id: `msg_${Date.now()}`,
         orgId: user.orgId,
         type: 'REMINDER',
         target: selectedHalaqa.telegramChatId,
         sentAt: new Date().toISOString(),
         status: 'SENT'
       });
       alert(`تم إرسال تذكير إلى مجموعة التيليجرام: ${selectedHalaqa.name}`);
    } else {
      alert('لا يوجد معرف مجموعة تيليجرام لهذه الحلقة');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">تسميع اليوم</h2>
           <p className="text-slate-500">حلقة: {selectedHalaqa.name}</p>
        </div>
        <div className="flex items-center gap-3">
           <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
           <Button variant="outline" onClick={handleSendReminder}>
             <MessageCircle size={18} className="ml-2" />
             تذكير
           </Button>
           <Button onClick={handleBulkSave}>
             <Save size={18} className="ml-2" />
             حفظ الكل
           </Button>
        </div>
      </div>

      <Card>
        <Table headers={['الطالب', 'الحالة', 'التسميع', 'الدرجة', 'التقييم', 'ملاحظات']}>
          {students.map(student => {
            const r = getRecord(student.id);
            return (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium">{student.name}</td>
                <td className="p-4">
                  <select 
                    className="border rounded p-1 text-sm w-full"
                    value={r.attendance}
                    onChange={e => updateRecord(student.id, { attendance: e.target.value as any })}
                  >
                    <option value="PRESENT">حاضر</option>
                    <option value="ABSENT">غائب</option>
                    <option value="EXCUSED">معذور</option>
                  </select>
                </td>
                <td className="p-4">
                   {r.attendance === 'PRESENT' ? (
                     <div className="flex gap-2">
                       <button 
                         onClick={() => updateRecord(student.id, { recited: 'YES' })}
                         className={`p-1 rounded ${r.recited === 'YES' ? 'bg-green-100 text-green-700' : 'text-slate-400'}`}
                       ><Check size={16} /></button>
                        <button 
                         onClick={() => updateRecord(student.id, { recited: 'PARTIAL' })}
                         className={`p-1 rounded ${r.recited === 'PARTIAL' ? 'bg-amber-100 text-amber-700' : 'text-slate-400'}`}
                       >-</button>
                        <button 
                         onClick={() => updateRecord(student.id, { recited: 'NO' })}
                         className={`p-1 rounded ${r.recited === 'NO' ? 'bg-red-100 text-red-700' : 'text-slate-400'}`}
                       ><X size={16} /></button>
                     </div>
                   ) : <span className="text-slate-400">-</span>}
                </td>
                <td className="p-4">
                  <input 
                    type="number" 
                    min="0" max="10" 
                    className="w-16 border rounded p-1 text-center"
                    value={r.score}
                    disabled={r.attendance !== 'PRESENT'}
                    onChange={e => updateRecord(student.id, { score: parseInt(e.target.value) })}
                  />
                </td>
                <td className="p-4">
                   <select 
                    className="border rounded p-1 text-sm w-full"
                    value={r.rating}
                    disabled={r.attendance !== 'PRESENT'}
                    onChange={e => updateRecord(student.id, { rating: e.target.value as any })}
                  >
                    <option value="EXCELLENT">ممتاز</option>
                    <option value="GOOD">جيد</option>
                    <option value="NEEDS_WORK">يحتاج متابعة</option>
                  </select>
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    className="border rounded p-1 text-sm w-full"
                    placeholder="ملاحظة..."
                    value={r.notes || ''}
                    onChange={e => updateRecord(student.id, { notes: e.target.value })}
                  />
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
};
