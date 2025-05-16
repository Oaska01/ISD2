import { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

// Mock proctors data
const mockProctors = [
  { id: '1', name: 'Proctor User', email: 'proctor@example.com', campus: 'Main Campus', assignedExams: 3 },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', campus: 'West Campus', assignedExams: 2 },
  { id: '3', name: 'John Doe', email: 'john.doe@example.com', campus: 'South Campus', assignedExams: 1 },
  { id: '4', name: 'Sarah Johnson', email: 'sarah.j@example.com', campus: 'Main Campus', assignedExams: 4 },
  { id: '5', name: 'Michael Brown', email: 'mbrown@example.com', campus: 'West Campus', assignedExams: 0 },
];

const ManageProctors = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter proctors based on search query
  const filteredProctors = mockProctors.filter(proctor => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      proctor.name.toLowerCase().includes(query) ||
      proctor.email.toLowerCase().includes(query) ||
      proctor.campus.toLowerCase().includes(query)
    );
  });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search proctors..."
            className="pl-10 w-full sm:w-64 rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => toast.success('This would open a form to add a new proctor')}
        >
          Add Proctor
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Proctors</h3>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campus
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Exams
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProctors.length > 0 ? (
                  filteredProctors.map((proctor) => (
                    <tr key={proctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{proctor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proctor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proctor.campus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          proctor.assignedExams > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {proctor.assignedExams}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          onClick={() => toast.success(`Edit proctor: ${proctor.name}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => toast.success(`Remove proctor: ${proctor.name}`)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No proctors found matching your search
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

export default ManageProctors;