import { 
  Role, 
  CourseType, 
  StudentStatus, 
  User, 
  Organization, 
  Course, 
  Halaqa, 
  Student, 
  DailyPlan, 
  RecitationRecord,
  MessageLog,
  GoogleConnection,
  CourseGoogleAssets
} from './types';

// --- SEED DATA ---

const ORGS: Organization[] = [
  { id: 'org1', name: 'مركز النور القرآني', plan: 'PRO' },
  { id: 'org2', name: 'جمعية الفرقان', plan: 'FREE' }
];

const USERS: User[] = [
  { id: 'u1', name: 'أحمد المدير', email: 'admin@platform.com', role: Role.PLATFORM_ADMIN, orgId: 'org1' },
  { id: 'u2', name: 'الشيخ عمر', email: 'manager@alnoor.com', role: Role.ORG_ADMIN, orgId: 'org1' },
  { id: 'u3', name: 'المشرف خالد', email: 'coord@alnoor.com', role: Role.COORDINATOR, orgId: 'org1' },
  { id: 'u4', name: 'المعلم عثمان', email: 'teacher@alnoor.com', role: Role.TEACHER, orgId: 'org1' },
  { id: 'u5', name: 'معلم آخر', email: 'teacher2@alnoor.com', role: Role.TEACHER, orgId: 'org1' }
];

const COURSES: Course[] = [
  { 
    id: 'c1', 
    orgId: 'org1', 
    name: 'دورة سورة البقرة المكثفة', 
    startDate: '2023-10-01', 
    endDate: '2023-12-30', 
    type: CourseType.SURAH_SINGLE, 
    dailyAmount: 'وجه واحد', 
    recitationDays: [0, 1, 2, 3, 4], // Sun-Thu
    passingScore: 8,
    midtermDate: '2023-11-15',
    finalExamDate: '2023-12-28'
  },
  { 
    id: 'c2', 
    orgId: 'org1', 
    name: 'حفظ جزء عم وتبارك', 
    startDate: '2023-09-15', 
    endDate: '2023-11-15', 
    type: CourseType.JUZ_RANGE, 
    dailyAmount: 'نصف وجه', 
    recitationDays: [0, 1, 2, 3, 4],
    passingScore: 7,
    midtermDate: '2023-10-15',
    finalExamDate: '2023-11-14'
  }
];

const HALAQAT: Halaqa[] = [
  { id: 'h1', orgId: 'org1', courseId: 'c1', name: 'حلقة الصديق', teacherId: 'u4', capacity: 15, telegramChatId: '-100123456789' },
  { id: 'h2', orgId: 'org1', courseId: 'c1', name: 'حلقة الفاروق', teacherId: 'u5', capacity: 15, telegramChatId: '-100987654321' },
  { id: 'h3', orgId: 'org1', courseId: 'c2', name: 'براعم القرآن', teacherId: 'u4', capacity: 20 }
];

const STUDENTS: Student[] = [
  { id: 's1', orgId: 'org1', name: 'محمد علي', phone: '0501234567', status: StudentStatus.ACCEPTED, courseId: 'c1', halaqaId: 'h1', gender: 'MALE' },
  { id: 's2', orgId: 'org1', name: 'عبدالله عمر', phone: '0507654321', status: StudentStatus.ACCEPTED, courseId: 'c1', halaqaId: 'h1', gender: 'MALE' },
  { id: 's3', orgId: 'org1', name: 'سارة أحمد', phone: '0509988776', status: StudentStatus.ACCEPTED, courseId: 'c1', halaqaId: 'h2', gender: 'FEMALE' },
  { id: 's4', orgId: 'org1', name: 'يوسف حسن', phone: '0501122334', status: StudentStatus.NEW, courseId: 'c1', gender: 'MALE' },
  { id: 's5', orgId: 'org1', name: 'خالد وليد', phone: '0555555555', status: StudentStatus.ACCEPTED, courseId: 'c1', halaqaId: 'h1', gender: 'MALE' },
];

const DAILY_PLANS: DailyPlan[] = [];
// Generate some dummy plans
const today = new Date();
for(let i=0; i<30; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() - 15 + i);
  DAILY_PLANS.push({
    id: `dp_${i}`,
    courseId: 'c1',
    date: d.toISOString().split('T')[0],
    text: `الصفحة ${i + 1} من سورة البقرة`,
    isExam: i % 10 === 0 && i !== 0
  });
}

const RECORDS: RecitationRecord[] = [];
// Generate recent records
for(let i=0; i<5; i++) {
   const d = new Date(today);
   d.setDate(d.getDate() - i);
   const dateStr = d.toISOString().split('T')[0];
   RECORDS.push({
     id: `r_s1_${i}`, studentId: 's1', date: dateStr, attendance: 'PRESENT', recited: 'YES', score: 9 + (i%2), rating: 'EXCELLENT'
   });
   RECORDS.push({
     id: `r_s2_${i}`, studentId: 's2', date: dateStr, attendance: i === 1 ? 'ABSENT' : 'PRESENT', recited: i===1 ? 'NO' : 'YES', score: i===1?0:8, rating: i===1?'NEEDS_WORK':'GOOD'
   });
}

// --- STORE IMPLEMENTATION ---

class MockStore {
  orgs = ORGS;
  users = USERS;
  courses = COURSES;
  halaqat = HALAQAT;
  students = STUDENTS;
  plans = DAILY_PLANS;
  records = RECORDS;
  messageLogs: MessageLog[] = [];
  
  // Google Integration Store
  googleConnections: GoogleConnection[] = [];
  courseGoogleAssets: CourseGoogleAssets[] = [];

  // Helper
  currentUser: User | null = null;

  login(role: Role) {
    // Auto-select a user based on role for demo
    this.currentUser = this.users.find(u => u.role === role) || this.users[0];
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }

  // Queries
  getOrgStats(orgId: string) {
    return {
      activeCourses: this.courses.filter(c => c.orgId === orgId).length,
      totalStudents: this.students.filter(s => s.orgId === orgId).length,
      totalTeachers: this.users.filter(u => u.orgId === orgId && u.role === Role.TEACHER).length,
    };
  }

  getRecitationCompletion(courseId: string) {
    // Mock metric
    return 85;
  }

  getCourses(orgId: string) {
    return this.courses.filter(c => c.orgId === orgId);
  }

  getHalaqat(courseId: string) {
    return this.halaqat.filter(h => h.courseId === courseId);
  }

  getStudents(orgId: string, courseId?: string, halaqaId?: string) {
    let res = this.students.filter(s => s.orgId === orgId);
    if (courseId) res = res.filter(s => s.courseId === courseId);
    if (halaqaId) res = res.filter(s => s.halaqaId === halaqaId);
    return res;
  }

  getTeachers(courseId: string) {
    // Simplified: get all teachers who have a halaqa in this course
    const halaqat = this.getHalaqat(courseId);
    const teacherIds = [...new Set(halaqat.map(h => h.teacherId))];
    return teacherIds.length;
  }

  getTeacherHalaqat(teacherId: string) {
    return this.halaqat.filter(h => h.teacherId === teacherId);
  }

  getDailyPlan(courseId: string, date: string) {
    return this.plans.find(p => p.courseId === courseId && p.date === date);
  }

  getRecords(halaqaId: string, date: string) {
    // get students in halaqa
    const students = this.students.filter(s => s.halaqaId === halaqaId);
    // get records for these students on this date
    return students.map(s => {
      const record = this.records.find(r => r.studentId === s.id && r.date === date);
      return { student: s, record };
    });
  }

  getGoogleConnection(orgId: string) {
    return this.googleConnections.find(c => c.orgId === orgId);
  }

  getCourseGoogleAssets(courseId: string) {
    return this.courseGoogleAssets.find(a => a.courseId === courseId);
  }

  // Mutations
  addCourse(course: Course) {
    this.courses.push(course);
  }

  updateCourse(courseId: string, updates: Partial<Course>) {
    const idx = this.courses.findIndex(c => c.id === courseId);
    if (idx !== -1) {
      this.courses[idx] = { ...this.courses[idx], ...updates };
    }
  }

  updateCourseAssets(courseId: string, orgId: string, updates: Partial<CourseGoogleAssets>) {
    const idx = this.courseGoogleAssets.findIndex(a => a.courseId === courseId);
    if (idx !== -1) {
      this.courseGoogleAssets[idx] = { ...this.courseGoogleAssets[idx], ...updates };
    } else {
      // Create new if not exists
      this.courseGoogleAssets.push({
        id: `ga_${Date.now()}`,
        orgId,
        courseId,
        formId: '',
        formUrl: '',
        sheetId: '',
        sheetUrl: '',
        createdAt: new Date().toISOString(),
        ...updates
      });
    }
  }

  saveRecords(records: RecitationRecord[]) {
    records.forEach(newRecord => {
      const idx = this.records.findIndex(r => r.studentId === newRecord.studentId && r.date === newRecord.date);
      if (idx >= 0) {
        this.records[idx] = newRecord;
      } else {
        this.records.push(newRecord);
      }
    });
  }

  sendMessage(log: MessageLog) {
    this.messageLogs.push(log);
    // In real app, call Telegram API here
    console.log(`[TELEGRAM] Sending ${log.type} to ${log.target}`);
  }

  // --- GOOGLE INTEGRATION ACTIONS ---

  async connectGoogle(orgId: string): Promise<void> {
    // Simulate OAuth Delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if already connected
    const existing = this.googleConnections.find(c => c.orgId === orgId);
    if (existing) return;

    this.googleConnections.push({
      id: `gc_${Date.now()}`,
      orgId,
      email: 'admin@alnoor-center.com', // Simulated Google Email
      connectedAt: new Date().toISOString(),
      scopes: ['forms.body', 'drive.file', 'spreadsheets'],
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token'
    });
  }

  async disconnectGoogle(orgId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.googleConnections = this.googleConnections.filter(c => c.orgId !== orgId);
  }

  async createCourseForm(courseId: string, orgId: string): Promise<CourseGoogleAssets> {
    // Check connection
    const conn = this.getGoogleConnection(orgId);
    if (!conn) throw new Error("Google account not connected");

    const course = this.courses.find(c => c.id === courseId);
    if (!course) throw new Error("Course not found");

    // Simulate API calls to create Form and Sheet
    await new Promise(resolve => setTimeout(resolve, 3000)); // Creating files takes time

    const assets: CourseGoogleAssets = {
      id: `ga_${Date.now()}`,
      orgId,
      courseId,
      formId: `form_${courseId}_${Date.now()}`,
      formUrl: `https://docs.google.com/forms/d/e/1FAIpQLSeMockFormID${courseId}/viewform`,
      sheetId: `sheet_${courseId}_${Date.now()}`,
      sheetUrl: `https://docs.google.com/spreadsheets/d/mockSheetID${courseId}/edit`,
      createdAt: new Date().toISOString()
    };

    this.courseGoogleAssets.push(assets);
    return assets;
  }

  async syncStudentsFromSheet(courseId: string, orgId: string): Promise<number> {
    const assets = this.getCourseGoogleAssets(courseId);
    if (!assets) throw new Error("No Google Sheet linked");

    // Simulate reading sheet rows
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock incoming students
    const newStudentsCount = 3;
    for (let i = 0; i < newStudentsCount; i++) {
      this.students.push({
        id: `s_imp_${Date.now()}_${i}`,
        orgId,
        courseId,
        name: `طالب جديد ${i + 1}`,
        phone: `05999999${i}`,
        gender: 'MALE',
        status: StudentStatus.NEW
      });
    }

    return newStudentsCount;
  }
}

export const store = new MockStore();
