import React from 'react';

const MainMenu = ({ setView }) => {
  return (
    <div>
      <h2>Main Menu</h2>
      <button onClick={() => setView('habits')}>Habit Tracker</button>
      <button onClick={() => setView('partners')}>Accountability Partners</button>
      <button onClick={() => setView('signup')}>Sign Up</button>
      <button onClick={() => setView('login')}>Log In</button>
    </div>
  );
};

export default MainMenu;
