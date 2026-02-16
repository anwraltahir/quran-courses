import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { store } from '../store';
import { Link2, Check, X, Shield, ExternalLink } from 'lucide-react';

export const Settings: React.FC = () => {
  const user = store.currentUser!;
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'integrations'>('integrations');
  
  // Force update hack for mock store reactivity
  const [_, setTick] = useState(0);
  const forceUpdate = () => setTick(t => t + 1);

  const googleConnection = store.getGoogleConnection(user.orgId);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await store.connectGoogle(user.orgId);
      forceUpdate();
    } catch (e) {
      alert('Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if(!confirm('هل أنت متأكد من إلغاء الربط؟ ستتوقف النماذج الجديدة عن العمل.')) return;
    setLoading(true);
    try {
      await store.disconnectGoogle(user.orgId);
      forceUpdate();
    } catch (e) {
      alert('Failed to disconnect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">إعدادات المنظمة</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          <button
            onClick={() => setActiveTab('general')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            عام
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'integrations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            التكامل والربط
          </button>
        </nav>
      </div>

      {activeTab === 'general' && (
        <Card className="p-8 text-center text-slate-500">
          Settings Placeholder
        </Card>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card title="Google Workspace" className="overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-1">
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
                    <path d="M12.0003 10.2V13.8H17.0004C16.7804 14.98 15.3804 17.4 12.0003 17.4C9.09035 17.4 6.73035 15.05 6.73035 12.14C6.73035 9.23 9.09035 6.88 12.0003 6.88C13.6603 6.88 14.7703 7.59 15.4103 8.19L18.0603 5.64C16.4203 4.11 14.3703 3.32 12.0003 3.32C7.14035 3.32 3.20032 7.26 3.20032 12.12C3.20032 16.98 7.14035 20.92 12.0003 20.92C16.9003 20.92 20.1503 17.46 20.1503 12.55C20.1503 11.72 20.0803 11.08 19.9503 10.2H12.0003Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">ربط حساب Google</h3>
                  <p className="text-slate-500 text-sm">
                    لإنشاء نماذج التسجيل (Google Forms) وجداول البيانات (Sheets) تلقائياً.
                  </p>
                  {googleConnection && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-2 py-1 rounded w-fit">
                      <Check size={14} />
                      <span>متصل بحساب: {googleConnection.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {!googleConnection ? (
                  <Button onClick={handleConnect} disabled={loading} className="w-full md:w-auto">
                    {loading ? 'جاري الاتصال...' : 'اتصال بـ Google'}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleDisconnect} disabled={loading} className="text-red-600 border-red-200 hover:bg-red-50">
                    {loading ? 'جاري الفصل...' : 'إلغاء الربط'}
                  </Button>
                )}
              </div>
            </div>
            
            {googleConnection && (
              <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50 -m-6 p-6">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <Shield size={16} className="mt-0.5 text-slate-400" />
                  <p>
                    يملك النظام صلاحية إنشاء وتعديل النماذج والجداول في حسابك. تأكد من أن الحساب مخصص للعمل الإداري.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
