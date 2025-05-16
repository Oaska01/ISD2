import { format, parse } from 'date-fns';
import { Exam } from '../data/mockData';

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  return format(date, 'MMMM d, yyyy');
};

// Format time for display
export const formatTime = (timeString: string): string => {
  const time = parse(timeString, 'HH:mm', new Date());
  return format(time, 'h:mm a');
};

// Group exams by date for easier display
export const groupExamsByDate = (exams: Exam[]): { [key: string]: Exam[] } => {
  return exams.reduce<{ [key: string]: Exam[] }>((acc, exam) => {
    if (!acc[exam.date]) {
      acc[exam.date] = [];
    }
    acc[exam.date].push(exam);
    return acc;
  }, {});
};

// Sort exams by date and time
export const sortExamsByDateTime = (exams: Exam[]): Exam[] => {
  return [...exams].sort((a, b) => {
    // First compare dates
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    
    // If dates are the same, compare times
    if (a.startTime < b.startTime) return -1;
    if (a.startTime > b.startTime) return 1;
    
    return 0;
  });
};

// Generate a mock PDF download
export const downloadSchedule = (exams: Exam[], filename = 'exam-schedule.pdf'): void => {
  // In a real app, this would generate an actual PDF
  // For this mock-up, we'll create a text representation of the schedule
  let content = 'EXAM SCHEDULE\n\n';
  
  const groupedExams = groupExamsByDate(sortExamsByDateTime(exams));
  
  Object.entries(groupedExams).forEach(([date, dayExams]) => {
    content += `${formatDate(date)}\n`;
    content += '----------------------------------------\n';
    
    dayExams.forEach(exam => {
      content += `${exam.courseCode}: ${exam.courseName}\n`;
      content += `Time: ${formatTime(exam.startTime)} - ${formatTime(exam.endTime)}\n`;
      content += `Location: ${exam.location} (${exam.campus})\n\n`;
    });
  });
  
  // Create a blob and trigger download
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};