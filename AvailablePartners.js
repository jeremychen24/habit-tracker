import React, { useState, useEffect } from 'react';
import { getUserData, updateUserPartnerStatus } from './UserService';

const AccountabilityPartnerSignup = ({ setView }) => {  // Accept setView as a prop
  const [isPartner, setIsPartner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch current user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setIsPartner(userData.isPartner || false);  // Set partner status from Firestore
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  // Toggle partner status
  const handlePartnerToggle = async () => {
    const newStatus = !isPartner;
    setIsPartner(newStatus);  // Update local state
    await updateUserPartnerStatus(newStatus);  // Update Firestore
  };

  if (loading) {
    return <p>Loading...</p>;  // Show loading state while fetching user data
  }

  return (
    <div>
      <h2>Sign Up as an Accountability Partner</h2>
      <label>
        <input
          type="checkbox"
          checked={isPartner}
          onChange={handlePartnerToggle}
        />
        Available as an Accountability Partner
      </label>

      {/* Back to Menu Button */}
      <div>
        <button onClick={() => setView('menu')}>Back to Menu</button>
      </div>
    </div>
  );
};

export default AccountabilityPartnerSignup;
