
import { useState, useEffect, useMemo } from 'react';
import { Question, Course } from '@/types';
import { questions as mockQuestions, courses as mockCourses } from '@/data/mockData';

interface UseQuestionsOptions {
  courseId?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  tags?: string[];
  searchQuery?: string;
}

export function useQuestions(options: UseQuestionsOptions = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const { courseId, difficulty, tags, searchQuery } = options;

  // Fetch questions and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setQuestions(mockQuestions);
        setCourses(mockCourses);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const question: Question = {
        ...newQuestion,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

  return {
    questions: filteredQuestions,
    courses,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
