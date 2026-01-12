
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  WELFARE_PAYOUT = 'WELFARE_PAYOUT',
  LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  FUND_INCOME = 'FUND_INCOME'
}

export enum WelfareType {
  BIRTH = 'BIRTH',
  DEATH = 'DEATH',
  HOSPITAL = 'HOSPITAL',
  EDUCATION = 'EDUCATION',
  ELDERLY = 'ELDERLY',
  FUNERAL = 'FUNERAL'
}

export enum IncomeType {
  INTEREST = 'INTEREST',
  FEE = 'FEE',
  FINE = 'FINE',
  DONATION = 'DONATION',
  SUBSIDY = 'SUBSIDY',
  UTILITY_FEE = 'UTILITY_FEE',
  ACTIVITY_FUND = 'ACTIVITY_FUND',
  OTHER = 'OTHER'
}

export type UserRole = 'ADMIN' | 'MEMBER';

export interface CurrentUser {
  role: UserRole;
  memberId?: string; 
  name: string;
}

export interface WelfareRecord {
  id: string;
  memberId: string;
  memberName: string;
  type: WelfareType;
  amount: number;
  date: string;
  note?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'PAYOUT' | 'MEETING' | 'DEADLINE';
  amount?: number;
  reminder?: string;
  remindDaysBefore?: number;
}

export interface Member {
  id: string;
  name: string;
  memberId: string;
  password?: string;
  joinDate: string;
  balance: number;
  loanBalance: number;
  status: 'ACTIVE' | 'INACTIVE';
  lastPaymentDate?: string; 
  idNumber?: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  beneficiaryName?: string;
}

export interface Transaction {
  id: string;
  memberId?: string;
  memberName?: string;
  amount: number;
  type: TransactionType;
  date: string;
  description: string;
  welfareType?: WelfareType;
  incomeType?: IncomeType;
  loanTerm?: number;
  attachment?: string;
  attachmentName?: string;
}

export interface WelfareFundState {
  totalBalance: number;
  totalMembers: number;
  activeLoans: number;
  recentTransactions: Transaction[];
  members: Member[];
  events: CalendarEvent[];
  welfareRecords: WelfareRecord[];
}

export type View = 'DASHBOARD' | 'MEMBERS' | 'TRANSACTIONS' | 'WELFARE' | 'LOANS' | 'AI_INSIGHT' | 'REGISTRATION';
