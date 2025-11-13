import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Star, 
  Clock, 
  Briefcase, 
  CheckCircle, 
  Mail, 
  ArrowLeft, 
  MessageCircle as MessageCircleIcon,
  IndianRupee
} from 'lucide-react';
import { api } from '../services/api';
import { Worker } from '../types';

const WorkerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [callLoading, setCallLoading] = useState(false);
  const [callSuccess, setCallSuccess] = useState(false);
  const [callMessage, setCallMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getWorkerById(id);
        setWorker(data);
      } catch (err) {
        setError('Failed to load worker profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  const handleCall = async () => {
    if (!worker) return;
    try {
      setCallLoading(true);
      setCallMessage('');
      const customerPhone = worker.phone;
      const result = await api.callWorker(worker.id, customerPhone);
      setCallSuccess(result.success);
      setCallMessage(result.message || 'Call response received.');
    } catch (err) {
      setCallSuccess(false);
      setCallMessage('An error occurred while trying to make the call.');
    } finally {
      setCallLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!worker) return;
    try {
      setMessageLoading(true);
      setMessageText('');
      const customerPhone = worker.phone;
      const result = await api.messageWorker(worker.id, customerPhone);
      setMessageSuccess(result.success);
      setMessageText(result.message || 'Message sent successfully.');
    } catch (err) {
      setMessageSuccess(false);
      setMessageText('An error occurred while trying to send the message.');
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Worker not found'}
        </div>
        <button
          onClick={() => navigate('/workers')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to workers list
        </button>
      </div>
    );
  }

  // Ensure rating is a valid number before displaying
  const rating = worker.rating && !isNaN(worker.rating) ? worker.rating.toFixed(1) : 'N/A';

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/workers')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to workers list
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-white mr-4">
                  {worker.avatar ? (
                    <img 
                      src={worker.avatar} 
                      alt={worker.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-2xl">
                      {worker.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{worker.name}</h1>
                  <div className="flex items-center mt-1">
                    <Star className="h-5 w-5 text-yellow-300 fill-current" />
                    <span className="ml-1 text-blue-100">
                      {rating} ({worker.completedJobs} jobs)
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:ml-auto flex flex-col md:items-end gap-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-800 text-sm">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {worker.hourlyRate} / hour
                </div>
                {callMessage && (
                  <div className={`text-sm px-3 py-1 rounded-full ${
                    callSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {callMessage}
                  </div>
                )}
                {messageText && (
                  <div className={`text-sm px-3 py-1 rounded-full ${
                    messageSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {messageText}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {worker.skills.length ? (
                  worker.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed.</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Worker Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Experience</h3>
                    <p className="text-gray-600">{worker.experience} years</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Completed Jobs</h3>
                    <p className="text-gray-600">{worker.completedJobs || 0}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">{worker.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">{worker.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Response Time</h3>
                    <p className="text-gray-600">within {worker.responseTime} hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCall}
                disabled={callLoading}
                className={`flex-1 inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm ${
                  callLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {callLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </>
                )}
              </button>
              <button
                onClick={handleMessage}
                disabled={messageLoading}
                className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
              >
                <MessageCircleIcon className="h-5 w-5 mr-2" />
                {messageLoading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
