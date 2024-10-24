import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase'; // Firestore and auth references

// Function to fetch the current user's data from Firestore
export const getUserData = async () => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data(); // Return user data (goal, habits, partner, etc.)
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Function to save the user's updated habits to Firestore
export const saveUserHabits = async (habits) => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { habits }, { merge: true }); // Merge ensures other fields aren't overwritten
    console.log('User habits updated in Firestore');
  } catch (error) {
    console.error('Error saving user habits:', error);
  }
};

// Function to update the user's goal in Firestore
export const updateUserGoal = async (newGoal) => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { goal: newGoal }, { merge: true });
    console.log('User goal updated in Firestore');
  } catch (error) {
    console.error('Error updating user goal:', error);
  }
};

// Function to update user's accountability partner status (availability)
export const updateUserPartnerStatus = async (isPartner) => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, { isPartner: isPartner }, { merge: true });
    console.log(`User's partner availability updated to: ${isPartner}`);
  } catch (error) {
    console.error('Error updating user partner status:', error);
  }
};

// Function to find an accountability partner with the same goal
export const findAccountabilityPartner = async (goal) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('goal', '==', goal),  // Match the same goal
      where('partner', '==', null),  // Partner must not be assigned
      where('isPartner', '==', true),  // Partner must be available
      where('email', '!=', auth.currentUser.email) // Exclude the current user
    );

    const querySnapshot = await getDocs(q);
    const availablePartners = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    if (availablePartners.length > 0) {
      const matchedPartner = availablePartners[0];

      // Update both users' documents to set them as partners
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const partnerRef = doc(db, 'users', matchedPartner.id);

      await setDoc(userRef, { partner: matchedPartner.email }, { merge: true });
      await setDoc(partnerRef, { partner: auth.currentUser.email }, { merge: true });

      console.log(`Partner assigned: ${matchedPartner.email}`);
      return matchedPartner.email; // Return the partner's email
    } else {
      console.log('No available partners found');
      return null;
    }
  } catch (error) {
    console.error('Error finding accountability partner:', error);
    return null;
  }
};

// Function to fetch all available partners who opted to be accountability partners
export const getAvailablePartners = async () => {
  try {
    const q = query(collection(db, 'users'), where('isPartner', '==', true));
    const querySnapshot = await getDocs(q);
    const availablePartners = querySnapshot.docs.map((doc) => doc.data());
    return availablePartners; // Return available partners
  } catch (error) {
    console.error('Error fetching available partners:', error);
    return [];
  }
};

// Function to remove the accountability partner for the current user
export const removeAccountabilityPartner = async () => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const partnerEmail = userData.partner;

      if (partnerEmail) {
        // Remove partner from current user's document
        await setDoc(userRef, { partner: null }, { merge: true });

        // Find the partner by email and remove the current user from their document
        const partnerQuery = query(
          collection(db, 'users'),
          where('email', '==', partnerEmail)
        );
        const partnerSnapshot = await getDocs(partnerQuery);
        if (!partnerSnapshot.empty) {
          const partnerDoc = partnerSnapshot.docs[0];
          const partnerRef = doc(db, 'users', partnerDoc.id);
          await setDoc(partnerRef, { partner: null }, { merge: true });
        }

        console.log(`Removed partner: ${partnerEmail}`);
        return true; // Indicate successful removal
      } else {
        console.log('No partner assigned');
        return false; // No partner to remove
      }
    }
  } catch (error) {
    console.error('Error removing accountability partner:', error);
    return false;
  }
};

// Function to toggle partner availability for the current user
export const togglePartnerAvailability = async () => {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const newPartnerStatus = !userData.isPartner; // Toggle the isPartner value

      // Update the partner status
      await setDoc(userRef, { isPartner: newPartnerStatus }, { merge: true });
      console.log(`Partner availability toggled to: ${newPartnerStatus}`);
      return newPartnerStatus; // Return the new status
    } else {
      console.log('No user data found');
      return false;
    }
  } catch (error) {
    console.error('Error toggling partner availability:', error);
    return false;
  }
};
