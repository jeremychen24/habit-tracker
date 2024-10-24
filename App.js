import React, { useState, useEffect } from 'react';
import MainMenu from './MainMenu';
import HabitList from './HabitList';
import AccountabilityPartner from './AccountabilityPartner';
import Signup from './Signup';
import Login from './Login';
import AccountabilityPartnerSignup from './AvailablePartners';  // Import new component
import { auth } from './firebase';  // Firebase auth reference

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setView('menu');
      } else {
        setUser(null);
        setView('login');
      }
    });

    setFirebaseInitialized(true);
    return () => unsubscribe();
  }, []);

  if (!firebaseInitialized) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    await auth.signOut();
    setView('login');
  };

  return (
    <div className="App">
      <header>
        <h1>Habit Tracker with Accountability Partners</h1>
        {user && (
          <div>
            <p>Welcome, {user.email}!</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </header>

      {view === 'menu' && (
        <div>
          <h2>Main Menu</h2>
          <button onClick={() => setView('habits')}>Habit Tracker</button>
          <button onClick={() => setView('partners')}>Accountability Partners</button>
          <button onClick={() => setView('partner-signup')}>Sign Up as Partner</button>  {/* New button */}
        </div>
      )}

      {/* View switching */}
      {view === 'login' && !user && <Login setView={setView} />}
      {view === 'signup' && !user && <Signup setView={setView} />}
      {view === 'habits' && user && <HabitList setView={setView} />}
      {view === 'partners' && user && <AccountabilityPartner setView={setView} />}
      {view === 'partner-signup' && user && <AccountabilityPartnerSignup setView={setView} />}  {/* Pass setView */}

      <footer>
        <p>&copy; 2024 Habit Tracker App</p>
      </footer>
    </div>
  );
}

export default App;
