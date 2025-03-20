
import { useState, useEffect, useMemo } from 'react';
import { Question, Course, ALGORITHM_QUESTION_TYPES, PROBABILITY_QUESTION_TYPES } from '@/types';

interface UseQuestionsOptions {
  courseId?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  tags?: string[];
  searchQuery?: string;
}

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: 'algorithms',
    name: 'Algorithms',
    description: 'Study fundamental algorithms and data structures',
    questionCount: 12,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-04-10'),
    color: '#8B5CF6',
    questionTypes: ALGORITHM_QUESTION_TYPES
  },
  {
    id: 'probability',
    name: 'Probability',
    description: 'Statistical concepts and probability theory',
    questionCount: 8,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-04-15'),
    color: '#10B981',
    questionTypes: PROBABILITY_QUESTION_TYPES
  }
];

// Mock data for questions
const mockQuestions: Question[] = [
  {
    id: 'q1',
    title: 'Binary Search Implementation',
    content: 'Implement binary search for a sorted array. Analyze its time and space complexity.',
    difficulty: 'medium',
    course: 'algorithms',
    tags: ['searching', 'arrays', 'divide and conquer'],
    questionTypes: ['Algorithm Design/Modification', 'Complexity Analysis'],
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15'),
    timeEstimate: 20,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Binary_Search_Depiction.svg'
  },
  {
    id: 'q2',
    title: 'Probability of Independent Events',
    content: 'If P(A) = 0.3 and P(B) = 0.5, and A and B are independent events, calculate P(A and B) and P(A or B).',
    difficulty: 'easy',
    course: 'probability',
    tags: ['independence', 'basic probability'],
    questionTypes: ['Axioms of probability', 'Conditional probability and independence'],
    createdAt: new Date('2023-03-18'),
    updatedAt: new Date('2023-03-18'),
    timeEstimate: 15
  },
  {
    id: 'q3',
    title: 'Merge Sort Implementation',
    content: 'Implement the merge sort algorithm and discuss its advantages over other sorting methods.',
    difficulty: 'medium',
    course: 'algorithms',
    tags: ['sorting', 'divide and conquer', 'recursion'],
    questionTypes: ['Algorithm Design/Modification', 'Complexity Analysis'],
    createdAt: new Date('2023-03-22'),
    updatedAt: new Date('2023-03-22'),
    timeEstimate: 30
  },
  {
    id: 'q4',
    title: 'Expected Value Calculation',
    content: 'A fair six-sided die is rolled twice. Let X be the random variable representing the sum of the two rolls. Calculate E[X].',
    difficulty: 'medium',
    course: 'probability',
    tags: ['expected value', 'discrete random variables'],
    questionTypes: ['Random variables', 'Properties of expectation'],
    createdAt: new Date('2023-03-25'),
    updatedAt: new Date('2023-03-25'),
    timeEstimate: 20
  },
  {
    id: 'q5',
    title: 'Quicksort Analysis',
    content: 'Analyze the time and space complexity of the Quicksort algorithm. When would you choose Quicksort over other sorting algorithms?',
    difficulty: 'hard',
    course: 'algorithms',
    tags: ['sorting', 'complexity analysis', 'algorithms'],
    questionTypes: ['Algorithm Analysis', 'Complexity Analysis', 'Algorithm Comparison'],
    createdAt: new Date('2023-03-28'),
    updatedAt: new Date('2023-03-28'),
    timeEstimate: 25
  }
];

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
        
        // Try to load from localStorage first
        const storedQuestions = localStorage.getItem('mindlock_questions');
        const storedCourses = localStorage.getItem('mindlock_courses');
        
        if (storedQuestions && storedCourses) {
          setQuestions(JSON.parse(storedQuestions));
          setCourses(JSON.parse(storedCourses));
        } else {
          // Use mock data if nothing in localStorage
          setQuestions(mockQuestions);
          setCourses(mockCourses);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save to localStorage whenever questions or courses change
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem('mindlock_questions', JSON.stringify(questions));
    }
    if (courses.length > 0) {
      localStorage.setItem('mindlock_courses', JSON.stringify(courses));
    }
  }, [questions, courses]);

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
        questionTypes: newQuestion.questionTypes || []
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

  const addCourse = async (newCourse: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
