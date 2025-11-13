import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, User, Phone, Briefcase, Clock, IndianRupee, LockKeyhole } from 'lucide-react';

const skills = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Agriculture',
  'General Maintenance',
  'Construction'
];

const WorkerRegistration = () => {
  const { user, registerWorker } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      selectedSkills.length === 0 ||
      !hourlyRate ||
      !responseTime
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await registerWorker(
        email,
        password,
        name,
        phone,
        selectedSkills,
        experience,
        responseTime,
        Number(hourlyRate)
      );
      navigate('/workers');
    } catch (err) {
      console.error(err);
      setError('Failed to create a worker account');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Register as a Worker</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform and connect with customers in need of your skills
          </p>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputWithIcon
              label="Full Name"
              icon={<User className="h-5 w-5 text-gray-400" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              required
            />

            <InputWithIcon
              label="Email Address"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              required
            />

            <InputWithIcon
              label="Phone Number"
              icon={<Phone className="h-5 w-5 text-gray-400" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="phone"
              type="tel"
              required
            />

            {/* Skills with manual input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[...new Set([...skills, ...selectedSkills.filter(s => !skills.includes(s))])].map((skill) => (
                  <div key={skill} className="flex items-center">
                    <input
                      id={`skill-${skill}`}
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`skill-${skill}`} className="ml-2 text-sm text-gray-900">
                      {skill}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex">
                <input
                  type="text"
                  placeholder="Add custom skill"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    const skill = customSkill.trim();
                    if (skill && !selectedSkills.includes(skill)) {
                      setSelectedSkills((prev) => [...prev, skill]);
                      setCustomSkill('');
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select years of experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>

            <InputWithIcon
              label="Password"
              icon={<LockKeyhole className="h-5 w-5 text-gray-400" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              required
            />

            <InputWithIcon
              label="Confirm Password"
              icon={<LockKeyhole className="h-5 w-5 text-gray-400" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirm-password"
              type="password"
              required
            />

            <InputWithIcon
              label="Hourly Rate (in ₹)"
              icon={<IndianRupee className="h-5 w-5 text-gray-400" />}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              id="hourlyrate"
              required
            />

            <InputWithIcon
              label="Expected Response Time (in hours)"
              icon={<Clock className="h-5 w-5 text-gray-400" />}
              value={responseTime}
              onChange={(e) => setResponseTime(e.target.value)}
              id="responsetime"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Registering...' : 'Register as Worker'}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputWithIcon = ({
  label,
  icon,
  value,
  onChange,
  id,
  type = 'text',
  required = false
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
        placeholder={label}
      />
    </div>
  </div>
);

export default WorkerRegistration;
