
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCcw, LayoutDashboard, Target, ShieldCheck } from 'lucide-react';
import { WelfareFundState } from '../types';
import { getAIInsight } from '../services/geminiService';

interface AIInsightProps {
  state: WelfareFundState;
}

const AIInsight: React.FC<AIInsightProps> = ({ state }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInsight = async () => {
    setLoading(true);
    const result = await getAIInsight(state);
    setInsight(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-amber-500" />
          AI วิเคราะห์กองทุนอัจฉริยะ
        </h2>
        <button 
          onClick={fetchInsight}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          รีเฟรชการวิเคราะห์
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 animate-pulse">กำลังประมวลผลข้อมูลกองทุนด้วย Gemini AI...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl text-white shadow-lg shadow-blue-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LayoutDashboard />
                สรุปจาก AI
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="leading-relaxed whitespace-pre-wrap">
                  {insight}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="text-green-500" />
                  <h4 className="font-bold text-slate-800">จุดแข็งกองทุน</h4>
                </div>
                <p className="text-slate-600 text-sm">
                  กองทุนมีสภาพคล่องสูง สมาชิกมีความสม่ำเสมอในการส่งเงินออม ยอดหนี้เงินกู้อยู่ในระดับที่จัดการได้
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-amber-500">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="text-amber-500" />
                  <h4 className="font-bold text-slate-800">เป้าหมายถัดไป</h4>
                </div>
                <p className="text-slate-600 text-sm">
                  พิจารณาขยายเพดานสวัสดิการการศึกษาให้ลูกหลานสมาชิก เนื่องจากมีงบประมาณสะสมเพียงพอ
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4">คะแนนสุขภาพกองทุน</h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-black text-blue-600">88</span>
                <span className="text-slate-400 font-medium mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[88%]"></div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                *ประเมินจากกระแสเงินสด, การชำระหนี้, และสัดส่วนสมาชิก
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4">คำถามแนะนำ</h4>
              <ul className="space-y-2">
                {['เงินกู้ปีนี้เสี่ยงแค่ไหน?', 'เพิ่มสวัสดิการผู้สูงอายุได้ไหม?', 'ยอดสมาชิกโตขึ้นกี่เปอร์เซ็นต์?'].map((q, i) => (
                  <li key={i}>
                    <button className="w-full text-left text-sm text-slate-600 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100">
                      "{q}"
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsight;
