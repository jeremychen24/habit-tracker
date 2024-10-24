import React, { useState, useEffect } from 'react';
import { getUserData, updateUserPartnerStatus } from './UserService';

const Settings = () => {
  const [isPartner, setIsPartner] = useState(false);

  // Load the current user's settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      const userData = await getUserData();
      if (userData) {
        setIsPartner(userData.isPartner || false);
      }
    };
    fetchUserSettings();
  }, []);

  // Toggle partner availability
  const handlePartnerStatusChange = async () => {
    const newStatus = !isPartner;
    setIsPartner(newStatus);
    await updateUserPartnerStatus(newStatus); // Update Firestore
  };

  return (
    <div>
      <h2>Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={isPartner}
          onChange={handlePartnerStatusChange}
        />
        Available as an Accountability Partner
      </label>
    </div>
  );
};

export default Settings;
