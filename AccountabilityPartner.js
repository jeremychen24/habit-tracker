import React, { useState, useEffect } from 'react';
import { getUserData, updateUserGoal, findAccountabilityPartner } from './UserService'; // Import UserService functions

const AccountabilityPartner = ({ setView }) => {
  const [goal, setGoal] = useState('Exercise'); // Default goal
  const [partner, setPartner] = useState(null);
  const [habits, setHabits] = useState([]);

  // Fetch current user data and habits when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setGoal(userData.goal);
        setPartner(userData.partner);
        setHabits(userData.habits || []); // Set habits if available
      }
    };
    fetchUserData();
  }, []);

  // Handle goal change
  const handleGoalChange = async (e) => {
    const selectedGoal = e.target.value;
    setGoal(selectedGoal);
    await updateUserGoal(selectedGoal); // Update goal in Firestore
  };

  // Remove duplicate goals from habits array (if they exist)
  const uniqueHabits = [...new Set(habits.map(habit => habit.name))]; // Remove duplicates

  return (
    <div>
      <h2>Find an Accountability Partner</h2>
      
      <label htmlFor="goal-select">Select a goal:</label>
      <select id="goal-select" value={goal} onChange={handleGoalChange}>
        {uniqueHabits.map((habit, index) => (
          <option key={index} value={habit}>
            {habit}
          </option>
        ))}
      </select>

      <button onClick={() => findAccountabilityPartner(goal)}>Find Partner</button>

      <div>
        {partner ? (
          <p>Your Accountability Partner: {partner}</p>
        ) : (
          <p>No partner assigned yet.</p>
        )}
      </div>

      {/* Back to Menu Button */}
      <button onClick={() => setView('menu')}>Back to Menu</button>
    </div>
  );
};

export default AccountabilityPartner;
