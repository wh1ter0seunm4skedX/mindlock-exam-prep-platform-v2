
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Save, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useQuestions } from '@/hooks/useQuestions';
import { useTimer } from '@/hooks/useTimer';
import { Question } from '@/types';

const Study = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerSaved, setIsAnswerSaved] = useState(false);
  
  const { questions: allQuestions, updateQuestion } = useQuestions();
  const [question, setQuestion] = useState<Question | null>(null);
  
  const {
    time,
    isRunning,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    formattedTime,
  } = useTimer();

  // Find the question based on the ID
  useEffect(() => {
    if (questionId && allQuestions.length > 0) {
      const foundQuestion = allQuestions.find(q => q.id === questionId);
      if (foundQuestion) {
        setQuestion(foundQuestion);
        setUserAnswer(foundQuestion.userAnswer || '');
        setIsAnswerSaved(!!foundQuestion.userAnswer);
      }
    }
  }, [questionId, allQuestions]);

  // Start timer automatically when question loads
  useEffect(() => {
    if (question && !isRunning) {
      startTimer();
    }
  }, [question, isRunning, startTimer]);

  const toggleFocusMode = () => {
    setIsFocusMode(prev => !prev);
  };

  const handleSaveAnswer = async () => {
    if (!question) return;
    
    try {
      await updateQuestion(question.id, { userAnswer });
      setIsAnswerSaved(true);
      toast.success('Your answer has been saved');
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Failed to save your answer');
    }
  };

  const handleUserAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAnswer(e.target.value);
    setIsAnswerSaved(false);
  };

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto"></div>
          </div>
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isFocusMode ? 'bg-slate-900' : 'bg-background'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex items-center justify-between mb-6 ${isFocusMode ? 'text-white' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/questions')}
            className={isFocusMode ? 'text-white hover:bg-slate-800' : ''}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Questions
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span className="font-mono">{formattedTime.formatted}</span>
            </div>
            
            <Button
              variant={isFocusMode ? "outline" : "default"}
              onClick={toggleFocusMode}
              className={isFocusMode ? 'border-white text-white hover:bg-slate-800' : ''}
            >
              <Focus size={16} className="mr-2" />
              {isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <Card className={isFocusMode ? 'bg-slate-800 border-slate-700 text-white' : ''}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={isFocusMode ? "outline" : "secondary"} className={isFocusMode ? 'border-slate-600' : ''}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </Badge>
                
                {question.questionTypes && question.questionTypes.map(type => (
                  <Badge key={type} variant={isFocusMode ? "outline" : "default"} className={isFocusMode ? 'border-slate-600' : ''}>
                    {type}
                  </Badge>
                ))}
              </div>
              
              <CardTitle className="text-2xl font-bold">{question.title}</CardTitle>
            </CardHeader>
            
            <CardContent>
              {question.imageUrl && (
                <div className="mb-6 rounded-md overflow-hidden">
                  <img 
                    src={question.imageUrl} 
                    alt={question.title} 
                    className="max-w-full mx-auto max-h-[400px] object-contain"
                  />
                </div>
              )}
              
              <div className={`prose max-w-none mb-8 ${isFocusMode ? 'text-slate-200' : ''}`}>
                <p>{question.content}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${isFocusMode ? 'text-white' : ''}`}>Your Answer</h3>
                <Textarea
                  value={userAnswer}
                  onChange={handleUserAnswerChange}
                  placeholder="Write your answer here..."
                  rows={10}
                  className={isFocusMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : ''}
                />
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveAnswer}
                    disabled={isAnswerSaved}
                    className={isAnswerSaved ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <Save size={16} className="mr-2" />
                    {isAnswerSaved ? 'Answer Saved' : 'Save Answer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Study;
