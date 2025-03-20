import { useNavigate } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import {
  BookOpen,
  Clock,
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { courses, allQuestions } = useQuestions();

  // Motion animation settings
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Simple hash-based fallback color generator
  const getGradientFromName = (name: string) => {
    if (name.toLowerCase().includes('algo')) return 'from-violet-500 to-indigo-600';
    if (name.toLowerCase().includes('system')) return 'from-orange-400 to-red-600';
    if (name.toLowerCase().includes('network')) return 'from-sky-500 to-cyan-700';
    return 'from-emerald-500 to-teal-700';
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">📚 My Courses</h2>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {courses.map((course) => {
            const courseQuestions = allQuestions.filter(q => q.course === course.id);
            const totalTime = courseQuestions.reduce((acc, q) => acc + (q.timeEstimate || 0), 0);
            const gradientColors = getGradientFromName(course.name);

            return (
              <motion.div key={course.id} variants={item}>
                <Card className="h-full shadow-sm hover:shadow-md transition-shadow border border-border bg-background">
                  <div className={`h-1.5 bg-gradient-to-r ${gradientColors}`} />
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{course.name}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.questionCount} Questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>~{totalTime} min</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="text-sm font-medium mb-2 text-foreground">Question Types</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.questionTypes.slice(0, 3).map((type) => (
                          <span
                            key={type}
                            className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                          >
                            {type}
                          </span>
                        ))}
                        {course.questionTypes.length > 3 && (
                          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
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
                      onClick={() => navigate(`/questions?courseId=${course.id}`)}
                      aria-label={`View questions for ${course.name}`}
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
      <Footer />
    </div>
  );
};

export default Dashboard;
