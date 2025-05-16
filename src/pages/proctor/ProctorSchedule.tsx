import { Download, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDate, formatTime, downloadSchedule } from '../../utils/scheduleUtils';
import { useAuth } from '../../contexts/AuthContext';
import { getProctorExams } from '../../data/mockData';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const ProctorSchedule = () => {
  const { user } = useAuth();
  const proctorExams = user ? getProctorExams(user.id) : [];
  
  const handleDownload = () => {
    downloadSchedule(proctorExams, `proctor-schedule-${user?.name}.pdf`);
    toast.success('Schedule downloaded successfully');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Assigned Exams</h2>
        <Button
          variant="primary"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleDownload}
        >
          Download Schedule
        </Button>
      </div>
      
      {proctorExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proctorExams.map(exam => (
            <Card key={exam.id} className="h-full">
              <CardHeader className="flex items-start">
                <div className="mr-4 bg-blue-100 p-2 rounded-md">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{exam.courseCode}</h3>
                  <p className="text-sm text-gray-600">{exam.courseName}</p>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <span className="font-medium w-24">Date:</span>
                    <span>{formatDate(exam.date)}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="font-medium w-24">Time:</span>
                    <span>{formatTime(exam.startTime)} - {formatTime(exam.endTime)}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="font-medium w-24">Location:</span>
                    <span>{exam.location}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="font-medium w-24">Campus:</span>
                    <span>{exam.campus}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Assigned Exams</h3>
            <p className="text-gray-500">You don't have any assigned exams at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProctorSchedule;