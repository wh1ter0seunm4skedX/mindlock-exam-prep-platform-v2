
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Book, GraduationCap, Users, Clock, ChevronRight, Search, Plus, List } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuestions } from '@/hooks/useQuestions';
import { Course } from '@/types';

const courseColors = [
  "from-violet-500 to-purple-500",
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-green-400",
  "from-orange-500 to-amber-400",
  "from-pink-500 to-rose-400",
  "from-indigo-500 to-blue-400",
  "from-red-500 to-rose-400",
  "from-teal-500 to-green-400",
];

const Index = () => {
  const navigate = useNavigate();
  const { courses, questions } = useQuestions();
  const [coloredCourses, setColoredCourses] = useState<(Course & { colorClass: string })[]>([]);

  // Assign colors to courses if they don't have one already
  useEffect(() => {
    const coursesWithColors = courses.map((course, index) => ({
      ...course,
      colorClass: courseColors[index % courseColors.length]
    }));
    setColoredCourses(coursesWithColors);
  }, [courses]);

  // Navigate to questions with course filter
  const navigateToCourseQuestions = (courseId: string) => {
    navigate(`/questions?course=${courseId}`);
  };

  // Create a new question
  const createQuestion = () => {
    navigate('/questions');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">MindLock</h1>
            <p className="text-muted-foreground text-lg">
              Your personal distraction-free study environment
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/questions')}>
              <Search size={18} className="mr-2" />
              Browse Questions
            </Button>
            <Button onClick={createQuestion}>
              <Plus size={18} className="mr-2" />
              Create Question
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                <h3 className="text-3xl font-bold mt-1">{questions.length}</h3>
              </div>
              <Book className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Courses</p>
                <h3 className="text-3xl font-bold mt-1">{courses.length}</h3>
              </div>
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Question Types</p>
                <h3 className="text-3xl font-bold mt-1">
                  {
                    [...new Set(
                      questions.flatMap(q => q.questionTypes || [])
                    )].length
                  }
                </h3>
              </div>
              <List className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                <h3 className="text-3xl font-bold mt-1">
                  {Math.round(
                    questions.reduce(
                      (acc, q) => acc + (q.timeEstimate || 0), 
                    0) / 60
                  )}h
                </h3>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coloredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className="cursor-pointer h-full hover:shadow-lg transition-all overflow-hidden group"
                  onClick={() => navigateToCourseQuestions(course.id)}
                >
                  <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r ${course.colorClass} opacity-90`} />
                  
                  <CardHeader className="relative pt-20">
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription>
                      {course.description || 'Practice questions for this course'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Questions:</span>
                        <span className="font-medium">{course.questionCount}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Question Types:</span>
                        <span className="font-medium">{course.questionTypes?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4">
                    <Button variant="ghost" className="ml-auto group-hover:bg-primary group-hover:text-white transition-colors">
                      Browse Questions
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            
            {/* Add Course Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: coloredCourses.length * 0.1 }}
            >
              <Card className="h-full border-dashed cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center justify-center p-6">
                <div className="rounded-full p-4 bg-muted mb-4">
                  <Plus size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">Add New Course</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Create a new course to organize your questions
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
