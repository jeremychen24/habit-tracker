import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase'; // Assuming you're using firebase for auth
import { setDoc, doc } from 'firebase/firestore'; // Firestore

const Signup = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPartner, setIsPartner] = useState(false); // New field to indicate availability
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore, including the "isPartner" field
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        isPartner: isPartner, // Save the availability status
        goal: null,
        partner: null,
        habits: []
      });

      setView('menu'); // Redirect to main menu after signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Checkbox to mark availability as an accountability partner */}
        <label>
          <input
            type="checkbox"
            checked={isPartner}
            onChange={() => setIsPartner(!isPartner)}
          />
          Available as an Accountability Partner
        </label>

        <button type="submit">Sign Up</button>
      </form>
      <button onClick={() => setView('login')}>Log In</button>
    </div>
  );
};

export default Signup;
