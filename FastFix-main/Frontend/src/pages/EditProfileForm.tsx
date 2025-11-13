import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditProfileForm = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setSkills(user.skills || []);
      setExperience(user.experience || '');
      setHourlyRate(user.hourlyRate?.toString() || '');
      setResponseTime(user.responseTime || '');
    }
  }, [user]);

  const handleSkillChange = (index: number, value: string) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const handleAddSkill = () => setSkills([...skills, '']);
  const handleRemoveSkill = (index: number) =>
    setSkills(skills.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user?.id) {
      setError('User ID is missing.');
      setLoading(false);
      return;
    }

    if (isNaN(parseFloat(hourlyRate)) || parseFloat(hourlyRate) < 0) {
      setError('Hourly rate must be a valid positive number.');
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        name: name.trim(),
        phone: phone.trim(),
      };

      if (user.role === 'worker') {
        payload.skills = skills.map((s) => s.trim()).filter(Boolean);
        payload.experience = experience.trim();
        payload.hourlyRate = parseFloat(hourlyRate);
        payload.responseTime = responseTime.trim();
      }

      await updateUser(payload);
      alert('Profile updated successfully!');
      navigate(`/userprofile`);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border rounded p-2 bg-gray-200"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Worker-specific fields */}
        {user.role === 'worker' && (
          <>
            {/* Skills */}
            <div>
              <label className="block text-gray-700">Skills</label>
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 mb-1">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="w-full border rounded p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSkill}
                className="mt-2 text-blue-600"
              >
                Add Skill
              </button>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-gray-700">Experience</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-gray-700">Hourly Rate</label>
              <input
                type="number"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Response Time */}
            <div>
              <label className="block text-gray-700">Response Time</label>
              <input
                type="text"
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
