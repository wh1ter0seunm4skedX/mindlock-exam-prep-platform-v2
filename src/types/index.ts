
export interface Question {
  id: string;
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  course: string;
  tags: string[];
  questionTypes: string[];
  createdAt: Date;
  updatedAt: Date;
  solution?: string;
  hints?: string[];
  timeEstimate?: number; // in minutes
  attempts?: QuestionAttempt[];
  imageUrl?: string; // Added for image support
  userAnswer?: string; // Added to store user answers in focus mode
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in seconds
  success: boolean;
  notes?: string;
  distracted?: boolean;
  userAnswer?: string; // Added to store user answers
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
  color?: string; // For dashboard card styling
  questionTypes: string[]; // Available question types for this course
}

// Question type definitions for different courses
export const ALGORITHM_QUESTION_TYPES = [
  'Algorithm Design/Modification',
  'Proof of Correctness/Properties',
  'Complexity Analysis',
  'Counterexamples/Disproof',
  'Reductions',
  'Optimization',
  'Theoretical Analysis',
  'Efficient Implementation',
  'Edge Cases and Special Properties',
  'Algorithm Comparison'
];

export const PROBABILITY_QUESTION_TYPES = [
  'Combinatorial analysis',
  'Axioms of probability',
  'Conditional probability and independence',
  'Random variables',
  'Continuous random variables',
  'Jointly distributed random variables',
  'Properties of expectation',
  'Limit theorems'
];

// Map course IDs to their question types
export const COURSE_QUESTION_TYPES: Record<string, string[]> = {
  'algorithms': ALGORITHM_QUESTION_TYPES,
  'probability': PROBABILITY_QUESTION_TYPES,
};
