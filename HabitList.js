import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { getUserData, saveUserHabits } from './UserService'; // Import UserService functions

const HabitList = ({ setView }) => {
  const [habits, setHabits] = useState([]);

  // Load user habits when the component loads
  useEffect(() => {
    const fetchHabits = async () => {
      const userData = await getUserData();
      if (userData && userData.habits) {
        setHabits(userData.habits);  // Load habits from Firestore
      }
    };
    fetchHabits();  // Fetch habits from Firestore
  }, []);

  // Update progress for a habit and save it to Firestore
  const handleUpdateProgress = (index) => {
    const updatedHabits = [...habits];
    updatedHabits[index].progress += 1;
    setHabits(updatedHabits);
    saveUserHabits(updatedHabits);  // Save updated habits to Firestore
  };

  // Enable habit editing
  const enableEditing = (index) => {
    const updatedHabits = [...habits];
    updatedHabits[index].isEditing = true;
    setHabits(updatedHabits);
  };

  // Handle name change during editing
  const handleNameChange = (index, newName) => {
    const updatedHabits = [...habits];
    updatedHabits[index].name = newName;
    setHabits(updatedHabits);
  };

  // Save edited habit to Firestore
  const saveHabit = (index) => {
    const updatedHabits = [...habits];
    updatedHabits[index].isEditing = false;
    setHabits(updatedHabits);
    saveUserHabits(updatedHabits);  // Save updated habits to Firestore
  };

  // Delete a habit and save the change to Firestore
  const deleteHabit = (index) => {
    const updatedHabits = habits.filter((_, i) => i !== index);
    setHabits(updatedHabits);
    saveUserHabits(updatedHabits);  // Save updated habits to Firestore
  };

  // Toggle day completion for the calendar
  const toggleDayCompletion = (habitIndex, day) => {
    const updatedHabits = [...habits];
    const completedDays = updatedHabits[habitIndex].completedDays || [];

    if (completedDays.includes(day)) {
      updatedHabits[habitIndex].completedDays = completedDays.filter((d) => d !== day);
    } else {
      updatedHabits[habitIndex].completedDays = [...completedDays, day];
    }

    setHabits(updatedHabits);
    saveUserHabits(updatedHabits);  // Save updated habits to Firestore
  };

  return (
    <section id="habit-section">
      <h2>Your Habits</h2>
      <ul id="habit-list">
        {habits.map((habit, index) => (
          <li key={index} className="habit">
            {habit.isEditing ? (
              <div>
                <input
                  type="text"
                  value={habit.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
                <button onClick={() => saveHabit(index)}>Save</button>
              </div>
            ) : (
              <div>
                <h3>{habit.name}</h3>
                <p>
                  Progress: <span className="progress">{habit.progress}</span> days
                </p>
                <button onClick={() => handleUpdateProgress(index)}>Mark as Done</button>
                <button onClick={() => enableEditing(index)}>Edit</button>
                <button onClick={() => deleteHabit(index)}>Delete</button> {/* Delete button */}
              </div>
            )}
            <Calendar
              habitIndex={index}
              toggleDayCompletion={toggleDayCompletion}
              completedDays={habit.completedDays || []} // Ensure completedDays is always defined
            />
          </li>
        ))}
      </ul>

      <button
        id="add-habit"
        onClick={() => {
          const newHabit = { name: 'New Habit', progress: 0, isEditing: false, completedDays: [] };
          const updatedHabits = [...habits, newHabit];
          setHabits(updatedHabits);
          saveUserHabits(updatedHabits);  // Save new habit to Firestore
        }}
      >
        Add New Habit
      </button>

      {/* Back to Main Menu Button */}
      <button onClick={() => setView('menu')}>Back to Menu</button>
    </section>
  );
};

export default HabitList;
