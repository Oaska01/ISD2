import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProctorSchedule from './ProctorSchedule';

const ProctorDashboard = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout title={`Proctor Dashboard - ${user?.campus || ''}`}>
      <ProctorSchedule />
    </DashboardLayout>
  );
};

export default ProctorDashboard;