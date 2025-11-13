import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import {
  Phone,
  Mail,
  ArrowLeft,
  User as UserIcon,
  Star,
  Briefcase,
  CheckCircle,
  Clock,
  IndianRupee
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  rating?: number;
  completedJobs?: number;
  experience?: string;
  hourlyRate?: number;
  responseTime?: string;
  skills?: string[];
}

const UserProfile = () => {
  const { user, getUserProfile } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Prevent infinite loop

  useEffect(() => {
    if (!user || hasFetched.current) return;

    const fetchProfile = async () => {
      if (!user.id) {
        setError('User ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const data = await getUserProfile();
        if (data) {
          const formattedData = {
            ...data,
            experience: data.experience || '0',
          };
          setProfile(formattedData);
        } else {
          setError('Failed to fetch user profile.');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching user profile.');
      } finally {
        setLoading(false);
        hasFetched.current = true; // Mark fetch complete
      }
    };

    fetchProfile();
  }, [user, getUserProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">No user profile found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-white mr-4">
                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-2xl">
                  {profile.name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name || 'User'}</h1>
                <p className="text-blue-100 text-sm">{profile.role.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Profile Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <UserIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Name</h3>
                    <p className="text-gray-600">{profile.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {profile.role === 'worker' && (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Worker Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Rating</h3>
                        <p className="text-gray-600">{profile.rating?.toFixed(1) || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Completed Jobs</h3>
                        <p className="text-gray-600">{profile.completedJobs || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Experience</h3>
                        <p className="text-gray-600">{profile.experience || 'N/A'} years</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <IndianRupee className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Hourly Rate</h3>
                        <p className="text-gray-600">₹{profile.hourlyRate || '0'}/hr</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Response Time</h3>
                        <p className="text-gray-600">Usually within {profile.responseTime || 'N/A'} hour</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.length ? (
                      profile.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills listed.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
