import { useState, useEffect, useMemo } from 'react';
import { Question, Course, ALGORITHM_QUESTION_TYPES, PROBABILITY_QUESTION_TYPES } from '@/types';
import { questions as mockQuestions, courses as mockCourses } from '@/data/mockData';

interface UseQuestionsOptions {
  courseId?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  tags?: string[];
  searchQuery?: string;
}

export function useQuestions(options: UseQuestionsOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [courses, setCourses] = useState<Course[]>(mockCourses);

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
      const question: Question = {
        ...newQuestion,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        questionTypes: newQuestion.questionTypes || [],
        imageUrl: newQuestion.imageUrl || null,
      };
      
      setQuestions(prev => [...prev, question]);
      
      // Update question count in the course
      setCourses(prev => 
        prev.map(course => 
          course.id === question.course 
            ? { ...course, questionCount: course.questionCount + 1 } 
            : course
        )
      );

      return question;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    try {
      setQuestions(prev => 
        prev.map(question => 
          question.id === id 
            ? { ...question, ...updates, updatedAt: new Date() } 
            : question
        )
      );
      
      const updatedQuestion = questions.find(q => q.id === id);
      return updatedQuestion;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      const questionToDelete = questions.find(q => q.id === id);
      if (!questionToDelete) throw new Error('Question not found');
      
      setQuestions(prev => prev.filter(question => question.id !== id));
      
      // Update question count in the course
      setCourses(prev => 
        prev.map(course => 
          course.id === questionToDelete.course 
            ? { ...course, questionCount: course.questionCount - 1 } 
            : course
        )
      );
      
      return true;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const addCourse = async (newCourse: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => {
    try {
      const course: Course = {
        ...newCourse,
        id: Date.now().toString(),
        questionCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        questionTypes: newCourse.questionTypes || []
      };
      
      setCourses(prev => [...prev, course]);
      
      return course;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    questions: filteredQuestions,
    allQuestions: questions, // Unfiltered questions
    courses,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addCourse
  };
}
