import { format, addMinutes, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

// Types
export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  campus: string;
  proctorId?: string;
  proctorName?: string;
  studentCount?: number;
}

export interface Campus {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  studentCount: number;
}

export interface Room {
  id: string;
  name: string;
  campus: string;
  capacity: number;
  hasProjector: boolean;
  hasComputers: boolean;
  isAccessible: boolean;
}

export interface Proctor {
  id: string;
  name: string;
  email: string;
  campus: string;
  availability: TimeSlot[];
  maxExamsPerDay: number;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

// Mock data
export const mockCampuses: Campus[] = [
  { id: '1', name: 'Main Campus' },
  { id: '2', name: 'West Campus' },
  { id: '3', name: 'South Campus' },
  { id: '4', name: 'Online' },
];

export const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Room A100',
    campus: 'Main Campus',
    capacity: 50,
    hasProjector: true,
    hasComputers: false,
    isAccessible: true,
  },
  {
    id: '2',
    name: 'Lab B200',
    campus: 'Main Campus',
    capacity: 30,
    hasProjector: true,
    hasComputers: true,
    isAccessible: true,
  },
  {
    id: '3',
    name: 'Hall C',
    campus: 'West Campus',
    capacity: 100,
    hasProjector: true,
    hasComputers: false,
    isAccessible: true,
  },
  {
    id: '4',
    name: 'Lab D100',
    campus: 'South Campus',
    capacity: 40,
    hasProjector: true,
    hasComputers: true,
    isAccessible: true,
  },
];

export const mockProctors: Proctor[] = [
  {
    id: '1',
    name: 'Proctor User',
    email: 'proctor@example.com',
    campus: 'Main Campus',
    availability: [
      { date: '2025-05-15', startTime: '09:00', endTime: '17:00' },
      { date: '2025-05-16', startTime: '09:00', endTime: '17:00' },
      { date: '2025-05-17', startTime: '09:00', endTime: '17:00' },
    ],
    maxExamsPerDay: 3,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    campus: 'West Campus',
    availability: [
      { date: '2025-05-15', startTime: '09:00', endTime: '17:00' },
      { date: '2025-05-16', startTime: '09:00', endTime: '17:00' },
    ],
    maxExamsPerDay: 2,
  },
];

export const mockCourses: Course[] = [
  { id: '1', code: 'CS101', name: 'Introduction to Computer Science', studentCount: 45 },
  { id: '2', code: 'MATH201', name: 'Calculus II', studentCount: 35 },
  { id: '3', code: 'ENG103', name: 'English Composition', studentCount: 30 },
  { id: '4', code: 'BIO220', name: 'Molecular Biology', studentCount: 25 },
  { id: '5', code: 'PHYS150', name: 'Physics I', studentCount: 40 },
  { id: '6', code: 'CHEM101', name: 'General Chemistry', studentCount: 35 },
  { id: '7', code: 'HIST210', name: 'World History', studentCount: 50 },
  { id: '8', code: 'PSYC101', name: 'Introduction to Psychology', studentCount: 60 },
];

export const mockExams: Exam[] = [
  {
    id: '1',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    date: '2025-05-15',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Room A100',
    campus: 'Main Campus',
    proctorId: '1',
    proctorName: 'Proctor User',
    studentCount: 45,
  },
  {
    id: '2',
    courseCode: 'MATH201',
    courseName: 'Calculus II',
    date: '2025-05-16',
    startTime: '13:00',
    endTime: '15:00',
    location: 'Room B200',
    campus: 'Main Campus',
    proctorId: '2',
    proctorName: 'Proctor User',
    studentCount: 35,
  },
  {
    id: '3',
    courseCode: 'ENG103',
    courseName: 'English Composition',
    date: '2025-05-17',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Hall C',
    campus: 'West Campus',
    studentCount: 30,
  },
  {
    id: '4',
    courseCode: 'BIO220',
    courseName: 'Molecular Biology',
    date: '2025-05-18',
    startTime: '14:00',
    endTime: '16:30',
    location: 'Lab D100',
    campus: 'South Campus',
    studentCount: 25,
  },
  {
    id: '5',
    courseCode: 'PHYS150',
    courseName: 'Physics I',
    date: '2025-05-19',
    startTime: '09:00',
    endTime: '11:30',
    location: 'Room A101',
    campus: 'Main Campus',
    studentCount: 40,
  },
  {
    id: '6',
    courseCode: 'CHEM101',
    courseName: 'General Chemistry',
    date: '2025-05-20',
    startTime: '13:00',
    endTime: '15:00',
    location: 'Lab E200',
    campus: 'South Campus',
    studentCount: 35,
  },
  {
    id: '7',
    courseCode: 'HIST210',
    courseName: 'World History',
    date: '2025-05-21',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Hall B',
    campus: 'West Campus',
    studentCount: 50,
  },
  {
    id: '8',
    courseCode: 'PSYC101',
    courseName: 'Introduction to Psychology',
    date: '2025-05-22',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Room C300',
    campus: 'Main Campus',
    proctorId: '2',
    proctorName: 'Proctor User',
    studentCount: 60,
  },
];

// Scheduling utilities
export const isTimeSlotAvailable = (
  proctor: Proctor,
  date: string,
  startTime: string,
  endTime: string,
  existingExams: Exam[]
): boolean => {
  // Check if within proctor's availability
  const availableSlot = proctor.availability.find(slot => 
    slot.date === date &&
    slot.startTime <= startTime &&
    slot.endTime >= endTime
  );

  if (!availableSlot) return false;

  // Check for conflicts with existing exams
  const proctorExams = existingExams.filter(exam => exam.proctorId === proctor.id && exam.date === date);
  const examInterval = { start: startTime, end: endTime };

  return !proctorExams.some(exam => 
    areIntervalsOverlapping(
      { start: exam.startTime, end: exam.endTime },
      examInterval
    )
  );
};

export const isRoomAvailable = (
  room: Room,
  date: string,
  startTime: string,
  endTime: string,
  existingExams: Exam[]
): boolean => {
  const roomExams = existingExams.filter(
    exam => exam.location === room.name && exam.date === date
  );

  const examInterval = { start: startTime, end: endTime };

  return !roomExams.some(exam =>
    areIntervalsOverlapping(
      { start: exam.startTime, end: exam.endTime },
      examInterval
    )
  );
};

export const findAvailableRoom = (
  campus: string,
  studentCount: number,
  date: string,
  startTime: string,
  endTime: string,
  existingExams: Exam[]
): Room | null => {
  return mockRooms.find(room =>
    room.campus === campus &&
    room.capacity >= studentCount &&
    isRoomAvailable(room, date, startTime, endTime, existingExams)
  ) || null;
};

export const findAvailableProctor = (
  campus: string,
  date: string,
  startTime: string,
  endTime: string,
  existingExams: Exam[]
): Proctor | null => {
  return mockProctors.find(proctor =>
    proctor.campus === campus &&
    isTimeSlotAvailable(proctor, date, startTime, endTime, existingExams)
  ) || null;
};

// Mock student schedules
export const mockStudentSchedule = [
  {
    studentId: '3',
    examIds: ['1', '2', '5', '8'],
  },
];

// Utility functions
export const getProctorExams = (proctorId: string): Exam[] => {
  return mockExams.filter(exam => exam.proctorId === proctorId);
};

export const getStudentExams = (studentId: string): Exam[] => {
  const schedule = mockStudentSchedule.find(s => s.studentId === studentId);
  if (!schedule) return [];
  return mockExams.filter(exam => schedule.examIds.includes(exam.id));
};

export const getExamsByCampus = (campusName: string): Exam[] => {
  return mockExams.filter(exam => exam.campus === campusName);
};