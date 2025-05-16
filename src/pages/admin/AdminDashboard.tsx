import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Calendar, Users, School } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ExamSchedule from './ExamSchedule';
import ManageProctors from './ManageProctors';
import ManageCampuses from './ManageCampuses';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  
  const tabs = [
    { id: 'schedule', name: 'Exam Schedule', icon: <Calendar className="w-5 h-5" />, path: '' },
    { id: 'proctors', name: 'Proctors', icon: <Users className="w-5 h-5" />, path: 'proctors' },
    { id: 'campuses', name: 'Campuses', icon: <School className="w-5 h-5" />, path: 'campuses' },
  ];
  
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`/admin/${tab.path}`}
                className={`
                  inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="mr-2">{tab.icon}</div>
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      <Routes>
        <Route path="/" element={<ExamSchedule />} />
        <Route path="/proctors" element={<ManageProctors />} />
        <Route path="/campuses" element={<ManageCampuses />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;