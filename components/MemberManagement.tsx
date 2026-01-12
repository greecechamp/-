
import React, { useState, useMemo } from 'react';
import { 
  Search, UserPlus, Eye, ArrowUpDown, ArrowUp, ArrowDown, User, ShieldCheck, X, CheckCircle2, ShieldAlert, Square, CheckSquare, AlertCircle
} from 'lucide-react';
import { Member, CurrentUser } from '../types';

interface MemberManagementProps {
  members: Member[];
  onAddMember: (member: Member, registrationFee: number) => void;
  currentUser: CurrentUser;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ members, onAddMember, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Admin Form State
  const [formData, setFormData] = useState({
    name: '',
    memberId: '',
    joinDate: new Date().toISOString().split('T')[0],
    initialDeposit: '100',
    regFee: '50'
  });

  // Compliance Checks for Admin
  const [checks, setChecks] = useState({
    acknowledgeRules: false,
    consentDisclosure: false,
    acceptMaintenance: false
  });

  const allChecksPassed = checks.acknowledgeRules && checks.consentDisclosure && checks.acceptMaintenance;

  const displayMembers = useMemo(() => {
    let result = members;
    if (currentUser.role === 'MEMBER') {
      result = members.filter(m => m.memberId === currentUser.memberId);
    }
    return result.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.memberId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm, currentUser]);

  const handleAdminAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecksPassed) return;

    const newMember: Member = {
      id: Date.now().toString(),
      memberId: formData.memberId,
      name: formData.name,
      joinDate: formData.joinDate,
      balance: Number(formData.initialDeposit),
      loanBalance: 0,
      status: 'ACTIVE',
      password: 'password' // Default password for admin adds
    };

    onAddMember(newMember, Number(formData.regFee));
    setIsAddModalOpen(false);
    // Reset
    setFormData({ name: '', memberId: '', joinDate: new Date().toISOString().split('T')[0], initialDeposit: '100', regFee: '50' });
    setChecks({ acknowledgeRules: false, consentDisclosure: false, acceptMaintenance: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {currentUser.role === 'ADMIN' ? 'จัดการข้อมูลสมาชิก' : 'ข้อมูลสมาชิกของฉัน'}
          </h2>
          <p className="text-sm text-slate-500">
            {currentUser.role === 'ADMIN' ? 'ตรวจสอบสิทธิ์และสถานะสมาชิกทั้งหมดในหมู่บ้าน' : 'ตรวจสอบสิทธิสวัสดิการและยอดเงินสะสมส่วนบุคคล'}
          </p>
        </div>
        {currentUser.role === 'ADMIN' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <UserPlus size={18} />
            ลงทะเบียนสมาชิกใหม่
          </button>
        )}
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {currentUser.role === 'ADMIN' && (
          <div className="p-8 border-b border-slate-100 bg-slate-50/30 relative">
            <Search className="absolute left-12 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรือ รหัสสมาชิก..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-950 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัสสมาชิก</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อ-นามสกุล</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">เงินออมสะสม</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">ยอดเงินกู้</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-400 text-xs">{member.memberId}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 font-black text-xs uppercase shadow-sm">
                        {member.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-black text-sm">{member.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">เข้าร่วม: {member.joinDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-indigo-600 text-sm">฿{member.balance.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right font-black text-amber-600 text-sm">฿{member.loanBalance.toLocaleString()}</td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">Active</span>
                  </td>
                </tr>
              ))}
              {displayMembers.length === 0 && (
                <tr><td colSpan={5} className="p-24 text-center text-slate-300 italic font-medium">ไม่พบข้อมูลสมาชิกที่คุณต้องการ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col md:flex-row">
            
            {/* Left: Form */}
            <div className="p-10 flex-1 space-y-8">
               <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                      <UserPlus size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">เพิ่มสมาชิกใหม่</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registration for new member</p>
                    </div>
                 </div>
                 <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                   <X size={20} />
                 </button>
               </div>

               <form onSubmit={handleAdminAddMember} className="space-y-6">
                 <div className="grid grid-cols-2 gap-5">
                   <div className="col-span-2">
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">ชื่อ-นามสกุล สมาชิก</label>
                     <input 
                       required
                       type="text"
                       placeholder="นายสมชาย มีสุข"
                       className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">รหัสสมาชิก (Mxxx)</label>
                     <input 
                       required
                       type="text"
                       placeholder="M006"
                       className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                       value={formData.memberId}
                       onChange={(e) => setFormData({...formData, memberId: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">วันที่เข้าร่วม</label>
                     <input 
                       required
                       type="date"
                       className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                       value={formData.joinDate}
                       onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">เงินฝากแรกเข้า (บาท)</label>
                     <input 
                       required
                       type="number"
                       className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                       value={formData.initialDeposit}
                       onChange={(e) => setFormData({...formData, initialDeposit: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">ค่าธรรมเนียมสมัคร (บาท)</label>
                     <input 
                       required
                       type="number"
                       className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                       value={formData.regFee}
                       onChange={(e) => setFormData({...formData, regFee: e.target.value})}
                     />
                   </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={!allChecksPassed}
                   className={`w-full py-5 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-3 ${
                    allChecksPassed 
                    ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98]' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                   }`}
                 >
                   บันทึกข้อมูลและออกรหัสสมาชิก
                   <CheckCircle2 size={20} />
                 </button>
               </form>
            </div>

            {/* Right: Compliance Card */}
            <div className="bg-slate-900 p-10 flex-1 text-white relative overflow-hidden flex flex-col justify-center">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <ShieldCheck size={200} />
               </div>

               <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-indigo-400" size={28} />
                    <h4 className="text-xl font-black">ระเบียบและข้อตกลง</h4>
                 </div>

                 <div className="space-y-4">
                    <div 
                      onClick={() => setChecks(prev => ({...prev, acknowledgeRules: !prev.acknowledgeRules}))}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${checks.acknowledgeRules ? 'bg-indigo-600/20 border-indigo-400/50' : 'bg-white/5 border-white/10'}`}
                    >
                      <div className="pt-0.5">{checks.acknowledgeRules ? <CheckSquare className="text-indigo-400" /> : <Square className="text-slate-500" />}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold mb-1">สมาชิกรับทราบคุณสมบัติเบื้องต้น</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">ต้องมีภูมิลำเนาเกิน 6 เดือน และยินดีออมเงินสม่ำเสมอ</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setChecks(prev => ({...prev, consentDisclosure: !prev.consentDisclosure}))}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${checks.consentDisclosure ? 'bg-indigo-600/20 border-indigo-400/50' : 'bg-white/5 border-white/10'}`}
                    >
                      <div className="pt-0.5">{checks.consentDisclosure ? <CheckSquare className="text-indigo-400" /> : <Square className="text-slate-500" />}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold mb-1">ยินยอมเปิดเผยข้อมูลส่วนบุคคล</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">อนุญาตให้กองทุนใช้ AI ตรวจสอบความโปร่งใสในธุรกรรม</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setChecks(prev => ({...prev, acceptMaintenance: !prev.acceptMaintenance}))}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start gap-4 ${checks.acceptMaintenance ? 'bg-rose-900/20 border-rose-500/30' : 'bg-white/5 border-white/10'}`}
                    >
                      <div className="pt-0.5">{checks.acceptMaintenance ? <CheckSquare className="text-rose-400" /> : <Square className="text-slate-500" />}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold mb-1">รักษาสถานภาพ (Maintenance Rules)</p>
                        <div className="mt-2 p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                          <p className="text-[10px] text-rose-300 leading-relaxed italic font-bold">
                            * หากขาดส่งเงินออมเกิน 3-6 เดือน จะถูกระงับสิทธิทันที
                          </p>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5 flex gap-3 items-center">
                   <AlertCircle size={20} className="text-amber-500 shrink-0" />
                   <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                     เจ้าหน้าที่ต้องยืนยันว่าผู้สมัคร "รับทราบ" กฎระเบียบอย่างครบถ้วนก่อนกดบันทึกข้อมูล
                   </p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
