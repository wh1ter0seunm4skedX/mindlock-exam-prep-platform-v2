
export interface Question {
  id: string;
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  course: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  solution?: string;
  hints?: string[];
  timeEstimate?: number; // in minutes
  attempts?: QuestionAttempt[];
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
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  questionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  name?: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // in seconds
  questions: string[]; // question IDs
  attempts: QuestionAttempt[];
  isDistracted: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  studySessions: StudySession[];
  courses: Course[];
  questions: Question[];
}

export interface StudyGoal {
  id: string;
  title: string;
  targetDate: Date;
  questionCount: number;
  completedCount: number;
  courseId?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}
