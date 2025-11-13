import { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Phone, Filter } from 'lucide-react';
import { api } from '../services/api';
import { Worker } from '../types';
import { useAuth } from '../context/AuthContext';

const WorkerListing = () => {
  const [allWorkers, setAllWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [callState, setCallState] = useState<{ [key: string]: { loading: boolean; message: string } }>({});
  const { user } = useAuth();
    const nav = useNavigate();
  if(!user){
    nav("/login");
  }

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const data = await api.getWorkers();
        setAllWorkers(data);
        setFilteredWorkers(data);
      } catch (err) {
        console.error('Error fetching workers:', err);
        setError('Failed to load workers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const getAllSkills = () => {
    const defaultSkills = ['All'];
    const dynamicSkills = new Set<string>();

    allWorkers.forEach((worker) => {
      worker.skills.forEach((skill) => {
        const normalized = skill.trim().toLowerCase();
        dynamicSkills.add(normalized);
      });
    });

    const capitalizedSkills = Array.from(dynamicSkills).map(
      (skill) => skill.charAt(0).toUpperCase() + skill.slice(1)
    );

    return [...defaultSkills, ...capitalizedSkills];
  };

  const handleSkillFilter = async (skill: string) => {
    setSelectedSkill(skill);
    setLoading(true);
    try {
      if (skill === 'All') {
        setFilteredWorkers(allWorkers);
      } else {
        const normalizedSkill = skill.trim().toLowerCase();
        const filtered = allWorkers.filter((worker) =>
          worker.skills.some((s) => s.trim().toLowerCase() === normalizedSkill)
        );
        setFilteredWorkers(filtered);
      }
    } catch (err) {
      console.error('Error filtering workers:', err);
      setError('Failed to filter workers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = async (workerId: string, phone: string) => {
    setCallState((prevState) => ({
      ...prevState,
      [workerId]: { loading: true, message: '' },
    }));

    try {
      const result = await api.callWorker(workerId, phone);
      setCallState((prevState) => ({
        ...prevState,
        [workerId]: {
          loading: false,
          message: result.success ? 'Call initiated to customer' : 'Failed to initiate call',
        },
      }));
    } catch (err) {
      setCallState((prevState) => ({
        ...prevState,
        [workerId]: { loading: false, message: 'An error occurred while trying to make the call.' },
      }));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Find Skilled Workers</h1>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block md:w-1/4 lg:w-1/5">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Filter by Skill</h2>
              <div className="space-y-2">
                {getAllSkills().map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillFilter(skill)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      selectedSkill === skill
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Workers list */}
          <div className="md:w-3/4 lg:w-4/5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredWorkers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
                <p className="text-gray-600">
                  No workers matching your selected criteria were found. Try another skill category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkers.map((worker) =>
                  worker.id !== user?.id ? (
                    <div
                      key={worker.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-5">
                        <div className="flex items-start mb-4">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-4 flex-shrink-0">
                            {worker.avatar ? (
                              <img
                                src={worker.avatar}
                                alt={worker.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-lg">
                                {worker.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{worker.name}</h3>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">
                                {worker.rating} ({worker.completedJobs} jobs)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {worker.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Experience:</span> {worker.experience} years
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Rate:</span> ${worker.hourlyRate}/hour
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/workers/${worker.id}`}
                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => handleCall(worker.id, worker.phone)}
                            disabled={callState[worker.id]?.loading}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            {callState[worker.id]?.loading ? 'Calling...' : 'Call'}
                          </button>
                        </div>

                        {callState[worker.id]?.message && (
                          <div
                            className={`text-sm mt-2 px-3 py-1 rounded-full ${
                              callState[worker.id]?.message.includes('error')
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {callState[worker.id]?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerListing;
