import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useQuestions } from '@/hooks/useQuestions';
import { Clock, ArrowLeft, ArrowRight, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ExamMode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExitDialog, setShowExitDialog] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const course = searchParams.get('course');
  const difficulty = searchParams.get('difficulty');
  const duration = parseInt(searchParams.get('duration') || '20', 10) * 60;
  const topics = searchParams.get('topics');
  const random = searchParams.get('random') === 'true';
  const topicList = topics ? topics.split(',') : [];

  const { questions: fetchedQuestions } = useQuestions({
    courseId: course || undefined,
    difficulty: difficulty as any || undefined,
    tags: topicList,
  });

  const questions = useMemo(() => {
    if (!fetchedQuestions || fetchedQuestions.length === 0) return [];
    return random ? [...fetchedQuestions].sort(() => Math.random() - 0.5) : fetchedQuestions;
  }, [fetchedQuestions, random]);

  useEffect(() => {
    if (!timeLeft) setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    // Here you would typically save the answers to your backend
    clearInterval(timerRef.current as NodeJS.Timeout);
    toast.success('Exam submitted successfully!');
    navigate('/questions');
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (questions.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">No Questions Available</h1>
        <p className="text-muted-foreground mb-6">
          No questions match your selected criteria. Try adjusting your filters.
        </p>
        <Button onClick={() => navigate('/questions')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Questions
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="py-4 px-6 border-b flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setShowExitDialog(true)}
          className="text-red-500 hover:text-red-600"
        >
          Exit Exam
        </Button>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(timeLeft)}
          </Badge>
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-grow overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{currentQuestion.title}</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{currentQuestion.content}</p>
                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question illustration"
                    className="mt-4 max-w-full rounded-md"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[200px] font-mono"
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Submit Exam
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Exit Exam?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit? Your progress will be lost and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate('/questions')}
              className="bg-red-500 hover:bg-red-600"
            >
              Exit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamMode;
