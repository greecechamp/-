
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  DollarSign, 
  Bell, 
  BellRing,
  X,
  Save,
  Trash2
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface WelfareCalendarProps {
  events: CalendarEvent[];
  onUpdateEvent: (updatedEvent: CalendarEvent) => void;
}

const WelfareCalendar: React.FC<WelfareCalendarProps> = ({ events, onUpdateEvent }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [reminderNote, setReminderNote] = useState('');
  const [remindDays, setRemindDays] = useState(1);

  // Simple calendar helper (Hardcoded for May 2025 for demonstration)
  const daysInMonth = 31;
  const firstDayOfMonth = 4; // Thursday
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const dateStr = `2025-05-${day.toString().padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const handleOpenReminder = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setReminderNote(event.reminder || '');
    setRemindDays(event.remindDaysBefore || 1);
  };

  const handleSaveReminder = () => {
    if (selectedEvent) {
      onUpdateEvent({
        ...selectedEvent,
        reminder: reminderNote,
        remindDaysBefore: remindDays
      });
      setSelectedEvent(null);
    }
  };

  const handleDeleteReminder = () => {
    if (selectedEvent) {
      onUpdateEvent({
        ...selectedEvent,
        reminder: undefined,
        remindDaysBefore: undefined
      });
      setSelectedEvent(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <CalendarIcon className="text-blue-600" />
          ปฏิทินสวัสดิการและกิจกรรม
        </h2>
        <div className="flex items-center gap-4 bg-white p-1 rounded-xl border border-slate-200">
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><ChevronLeft size={18} /></button>
          <span className="text-sm font-bold text-slate-700 px-2">พฤษภาคม 2568</span>
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
            {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 border-collapse">
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="h-28 border-b border-r border-slate-50 bg-slate-50/30"></div>
            ))}
            {calendarDays.map(day => {
              const dayEvents = getEventsForDay(day);
              const isToday = day === 15;
              
              return (
                <div key={day} className={`h-28 border-b border-r border-slate-100 p-2 hover:bg-slate-50 transition-colors relative ${isToday ? 'bg-blue-50/20' : ''}`}>
                  <span className={`text-sm font-bold ${isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-600'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.map(event => (
                      <button 
                        key={event.id} 
                        onClick={() => handleOpenReminder(event)}
                        className={`w-full text-left text-[9px] px-1.5 py-0.5 rounded-md border truncate flex items-center justify-between gap-1 transition-all hover:scale-[1.02] ${
                          event.type === 'PAYOUT' ? 'bg-green-50 text-green-700 border-green-100' :
                          event.type === 'MEETING' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}
                        title={event.title}
                      >
                        <span className="truncate">{event.title}</span>
                        {event.reminder && <BellRing size={8} className="shrink-0 text-red-500 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming List */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">กิจกรรมที่กำลังจะถึง</h3>
            <div className="space-y-4">
              {events.sort((a, b) => a.date.localeCompare(b.date)).map(event => (
                <div 
                  key={event.id} 
                  className="flex gap-4 group cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-xl transition-colors"
                  onClick={() => handleOpenReminder(event)}
                >
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border relative ${
                    event.type === 'PAYOUT' ? 'bg-green-50 border-green-100 text-green-600' :
                    event.type === 'MEETING' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                    'bg-amber-50 border-amber-100 text-amber-600'
                  }`}>
                    <span className="text-xs font-bold leading-none">{new Date(event.date).getDate()}</span>
                    <span className="text-[10px] uppercase font-medium">พ.ค.</span>
                    {event.reminder && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border border-white">
                        <Bell size={8} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{event.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-[11px] text-slate-500">09:00 น.</span>
                      {event.amount && (
                        <>
                          <span className="text-slate-200">|</span>
                          <DollarSign size={12} className="text-green-500" />
                          <span className="text-[11px] font-bold text-green-600">฿{event.amount.toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-all border border-slate-100">
              ดูตารางทั้งหมด
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-sm mb-1 opacity-90">ประกาศสำคัญ</h4>
              <p className="text-xs leading-relaxed opacity-80">
                วันจันทร์ที่ 15 พฤษภาคมนี้ จะมีการแจกแจงสวัสดิการรายปี ณ ศาลาอเนกประสงค์ สมาชิกกรุณานำสมุดกองทุนมาด้วย
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
                <MapPin size={10} />
                ศาลาหมู่บ้าน
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
              <CalendarIcon size={120} />
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Bell size={20} />
                </div>
                <h3 className="font-bold text-slate-800">ตั้งค่าการแจ้งเตือน</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">กิจกรรม</label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-800">{selectedEvent.title}</p>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                    <CalendarIcon size={14} />
                    {selectedEvent.date}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ข้อความแจ้งเตือน (Custom Message)</label>
                <textarea 
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  placeholder="เช่น: อย่าลืมนำสมุดบัญชีมาด้วย..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">แจ้งเตือนล่วงหน้า</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 5, 7].map(days => (
                    <button 
                      key={days}
                      onClick={() => setRemindDays(days)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        remindDays === days 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      {days} วัน
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={handleDeleteReminder}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-red-100 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all"
              >
                <Trash2 size={18} />
                ลบการแจ้งเตือน
              </button>
              <button 
                onClick={handleSaveReminder}
                className="flex-[2] flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                <Save size={18} />
                บันทึกการแจ้งเตือน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelfareCalendar;
