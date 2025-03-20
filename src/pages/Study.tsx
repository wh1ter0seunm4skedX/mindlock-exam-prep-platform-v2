import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Save, Send, Book, CheckCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuestions } from '@/hooks/useQuestions';
import { Question } from '@/types';
import { useTimer } from '@/hooks/useTimer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';

const Study = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const { allQuestions, updateQuestion, courses } = useQuestions();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isExamMode] = useState<boolean>(false);
  const [showTimerDialog, setShowTimerDialog] = useState(false);

  const {
    time,
    isRunning,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    formattedTime,
  } = useTimer({ autoStart: true });

  useEffect(() => {
    if (questionId && allQuestions.length > 0) {
      const foundQuestion = allQuestions.find(q => q.id === questionId);
      if (foundQuestion) {
        setQuestion(foundQuestion);
        if (foundQuestion.userAnswer) {
          setUserAnswer(foundQuestion.userAnswer);
        }
      } else {
        toast.error('Question not found');
        navigate('/questions');
      }
    }
  }, [questionId, allQuestions, navigate]);

  const courseName = useMemo(() => {
    return question
      ? courses.find(c => c.id === question.course)?.name || 'Unknown Course'
      : '';
  }, [question, courses]);

  const handleSaveAnswer = async () => {
    if (!question || userAnswer === question.userAnswer) return;

    try {
      setSaveStatus('saving');
      await updateQuestion(question.id, { userAnswer });
      setSaveStatus('saved');
      toast.success(`Answer saved at ${new Date().toLocaleTimeString()}`);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error saving answer:', error);
      setSaveStatus('');
      toast.error('Failed to save answer');
    }
  };

  const renderSaveButtonContent = () => {
    if (saveStatus === 'saving') {
      return (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Saving...
        </>
      );
    }
    if (saveStatus === 'saved') {
      return (
        <>
          <CheckCircle className="h-4 w-4" />
          Saved
        </>
      );
    }
    return (
      <>
        <Save className="h-4 w-4" />
        Save Answer
      </>
    );
  };

  const handleBackToQuestions = () => {
    navigate('/questions');
  };

  const toggleTimerDialog = () => {
    setShowTimerDialog(!showTimerDialog);
  };

  if (!question) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="h-4 w-24 rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="py-4 px-6 border-b flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={handleBackToQuestions} aria-label="Back to questions">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-4 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={toggleTimerDialog}
            aria-label="Open study timer"
          >
            <Timer className="h-4 w-4" />
            {formattedTime.hours > 0
              ? `${formattedTime.hours}:${formattedTime.minutes.toString().padStart(2, '0')}:${formattedTime.seconds.toString().padStart(2, '0')}`
              : `${formattedTime.minutes}:${formattedTime.seconds.toString().padStart(2, '0')}`}
          </Button>

          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{question.timeEstimate || '?'} min</span>
          </Badge>

          <Badge
            variant={
              question.difficulty === 'easy'
                ? 'secondary'
                : question.difficulty === 'medium'
                ? 'default'
                : question.difficulty === 'hard'
                ? 'destructive'
                : 'outline'
            }
          >
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </Badge>

          <Badge variant="outline">{courseName}</Badge>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-grow overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-2xl font-bold mb-6">{question.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags?.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
            {question.questionTypes?.map(type => (
              <Badge key={type} variant="outline">{type}</Badge>
            ))}
          </div>

          <Card className="mb-8">
            <CardContent className="p-6 prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{question.content}</p>
              {question.imageUrl && (
                <div className="mt-4">
                  <img src={question.imageUrl} alt="Question illustration" className="max-w-full rounded-md" />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mb-4">
            <label htmlFor="answer" className="text-xl font-semibold mb-3 flex items-center">
              <Book className="mr-2" size={20} />
              Your Answer
            </label>
            <Textarea
              id="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[200px] font-mono"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleSaveAnswer}
              className="flex items-center gap-2"
              disabled={saveStatus === 'saving' || userAnswer === question.userAnswer}
              aria-label="Save your answer"
            >
              {renderSaveButtonContent()}
            </Button>
            <Button onClick={handleBackToQuestions} className="flex items-center gap-2" aria-label="Finish and go back">
              <Send className="h-4 w-4" />
              Finish
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Timer Dialog */}
      <Dialog open={showTimerDialog} onOpenChange={setShowTimerDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Study Timer</DialogTitle>
            <DialogDescription>Track your study time for this question.</DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-4xl font-mono font-bold mb-4">
              {formattedTime.hours > 0 && `${formattedTime.hours}:`}
              {formattedTime.minutes.toString().padStart(2, '0')}:
              {formattedTime.seconds.toString().padStart(2, '0')}
            </p>
            <div className="flex justify-center gap-2">
              {isRunning ? (
                <Button variant="outline" onClick={pauseTimer}>Pause</Button>
              ) : (
                <Button onClick={startTimer}>Resume</Button>
              )}
              <Button variant="outline" onClick={resetTimer}>Reset</Button>
            </div>
            {question.timeEstimate && (
              <div className="mt-4 text-sm text-muted-foreground">
                Estimated time: {question.timeEstimate} minutes
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimerDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Study;
