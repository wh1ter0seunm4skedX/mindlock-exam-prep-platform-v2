import { Question, Course, QuestionAttempt, StudySession, StudyGoal, ALGORITHM_QUESTION_TYPES, PROBABILITY_QUESTION_TYPES } from '@/types';

// Sample courses - keeping only Algorithms and Probability
export const courses: Course[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    description: 'Fundamental algorithms and data structures for computer science',
    questionCount: 48,
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-15'),
    questionTypes: ALGORITHM_QUESTION_TYPES,
  },
  {
    id: '2',
    name: 'Probability',
    description: 'Statistical concepts and probability theory',
    questionCount: 35,
    createdAt: new Date('2023-11-02'),
    updatedAt: new Date('2023-11-10'),
    questionTypes: PROBABILITY_QUESTION_TYPES,
  },
];

// Sample questions
export const questions: Question[] = [
  {
    id: '1',
    title: 'Binary Search Implementation',
    content: 'Implement a binary search algorithm that finds the position of a target value within a sorted array.',
    difficulty: 'medium',
    course: '1', // Algorithm course
    tags: ['algorithms', 'searching', 'arrays'],
    questionTypes: ['Algorithm Design/Modification', 'Complexity Analysis'],
    createdAt: new Date('2023-10-16'),
    updatedAt: new Date('2023-10-16'),
    solution: 'function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    \n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  \n  return -1;\n}',
    hints: [
      'Think about dividing the array in half at each step',
      'Consider what happens when the target is less than or greater than the middle element',
      'Remember to handle the case when the target is not found'
    ],
    timeEstimate: 15,
  },
  {
    id: '2',
    title: 'Graph Traversal: BFS',
    content: 'Implement a Breadth-First Search algorithm to traverse a graph represented as an adjacency list.',
    difficulty: 'hard',
    course: '1', // Algorithm course
    tags: ['algorithms', 'graphs', 'traversal'],
    questionTypes: ['Algorithm Design/Modification', 'Complexity Analysis', 'Efficient Implementation'],
    createdAt: new Date('2023-10-18'),
    updatedAt: new Date('2023-10-20'),
    solution: 'function bfs(graph, start) {\n  const visited = new Set();\n  const queue = [start];\n  visited.add(start);\n  \n  while (queue.length > 0) {\n    const vertex = queue.shift();\n    console.log(vertex);\n    \n    for (const neighbor of graph[vertex]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}',
    hints: [
      'Use a queue data structure to keep track of nodes to visit',
      'Mark nodes as visited to avoid cycles',
      'Process all neighbors of a node before moving to the next level'
    ],
    timeEstimate: 25,
  },
  {
    id: '3',
    title: 'Probability of Independent Events',
    content: 'If P(A) = 0.3 and P(B) = 0.5, and A and B are independent events, calculate P(A and B) and P(A or B).',
    difficulty: 'easy',
    course: '2', // Probability course
    tags: ['probability', 'independence', 'events'],
    questionTypes: ['Axioms of probability', 'Conditional probability and independence'],
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05'),
    timeEstimate: 15,
    hints: [
      'For independent events, P(A and B) = P(A) × P(B)',
      'For any two events, P(A or B) = P(A) + P(B) - P(A and B)'
    ],
  },
  {
    id: '4',
    title: 'Expected Value Calculation',
    content: 'A fair six-sided die is rolled twice. Let X be the random variable representing the sum of the two rolls. Calculate E[X].',
    difficulty: 'medium',
    course: '2', // Probability course
    tags: ['expected value', 'random variables', 'discrete'],
    questionTypes: ['Random variables', 'Properties of expectation'],
    createdAt: new Date('2023-11-12'),
    updatedAt: new Date('2023-11-12'),
    timeEstimate: 20,
    hints: [
      'The expected value is the weighted average of all possible outcomes',
      'For the sum of independent random variables, E[X+Y] = E[X] + E[Y]',
      'For a fair die, E[X] = (1+2+3+4+5+6)/6 = 3.5'
    ],
  },
  {
    id: '5',
    title: 'Time Complexity Analysis of Sorting Algorithms',
    content: 'Analyze and compare the time complexity of Quicksort, Mergesort, and Heapsort algorithms in best, average, and worst cases.',
    difficulty: 'hard',
    course: '1', // Algorithm course
    tags: ['algorithms', 'sorting', 'complexity'],
    questionTypes: ['Complexity Analysis', 'Algorithm Comparison', 'Theoretical Analysis'],
    createdAt: new Date('2023-10-25'),
    updatedAt: new Date('2023-10-25'),
    timeEstimate: 30,
  },
];

// Sample question attempts
export const questionAttempts: QuestionAttempt[] = [
  {
    id: '1',
    questionId: '1',
    startedAt: new Date('2023-10-25T14:30:00'),
    completedAt: new Date('2023-10-25T14:42:00'),
    duration: 720, // 12 minutes
    success: true,
    notes: 'Implemented correctly on first try, but could optimize time complexity',
  },
  {
    id: '2',
    questionId: '2',
    startedAt: new Date('2023-10-26T10:15:00'),
    completedAt: new Date('2023-10-26T10:48:00'),
    duration: 1980, // 33 minutes
    success: false,
    notes: 'Struggled with keeping track of visited nodes, need to review graph traversal',
    distracted: true,
  },
];

// Sample study sessions
export const studySessions: StudySession[] = [
  {
    id: '1',
    name: 'DSA Practice Session',
    startedAt: new Date('2023-10-25T14:00:00'),
    endedAt: new Date('2023-10-25T16:00:00'),
    duration: 7200, // 2 hours
    questions: ['1', '2'],
    attempts: [questionAttempts[0], questionAttempts[1]],
    isDistracted: false,
  },
];

// Sample study goals
export const studyGoals: StudyGoal[] = [
  {
    id: '1',
    title: 'Master DSA Basics',
    targetDate: new Date('2023-12-15'),
    questionCount: 30,
    completedCount: 12,
    courseId: '1',
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Complete Probability Fundamentals',
    targetDate: new Date('2023-12-31'),
    questionCount: 35,
    completedCount: 8,
    courseId: '2',
  },
];
