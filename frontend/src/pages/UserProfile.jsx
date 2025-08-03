import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { getUserProfile } from '../services/userProfileService';

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await getUserProfile();
        // backend shape: { success, data: { user: {...} } }
        const data = resp.data?.data?.user || resp.data?.user || resp.user || resp;
        console.log(data);
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100">
      <PageHeader title="Thrivable" onBack={() => navigate('/dashboard')} showBackButton={true} />
      <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Your Profile</h2>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {profile && (

          <div className="space-y-4">
            {profile.score !== undefined && (
              <div className="flex justify-between">
                <span className="font-semibold text-emerald-700">Score:</span>
                <span>{profile.score}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-semibold text-emerald-700">First Name:</span>
              <span>{profile.firstName || profile.first_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-emerald-700">Last Name:</span>
              <span>{profile.lastName || profile.last_name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-semibold text-emerald-700">Email:</span>
              <span>{profile.email}</span>
            </div>
            
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default UserProfile;