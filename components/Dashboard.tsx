
import React, { useMemo } from 'react';
import { 
  Wallet, 
  HandCoins, 
  Activity, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Image as ImageIcon, 
  LineChart as LineChartIcon, 
  Heart,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { WelfareFundState, TransactionType, CurrentUser, IncomeType, WelfareType } from '../types';
import { TRANSACTION_TYPE_LABELS, INCOME_TYPE_LABELS, WELFARE_TYPE_LABELS } from '../constants';

interface DashboardProps {
  state: WelfareFundState;
  currentUser: CurrentUser;
}

const Dashboard: React.FC<DashboardProps> = ({ state, currentUser }) => {
  const totalIncome = useMemo(() => state.recentTransactions.filter(tx => tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.LOAN_REPAYMENT || tx.type === TransactionType.FUND_INCOME).reduce((acc, tx) => acc + tx.amount, 0), [state.recentTransactions]);
  const totalExpense = useMemo(() => state.recentTransactions.filter(tx => tx.type === TransactionType.WITHDRAW || tx.type === TransactionType.WELFARE_PAYOUT || tx.type === TransactionType.LOAN_DISBURSEMENT).reduce((acc, tx) => acc + tx.amount, 0), [state.recentTransactions]);

  const filteredTransactions = useMemo(() => {
    if (currentUser.role === 'ADMIN') return state.recentTransactions.slice(0, 10);
    return state.recentTransactions.filter(tx => tx.memberId === currentUser.memberId).slice(0, 10);
  }, [state.recentTransactions, currentUser]);

  // Aggregate Income by Category with specific color grouping
  const incomeBreakdown = useMemo(() => {
    const totals: Record<string, { value: number, category: 'SAVINGS' | 'LOAN' | 'OTHER' }> = {
      'เงินออมสมาชิก': { value: 0, category: 'SAVINGS' },
      'ชำระเงินกู้': { value: 0, category: 'LOAN' },
    };
    
    state.recentTransactions.forEach(tx => {
      if (tx.type === TransactionType.DEPOSIT) totals['เงินออมสมาชิก'].value += tx.amount;
      if (tx.type === TransactionType.LOAN_REPAYMENT) totals['ชำระเงินกู้'].value += tx.amount;
      if (tx.type === TransactionType.FUND_INCOME && tx.incomeType) {
        const label = INCOME_TYPE_LABELS[tx.incomeType].label;
        if (!totals[label]) totals[label] = { value: 0, category: 'OTHER' };
        totals[label].value += tx.amount;
      }
    });

    // Color tones requested: Green (Savings), Blue (Loans), Cyan/Sky (Other)
    const palettes = {
      SAVINGS: ['#10b981', '#059669', '#34d399'], // Emerald (Green)
      LOAN: ['#2563eb', '#3b82f6', '#60a5fa'],    // Blue
      OTHER: ['#06b6d4', '#0ea5e9', '#22d3ee'],   // Cyan/Sky
    };

    let sIdx = 0, lIdx = 0, oIdx = 0;

    return Object.entries(totals)
      .filter(([_, data]) => data.value > 0)
      .map(([name, data]) => {
        let color = '#cbd5e1';
        if (data.category === 'SAVINGS') color = palettes.SAVINGS[sIdx++ % 3];
        if (data.category === 'LOAN') color = palettes.LOAN[lIdx++ % 3];
        if (data.category === 'OTHER') color = palettes.OTHER[oIdx++ % 3];
        return { name, value: data.value, color };
      });
  }, [state.recentTransactions]);

  // Aggregate Expenses by Category with specific color grouping
  const expenseBreakdown = useMemo(() => {
    const totals: Record<string, { value: number, category: 'WITHDRAW' | 'LOAN' | 'WELFARE' }> = {
      'ถอนเงินออม': { value: 0, category: 'WITHDRAW' },
      'จ่ายเงินกู้': { value: 0, category: 'LOAN' },
    };
    
    state.recentTransactions.forEach(tx => {
      if (tx.type === TransactionType.WITHDRAW) totals['ถอนเงินออม'].value += tx.amount;
      if (tx.type === TransactionType.LOAN_DISBURSEMENT) totals['จ่ายเงินกู้'].value += tx.amount;
      if (tx.type === TransactionType.WELFARE_PAYOUT && tx.welfareType) {
        const label = WELFARE_TYPE_LABELS[tx.welfareType].label;
        if (!totals[label]) totals[label] = { value: 0, category: 'WELFARE' };
        totals[label].value += tx.amount;
      }
    });

    // Color tones requested: Red (Withdraw), Orange/Yellow (Loans), Pink (Welfare)
    const palettes = {
      WITHDRAW: ['#ef4444', '#dc2626', '#f87171'], // Red
      LOAN: ['#f97316', '#f59e0b', '#fbbf24'],     // Orange/Yellow
      WELFARE: ['#ec4899', '#db2777', '#f472b6', '#9d174d', '#fbcfe8'], // Pink
    };

    let wIdx = 0, lIdx = 0, welIdx = 0;

    return Object.entries(totals)
      .filter(([_, data]) => data.value > 0)
      .map(([name, data]) => {
        let color = '#cbd5e1';
        if (data.category === 'WITHDRAW') color = palettes.WITHDRAW[wIdx++ % 3];
        if (data.category === 'LOAN') color = palettes.LOAN[lIdx++ % 3];
        if (data.category === 'WELFARE') color = palettes.WELFARE[welIdx++ % 5];
        return { name, value: data.value, color };
      });
  }, [state.recentTransactions]);

  const monthlyChartData = useMemo(() => {
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.'];
    const dataMap: Record<string, { income: number; expense: number }> = {
      '01': { income: 45000, expense: 32000 }, '02': { income: 52000, expense: 41000 },
      '03': { income: 48000, expense: 35000 }, '04': { income: 61000, expense: 48000 },
      '05': { income: 0, expense: 0 },
    };
    state.recentTransactions.forEach(tx => {
      const month = tx.date.split('-')[1];
      if (dataMap[month]) {
        const isIncome = tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.LOAN_REPAYMENT || tx.type === TransactionType.FUND_INCOME;
        if (isIncome) dataMap[month].income += tx.amount;
        else dataMap[month].expense += tx.amount;
      }
    });
    let currentBalance = 150000; 
    return months.map((name, index) => {
      const monthKey = (index + 1).toString().padStart(2, '0');
      const monthlyIncome = dataMap[monthKey].income;
      const monthlyExpense = dataMap[monthKey].expense;
      currentBalance = currentBalance + monthlyIncome - monthlyExpense;
      return { name, income: monthlyIncome, expense: monthlyExpense, balance: currentBalance };
    });
  }, [state.recentTransactions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Wallet size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">เงินกองทุนทั้งหมด</p><h3 className="text-xl font-black text-slate-800">฿{state.totalBalance.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600"><ArrowDownToLine size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">รายรับสะสม</p><h3 className="text-xl font-black text-emerald-600">฿{totalIncome.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 border-l-4 border-l-rose-500">
          <div className="p-3 bg-rose-100 rounded-xl text-rose-600"><ArrowUpFromLine size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">รายจ่ายสะสม</p><h3 className="text-xl font-black text-rose-600">฿{totalExpense.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-600"><HandCoins size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">ยอดเงินกู้คงค้าง</p><h3 className="text-xl font-black text-slate-800">฿{state.activeLoans.toLocaleString()}</h3></div>
        </div>
      </div>

      {/* Public Proportions Section */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <PieChartIcon size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg">สัดส่วนการเงินสาธารณะ</h3>
              <p className="text-sm text-slate-500 font-medium">ภาพรวมความโปร่งใสของรายรับและรายจ่ายกองทุน (แยกตามกลุ่มสี)</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-bold flex items-center gap-2">
            <Activity size={14} /> ข้อมูลอัปเดตล่าสุดวันนี้
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Income Proportion */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-bold text-slate-700 flex items-center gap-2"><ArrowDownToLine size={18} className="text-emerald-500" /> ที่มาของรายรับ</h4>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เขียว/ฟ้า/น้ำเงิน</span>
            </div>
            <div className="h-[320px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={incomeBreakdown} 
                    cx="50%" cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={5} 
                    dataKey="value"
                  >
                    {incomeBreakdown.map((entry, index) => <Cell key={`cell-income-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                  />
                  <Legend verticalAlign="bottom" height={40}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Proportion */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-bold text-slate-700 flex items-center gap-2"><ArrowUpFromLine size={18} className="text-rose-500" /> สัดส่วนรายจ่าย</h4>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">แดง/เหลือง/ส้ม + ชมพู</span>
            </div>
            <div className="h-[320px] w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={expenseBreakdown} 
                    cx="50%" cy="50%" 
                    innerRadius={70} 
                    outerRadius={100} 
                    paddingAngle={5} 
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => <Cell key={`cell-expense-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => `฿${value.toLocaleString()}`}
                  />
                  <Legend verticalAlign="bottom" height={40}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 flex items-center gap-2"><LineChartIcon size={20} className="text-indigo-500" />การเติบโตของกองทุนสะสม</h3>
            <span className="text-[10px] font-black uppercase text-slate-400">Monthly Asset Growth</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChartData}>
                <defs><linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <BarChart3 size={20} />
            </div>
            <h3 className="font-black text-slate-800">เปรียบเทียบ เดือนนี้</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-500">เป้าหมายรายรับ</span>
                <span className="text-emerald-600">82% ของเป้าหมาย</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[82%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-500">เพดานรายจ่ายสวัสดิการ</span>
                <span className="text-amber-600">45% ของงบประมาณ</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[45%]"></div>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-wider mb-1">AI Financial Health Check</p>
              <p className="text-xs text-indigo-900 font-bold italic">"สภาพคล่องอยู่ในเกณฑ์ดีเยี่ยม สามารถรองรับการกู้ยืมเพิ่มเติมได้"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-800">ธุรกรรมล่าสุด {currentUser.role === 'MEMBER' && '(ข้อมูลส่วนตัว)'}</h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            {currentUser.role === 'ADMIN' ? 'Viewing all member records' : `Logged in as ${currentUser.name}`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">รายการ</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ประเภท</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">จำนวนเงิน</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.LOAN_REPAYMENT || tx.type === TransactionType.FUND_INCOME;
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold text-sm">{tx.memberName || 'รายได้กองทุน'}</span>
                        <span className="text-slate-400 text-[10px] font-medium">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        tx.type === TransactionType.DEPOSIT ? 'bg-emerald-100 text-emerald-700' :
                        tx.type === TransactionType.WITHDRAW ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {TRANSACTION_TYPE_LABELS[tx.type]}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-black text-sm ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isIncome ? '+' : '-'} ฿{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[10px] font-bold">{tx.date}</td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr><td colSpan={4} className="p-12 text-center text-slate-400 italic">ไม่มีรายการธุรกรรมของคุณในขณะนี้</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
