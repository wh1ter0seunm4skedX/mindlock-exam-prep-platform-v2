
import { Question, Course, QuestionAttempt, StudySession, StudyGoal } from '@/types';

// Sample courses
export const courses: Course[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    description: 'Fundamental algorithms and data structures for computer science',
    questionCount: 48,
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-15'),
  },
  {
    id: '2',
    name: 'Machine Learning',
    description: 'Introduction to machine learning concepts and applications',
    questionCount: 35,
    createdAt: new Date('2023-11-02'),
    updatedAt: new Date('2023-11-10'),
  },
  {
    id: '3',
    name: 'Web Development',
    description: 'Modern web development techniques and frameworks',
    questionCount: 42,
    createdAt: new Date('2023-09-20'),
    updatedAt: new Date('2023-09-28'),
  },
  {
    id: '4',
    name: 'Operating Systems',
    description: 'Core concepts of operating systems and system programming',
    questionCount: 30,
    createdAt: new Date('2023-08-12'),
    updatedAt: new Date('2023-08-15'),
  },
];

// Sample questions
export const questions: Question[] = [
  {
    id: '1',
    title: 'Binary Search Implementation',
    content: 'Implement a binary search algorithm that finds the position of a target value within a sorted array.',
    difficulty: 'medium',
    course: '1',
    tags: ['algorithms', 'searching', 'arrays'],
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
    course: '1',
    tags: ['algorithms', 'graphs', 'traversal'],
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
    title: 'Linear Regression Implementation',
    content: 'Implement a simple linear regression model from scratch using gradient descent.',
    difficulty: 'hard',
    course: '2',
    tags: ['machine learning', 'regression', 'optimization'],
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05'),
    solution: 'class LinearRegression {\n  constructor(learningRate = 0.01, iterations = 1000) {\n    this.learningRate = learningRate;\n    this.iterations = iterations;\n    this.weights = null;\n    this.bias = null;\n  }\n\n  fit(X, y) {\n    // Initialize parameters\n    const m = X.length;\n    this.weights = 0;\n    this.bias = 0;\n    \n    // Gradient descent\n    for (let i = 0; i < this.iterations; i++) {\n      // Predictions\n      const y_pred = X.map(x_i => this.weights * x_i + this.bias);\n      \n      // Compute gradients\n      let dw = 0;\n      let db = 0;\n      \n      for (let j = 0; j < m; j++) {\n        dw += -2 * X[j] * (y[j] - y_pred[j]);\n        db += -2 * (y[j] - y_pred[j]);\n      }\n      \n      dw /= m;\n      db /= m;\n      \n      // Update parameters\n      this.weights -= this.learningRate * dw;\n      this.bias -= this.learningRate * db;\n    }\n    \n    return this;\n  }\n\n  predict(X) {\n    return X.map(x_i => this.weights * x_i + this.bias);\n  }\n}',
    hints: [
      'Start by defining the linear model equation: y = wx + b',
      'Compute the gradients of the loss function with respect to w and b',
      'Update the parameters using the learning rate and gradients'
    ],
    timeEstimate: 30,
  },
  {
    id: '4',
    title: 'React Component Lifecycle',
    content: 'Explain the lifecycle methods of a React component and provide examples of when each should be used.',
    difficulty: 'medium',
    course: '3',
    tags: ['react', 'frontend', 'components'],
    createdAt: new Date('2023-09-22'),
    updatedAt: new Date('2023-09-22'),
    timeEstimate: 20,
  },
  {
    id: '5',
    title: 'Process Scheduling Algorithms',
    content: 'Implement and compare First-Come-First-Served (FCFS) and Shortest Job First (SJF) scheduling algorithms.',
    difficulty: 'expert',
    course: '4',
    tags: ['operating systems', 'scheduling', 'algorithms'],
    createdAt: new Date('2023-08-14'),
    updatedAt: new Date('2023-08-16'),
    timeEstimate: 45,
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
  {
    id: '3',
    questionId: '1',
    startedAt: new Date('2023-10-28T16:20:00'),
    completedAt: new Date('2023-10-28T16:32:00'),
    duration: 720, // 12 minutes
    success: true,
    notes: 'Much faster implementation this time',
  },
  {
    id: '4',
    questionId: '3',
    startedAt: new Date('2023-11-12T09:00:00'),
    completedAt: new Date('2023-11-12T09:38:00'),
    duration: 2280, // 38 minutes
    success: true,
    notes: 'Implemented correctly but took longer than expected',
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
  {
    id: '2',
    name: 'Algorithm Review',
    startedAt: new Date('2023-10-28T16:00:00'),
    endedAt: new Date('2023-10-28T17:00:00'),
    duration: 3600, // 1 hour
    questions: ['1'],
    attempts: [questionAttempts[2]],
    isDistracted: false,
  },
  {
    id: '3',
    name: 'ML Study Session',
    startedAt: new Date('2023-11-12T09:00:00'),
    endedAt: new Date('2023-11-12T10:30:00'),
    duration: 5400, // 1.5 hours
    questions: ['3'],
    attempts: [questionAttempts[3]],
    isDistracted: true,
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
    title: 'Complete ML Course',
    targetDate: new Date('2023-12-31'),
    questionCount: 35,
    completedCount: 8,
    courseId: '2',
  },
  {
    id: '3',
    title: 'React Advanced Concepts',
    targetDate: new Date('2023-11-30'),
    questionCount: 20,
    completedCount: 15,
    courseId: '3',
    tags: ['react', 'hooks', 'performance'],
  },
];
