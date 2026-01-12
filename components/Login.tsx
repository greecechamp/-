
import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, Loader2, Users, Briefcase, UserPlus, KeyRound, ArrowLeft, CreditCard, Eye, EyeOff } from 'lucide-react';
import { CurrentUser, UserRole, Member } from '../types';

interface LoginProps {
  onLogin: (user: CurrentUser) => void;
  onNavigateToRegister: () => void;
  members: Member[];
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, members }) => {
  const [view, setView] = useState<'LOGIN' | 'FORGOT_PASSWORD'>('LOGIN');
  const [role, setRole] = useState<UserRole>('MEMBER');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password States
  const [recoveryId, setRecoveryId] = useState('');
  const [recoveryIdCard, setRecoveryIdCard] = useState('');
  const [recoveredPassword, setRecoveredPassword] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate Network Delay
    setTimeout(() => {
      if (role === 'ADMIN') {
        if (username === 'M0000' && password === '65142004') {
          onLogin({ role: 'ADMIN', memberId: 'M0000', name: 'เจ้าหน้าที่กองทุน' });
        } else {
          setError('รหัสเจ้าหน้าที่ (M0000) หรือรหัสผ่านไม่ถูกต้อง');
        }
      } else {
        const member = members.find(m => m.memberId === username && m.password === password);
        if (member) {
          onLogin({ role: 'MEMBER', memberId: member.memberId, name: member.name });
        } else {
          setError('รหัสสมาชิกหรือรหัสผ่านไม่ถูกต้อง');
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const handleRecoverPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRecoveredPassword(null);

    setTimeout(() => {
      const member = members.find(m => m.memberId === recoveryId && m.idNumber === recoveryIdCard);
      if (member) {
        setRecoveredPassword(member.password || 'ไม่ได้กำหนดรหัสผ่าน');
      } else {
        setError('ไม่พบข้อมูลสมาชิกที่ตรงกับรหัสสมาชิกและเลขบัตรประชาชนนี้');
      }
      setIsLoading(false);
    }, 1000);
  };

  if (view === 'FORGOT_PASSWORD') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-['Anuphan']">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 p-8 md:p-12">
            <button 
              onClick={() => { setView('LOGIN'); setError(''); setRecoveredPassword(null); }}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs mb-8 transition-colors"
            >
              <ArrowLeft size={16} /> กลับหน้าเข้าสู่ระบบ
            </button>

            <div className="text-center mb-10">
              <div className="inline-flex p-4 bg-amber-50 rounded-3xl mb-4">
                <KeyRound className="text-amber-600" size={40} />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">กู้คืนรหัสผ่าน</h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">ระบุข้อมูลเพื่อตรวจสอบความเป็นเจ้าของบัญชี</p>
            </div>

            {recoveredPassword ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">รหัสผ่านของคุณคือ</p>
                  <div className="text-3xl font-black text-slate-950 tracking-wider">
                    {recoveredPassword}
                  </div>
                </div>
                <button 
                  onClick={() => { setView('LOGIN'); setUsername(recoveryId); setRecoveredPassword(null); }}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 transition-all"
                >
                  ไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecoverPassword} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">รหัสสมาชิก (เช่น M001)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-bold text-slate-950"
                        placeholder="ระบุรหัสสมาชิก"
                        value={recoveryId}
                        onChange={(e) => setRecoveryId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">เลขบัตรประชาชน (13 หลัก)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        maxLength={13}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-bold text-slate-950"
                        placeholder="กรอกเลขบัตรที่ลงทะเบียนไว้"
                        value={recoveryIdCard}
                        onChange={(e) => setRecoveryIdCard(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold rounded-xl text-center">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-amber-200 hover:bg-amber-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      กำลังตรวจสอบข้อมูล...
                    </>
                  ) : (
                    <>
                      ตรวจสอบข้อมูล
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                หากพบปัญหาในการกู้คืน กรุณาติดต่อคณะกรรมการหมู่บ้าน
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-['Anuphan']">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-indigo-50 rounded-3xl mb-4">
              <ShieldCheck className="text-indigo-600" size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">กองทุนบ้านเขาเสวยราช</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">เข้าสู่ระบบเพื่อจัดการสวัสดิการหมู่บ้าน</p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button 
              onClick={() => { setRole('MEMBER'); setError(''); setUsername(''); setPassword(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${role === 'MEMBER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users size={16} /> สมาชิก
            </button>
            <button 
              onClick={() => { setRole('ADMIN'); setError(''); setUsername(''); setPassword(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${role === 'ADMIN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Briefcase size={16} /> เจ้าหน้าที่
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  {role === 'ADMIN' ? 'Admin Username (M0000)' : 'Member ID (เช่น M001)'}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="text"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold text-slate-950"
                    placeholder={role === 'ADMIN' ? 'M0000' : 'ระบุรหัสสมาชิก'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  {role === 'MEMBER' && (
                    <button 
                      type="button"
                      onClick={() => setView('FORGOT_PASSWORD')}
                      className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest"
                    >
                      ลืมรหัสผ่าน?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold text-slate-950"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col gap-4">
             <button 
               onClick={onNavigateToRegister}
               className="w-full py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
             >
               <UserPlus size={16} />
               ยังไม่เป็นสมาชิก? ลงทะเบียนที่นี่
             </button>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
              Village Fund Management System v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
