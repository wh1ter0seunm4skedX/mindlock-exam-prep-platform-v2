import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
  Query,
  CollectionReference,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Question, Course } from '@/types';

interface UseFirebaseQuestionsOptions {
  courseId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  searchQuery?: string;
}

export const useFirebaseQuestions = (options: UseFirebaseQuestionsOptions = {}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        let q: Query | CollectionReference = collection(db, 'questions');

        // Apply filters
        if (options.courseId) {
          q = query(q, where('course', '==', options.courseId));
        }
        if (options.difficulty) {
          q = query(q, where('difficulty', '==', options.difficulty));
        }

        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Question[];

        // Apply search filter if needed
        const filteredQuestions = options.searchQuery
          ? fetchedQuestions.filter(q =>
              q.title.toLowerCase().includes(options.searchQuery!.toLowerCase()) ||
              q.content.toLowerCase().includes(options.searchQuery!.toLowerCase())
            )
          : fetchedQuestions;

        setQuestions(filteredQuestions);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [options.courseId, options.difficulty, options.searchQuery]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const fetchedCourses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Course[];
        setCourses(fetchedCourses);
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchCourses();
  }, []);

  const getQuestionById = useCallback(async (id: string) => {
    try {
      // First try to find by originalId
      const questionsQuery = query(collection(db, 'questions'), where('originalId', '==', id));
      const querySnapshot = await getDocs(questionsQuery);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        } as Question;
      }

      // If not found by originalId, try by document id
      const docRef = doc(db, 'questions', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as Question;
      }

      return null;
    } catch (err) {
      console.error('Error fetching question:', err);
      return null;
    }
  }, []); // Empty dependency array since this function doesn't depend on any props or state

  const addQuestion = async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'questions'), {
        ...question,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Update course question count
      const courseRef = doc(db, 'courses', question.course);
      const courseDoc = await getDocs(query(collection(db, 'questions'), where('course', '==', question.course)));
      await updateDoc(courseRef, {
        questionCount: courseDoc.size,
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (err) {
      throw err;
    }
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    try {
      const questionRef = doc(db, 'questions', id);
      await updateDoc(questionRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      throw err;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      const questionRef = doc(db, 'questions', id);
      const questionDoc = await getDocs(query(collection(db, 'questions'), where('id', '==', id)));
      const question = questionDoc.docs[0]?.data() as Question;

      if (question) {
        // Update course question count
        const courseRef = doc(db, 'courses', question.course);
        const courseDoc = await getDocs(query(collection(db, 'questions'), where('course', '==', question.course)));
        await updateDoc(courseRef, {
          questionCount: courseDoc.size - 1,
          updatedAt: Timestamp.now(),
        });
      }

      await deleteDoc(questionRef);
    } catch (err) {
      throw err;
    }
  };

  const addCourse = async (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...course,
        questionCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (err) {
      throw err;
    }
  };

  return {
    questions,
    courses,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addCourse,
    getQuestionById,
  };
}; 