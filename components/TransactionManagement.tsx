
import React, { useState, useMemo } from 'react';
import { Search, Plus, Calendar as CalendarIcon, Filter, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { WelfareFundState, TransactionType, CurrentUser, Transaction } from '../types';
import { TRANSACTION_TYPE_LABELS } from '../constants';

interface TransactionManagementProps {
  state: WelfareFundState;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  currentUser: CurrentUser;
}

const TransactionManagement: React.FC<TransactionManagementProps> = ({ state, onAddTransaction, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const displayTransactions = useMemo(() => {
    let result = state.recentTransactions;
    if (currentUser.role === 'MEMBER') {
      result = state.recentTransactions.filter(tx => tx.memberId === currentUser.memberId);
    }
    return result.filter(tx => 
      tx.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [state.recentTransactions, searchTerm, currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ประวัติธุรกรรม</h2>
          <p className="text-sm text-slate-500">ตรวจสอบรายละเอียดรายรับ-รายจ่ายที่เกิดขึ้น</p>
        </div>
        {currentUser.role === 'ADMIN' && (
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-emerald-100">
            <Plus size={18} /> เพิ่มรายการใหม่
          </button>
        )}
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหารายการ..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 text-xs font-black flex items-center gap-2 hover:bg-slate-50">
            <Filter size={16} /> ตัวกรองขั้นสูง
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">สมาชิก/รายการ</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ประเภท</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayTransactions.map((tx) => {
                const isIncome = tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.LOAN_REPAYMENT || tx.type === TransactionType.FUND_INCOME;
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 text-[10px] font-black text-slate-400">{tx.date}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-black text-sm">{tx.memberName || 'รายได้กองทุน'}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter w-fit flex items-center gap-2 ${isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {isIncome ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
                        {TRANSACTION_TYPE_LABELS[tx.type]}
                      </div>
                    </td>
                    <td className={`px-8 py-6 text-right font-black text-sm ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isIncome ? '+' : '-'} ฿{tx.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionManagement;
