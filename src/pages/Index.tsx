
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Clock,
  Timer, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useQuestions } from '@/hooks/useQuestions';

const Index = () => {
  const navigate = useNavigate();
  const { courses, allQuestions } = useQuestions();
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Welcome to MindLock</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your dedicated platform for distraction-free practice and mastery of 
          complex academic subjects
        </p>
      </div>
      
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Courses</h2>
          <Button onClick={() => navigate('/questions')}>
            Browse All Questions
          </Button>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {courses.map((course) => {
            const courseQuestions = allQuestions.filter(q => q.course === course.id);
            const totalTime = courseQuestions.reduce((acc, q) => acc + (q.timeEstimate || 0), 0);
            
            // Generate a gradient based on the course name for visual distinction
            const gradientColors = course.name.includes('Algorithm') 
              ? 'from-violet-500 to-indigo-700'
              : 'from-emerald-500 to-teal-700';
            
            return (
              <motion.div key={course.id} variants={item}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`h-3 bg-gradient-to-r ${gradientColors}`}></div>
                  <CardHeader>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.questionCount} Questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>~{totalTime} min total</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <h4 className="font-medium mb-2">Question Types:</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.questionTypes.slice(0, 3).map((type) => (
                          <span 
                            key={type} 
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {type}
                          </span>
                        ))}
                        {course.questionTypes.length > 3 && (
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">
                            +{course.questionTypes.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between"
                      onClick={() => navigate('/questions')}
                    >
                      <span>View Questions</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Start Studying</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Quick Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Start a quick study session with random questions from your courses.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/questions')} className="w-full">
                Start Practice
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Focus Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Solve questions in a distraction-free environment with time tracking.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate('/questions')} 
                variant="outline" 
                className="w-full"
              >
                Enter Focus Mode
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Add New Question</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create a new question to practice with specific topics or concepts.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate('/questions')} 
                variant="secondary" 
                className="w-full"
              >
                Add Question
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
