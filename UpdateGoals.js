const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),  // You can replace this with service account credentials
  databaseURL: 'https://your-project-id.firebaseio.com',  // Replace with your Firebase project ID
});

const db = admin.firestore();

// Function to remove 'Reading' goal from all users
const removeReadingGoal = async () => {
  try {
    const usersCollectionRef = db.collection('users');  // Reference to 'users' collection
    const usersSnapshot = await usersCollectionRef.get();  // Get all documents in the 'users' collection

    usersSnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();  // Get user document data

      // Check if goal is 'Reading' and update it
      if (userData.goal === 'Reading') {
        const userRef = db.collection('users').doc(userDoc.id);  // Get document reference

        // Update the goal to another value, like 'Exercise'
        await userRef.update({ goal: 'Exercise' });
        console.log(`Updated user ${userData.email} from 'Reading' to 'Exercise'.`);
      }
    });

    console.log('Completed updating all users.');
  } catch (error) {
    console.error('Error updating goals:', error);
  }
};

// Run the function
removeReadingGoal();
