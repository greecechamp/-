import React, { useState, useMemo } from 'react';
import { CircleDollarSign, Plus, Search, TrendingDown, Clock, Calculator, Receipt, Scale, ShieldCheck, AlertCircle } from 'lucide-react';
import { WelfareFundState, CurrentUser, Transaction, Member, TransactionType } from '../types';
import { LOAN_INTEREST_RATE_YEARLY } from '../constants';

interface LoanManagementProps {
  state: WelfareFundState;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  currentUser: CurrentUser;
}

const LoanManagement: React.FC<LoanManagementProps> = ({ state, onAddTransaction, currentUser }) => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loanForm, setLoanForm] = useState({ memberId: currentUser.role === 'MEMBER' ? currentUser.memberId : '', amount: '10000', loanTerm: '12', description: 'กู้ยืมเพื่อการประกอบอาชีพ' });

  const displayMembersWithLoans = useMemo(() => {
    let result = state.members.filter(m => m.loanBalance > 0);
    if (currentUser.role === 'MEMBER') {
      result = result.filter(m => m.memberId === currentUser.memberId);
    }
    return result;
  }, [state.members, currentUser]);

  const selectedMember = useMemo(() => state.members.find(m => m.memberId === loanForm.memberId), [loanForm.memberId, state.members]);

  const loanSummary = useMemo(() => {
    const principal = Math.max(0, Number(loanForm.amount) || 0);
    const months = Math.max(1, Number(loanForm.loanTerm) || 1);
    const totalInterest = principal * LOAN_INTEREST_RATE_YEARLY * (months / 12);
    const totalRepayment = principal + totalInterest;
    return {
      monthlyTotal: totalRepayment / months,
      totalInterest,
      totalRepayment,
      riskLevel: selectedMember && principal > selectedMember.balance * 5 ? 'HIGH' : 'LOW'
    };
  }, [loanForm.amount, loanForm.loanTerm, selectedMember]);

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || currentUser.role !== 'ADMIN') return;
    onAddTransaction({
      memberId: loanForm.memberId,
      memberName: selectedMember.name,
      amount: Number(loanForm.amount),
      loanTerm: Number(loanForm.loanTerm),
      type: TransactionType.LOAN_DISBURSEMENT,
      date: new Date().toISOString().split('T')[0],
      description: loanForm.description
    });
    setIsLoanModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">เงินกู้กองทุนหมู่บ้าน</h2>
          <p className="text-sm text-slate-500">วางแผนและบริหารหนี้สินอย่างมีประสิทธิภาพ</p>
        </div>
        <button onClick={() => setIsLoanModalOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-100">
          <Calculator size={18} /> {currentUser.role === 'ADMIN' ? 'จัดการขอกู้ใหม่' : 'วางแผนการกู้'}
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-black text-slate-800">
            {currentUser.role === 'ADMIN' ? 'รายชื่อผู้กู้ทั้งหมด' : 'ข้อมูลหนี้สินของฉัน'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">สมาชิก</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">เงินต้นคงค้าง</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">ชำระล่าสุด</th>
                <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayMembersWithLoans.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6 font-black text-slate-800 text-sm">{member.name}</td>
                  <td className="px-8 py-6 text-right font-black text-amber-600 text-sm">฿{member.loanBalance.toLocaleString()}</td>
                  <td className="px-8 py-6 text-right font-bold text-slate-400 text-xs">{member.lastPaymentDate || 'ไม่มีข้อมูล'}</td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black rounded-lg border border-green-100">NORMAL</span>
                  </td>
                </tr>
              ))}
              {displayMembersWithLoans.length === 0 && (
                <tr><td colSpan={4} className="p-20 text-center text-slate-300 italic">ไม่มีข้อมูลการกู้ยืมที่ต้องการแสดง</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isLoanModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Calculator className="text-amber-500" /> Loan Planning</h3>
              {currentUser.role === 'ADMIN' ? (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">เลือกสมาชิก</label>
                  <select value={loanForm.memberId} onChange={(e) => setLoanForm({...loanForm, memberId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-950">
                    <option value="">-- เลือกผู้กู้ --</option>
                    {state.members.map(m => <option key={m.id} value={m.memberId}>{m.name}</option>)}
                  </select>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">กู้ในนาม</p><p className="font-black text-slate-800">{currentUser.name}</p></div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">ยอดเงินกู้</label><input type="number" value={loanForm.amount} onChange={(e) => setLoanForm({...loanForm, amount: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-950" /></div>
                {/* Fix: Replaced 'loanTerm' with 'loanForm' in the spread operator to correctly update state */}
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">กี่เดือน</label><input type="number" value={loanForm.loanTerm} onChange={(e) => setLoanForm({...loanForm, loanTerm: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-950" /></div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[40px] p-8 text-white flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 tracking-widest">Summary Payment</p>
                <h4 className="text-4xl font-black text-amber-400">฿{loanSummary.monthlyTotal.toLocaleString()}</h4>
                <p className="text-xs text-slate-500 font-bold">ยอดผ่อนชำระต่องวด</p>
                <div className="mt-8 space-y-2 pt-8 border-t border-white/10">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">รวมดอกเบี้ยตลอดสัญญา</span><span className="font-bold text-emerald-400">+฿{loanSummary.totalInterest.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">รวมชำระคืนทั้งหมด</span><span className="font-bold">฿{loanSummary.totalRepayment.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="pt-6">
                {currentUser.role === 'ADMIN' ? (
                  <button onClick={handleLoanSubmit} className="w-full py-4 bg-amber-500 text-slate-900 rounded-3xl font-black text-sm hover:bg-amber-400 transition-all">อนุมัติเงินกู้ทันที</button>
                ) : (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex gap-2"><AlertCircle size={16} className="text-amber-400 shrink-0" /><p className="text-[10px] text-slate-400 leading-relaxed italic">คุณสามารถวางแผนการผ่อนชำระได้ที่นี่ หากต้องการกู้จริงโปรดติดต่อคณะกรรมการหมู่บ้าน</p></div>
                )}
                <button onClick={() => setIsLoanModalOpen(false)} className="w-full mt-2 py-4 bg-white/5 text-white rounded-3xl font-black text-sm hover:bg-white/10">ปิดหน้าต่าง</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;