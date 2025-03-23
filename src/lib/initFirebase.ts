import { collection, getDocs, addDoc, Timestamp, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { Course, Question } from '@/types';
import { questions, courses } from '@/data/mockData';

export const eraseAndReinitializeFirebase = async () => {
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

    // Create a mapping of course names to their IDs
    const courseIdMap = new Map<string, string>();

    // Initialize courses first
    for (const course of courses) {
      const docRef = await addDoc(collection(db, 'courses'), {
        name: course.name,
        description: course.description,
        questionTypes: course.questionTypes,
        questionCount: course.questionCount,
        createdAt: Timestamp.fromDate(course.createdAt),
        updatedAt: Timestamp.fromDate(course.updatedAt),
      });
      courseIdMap.set(course.name, docRef.id);
    }
    console.log('Added all courses');

    // Initialize questions
    for (const question of questions) {
      const questionData = {
        title: question.title,
        content: question.content,
        difficulty: question.difficulty,
        course: courseIdMap.get(question.course) || question.course, // Use the new course ID
        tags: question.tags,
        questionTypes: question.questionTypes,
        timeEstimate: question.timeEstimate || 20,
        createdAt: Timestamp.fromDate(question.createdAt),
        updatedAt: Timestamp.fromDate(question.updatedAt),
        originalId: question.id, // Store the original ID from mock data
      };

      await addDoc(collection(db, 'questions'), questionData);
    }
    console.log('Added all questions');

    console.log('Firebase reinitialization completed successfully');
  } catch (error) {
    console.error('Error reinitializing Firebase:', error);
    throw error;
  }
}; 