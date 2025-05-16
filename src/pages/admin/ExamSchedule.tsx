import { useState } from 'react';
import { Plus, Filter, Download, Search, Calendar, Clock } from 'lucide-react';
import { mockExams, mockCampuses, mockCourses, findAvailableRoom, findAvailableProctor } from '../../data/mockData';
import { formatDate, formatTime, sortExamsByDateTime, downloadSchedule } from '../../utils/scheduleUtils';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

const ExamSchedule = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAutoSchedule, setShowAutoSchedule] = useState(false);
  const [autoScheduleForm, setAutoScheduleForm] = useState({
    courseId: '',
    date: '',
    startTime: '',
    duration: 120, // 2 hours default
  });
  
  // Filter exams based on campus and search query
  const filteredExams = sortExamsByDateTime(mockExams.filter(exam => {
    if (selectedCampus && exam.campus !== selectedCampus) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        exam.courseCode.toLowerCase().includes(query) ||
        exam.courseName.toLowerCase().includes(query) ||
        exam.location.toLowerCase().includes(query)
      );
    }
    
    return true;
  }));

  const handleAutoSchedule = () => {
    const course = mockCourses.find(c => c.id === autoScheduleForm.courseId);
    if (!course) {
      toast.error('Please select a course');
      return;
    }

    if (!selectedCampus) {
      toast.error('Please select a campus');
      return;
    }

    const endTime = formatTime(
      addMinutes(
        parse(autoScheduleForm.startTime, 'HH:mm', new Date()),
        autoScheduleForm.duration
      ).toISOString().split('T')[1].substring(0, 5)
    );

    // Find available room and proctor
    const room = findAvailableRoom(
      selectedCampus,
      course.studentCount,
      autoScheduleForm.date,
      autoScheduleForm.startTime,
      endTime,
      mockExams
    );

    const proctor = findAvailableProctor(
      selectedCampus,
      autoScheduleForm.date,
      autoScheduleForm.startTime,
      endTime,
      mockExams
    );

    if (!room) {
      toast.error('No suitable rooms available for this time slot');
      return;
    }

    if (!proctor) {
      toast.error('No available proctors for this time slot');
      return;
    }

    // In a real app, this would make an API call to create the exam
    toast.success(`Exam scheduled successfully:
      Course: ${course.code}
      Room: ${room.name}
      Proctor: ${proctor.name}
      Date: ${formatDate(autoScheduleForm.date)}
      Time: ${formatTime(autoScheduleForm.startTime)} - ${endTime}
    `);

    setShowAutoSchedule(false);
  };
  
  const handleDownload = () => {
    downloadSchedule(filteredExams, 'admin-exam-schedule.pdf');
    toast.success('Schedule downloaded successfully');
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search exams..."
            className="pl-10 w-full sm:w-64 rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
            >
              <option value="">All Campuses</option>
              {mockCampuses.map(campus => (
                <option key={campus.id} value={campus.name}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>
          
          <Button
            variant="primary"
            leftIcon={<Calendar className="w-4 h-4" />}
            onClick={() => setShowAutoSchedule(true)}
          >
            Auto Schedule
          </Button>
          
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>

      {showAutoSchedule && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-medium">Auto Schedule Exam</h3>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={autoScheduleForm.courseId}
                  onChange={(e) => setAutoScheduleForm({
                    ...autoScheduleForm,
                    courseId: e.target.value
                  })}
                >
                  <option value="">Select Course</option>
                  {mockCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code}: {course.name} ({course.studentCount} students)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={autoScheduleForm.date}
                  onChange={(e) => setAutoScheduleForm({
                    ...autoScheduleForm,
                    date: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={autoScheduleForm.startTime}
                  onChange={(e) => setAutoScheduleForm({
                    ...autoScheduleForm,
                    startTime: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="30"
                  step="30"
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={autoScheduleForm.duration}
                  onChange={(e) => setAutoScheduleForm({
                    ...autoScheduleForm,
                    duration: parseInt(e.target.value)
                  })}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAutoSchedule(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAutoSchedule}
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Schedule
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">
            Final Exam Schedule {selectedCampus && `- ${selectedCampus}`}
          </h3>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{exam.courseCode}</div>
                        <div className="text-sm text-gray-500">{exam.courseName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(exam.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.campus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.proctorName || 'Not assigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exam.studentCount || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No exams found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamSchedule;