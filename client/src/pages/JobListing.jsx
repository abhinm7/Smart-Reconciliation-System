import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/upload/get-jobs');
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusBadge = (status) => {

    const s = status.toLowerCase(); 
    
    if (s === 'completed') return 'bg-green-100 text-green-800';
    if (s === 'failed') return 'bg-red-100 text-red-800';
    if (s === 'processing' || s === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-10 text-center">Loading your jobs...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Your Reconciliations</h1>
          <p className="text-gray-500">Manage your system data and bank uploads</p>
        </div>
        <div className="space-x-4">
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">Logout</button>
            <Link 
              to="/upload" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition"
            >
              + Upload New File
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                  No jobs found. Click "Upload New File" to start! 🚀
                </td>
              </tr>   
            ) : (
              jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.fileName}
                    <div className="text-xs text-gray-400 font-normal">
                        {new Date(job.createdAt).toLocaleDateString()} at {new Date(job.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.type === 'SYSTEM_DATA' ? 'System Data' : 'Reconciliation'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          
                    {/* {job.processedRecords} / {job.totalRecords || '?'} */}
                        { Math.floor((job.processedRecords/job.totalRecords)*100) }
                

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Only show "View" button if it is a Reconciliation job and it is completed */}
                    {job.status.toLowerCase() === 'completed' && job.type === 'RECONCILIATION' ? (
                      <Link to={`/dashboard/${job._id}`} className="text-indigo-600 hover:text-indigo-900 font-bold border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50">
                        View Results →
                      </Link>
                    ) : job.status.toLowerCase() === 'completed' && job.type === 'SYSTEM_DATA' ? (
                        <span className="text-gray-500 italic">Data Indexed</span>
                    ) : (
                      <span className="text-gray-400 animate-pulse">Processing...</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobListing;