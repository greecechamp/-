
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Heart, 
  CircleDollarSign, 
  Sparkles,
  Menu,
  ChevronRight,
  LogOut,
  UserCircle
} from 'lucide-react';
import { WelfareFundState, View, TransactionType, CalendarEvent, Transaction, Member, IncomeType, CurrentUser, UserRole } from './types';
import { INITIAL_MEMBERS, INITIAL_TRANSACTIONS, INITIAL_EVENTS, INITIAL_WELFARE_RECORDS } from './constants';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import AIInsight from './components/AIInsight';
import WelfareManagement from './components/WelfareManagement';
import TransactionManagement from './components/TransactionManagement';
import LoanManagement from './components/LoanManagement';
import Login from './components/Login';
import Registration from './components/Registration';

// Main Application component for Village Welfare Fund Management
const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Initial State Management
  const [state, setState] = useState<WelfareFundState>({
    totalBalance: 245600,
    totalMembers: INITIAL_MEMBERS.length,
    activeLoans: 45000,
    recentTransactions: INITIAL_TRANSACTIONS,
    members: INITIAL_MEMBERS,
    events: INITIAL_EVENTS,
    welfareRecords: INITIAL_WELFARE_RECORDS
  });

  const sidebarItems = useMemo(() => {
    if (!currentUser) return [];
    const items = [
      { id: 'DASHBOARD', label: 'หน้าแรก', icon: <LayoutDashboard size={20} /> },
      { id: 'MEMBERS', label: currentUser.role === 'ADMIN' ? 'จัดการสมาชิก' : 'ข้อมูลสมาชิก', icon: <Users size={20} /> },
      { id: 'TRANSACTIONS', label: 'ธุรกรรม', icon: <Receipt size={20} /> },
      { id: 'WELFARE', label: 'สวัสดิการ', icon: <Heart size={20} /> },
      { id: 'LOANS', label: 'เงินกู้หมู่บ้าน', icon: <CircleDollarSign size={20} /> },
    ];
    if (currentUser.role === 'ADMIN') {
      items.push({ id: 'AI_INSIGHT', label: 'AI วิเคราะห์', icon: <Sparkles size={20} /> });
    }
    return items;
  }, [currentUser]);

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveView('DASHBOARD');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === updatedEvent.id ? updatedEvent : e)
    }));
  };

  const handleAddMember = (newMember: Member, registrationFee: number = 0) => {
    // Check if it's a self-registration or admin adding
    const isSelfReg = registrationFee === 0;
    
    const transactions: Transaction[] = [];
    
    if (newMember.balance > 0) {
      transactions.push({
        id: `t-sav-${Date.now()}`,
        memberId: newMember.memberId,
        memberName: newMember.name,
        amount: newMember.balance,
        type: TransactionType.DEPOSIT,
        date: newMember.joinDate,
        description: 'เงินออมสะสมแรกเข้า'
      });
    }

    if (registrationFee > 0) {
      transactions.push({
        id: `t-fee-${Date.now() + 1}`,
        memberId: newMember.memberId,
        memberName: newMember.name,
        amount: registrationFee,
        type: TransactionType.FUND_INCOME,
        incomeType: IncomeType.FEE,
        date: newMember.joinDate,
        description: 'ค่าธรรมเนียมสมัครสมาชิกใหม่'
      });
    }

    setState(prev => ({
      ...prev,
      members: [...prev.members, newMember],
      totalMembers: prev.totalMembers + 1,
      totalBalance: prev.totalBalance + newMember.balance + registrationFee,
      recentTransactions: [...transactions, ...prev.recentTransactions]
    }));

    if (isSelfReg) {
      setActiveView('DASHBOARD'); // In case somehow accessed while logged in
    }
  };

  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...newTxData, id: `t${Date.now()}` };
    setState(prev => {
      const updatedMembers = prev.members.map(member => {
        if (member.memberId === newTx.memberId) {
          let balanceChange = 0;
          let loanBalanceChange = 0;
          let lastPaymentDate = member.lastPaymentDate;
          switch (newTx.type) {
            case TransactionType.DEPOSIT: balanceChange = newTx.amount; break;
            case TransactionType.WITHDRAW:
            case TransactionType.WELFARE_PAYOUT: balanceChange = -newTx.amount; break;
            case TransactionType.LOAN_DISBURSEMENT: loanBalanceChange = newTx.amount; break;
            case TransactionType.LOAN_REPAYMENT: 
              loanBalanceChange = -newTx.amount; 
              lastPaymentDate = newTx.date; 
              break;
          }
          return { ...member, balance: member.balance + balanceChange, loanBalance: member.loanBalance + loanBalanceChange, lastPaymentDate: lastPaymentDate };
        }
        return member;
      });
      let fundChange = 0;
      let activeLoansChange = 0;
      switch (newTx.type) {
        case TransactionType.DEPOSIT:
        case TransactionType.LOAN_REPAYMENT:
        case TransactionType.FUND_INCOME: fundChange = newTx.amount; break;
        case TransactionType.WITHDRAW:
        case TransactionType.WELFARE_PAYOUT:
        case TransactionType.LOAN_DISBURSEMENT: fundChange = -newTx.amount; break;
      }
      if (newTx.type === TransactionType.LOAN_DISBURSEMENT) activeLoansChange = newTx.amount;
      if (newTx.type === TransactionType.LOAN_REPAYMENT) activeLoansChange = -newTx.amount;
      return { ...prev, totalBalance: prev.totalBalance + fundChange, activeLoans: prev.activeLoans + activeLoansChange, recentTransactions: [newTx, ...prev.recentTransactions], members: updatedMembers };
    });
  };

  const getNextMemberId = () => {
    const lastIdNum = state.members
      .map(m => parseInt(m.memberId.replace('M', '')))
      .sort((a, b) => b - a)[0] || 0;
    return `M${(lastIdNum + 1).toString().padStart(3, '0')}`;
  };

  // Content rendering based on state
  if (!isLoggedIn || !currentUser) {
    if (activeView === 'REGISTRATION') {
      return (
        <Registration 
          nextMemberId={getNextMemberId()} 
          onRegister={(newMember) => {
            handleAddMember(newMember);
            setActiveView('DASHBOARD'); // Reset to login
          }} 
          onCancel={() => setActiveView('DASHBOARD')} 
        />
      );
    }
    return <Login onLogin={handleLogin} onNavigateToRegister={() => setActiveView('REGISTRATION')} members={state.members} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'DASHBOARD':
        return <Dashboard state={state} currentUser={currentUser} />;
      case 'MEMBERS':
        return <MemberManagement members={state.members} onAddMember={handleAddMember} currentUser={currentUser} />;
      case 'TRANSACTIONS':
        return <TransactionManagement state={state} onAddTransaction={handleAddTransaction} currentUser={currentUser} />;
      case 'WELFARE':
        return <WelfareManagement state={state} onAddTransaction={handleAddTransaction} onUpdateEvent={handleUpdateEvent} currentUser={currentUser} />;
      case 'LOANS':
        return <LoanManagement state={state} onAddTransaction={handleAddTransaction} currentUser={currentUser} />;
      case 'AI_INSIGHT':
        return <AIInsight state={state} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-['Anuphan']">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="shrink-0 px-2 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100">
              <span className="text-[10px] font-bold leading-tight text-center">กองทุน<br/>หมู่บ้าน</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-slate-800 tracking-tight text-sm truncate">กองทุนบ้านเขาเสวยราชย์</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Village Welfare Fund</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id as View); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeView === item.id ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <span className={`${activeView === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
                {activeView === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <UserCircle className="text-slate-400" size={32} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{currentUser.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-rose-100 text-rose-600 rounded-xl text-xs font-black hover:bg-rose-50 transition-all shadow-sm"
            >
              <LogOut size={16} />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-slate-800 text-sm hidden sm:block">
              {sidebarItems.find(item => item.id === activeView)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-black text-slate-800">{currentUser.name}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{currentUser.role}</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
               <UserCircle size={20} />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
