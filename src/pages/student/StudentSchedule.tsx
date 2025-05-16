import { useState } from 'react';
import { Download, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDate, formatTime, groupExamsByDate, sortExamsByDateTime, downloadSchedule } from '../../utils/scheduleUtils';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentExams } from '../../data/mockData';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const StudentSchedule = () => {
  const { user } = useAuth();
  const studentExams = user ? getStudentExams(user.id) : [];
  const sortedExams = sortExamsByDateTime(studentExams);
  const groupedExams = groupExamsByDate(sortedExams);
  
  const handleDownload = () => {
    downloadSchedule(studentExams, `student-schedule-${user?.name}.pdf`);
    toast.success('Schedule downloaded successfully');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Exam Schedule</h2>
        <Button
          variant="primary"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleDownload}
          disabled={studentExams.length === 0}
        >
          Download Schedule
        </Button>
      </div>
      
      {Object.keys(groupedExams).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedExams).map(([date, exams]) => (
            <Card key={date}>
              <CardHeader className="bg-blue-50">
                <div className="flex items-center">
                  <Calendar className="mr-2 w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">{formatDate(date)}</h3>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="divide-y divide-gray-200">
                  {exams.map(exam => (
                    <div key={exam.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-md font-semibold text-gray-900">{exam.courseCode}: {exam.courseName}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                          </p>
                        </div>
                        
                        <div className="mt-2 md:mt-0">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {exam.location}, {exam.campus}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Remember to bring your student ID and arrive at least 15 minutes before each exam.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Exams Scheduled</h3>
            <p className="text-gray-500">You don't have any exams scheduled at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentSchedule;