export enum Role {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  COORDINATOR = 'COORDINATOR',
  TEACHER = 'TEACHER'
}

export enum CourseType {
  SURAH_SINGLE = 'SURAH_SINGLE',
  JUZ_RANGE = 'JUZ_RANGE',
  MULTI_SURAHS = 'MULTI_SURAHS'
}

export enum StudentStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WAITLIST = 'WAITLIST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string;
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: 'FREE' | 'PRO';
}

export interface Course {
  id: string;
  orgId: string;
  name: string;
  startDate: string;
  endDate: string;
  type: CourseType;
  dailyAmount: string;
  recitationDays: number[]; // 0=Sun, 1=Mon...
  passingScore: number;
  // New fields from sketch
  logo?: string;
  midtermDate?: string;
  finalExamDate?: string;
}

export interface Halaqa {
  id: string;
  orgId: string;
  courseId: string;
  name: string;
  teacherId: string;
  telegramChatId?: string;
  capacity: number;
}

export interface Student {
  id: string;
  orgId: string;
  name: string;
  phone: string;
  status: StudentStatus;
  halaqaId?: string;
  courseId: string;
  gender: 'MALE' | 'FEMALE';
}

export interface DailyPlan {
  id: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  text: string;
  isExam: boolean;
}

export interface RecitationRecord {
  id: string;
  studentId: string;
  date: string;
  attendance: 'PRESENT' | 'ABSENT' | 'EXCUSED';
  recited: 'YES' | 'PARTIAL' | 'NO';
  score: number;
  rating: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK';
  notes?: string;
}

export interface MessageLog {
  id: string;
  orgId: string;
  type: 'DAILY_PLAN' | 'REMINDER' | 'MOTIVATION';
  target: string;
  sentAt: string;
  status: 'SENT' | 'FAILED';
}

// --- GOOGLE INTEGRATION TYPES ---

export interface GoogleConnection {
  id: string;
  orgId: string;
  email: string; // The connected Google account email
  connectedAt: string;
  accessToken?: string; // Encrypted in real DB
  refreshToken?: string; // Encrypted in real DB
  scopes: string[];
}

export interface CourseGoogleAssets {
  id: string;
  orgId: string;
  courseId: string;
  formId: string;
  formUrl: string;
  sheetId: string;
  sheetUrl: string;
  createdAt: string;
  // New fields from sketch
  midtermExamUrl?: string;
  finalExamUrl?: string;
}
