
import React, { useState } from 'react';
import { 
  Heart, 
  History, 
  Calendar as CalendarIcon, 
  Plus, 
  Baby, 
  UserRound, 
  Stethoscope, 
  GraduationCap, 
  Church,
  X,
  CheckCircle2,
  ChevronRight,
  HeartOff,
  FileText,
  ShieldCheck,
  Info,
  AlertCircle,
  Clock,
  Briefcase,
  Download,
  Sparkles,
  Award
} from 'lucide-react';
import { WelfareFundState, WelfareType, Transaction, TransactionType, CalendarEvent, CurrentUser } from '../types';
import { WELFARE_TYPE_LABELS, WELFARE_REGULATIONS } from '../constants';
import WelfareCalendar from './WelfareCalendar';

// Updated interface to include currentUser
interface WelfareManagementProps {
  state: WelfareFundState;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateEvent: (updatedEvent: CalendarEvent) => void;
  currentUser: CurrentUser;
  isPrivacyActive?: boolean;
}

// Updated component to accept currentUser from props
const WelfareManagement: React.FC<WelfareManagementProps> = ({ state, onAddTransaction, onUpdateEvent, currentUser, isPrivacyActive = false }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CALENDAR' | 'HISTORY'>('OVERVIEW');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState<WelfareType | null>(null);
  const [formData, setFormData] = useState({
    memberId: '',
    type: WelfareType.HOSPITAL,
    amount: WELFARE_TYPE_LABELS[WelfareType.HOSPITAL].defaultAmount.toString(),
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const welfareIcons: Record<WelfareType, React.ReactNode> = {
    [WelfareType.BIRTH]: <Baby size={24} />,
    [WelfareType.DEATH]: <Church size={24} />,
    [WelfareType.HOSPITAL]: <Stethoscope size={24} />,
    [WelfareType.EDUCATION]: <GraduationCap size={24} />,
    [WelfareType.ELDERLY]: <UserRound size={24} />,
    [WelfareType.FUNERAL]: <HeartOff size={24} />,
  };

  const formatAmount = (amount: number) => {
    if (isPrivacyActive) return '฿•,•••';
    return `฿${amount.toLocaleString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = state.members.find(m => m.memberId === formData.memberId);
    if (!member) return;

    onAddTransaction({
      memberId: formData.memberId,
      memberName: member.name,
      amount: Number(formData.amount),
      type: TransactionType.WELFARE_PAYOUT,
      date: formData.date,
      description: `จ่ายสวัสดิการ: ${WELFARE_TYPE_LABELS[formData.type].label} (${formData.note})`,
      welfareType: formData.type
    });

    setIsModalOpen(false);
    setFormData({
      memberId: '',
      type: WelfareType.HOSPITAL,
      amount: WELFARE_TYPE_LABELS[WelfareType.HOSPITAL].defaultAmount.toString(),
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
  };

  const handleTypeChange = (type: WelfareType) => {
    setFormData({
      ...formData,
      type,
      amount: WELFARE_TYPE_LABELS[type].defaultAmount.toString()
    });
  };

  // Filter history based on user role and member ID
  const welfareHistory = React.useMemo(() => {
    const history = state.recentTransactions.filter(t => t.type === TransactionType.WELFARE_PAYOUT);
    if (currentUser.role === 'MEMBER') {
      return history.filter(tx => tx.memberId === currentUser.memberId);
    }
    return history;
  }, [state.recentTransactions, currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ระบบสวัสดิการหมู่บ้าน</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold flex items-center gap-1">
              <Award size={10} /> Success Model Verified
            </span>
            <p className="text-sm text-slate-500">ดูแลคุณภาพชีวิตสมาชิกตามเกณฑ์มาตรฐานกองทุนหมู่บ้านระดับประเทศ</p>
          </div>
        </div>
        {/* Only allow admins to record welfare payouts */}
        {currentUser.role === 'ADMIN' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-pink-100 font-bold"
          >
            <Plus size={18} />
            บันทึกการจ่ายสวัสดิการ
          </button>
        )}
      </div>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 w-fit">
        <button 
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'OVERVIEW' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          ภาพรวมระเบียบการ
        </button>
        <button 
          onClick={() => setActiveTab('CALENDAR')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'CALENDAR' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          ปฏิทินกิจกรรม
        </button>
        <button 
          onClick={() => setActiveTab('HISTORY')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'HISTORY' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          ประวัติการเบิกจ่าย
        </button>
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {Object.entries(WELFARE_TYPE_LABELS).map(([type, info]) => {
            const reg = WELFARE_REGULATIONS[type as WelfareType];
            return (
              <div key={type} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  {welfareIcons[type as WelfareType]}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{info.label}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-xl font-black text-slate-800">{formatAmount(info.defaultAmount)}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Model Amt.</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 font-medium bg-slate-50 p-2 rounded-lg mb-4">
                    <span className="font-bold text-slate-700 block mb-1">สิทธิ์เบื้องต้น:</span>
                    {reg.eligibility}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> 
                    Premium Policy
                  </div>
                  <button 
                    onClick={() => setSelectedReg(type as WelfareType)}
                    className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    ดูระเบียบการ <ChevronRight size={14} />
                  </button>
                </div>
                <div className="absolute top-2 right-2 opacity-5">
                  {welfareIcons[type as WelfareType]}
                </div>
              </div>
            );
          })}
          
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 p-8 rounded-3xl text-white flex flex-col justify-between shadow-xl shadow-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-200">ระเบียบกองทุนปี 2568</h4>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 italic mb-6">
                "ตัวเลขสวัสดิการเหล่านี้คำนวณจากฐานรายได้และกำไรสะสม เพื่อความมั่นคงสูงสุดของสมาชิกบ้านเขาเสวยราช"
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">อัตราความโปร่งใส</span>
                  <span className="font-bold text-emerald-400">ดีเยี่ยม (98%)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[98%]"></div>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2">
              <Download size={16} /> ดาวน์โหลดระเบียบฉบับเต็ม
            </button>
          </div>
        </div>
      )}

      {activeTab === 'CALENDAR' && (
        <div className="animate-in fade-in duration-300">
          <WelfareCalendar events={state.events} onUpdateEvent={onUpdateEvent} />
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">วันที่</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">สมาชิก</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ประเภทสวัสดิการ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {welfareHistory.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{tx.memberName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${tx.welfareType ? WELFARE_TYPE_LABELS[tx.welfareType].color : 'bg-slate-100 text-slate-600'}`}>
                      {tx.welfareType ? WELFARE_TYPE_LABELS[tx.welfareType].label : 'ทั่วไป'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-black ${isPrivacyActive ? 'text-slate-300' : 'text-slate-800'}`}>
                    {formatAmount(tx.amount)}
                  </td>
                </tr>
              ))}
              {welfareHistory.length === 0 && (
                <tr><td colSpan={4} className="p-12 text-center text-slate-400 italic">ไม่พบประวัติการจ่ายสวัสดิการ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Regulation Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className={`p-8 ${WELFARE_TYPE_LABELS[selectedReg].color} border-b border-slate-100 relative`}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-3xl shadow-sm text-slate-800">
                  {welfareIcons[selectedReg]}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">{WELFARE_TYPE_LABELS[selectedReg].label}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Village Fund Success Model v.2568
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedReg(null)} className="absolute top-6 right-6 p-3 bg-white/50 hover:bg-white rounded-full text-slate-500 transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                <Clock className="text-blue-500 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ระยะเวลาสมาชิกที่กำหนด</h4>
                  <p className="font-bold text-slate-800">{WELFARE_REGULATIONS[selectedReg].eligibility}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <h4>เงื่อนไขการรับสิทธิ์ (Success Standards)</h4>
                </div>
                <ul className="space-y-3 pl-2">
                  {WELFARE_REGULATIONS[selectedReg].conditions.map((condition, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="shrink-0 w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">{i+1}</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <FileText size={18} className="text-amber-500" />
                  <h4>หลักฐานที่ต้องแนบ</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WELFARE_REGULATIONS[selectedReg].documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs text-slate-500 font-medium group hover:border-blue-200 transition-all">
                      <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors"></div>
                      {doc}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-4">
                <Info className="text-blue-500 shrink-0 mt-1" size={20} />
                <p className="text-xs text-blue-800 leading-relaxed">
                  <span className="font-black block mb-1">คำแนะนำจากกองทุน:</span>
                  {WELFARE_REGULATIONS[selectedReg].note}
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedReg(null)}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
              >
                รับทราบระเบียบการ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welfare Payout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-pink-50">
              <div className="flex items-center gap-3 text-pink-600">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Heart size={20} />
                </div>
                <h3 className="font-bold text-slate-800">บันทึกการจ่ายสวัสดิการ</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-pink-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">สมาชิกผู้รับสวัสดิการ</label>
                <select 
                  required
                  value={formData.memberId}
                  onChange={(e) => setFormData({...formData, memberId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none"
                >
                  <option value="">-- เลือกสมาชิก --</option>
                  {state.members.map(m => (
                    <option key={m.id} value={m.memberId}>{m.memberId} - {m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">เลือกประเภทสวัสดิการ</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(WELFARE_TYPE_LABELS).map(([type, info]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type as WelfareType)}
                      className={`p-3 rounded-2xl border text-[10px] font-bold flex flex-col items-center gap-2 transition-all ${
                        formData.type === type 
                          ? 'bg-pink-600 border-pink-600 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-pink-300'
                      }`}
                    >
                      {welfareIcons[type as WelfareType]}
                      <span className="text-center">{info.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">จำนวนเงิน (บาท)</label>
                  <input 
                    required
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">วันที่เบิกจ่าย</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-500 shrink-0" size={18} />
                <p className="text-[10px] text-amber-800 leading-relaxed italic">
                  *ระบบจะตรวจสอบยอดเงินออมเบื้องต้น สมาชิกควรเป็นสมาชิกอย่างน้อยตามระเบียบกำหนดเพื่อความโปร่งใส
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">หมายเหตุ/รายละเอียด</label>
                <input 
                  type="text"
                  placeholder="เช่น เยี่ยมไข้ที่ รพ.ประจำจังหวัด..."
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-pink-600 text-white rounded-2xl font-bold text-sm hover:bg-pink-700 shadow-lg shadow-pink-100 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelfareManagement;
