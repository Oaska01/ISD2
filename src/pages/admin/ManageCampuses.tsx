import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { mockCampuses } from '../../data/mockData';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

const ManageCampuses = () => {
  const [newCampus, setNewCampus] = useState<string>('');
  const [campuses, setCampuses] = useState(mockCampuses);
  
  const handleAddCampus = () => {
    if (!newCampus.trim()) {
      toast.error('Please enter a campus name');
      return;
    }
    
    // Check if campus already exists
    if (campuses.some(campus => campus.name.toLowerCase() === newCampus.toLowerCase())) {
      toast.error('This campus already exists');
      return;
    }
    
    // Add new campus
    setCampuses([
      ...campuses,
      {
        id: `${campuses.length + 1}`,
        name: newCampus.trim(),
      },
    ]);
    
    setNewCampus('');
    toast.success(`Campus "${newCampus}" added successfully`);
  };
  
  const handleRemoveCampus = (id: string, name: string) => {
    setCampuses(campuses.filter(campus => campus.id !== id));
    toast.success(`Campus "${name}" removed successfully`);
  };
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-medium">Add New Campus</h3>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter campus name"
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={newCampus}
                onChange={(e) => setNewCampus(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCampus();
                  }
                }}
              />
            </div>
            
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleAddCampus}
            >
              Add Campus
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Campuses</h3>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campuses.map((campus) => (
                  <tr key={campus.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campus.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        onClick={() => toast.success(`Edit campus: ${campus.name}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveCampus(campus.id, campus.name)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageCampuses;