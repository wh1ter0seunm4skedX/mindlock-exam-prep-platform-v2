import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

export const eraseFirebaseCollections = async () => {
  try {
    // Get all collections
    const collections = ['questions', 'courses'];
    
    // Erase all data
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);
      
      querySnapshot.docs.forEach((document) => {
        batch.delete(doc(db, collectionName, document.id));
      });
      
      await batch.commit();
      console.log(`Erased all documents from ${collectionName}`);
    }

    console.log('Firebase reinitialization completed successfully');
  } catch (error) {
    console.error('Error reinitializing Firebase:', error);
    throw error;
  }
};