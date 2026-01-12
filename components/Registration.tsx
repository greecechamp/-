
import React, { useState } from 'react';
// Added AlertCircle to imports to fix the undefined error on line 328
import { UserPlus, ArrowLeft, ShieldCheck, Lock, User, Phone, MapPin, CreditCard, Calendar, CheckCircle2, FileText, X, Info, Award, ShieldAlert, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { Member, WelfareType } from '../types';
import { WELFARE_REGULATIONS, WELFARE_TYPE_LABELS, MEMBERSHIP_REGULATIONS } from '../constants';

interface RegistrationProps {
  onRegister: (newMember: Member) => void;
  onCancel: () => void;
  nextMemberId: string;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister, onCancel, nextMemberId }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    idNumber: '',
    address: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    beneficiaryName: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  
  // Compliance Checks
  const [checks, setChecks] = useState({
    acknowledgeRules: false,
    consentDisclosure: false,
    acceptMaintenance: false
  });

  const allChecksPassed = checks.acknowledgeRules && checks.consentDisclosure && checks.acceptMaintenance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allChecksPassed) {
      setError('กรุณายอมรับเงื่อนไขและกฎระเบียบให้ครบทุกข้อก่อนลงทะเบียน');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (formData.password.length < 6) {
      setError('รหัสผ่านควรมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      memberId: nextMemberId,
      name: formData.name,
      password: formData.password,
      joinDate: new Date().toISOString().split('T')[0],
      balance: 0,
      loanBalance: 0,
      status: 'ACTIVE',
      phoneNumber: formData.phoneNumber,
      idNumber: formData.idNumber,
      address: formData.address,
      birthDate: formData.birthDate,
      beneficiaryName: formData.beneficiaryName
    };

    setSuccess(true);
    setTimeout(() => {
      onRegister(newMember);
    }, 2000);
  };

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center max-w-md w-full animate-in zoom-in-95 duration-300 border border-slate-100">
          <div className="inline-flex p-6 bg-emerald-50 rounded-full text-emerald-500 mb-6">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">สมัครสมาชิกสำเร็จ!</h2>
          <p className="text-slate-500 font-medium mb-6 leading-relaxed">
            รหัสสมาชิกของคุณคือ <span className="text-indigo-600 font-bold">{nextMemberId}</span><br/>
            กรุณาใช้รหัสนี้และรหัสผ่านที่คุณตั้งไว้เพื่อเข้าสู่ระบบ
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            Redirecting to login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 py-12 relative overflow-hidden font-['Anuphan']">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-3xl relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 p-8 md:p-12">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-xs mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> กลับหน้าเข้าสู่ระบบ
          </button>

          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-emerald-50 rounded-3xl mb-4">
              <UserPlus className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">ลงทะเบียนสมาชิกใหม่</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">เข้าร่วมกองทุนสวัสดิการหมู่บ้านบ้านเขาเสวยราช</p>
            <div className="mt-4 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-2xl inline-block text-xs font-black shadow-sm">
              รหัสสมาชิกที่จะได้รับ: {nextMemberId}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">1. ข้อมูลส่วนบุคคล</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">ชื่อ-นามสกุล</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="text"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-950 placeholder:text-slate-300"
                        placeholder="ระบุชื่อจริง-นามสกุล"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">เบอร์โทรศัพท์</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="tel"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-950 placeholder:text-slate-300"
                        placeholder="08X-XXX-XXXX"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">เลขบัตรประชาชน (13 หลัก)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="text"
                        maxLength={13}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-950 placeholder:text-slate-300"
                        placeholder="X-XXXX-XXXXX-XX-X"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">ที่อยู่ตามทะเบียนบ้าน</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-400" size={16} />
                      <textarea 
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-950 h-28 resize-none placeholder:text-slate-300"
                        placeholder="บ้านเลขที่ หมู่ที่ ตำบล..."
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">2. สิทธิและรหัสผ่าน</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">วัน/เดือน/ปี เกิด</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="date"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-950"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">ชื่อผู้รับผลประโยชน์</label>
                    <div className="relative">
                      <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        required
                        type="text"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-950 placeholder:text-slate-300"
                        placeholder="ชื่อผู้รับสิทธิ์กรณีเสียชีวิต"
                        value={formData.beneficiaryName}
                        onChange={(e) => setFormData({...formData, beneficiaryName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="p-4 bg-amber-50 rounded-3xl border border-amber-100 flex gap-3 mb-4">
                      <ShieldAlert size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-800 leading-relaxed font-bold italic">
                        รหัสผ่านควรจดจำให้แม่นยำ เพื่อใช้ตรวจสอบยอดออมและเบิกสวัสดิการ
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">ตั้งรหัสผ่าน (Password)</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            required
                            type="password"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-950"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">ยืนยันรหัสผ่าน</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            required
                            type="password"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-950"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regulation Card Section */}
            <div className="bg-slate-900 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <ShieldCheck size={200} />
               </div>
               
               <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-white/10 rounded-2xl text-indigo-400 border border-white/10">
                   <ShieldCheck size={28} />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-white">ระเบียบและข้อตกลงการเป็นสมาชิก</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Compliance & Status Maintenance Agreement</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div 
                   onClick={() => toggleCheck('acknowledgeRules')}
                   className={`flex items-start gap-4 p-5 rounded-3xl border transition-all cursor-pointer ${checks.acknowledgeRules ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                 >
                   <div className="pt-0.5">
                     {checks.acknowledgeRules ? <CheckSquare className="text-indigo-400" size={24} /> : <Square className="text-slate-500" size={24} />}
                   </div>
                   <div className="flex-1">
                     <p className="text-sm font-bold text-white mb-1">รับทราบระเบียบและคุณสมบัติสมาชิก</p>
                     <p className="text-[11px] text-slate-400 leading-relaxed">มีภูมิลำเนาในหมู่บ้านเกิน 6 เดือน และยินยอมออมเงินรายเดือนขั้นต่ำ 100 บาท</p>
                     <button type="button" onClick={(e) => { e.stopPropagation(); setIsRegModalOpen(true); }} className="text-indigo-400 text-[10px] font-black uppercase mt-2 hover:underline">อ่านระเบียบฉบับเต็ม</button>
                   </div>
                 </div>

                 <div 
                   onClick={() => toggleCheck('consentDisclosure')}
                   className={`flex items-start gap-4 p-5 rounded-3xl border transition-all cursor-pointer ${checks.consentDisclosure ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                 >
                   <div className="pt-0.5">
                     {checks.consentDisclosure ? <CheckSquare className="text-indigo-400" size={24} /> : <Square className="text-slate-500" size={24} />}
                   </div>
                   <div className="flex-1">
                     <p className="text-sm font-bold text-white mb-1">ยินยอมเปิดเผยข้อมูลและตรวจสอบสลิปด้วย AI</p>
                     <p className="text-[11px] text-slate-400 leading-relaxed">อนุญาตให้กองทุนใช้ระบบ Gemini AI ตรวจสอบความถูกต้องของสลิปและข้อมูลเพื่อความโปร่งใส</p>
                   </div>
                 </div>

                 <div 
                   onClick={() => toggleCheck('acceptMaintenance')}
                   className={`flex items-start gap-4 p-5 rounded-3xl border transition-all cursor-pointer ${checks.acceptMaintenance ? 'bg-rose-900/20 border-rose-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                 >
                   <div className="pt-0.5">
                     {checks.acceptMaintenance ? <CheckSquare className="text-rose-400" size={24} /> : <Square className="text-slate-500" size={24} />}
                   </div>
                   <div className="flex-1">
                     <p className="text-sm font-bold text-white mb-1">ยอมรับเงื่อนไขการรักษาสถานภาพ (Status Maintenance)</p>
                     <div className="mt-1 p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                       <p className="text-[11px] text-rose-200 leading-relaxed italic">
                         <AlertCircle size={10} className="inline mr-1" />
                         หากขาดส่งเงินออมเกิน 3-6 เดือน จะถูกระงับสิทธิสวัสดิการและเงินกู้ทันทีจนกว่าจะดำเนินการแก้ไข
                       </p>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="mt-8 pt-8 border-t border-white/5">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic text-center">
                   * ข้อมูลข้างต้นมีผลทางกฎหมายเบื้องต้นตามข้อบังคับกองทุนหมู่บ้านบ้านเขาเสวยราช
                 </p>
               </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black rounded-2xl text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                <ShieldAlert size={16} /> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={!allChecksPassed}
              className={`w-full py-5 rounded-[24px] font-black text-sm shadow-xl transition-all flex items-center justify-center gap-3 ${
                allChecksPassed 
                ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] cursor-pointer' 
                : 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed border border-slate-200'
              }`}
            >
              ยืนยันการสมัครสมาชิกใหม่
              <CheckCircle2 size={20} />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
              Copyright © 2568 กองทุนสวัสดิการหมู่บ้านบ้านเขาเสวยราช<br/>All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Regulations Modal */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-10 bg-indigo-900 border-b border-indigo-950 relative text-white">
              <div className="flex items-center gap-5">
                <div className="p-5 bg-white/10 rounded-[32px] text-indigo-400 border border-white/5 shadow-inner">
                  <FileText size={40} />
                </div>
                <div>
                  <h3 className="text-3xl font-black">ระเบียบและข้อบังคับกองทุน</h3>
                  <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mt-2">Village Fund Regulations v.2568</p>
                </div>
              </div>
              <button onClick={() => setIsRegModalOpen(false)} className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 md:p-14 space-y-12 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
              <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                   <Info className="text-indigo-600" size={24} />
                   <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">คุณสมบัติผู้สมัคร</h4>
                </div>
                <ul className="text-sm text-slate-600 space-y-4 list-none font-medium leading-relaxed">
                  {MEMBERSHIP_REGULATIONS.qualifications.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="shrink-0 w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xs font-black">{i+1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="text-emerald-500" size={20} />
                      <h4 className="font-black text-slate-800 uppercase tracking-tight">หน้าที่สมาชิก</h4>
                   </div>
                   <ul className="text-xs text-slate-500 space-y-3 font-bold leading-relaxed">
                     {MEMBERSHIP_REGULATIONS.duties.map((item, i) => (
                       <li key={i} className="flex gap-3 items-start">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></div>
                         {item}
                       </li>
                     ))}
                   </ul>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3 mb-2">
                      <ShieldAlert className="text-rose-500" size={20} />
                      <h4 className="font-black text-slate-800 uppercase tracking-tight">การรักษาสิทธิ</h4>
                   </div>
                   <ul className="text-xs text-slate-500 space-y-3 font-bold leading-relaxed">
                     {MEMBERSHIP_REGULATIONS.maintenance.map((item, i) => (
                       <li key={i} className="flex gap-3 items-start">
                         <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0"></div>
                         {item}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <Award className="text-indigo-600" size={24} />
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">สรุปสิทธิประโยชน์สวัสดิการ</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Object.entries(WELFARE_TYPE_LABELS).map(([type, info]) => {
                    const reg = WELFARE_REGULATIONS[type as WelfareType];
                    return (
                      <div key={type} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
                        <div className="flex items-center gap-4 mb-3">
                          <span className={`w-10 h-10 rounded-2xl ${info.color} flex items-center justify-center font-black group-hover:scale-110 transition-transform`}>{info.label[0]}</span>
                          <h5 className="font-black text-slate-800 text-sm tracking-tight">{info.label}</h5>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-3">
                          {reg.eligibility}
                        </p>
                        <div className="inline-flex px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] font-black text-indigo-600">
                          มูลค่า ฿{info.defaultAmount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-5 items-center justify-between">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center md:text-left">
                * กฎระเบียบปรับปรุงล่าสุด 1 มกราคม 2568
              </p>
              <button 
                onClick={() => { setChecks(prev => ({ ...prev, acknowledgeRules: true })); setIsRegModalOpen(false); }}
                className="w-full md:w-auto px-12 py-4 bg-indigo-900 text-white rounded-[24px] font-black text-sm shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border border-indigo-950"
              >
                <CheckCircle2 size={20} className="text-emerald-400" />
                รับทราบและยอมรับระเบียบทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
