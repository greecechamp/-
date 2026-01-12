
import { Member, Transaction, TransactionType, CalendarEvent, WelfareType, WelfareRecord, IncomeType } from './types';

// อัตราดอกเบี้ยเงินกู้มาตรฐาน (Flat Rate) ตามเกณฑ์กองทุนหมู่บ้านต้นแบบ
export const LOAN_INTEREST_RATE_YEARLY = 0.06; // 6% ต่อปี

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.DEPOSIT]: 'ฝากเงินออม',
  [TransactionType.WITHDRAW]: 'ถอนเงินออม',
  [TransactionType.WELFARE_PAYOUT]: 'จ่ายสวัสดิการ',
  [TransactionType.LOAN_DISBURSEMENT]: 'จ่ายเงินกู้',
  [TransactionType.LOAN_REPAYMENT]: 'คืนเงินต้นเงินกู้',
  [TransactionType.FUND_INCOME]: 'รายได้กองทุน',
};

export const INCOME_TYPE_LABELS: Record<IncomeType, { label: string, color: string }> = {
  [IncomeType.INTEREST]: { label: 'ดอกเบี้ยเงินกู้', color: 'bg-emerald-100 text-emerald-700' },
  [IncomeType.FEE]: { label: 'ค่าธรรมเนียมแรกเข้า', color: 'bg-slate-100 text-slate-700' },
  [IncomeType.FINE]: { label: 'ค่าปรับ', color: 'bg-rose-100 text-rose-700' },
  [IncomeType.DONATION]: { label: 'เงินบริจาค', color: 'bg-purple-100 text-purple-700' },
  [IncomeType.SUBSIDY]: { label: 'เงินสนับสนุนจากหน่วยงาน', color: 'bg-cyan-100 text-cyan-700' },
  [IncomeType.UTILITY_FEE]: { label: 'ค่าธรรมเนียมสาธารณูปโภค', color: 'bg-indigo-100 text-indigo-700' },
  [IncomeType.ACTIVITY_FUND]: { label: 'เงินกิจกรรมประเพณี', color: 'bg-orange-100 text-orange-700' },
  [IncomeType.OTHER]: { label: 'รายได้อื่นๆ', color: 'bg-slate-100 text-slate-700' },
};

export const WELFARE_TYPE_LABELS: Record<WelfareType, { label: string, color: string, defaultAmount: number }> = {
  [WelfareType.BIRTH]: { label: 'รับขวัญบุตรใหม่', color: 'bg-pink-100 text-pink-700', defaultAmount: 3000 },
  [WelfareType.DEATH]: { label: 'จัดการศพ/ฌาปนกิจ', color: 'bg-slate-100 text-slate-700', defaultAmount: 20000 },
  [WelfareType.HOSPITAL]: { label: 'เยี่ยมไข้/นอนรพ.', color: 'bg-blue-100 text-blue-700', defaultAmount: 1000 },
  [WelfareType.EDUCATION]: { label: 'ทุนการศึกษา', color: 'bg-purple-100 text-purple-700', defaultAmount: 3000 },
  [WelfareType.ELDERLY]: { label: 'เบี้ยยังชีพผู้สูงอายุ', color: 'bg-emerald-100 text-emerald-700', defaultAmount: 1200 },
  [WelfareType.FUNERAL]: { label: 'เงินสงเคราะห์งานศพ', color: 'bg-zinc-800 text-zinc-100', defaultAmount: 30000 },
};

export const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'จักรภพ แสงแก้ว', memberId: 'M001', password: 'password', joinDate: '2023-01-15', balance: 5400, loanBalance: 0, status: 'ACTIVE' },
  { id: '2', name: 'ศักดิ์สิทธิ์ อินทรฟ้าสาง', memberId: 'M002', password: 'password', joinDate: '2023-02-10', balance: 3200, loanBalance: 15000, status: 'ACTIVE' },
  { id: '3', name: 'นพดล กาบแก้ว', memberId: 'M003', password: 'password', joinDate: '2023-03-05', balance: 8900, loanBalance: 0, status: 'ACTIVE' },
  { id: '4', name: 'สาธิต ประสมทอง', memberId: 'M004', password: 'password', joinDate: '2023-05-20', balance: 1200, loanBalance: 0, status: 'ACTIVE' },
  { id: '5', name: 'บุญเอื้อม แสงแก้ว', memberId: 'M005', password: 'password', joinDate: '2023-06-12', balance: 2500, loanBalance: 0, status: 'ACTIVE' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', memberId: 'M001', memberName: 'จักรภพ แสงแก้ว', amount: 500, type: TransactionType.DEPOSIT, date: '2024-05-01', description: 'เงินออมรายเดือน' },
  { id: 't2', memberId: 'M002', memberName: 'ศักดิ์สิทธิ์ อินทรฟ้าสาง', amount: 15000, type: TransactionType.LOAN_DISBURSEMENT, date: '2024-05-05', description: 'กู้ยืมเพื่อการเกษตร' },
  { id: 't3', memberId: 'M003', memberName: 'นพดล กาบแก้ว', amount: 3000, type: TransactionType.WELFARE_PAYOUT, date: '2024-05-10', description: 'สวัสดิการเจ็บป่วย', welfareType: WelfareType.HOSPITAL },
  { id: 't4', memberId: 'M002', memberName: 'ศักดิ์สิทธิ์ อินทรฟ้าสาง', amount: 150, type: TransactionType.FUND_INCOME, date: '2024-05-12', description: 'ดอกเบี้ยเงินกู้งวดที่ 1', incomeType: IncomeType.INTEREST },
  { id: 't5', amount: 5000, type: TransactionType.FUND_INCOME, date: '2024-05-15', description: 'งบประมาณจาก อบต.', incomeType: IncomeType.SUBSIDY },
  { id: 't6', amount: 1200, type: TransactionType.FUND_INCOME, date: '2024-05-18', description: 'รายได้งานบุญประจำปี', incomeType: IncomeType.ACTIVITY_FUND },
];

export const INITIAL_WELFARE_RECORDS: WelfareRecord[] = [
  { id: 'w1', memberId: 'M003', memberName: 'นพดล กาบแก้ว', type: WelfareType.HOSPITAL, amount: 3000, date: '2024-05-10', note: 'นอนโรงพยาบาล 3 คืน' }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'จ่ายเบี้ยยังชีพผู้สูงอายุ', date: '2025-05-10', type: 'PAYOUT', amount: 12500 },
  { id: 'e2', title: 'ประชุมสามัญประจำเดือน', date: '2025-05-15', type: 'MEETING' },
  { id: 'e3', title: 'ครบกำหนดส่งเงินออมรายเดือน', date: '2025-05-05', type: 'DEADLINE' },
  { id: 'e4', title: 'มอบทุนการศึกษาบุตรหลาน', date: '2025-05-25', type: 'PAYOUT', amount: 5000 },
];

export const MEMBERSHIP_REGULATIONS = {
  qualifications: [
    "ต้องเป็นผู้มีชื่อในทะเบียนบ้านในหมู่บ้านบ้านเขาเสวยราชไม่น้อยกว่า 6 เดือน",
    "มีอายุตั้งแต่ 15 ปีบริบูรณ์ขึ้นไป",
    "มีความเต็มใจปฏิบัติตามระเบียบข้อบังคับของกองทุนทุกประการ"
  ],
  duties: [
    "ต้องส่งเงินออมรายเดือนขั้นต่ำ 100 บาท และไม่เกิน 3,000 บาทต่อเดือน",
    "ต้องเข้าร่วมการประชุมสามัญสมาชิกอย่างน้อยปีละ 1 ครั้ง",
    "ต้องแจ้งเปลี่ยนข้อมูลส่วนบุคคล (ที่อยู่/เบอร์โทร) ทันทีที่มีการเปลี่ยนแปลง"
  ],
  maintenance: [
    "หากขาดส่งเงินออมติดต่อกันเกิน 3 เดือน จะถูกระงับสิทธิการขอกู้เงินชั่วคราว",
    "หากขาดส่งเงินออมติดต่อกันเกิน 6 เดือน จะถูกระงับสิทธิสวัสดิการทุกประเภท",
    "การกลับมาใช้สิทธิ์ต้องออมเงินย้อนหลังให้ครบและรอระยะเวลาพักสิทธิ์ 3 เดือน"
  ],
  termination: [
    "ลาออกจากการเป็นสมาชิกด้วยความสมัครใจ",
    "ถึงแก่ความตาย (โอนสิทธิให้ผู้รับผลประโยชน์ตามระเบียบ)",
    "กระทำผิดวินัยร้ายแรง หรือทุจริตต่อกองทุน (มติที่ประชุม 2 ใน 3 ให้พ้นสภาพ)"
  ]
};

export const WELFARE_REGULATIONS: Record<WelfareType, { 
  eligibility: string; 
  conditions: string[]; 
  documents: string[]; 
  note: string;
}> = {
  [WelfareType.BIRTH]: {
    eligibility: "เป็นสมาชิกติดต่อกันไม่น้อยกว่า 12 เดือน และมีการออมสม่ำเสมอ",
    conditions: [
      "จ่ายสวัสดิการเป็นเงินขวัญถุง 3,000 บาท ต่อบุตร 1 คน",
      "จำกัดสิทธิ์บุตรไม่เกิน 3 คนต่อครอบครัวสมาชิก",
      "สมาชิกต้องไม่มีประวัติค้างชำระเงินกู้เกิน 3 เดือนในปีที่ผ่านมา",
      "ต้องแจ้งใช้สิทธิ์ภายใน 90 วันนับจากวันที่ระบุในสูติบัตร"
    ],
    documents: ["สูติบัตรบุตร (สำเนา)", "ทะเบียนบ้านที่มีชื่อบุตร", "สมุดเงินออมกองทุน"],
    note: "สวัสดิการเพื่อส่งเสริมคุณภาพชีวิตประชากรใหม่ในชุมชน อิงตามโมเดลกองทุนหมู่บ้านดีเด่น"
  },
  [WelfareType.DEATH]: {
    eligibility: "เป็นสมาชิกติดต่อกันไม่น้อยกว่า 6 เดือน",
    conditions: [
      "กรณีสมาชิกเสียชีวิต มอบเงินช่วยเหลือ 20,000 บาท",
      "กรณีคู่สมรสหรือบุตรเสียชีวิต มอบเงินช่วยเหลือ 5,000 บาท",
      "เงินช่วยเหลือจะถูกหักหนี้ค้างชำระ (ถ้ามี) ก่อนมอบให้ผู้รับผลประโยชน์",
      "ต้องระบุชื่อผู้รับผลประโยชน์ไว้ในฐานข้อมูลล่วงหน้า"
    ],
    documents: ["ใบมรณบัตร", "สำเนาทะเบียนบ้านประทับตราตาย", "บัตรประชาชนผู้รับผลประโยชน์"],
    note: "หลักประกันความมั่นคงสุดท้าย เพื่อไม่ให้เป็นภาระแก่ผู้อยู่เบื้องหลัง"
  },
  [WelfareType.HOSPITAL]: {
    eligibility: "เป็นสมาชิกติดต่อกันไม่น้อยกว่า 3 เดือน",
    conditions: [
      "ต้องนอนพักรักษาตัวที่โรงพยาบาลไม่น้อยกว่า 2 คืน",
      "จ่ายเงินเยี่ยมไข้ครั้งละ 1,000 บาท (สูงสุดไม่เกิน 3,000 บาทต่อปี)",
      "ไม่ครอบคลุมการศัลยกรรมเพื่อความงามหรือการรักษาที่ไม่จำเป็น"
    ],
    documents: ["ใบรับรองแพทย์ฉบับจริง", "ใบสรุปค่ารักษาพยาบาล", "สมุดเงินออมกองทุน"],
    note: "การดูแลยามเจ็บป่วยเป็นสิทธิขั้นพื้นฐานที่สมาชิกพึงได้รับ"
  },
  [WelfareType.EDUCATION]: {
    eligibility: "เป็นสมาชิกติดต่อกันไม่น้อยกว่า 24 เดือน และมีเงินออมสะสมไม่ต่ำกว่า 5,000 บาท",
    conditions: [
      "มอบให้บุตรสมาชิกที่กำลังศึกษา (จำกัด 1 ทุนต่อครอบครัวต่อปี)",
      "พิจารณาจากความประพฤติและการมีส่วนร่วมในกิจกรรมหมู่บ้านของสมาชิก",
      "ทุนละ 3,000 บาท มอบให้ในช่วงเดือนพฤษภาคมของทุกปี"
    ],
    documents: ["ใบรับรองสถานะนักเรียน/นิสิต/นักศึกษา", "สำเนาผลการเรียนล่าสุด", "รูปถ่ายกิจกรรมจิตอาสา (ถ้ามี)"],
    note: "ลงทุนในปัญญา คือการสร้างอนาคตที่ยั่งยืนให้บ้านเขาเสวยราช"
  },
  [WelfareType.ELDERLY]: {
    eligibility: "สมาชิกอายุ 60 ปีขึ้นไป และเป็นสมาชิกมาไม่น้อยกว่า 5 ปี",
    conditions: [
      "มอบเบี้ยยังชีพพิเศษ 1,200 บาทต่อปี (จ่ายครั้งเดียว)",
      "สมาชิกต้องเข้าร่วมการประชุมสามัญประจำปีอย่างน้อย 1 ครั้ง",
      "มอบให้ในวันกตัญญูผู้สูงอายุช่วงเทศกาลสงกรานต์"
    ],
    documents: ["บัตรประชาชนสมาชิก", "สมุดเงินออมกองทุน"],
    note: "ตอบแทนผู้อาวุเอสที่ร่วมสร้างและรักษากองทุนมาอย่างยาวนาน"
  },
  [WelfareType.FUNERAL]: {
    eligibility: "สมาชิกโครงการฌาปนกิจส่วนเสริม (สมัครใจ)",
    conditions: [
      "จ่ายเงินสงเคราะห์ตามฐานจำนวนสมาชิก (ประมาณ 30,000 บาท)",
      "ต้องส่งเงินสมทบรายเดือนเข้ากองทุนส่วนเสริมไม่ขาดสาย",
      "จ่ายเงินงวดแรก 50% ภายใน 12 ชั่วโมงเพื่อเป็นค่าใช้จ่ายเร่งด่วน"
    ],
    documents: ["หลักฐานการเสียชีวิต", "บัตรสมาชิกโครงการฌาปนกิจ"],
    note: "ระบบช่วยเหลือเกื้อกูลกันในวาระสุดท้ายตามวิถีชุมชนไทยที่เขแข็ง"
  }
};
