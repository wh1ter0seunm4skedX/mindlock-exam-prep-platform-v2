import { useFirebaseQuestions } from './useFirebaseQuestions';
import { Question, Course } from '@/types';
import { useMemo } from 'react';

interface UseQuestionsOptions {
  courseId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  searchQuery?: string;
}

export function useQuestions(options: UseQuestionsOptions = {}) {
  const { questions, courses, loading, error, addQuestion: addFirebaseQuestion, updateQuestion: updateFirebaseQuestion, deleteQuestion: deleteFirebaseQuestion, addCourse: addFirebaseCourse } = useFirebaseQuestions(options);

  const { courseId, difficulty, tags, searchQuery } = options;

  // Filter questions based on options
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      // Filter by course
      if (courseId && question.course !== courseId) {
        return false;
      }

      // Filter by difficulty
      if (difficulty && question.difficulty !== difficulty) {
        return false;
      }

      // Filter by tags
      if (tags && tags.length > 0) {
        if (!tags.some(tag => question.tags.includes(tag))) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !question.title.toLowerCase().includes(query) &&
          !question.content.toLowerCase().includes(query) &&
          !question.tags.some(tag => tag.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      return true;
    });
  }, [questions, courseId, difficulty, tags, searchQuery]);

  const addQuestion = async (newQuestion: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      return await addFirebaseQuestion(newQuestion);
    } catch (err) {
      throw err;
    }
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    try {
      return await updateFirebaseQuestion(id, updates);
    } catch (err) {
      throw err;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      return await deleteFirebaseQuestion(id);
    } catch (err) {
      throw err;
    }
  };

  const addCourse = async (newCourse: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => {
    try {
      return await addFirebaseCourse(newCourse);
    } catch (err) {
      throw err;
    }
  };

  return {
    questions: filteredQuestions,
    allQuestions: questions,
    courses,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addCourse
  };
}
