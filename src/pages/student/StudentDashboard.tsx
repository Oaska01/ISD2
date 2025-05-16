import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StudentSchedule from './StudentSchedule';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout title={`Student Dashboard - ${user?.campus || ''}`}>
      <StudentSchedule />
    </DashboardLayout>
  );
};

export default StudentDashboard;